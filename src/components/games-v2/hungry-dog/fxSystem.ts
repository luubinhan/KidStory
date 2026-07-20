import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";
import { HUNGRY_DOG_TIMINGS } from "./timings";

const CORRECT_LABELS = ["Yummy!", "Delicious!", "Great!", "Thank you!"] as const;
const WRONG_LABELS = ["Oops!", "Try again!", "Not this one!"] as const;

const LABEL_STYLE = new TextStyle({
  fontFamily: "Arial, sans-serif",
  fontSize: 22,
  fontWeight: "800",
  fill: "#ffffff",
  stroke: { color: "#334155", width: 4, join: "round" },
});

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function runForDuration(
  app: Application,
  durationMs: number,
  onTick: (progress: number) => void,
  onFinish: () => void,
): void {
  let elapsed = 0;
  const tick = () => {
    elapsed += app.ticker.deltaMS;
    const progress = Math.min(1, elapsed / durationMs);
    onTick(progress);
    if (progress >= 1) {
      app.ticker.remove(tick);
      onFinish();
    }
  };
  app.ticker.add(tick);
}

export function showFeedbackLabel(
  text: string,
  x: number,
  y: number,
  stage: Container,
  app: Application,
): void {
  const label = new Text({ text, style: LABEL_STYLE });
  label.anchor.set(0.5);
  label.position.set(x, y - 60);
  label.alpha = 0;
  stage.addChild(label);

  runForDuration(
    app,
    HUNGRY_DOG_TIMINGS.feedbackLabelMs,
    (progress) => {
      label.alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
      label.y = y - 60 - progress * 20;
    },
    () => label.destroy(),
  );
}

export function triggerEffect(
  kind: "correct" | "wrong",
  x: number,
  y: number,
  stage: Container,
  app: Application,
): void {
  const label = kind === "correct" ? pickRandom(CORRECT_LABELS) : pickRandom(WRONG_LABELS);
  showFeedbackLabel(label, x, y, stage, app);

  const sparkle = new Graphics();
  const dotCount = kind === "correct" ? 8 : 4;
  const radius = kind === "correct" ? 32 : 20;
  const color = kind === "correct" ? 0xfff4b8 : 0xfca5a5;
  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * Math.PI * 2;
    sparkle.circle(Math.cos(angle) * radius, Math.sin(angle) * radius, kind === "correct" ? 4 : 3);
  }
  sparkle.fill({ color });
  sparkle.position.set(x, y);
  stage.addChild(sparkle);

  runForDuration(
    app,
    HUNGRY_DOG_TIMINGS.feedbackLabelMs,
    (progress) => {
      sparkle.alpha = 1 - progress;
      sparkle.scale.set(1 + progress * 0.4);
    },
    () => sparkle.destroy(),
  );
}

export function playCoinFly(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  stage: Container,
  app: Application,
): void {
  const coin = Sprite.from("coin");
  coin.anchor.set(0.5);
  coin.width = 28;
  coin.height = 28;
  coin.position.set(fromX, fromY);
  stage.addChild(coin);

  runForDuration(
    app,
    HUNGRY_DOG_TIMINGS.coinFlyMs,
    (progress) => {
      const e = 1 - (1 - progress) * (1 - progress);
      coin.x = fromX + (toX - fromX) * e;
      coin.y = fromY + (toY - fromY) * e - Math.sin(progress * Math.PI) * 40;
      coin.alpha = progress > 0.85 ? (1 - progress) / 0.15 : 1;
    },
    () => coin.destroy(),
  );
}

export function delayMs(app: Application, ms: number): Promise<void> {
  return new Promise((resolve) => {
    let elapsed = 0;
    const tick = () => {
      elapsed += app.ticker.deltaMS;
      if (elapsed >= ms) {
        app.ticker.remove(tick);
        resolve();
      }
    };
    app.ticker.add(tick);
  });
}
