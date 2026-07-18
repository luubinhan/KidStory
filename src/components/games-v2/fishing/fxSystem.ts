import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  type Ticker,
} from "pixi.js";
import {
  playFishingCoinSound,
  playFishingSplashSound,
} from "../../../lib/fishing/fishingSounds";
import type { PooledFish } from "./fishPool";

const CORRECT_DURATION_MS = 700;
const WRONG_TIMEOUT_MS = 800;
const WRONG_EDGE_MARGIN = 60;
const SPLASH_FADE_MS = 300;
const COIN_RISE_DISTANCE = 40;
const BOUNCE_SCALE = 1.25;
const COIN_ICON_SIZE = 22;
const COIN_GAP = 4;

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
  coin.width = COIN_ICON_SIZE;
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

/** Plays the correct-tap celebration (bounce + sparkle + floating coin) then calls `onDone`. */
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

  runForDuration(
    app,
    CORRECT_DURATION_MS,
    (progress) => {
      const bounce = Math.sin(Math.min(1, progress * 1.2) * Math.PI);
      fish.root.scale.set(1 + bounce * (BOUNCE_SCALE - 1));
      fish.root.alpha = 1 - progress * 0.6;

      if (sparkle) {
        sparkle.alpha = 1 - progress;
        sparkle.scale.set(1 + progress * 0.6);
      }
      if (coinLabel) {
        coinLabel.y = fish.root.y - 24 - easeOutQuad(progress) * COIN_RISE_DISTANCE;
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
