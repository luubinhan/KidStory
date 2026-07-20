import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import type { HungryDogVocabItem, LessonState, PuppyAnim } from "../../../types/hungryDog";
import { HUNGRY_DOG_TIMINGS } from "./timings";
import { delayMs, playCoinFly, triggerEffect } from "./fxSystem";
import { preloadHungryDogAssets } from "./preload";
import { createPuppyController, type PuppyController } from "./puppyController";
import { createWordCards, type WordCardDragSystem } from "./wordCardDrag";
import { createLessonProgressBar, type LessonProgressBar } from "./progressBar";

type DropOutcome =
  | { kind: "ignored" }
  | { kind: "wrong"; lesson: LessonState }
  | { kind: "correct"; lesson: LessonState };

type HungryDogPixiStageProps = {
  choices: readonly HungryDogVocabItem[];
  puppyBaseAnim: PuppyAnim;
  enabled: boolean;
  correctCount: number;
  targetsNeeded: number;
  onDrop: (word: string) => DropOutcome;
  onBusyChange?: (busy: boolean) => void;
  coinTarget?: { x: number; y: number };
};

/** Pixi stage: animated puppy, draggable word cards, mouth drop hit-test. */
export function HungryDogPixiStage({
  choices,
  puppyBaseAnim: _puppyBaseAnim,
  enabled,
  correctCount,
  targetsNeeded,
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
  const correctCountRef = useRef(correctCount);
  const targetsNeededRef = useRef(targetsNeeded);
  const puppyRef = useRef<PuppyController | null>(null);
  const cardsRef = useRef<WordCardDragSystem | null>(null);
  const progressRef = useRef<LessonProgressBar | null>(null);

  choicesRef.current = choices;
  enabledRef.current = enabled;
  onDropRef.current = onDrop;
  onBusyChangeRef.current = onBusyChange;
  coinTargetRef.current = coinTarget;
  correctCountRef.current = correctCount;
  targetsNeededRef.current = targetsNeeded;

  useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl) return;

    let disposed = false;
    const app = new Application();

    function destroyApp(): void {
      // Only destroy after init — calling destroy before renderer exists
      // throws `_cancelResize is not a function` (ResizePlugin not wired yet).
      if (!app.renderer) return;
      progressRef.current?.destroy();
      progressRef.current = null;
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
      app.stage.sortableChildren = true;

      await preloadHungryDogAssets();
      if (disposed) {
        destroyApp();
        return;
      }

      const progress = createLessonProgressBar();
      progressRef.current = progress;
      progress.setProgress(correctCountRef.current, targetsNeededRef.current);
      app.stage.addChild(progress.root);

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
          progressRef.current?.setProgress(
            result.lesson.correctCount,
            targetsNeededRef.current,
          );
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
        puppy.root.position.set(w / 2, h * 0.48);
        puppy.root.scale.set(Math.min(w / 400, 1.2));
        cards?.layout(w, h);
        progress.layout(w);
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

  useEffect(() => {
    progressRef.current?.setProgress(correctCount, targetsNeeded);
  }, [correctCount, targetsNeeded]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 z-0 touch-none"
      aria-hidden
    />
  );
}
