import { ProgressBar } from "@pixi/ui";
import { Container, Graphics, Text, TextStyle } from "pixi.js";

const BAR_WIDTH = 180;
const BAR_HEIGHT = 22;
const BAR_RADIUS = 11;

const LABEL_STYLE = new TextStyle({
  fontFamily: "Arial, sans-serif",
  fontSize: 14,
  fontWeight: "800",
  fill: "#0f172a",
});

export type LessonProgressBar = {
  root: Container;
  setProgress: (correctCount: number, targetsNeeded: number) => void;
  layout: (screenWidth: number) => void;
  destroy: () => void;
};

function makeBarGraphics(color: number, alpha = 1): Graphics {
  const g = new Graphics();
  g.roundRect(0, 0, BAR_WIDTH, BAR_HEIGHT, BAR_RADIUS);
  g.fill({ color, alpha });
  g.eventMode = "none";
  return g;
}

/** PixiUI ProgressBar for Hungry Dog lesson progress (correct / targetsNeeded). */
export function createLessonProgressBar(): LessonProgressBar {
  const root = new Container();
  root.eventMode = "none";
  root.zIndex = 5;

  const bar = new ProgressBar({
    bg: makeBarGraphics(0xffffff, 0.85),
    fill: makeBarGraphics(0x34d399, 1),
    fillPaddings: { top: 3, right: 3, bottom: 3, left: 3 },
    progress: 0,
  });
  bar.eventMode = "none";

  const label = new Text({ text: "0 / 5", style: LABEL_STYLE });
  label.anchor.set(0.5);
  label.position.set(BAR_WIDTH / 2, BAR_HEIGHT / 2);
  label.eventMode = "none";

  root.addChild(bar, label);

  const setProgress = (correctCount: number, targetsNeeded: number) => {
    const safeTarget = Math.max(1, targetsNeeded);
    const clamped = Math.max(0, Math.min(correctCount, safeTarget));
    bar.progress = (clamped / safeTarget) * 100;
    label.text = `${clamped} / ${safeTarget}`;
  };

  const layout = (screenWidth: number) => {
    root.position.set(Math.max(16, screenWidth * 0.05), 24);
  };

  return {
    root,
    setProgress,
    layout,
    destroy: () => {
      root.destroy({ children: true });
    },
  };
}
