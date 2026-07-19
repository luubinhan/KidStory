import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  type Filter,
  type Ticker,
} from "pixi.js";
import { ShockwaveFilter } from "pixi-filters/shockwave";
import {
  playFishingCoinSound,
  playFishingSplashSound,
} from "../../../lib/fishing/fishingSounds";
import type { PooledFish } from "./fishPool";

const CORRECT_DURATION_MS = 700;
const BUCKET_INSET_X = 56;
const BUCKET_INSET_Y = 56;
const CATCH_END_SCALE = 0.25;
const WRONG_TIMEOUT_MS = 800;
const WRONG_EDGE_MARGIN = 60;
const SPLASH_FADE_MS = 300;
const COIN_RISE_DISTANCE = 40;
const COIN_ICON_SIZE = 30;
const COIN_ICON_WIDTH = 48;
const COIN_GAP = 4;
const SHOCKWAVE_DURATION_MS = 700;
const SHOCKWAVE_RADIUS = 280;
const SHOCKWAVE_SPEED = 450;
const SHOCKWAVE_AMPLITUDE = 28;
const SHOCKWAVE_WAVELENGTH = 100;

const COIN_TEXT_STYLE = new TextStyle({
  fontFamily: "Arial, sans-serif",
  fontSize: 18,
  fontWeight: "800",
  fill: "#facc15",
  stroke: { color: "#7c2d12", width: 3, join: "round" },
});

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function runForDuration(
  app: Application,
  durationMs: number,
  onTick: (progress: number) => void,
  onFinish: () => void,
): void {
  let elapsed = 0;
  const tick = (ticker: Ticker) => {
    elapsed += ticker.deltaMS;
    const progress = Math.min(1, elapsed / durationMs);
    onTick(progress);
    if (progress >= 1) {
      app.ticker.remove(tick);
      onFinish();
    }
  };
  app.ticker.add(tick);
}

function spawnSparkle(fish: PooledFish, parent: Container): Graphics {
  const sparkle = new Graphics();
  const dotCount = 6;
  const radius = 28;
  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * Math.PI * 2;
    sparkle.circle(Math.cos(angle) * radius, Math.sin(angle) * radius, 3);
  }
  sparkle.fill({ color: 0xfff4b8 });
  sparkle.position.set(fish.root.x, fish.root.y);
  parent.addChild(sparkle);
  return sparkle;
}

function spawnCoinLabel(fish: PooledFish, parent: Container): Container {
  const group = new Container();

  const plusOne = new Text({ text: "+1", style: COIN_TEXT_STYLE });
  plusOne.anchor.set(0, 0.5);

  const coin = Sprite.from("coin");
  coin.anchor.set(0, 0.5);
  coin.width = COIN_ICON_WIDTH;
  coin.height = COIN_ICON_SIZE;
  coin.x = plusOne.width + COIN_GAP;

  const totalWidth = coin.x + coin.width;
  plusOne.x = -totalWidth / 2;
  coin.x = plusOne.x + plusOne.width + COIN_GAP;

  group.addChild(plusOne, coin);
  group.position.set(fish.root.x, fish.root.y - 24);
  parent.addChild(group);
  return group;
}

function spawnSplash(fish: PooledFish, parent: Container): Graphics {
  const splash = new Graphics();
  splash.circle(0, 0, 22).fill({ color: 0xbfe9ff, alpha: 0.7 });
  splash.circle(0, 0, 12).fill({ color: 0xffffff, alpha: 0.6 });
  splash.position.set(fish.root.x, fish.root.y);
  parent.addChild(splash);
  return splash;
}

/** Flies the caught fish into the top-right bucket (sparkle + coin), then calls `onDone`. */
export function playCorrect(
  fish: PooledFish,
  app: Application,
  onDone: () => void,
): void {
  fish.busy = true;
  playFishingCoinSound();
  const parent = fish.root.parent;
  const sparkle = parent ? spawnSparkle(fish, parent) : null;
  const coinLabel = parent ? spawnCoinLabel(fish, parent) : null;

  const startX = fish.root.x;
  const startY = fish.root.y;
  const endX = app.screen.width - BUCKET_INSET_X;
  const endY = BUCKET_INSET_Y;

  runForDuration(
    app,
    CORRECT_DURATION_MS,
    (progress) => {
      const t = easeOutQuad(progress);
      fish.root.x = startX + (endX - startX) * t;
      fish.root.y = startY + (endY - startY) * t;
      fish.root.scale.set(1 + (CATCH_END_SCALE - 1) * t);

      if (sparkle) {
        sparkle.alpha = 1 - progress;
        sparkle.scale.set(1 + progress * 0.6);
      }
      if (coinLabel) {
        coinLabel.y = startY - 24 - easeOutQuad(progress) * COIN_RISE_DISTANCE;
        coinLabel.alpha = 1 - progress;
      }
    },
    () => {
      fish.root.scale.set(1);
      sparkle?.destroy();
      coinLabel?.destroy({ children: true });
      onDone();
    },
  );
}

/** Sends a wrongly-tapped fish fleeing with a splash, calling `onDone` once it's off-screen or times out. */
export function playWrong(
  fish: PooledFish,
  app: Application,
  onDone: () => void,
): void {
  fish.busy = true;
  fish.vx *= 3;
  playFishingSplashSound();

  const parent = fish.root.parent;
  const splash = parent ? spawnSplash(fish, parent) : null;
  const screenWidth = app.screen.width;

  let elapsed = 0;
  const tick = (ticker: Ticker) => {
    elapsed += ticker.deltaMS;
    fish.root.x += fish.vx * (ticker.deltaMS / 1000);
    if (splash) {
      splash.alpha = Math.max(0, 1 - elapsed / SPLASH_FADE_MS);
    }
    const offScreen =
      fish.root.x < -WRONG_EDGE_MARGIN ||
      fish.root.x > screenWidth + WRONG_EDGE_MARGIN;
    if (offScreen || elapsed >= WRONG_TIMEOUT_MS) {
      app.ticker.remove(tick);
      splash?.destroy();
      onDone();
    }
  };
  app.ticker.add(tick);
}

function appendStageFilter(app: Application, filter: Filter): void {
  const current = app.stage.filters;
  app.stage.filters = current ? [...current, filter] : [filter];
}

function removeStageFilter(app: Application, filter: Filter): void {
  const current = app.stage.filters;
  if (!current) return;
  const next = current.filter((f) => f !== filter);
  app.stage.filters = next.length > 0 ? next : null;
}

/** Ripples the pond from a tap point via a stage-level ShockwaveFilter. */
export function playShockwave(
  app: Application,
  centerX: number,
  centerY: number,
): void {
  const shockwave = new ShockwaveFilter({
    center: { x: centerX, y: centerY },
    amplitude: SHOCKWAVE_AMPLITUDE,
    wavelength: SHOCKWAVE_WAVELENGTH,
    speed: SHOCKWAVE_SPEED,
    radius: SHOCKWAVE_RADIUS,
    brightness: 1.1,
    time: 0,
  });
  appendStageFilter(app, shockwave);

  runForDuration(
    app,
    SHOCKWAVE_DURATION_MS,
    (progress) => {
      shockwave.time = (progress * SHOCKWAVE_DURATION_MS) / 1000;
    },
    () => {
      removeStageFilter(app, shockwave);
      shockwave.destroy();
    },
  );
}
