import { useEffect, useRef } from "react";
import { GodrayFilter } from "pixi-filters/godray";
import { Application, Assets, Rectangle, Sprite, type Ticker } from "pixi.js";
import type { HungryDogVocabItem, LessonState, PuppyAnim } from "../../../types/hungryDog";
import { HUNGRY_DOG_TIMINGS } from "./timings";
import { delayMs, playCoinFly, triggerEffect } from "./fxSystem";
import { HUNGRY_DOG_BG_ALIAS, preloadHungryDogAssets } from "./preload";
import { createPuppyController, type PuppyController } from "./puppyController";
import { createWordCards, type WordCardDragSystem } from "./wordCardDrag";

/** Smaller top-left godray overlay (does not filter the full-bleed BG). */
const GODRAY_W = 0.38;
const GODRAY_H = 0.28;
const GODRAY_CENTER_X = 0.15;
const GODRAY_CENTER_Y = 0.1;
const GODRAY_TIME_STEP = 0.006;
const GODRAY_GAIN = 0.16;
const GODRAY_ALPHA = 0.25;

type DropOutcome =
  | { kind: "ignored" }
  | { kind: "wrong"; lesson: LessonState }
  | { kind: "correct"; lesson: LessonState };

type HungryDogPixiStageProps = {
  choices: readonly HungryDogVocabItem[];
  puppyBaseAnim: PuppyAnim;
  enabled: boolean;
  onDrop: (word: string) => DropOutcome;
  onBusyChange?: (busy: boolean) => void;
  coinTarget?: { x: number; y: number };
};

/** Pixi stage: animated puppy, draggable word cards, mouth drop hit-test. */
export function HungryDogPixiStage({
  choices,
  puppyBaseAnim: _puppyBaseAnim,
  enabled,
  onDrop,
  onBusyChange,
  coinTarget,
}: HungryDogPixiStageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const choicesRef = useRef(choices);
  const enabledRef = useRef(enabled);
  const onDropRef = useRef(onDrop);
  const onBusyChangeRef = useRef(onBusyChange);
  const coinTargetRef = useRef(coinTarget);
  const puppyRef = useRef<PuppyController | null>(null);
  const cardsRef = useRef<WordCardDragSystem | null>(null);

  choicesRef.current = choices;
  enabledRef.current = enabled;
  onDropRef.current = onDrop;
  onBusyChangeRef.current = onBusyChange;
  coinTargetRef.current = coinTarget;

  useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl) return;

    let disposed = false;
    const app = new Application();
    let tickGodray: ((ticker: Ticker) => void) | null = null;

    function destroyApp(): void {
      // Only destroy after init — calling destroy before renderer exists
      // throws `_cancelResize is not a function` (ResizePlugin not wired yet).
      if (!app.renderer) return;
      if (tickGodray) {
        app.ticker.remove(tickGodray);
        tickGodray = null;
      }
      cardsRef.current?.destroy();
      cardsRef.current = null;
      puppyRef.current?.destroy();
      puppyRef.current = null;
      app.destroy(true, { children: true });
    }

    void (async () => {
      await app.init({
        backgroundAlpha: 0,
        resizeTo: hostEl,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });
      if (disposed) {
        destroyApp();
        return;
      }

      hostEl.appendChild(app.canvas);
      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      app.stage.sortableChildren = true;

      await preloadHungryDogAssets();
      if (disposed) {
        destroyApp();
        return;
      }

      // Full-bleed BG — never put filters on this sprite (Pixi filter default
      // resolution + filterArea clipped it to a left strip on retina).
      const bg = new Sprite(Assets.get(HUNGRY_DOG_BG_ALIAS));
      bg.label = "dog-bg";
      bg.zIndex = -2;
      bg.width = app.screen.width;
      bg.height = app.screen.height;
      app.stage.addChild(bg);

      // Cropped duplicate for a small top-left godray only.
      const rayBg = new Sprite(Assets.get(HUNGRY_DOG_BG_ALIAS));
      rayBg.label = "dog-godray";
      rayBg.zIndex = -1;
      const rayW = app.screen.width * GODRAY_W;
      const rayH = app.screen.height * GODRAY_H;
      rayBg.width = app.screen.width;
      rayBg.height = app.screen.height;
      const godray = new GodrayFilter({
        parallel: false,
        center: { x: rayW * GODRAY_CENTER_X, y: rayH * GODRAY_CENTER_Y },
        gain: GODRAY_GAIN,
        alpha: GODRAY_ALPHA,
        lacunarity: 2.0,
      });
      godray.resolution = "inherit";
      rayBg.filterArea = new Rectangle(0, 0, rayW, rayH);
      rayBg.filters = [godray];
      rayBg.blendMode = "screen";
      tickGodray = (ticker) => {
        godray.time += GODRAY_TIME_STEP * ticker.deltaTime;
      };
      app.ticker.add(tickGodray);
      app.stage.addChild(rayBg);

      const puppy = createPuppyController(app.stage);
      puppyRef.current = puppy;
      puppy.setAnim("idle");
      puppy.root.scale.set(Math.min(app.screen.width / 400, 1.2));

      let cards: WordCardDragSystem | null = null;
      cards = createWordCards({
        app,
        stage: app.stage,
        getMouthBounds: () => puppy.getMouthBounds(),
        onDragStart: () => {
          puppy.setAnim("eating");
        },
        onDragCancel: () => {
          puppy.setAnim("idle");
        },
        onCardDrop: async (word) => {
          onBusyChangeRef.current?.(true);
          cards?.setEnabled(false);

          const result = onDropRef.current(word);
          const mouth = puppy.getMouthBounds();
          const cx = mouth.x + mouth.width / 2;
          const cy = mouth.y + mouth.height / 2;

          if (result.kind === "ignored") {
            puppy.setAnim("idle");
            onBusyChangeRef.current?.(false);
            cards?.setEnabled(enabledRef.current);
            return "ignored";
          }

          if (result.kind === "wrong") {
            // Already in eating while drag; switch to sad, then idle
            puppy.setAnim("wrong");
            triggerEffect("wrong", cx, cy, app.stage, app);
            await delayMs(app, HUNGRY_DOG_TIMINGS.wrongMs);
            puppy.setAnim("idle");
            onBusyChangeRef.current?.(false);
            cards?.setEnabled(enabledRef.current);
            return "wrong";
          }

          // Already eating during drag; celebrate then return to idle
          puppy.setAnim("happy");
          triggerEffect("correct", cx, cy, app.stage, app);
          const target = coinTargetRef.current;
          if (target) {
            playCoinFly(cx, cy, target.x, target.y, app.stage, app);
          }
          await delayMs(app, HUNGRY_DOG_TIMINGS.happyMs + HUNGRY_DOG_TIMINGS.advanceDelayMs);
          // Use lesson from applyDrop — choicesRef may still be stale until React re-renders
          if (result.lesson.status === "playing") {
            choicesRef.current = result.lesson.round.choices;
            cards?.updateChoices(result.lesson.round.choices);
          }
          puppy.setAnim("idle");
          onBusyChangeRef.current?.(false);
          cards?.setEnabled(enabledRef.current);
          return "correct";
        },
      });
      cardsRef.current = cards;
      cards?.updateChoices(choicesRef.current);

      function layout(): void {
        const w = app.screen.width;
        const h = app.screen.height;
        bg.width = w;
        bg.height = h;
        bg.position.set(0, 0);
        rayBg.width = w;
        rayBg.height = h;
        rayBg.position.set(0, 0);
        const rayW = w * GODRAY_W;
        const rayH = h * GODRAY_H;
        rayBg.filterArea = new Rectangle(0, 0, rayW, rayH);
        godray.center = { x: rayW * GODRAY_CENTER_X, y: rayH * GODRAY_CENTER_Y };
        puppy.root.position.set(w / 2, h * 0.48 + 100);
        puppy.root.scale.set(Math.min(w / 400, 1.2));
        cards?.layout(w, h);
      }

      layout();
      app.renderer.on("resize", layout);
    })();

    return () => {
      disposed = true;
      destroyApp();
    };
  }, []);

  useEffect(() => {
    cardsRef.current?.setEnabled(enabled);
  }, [enabled]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 z-0 touch-none"
      aria-hidden
    />
  );
}
