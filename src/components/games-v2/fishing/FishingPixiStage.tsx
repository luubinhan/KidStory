import { useEffect, useRef } from "react";
import { Application, type Ticker } from "pixi.js";
import { FishPool, type PooledFish } from "./fishPool";
import { updateSwim, randomizeSpawn } from "./swimSystem";
import { playCorrect, playWrong } from "./fxSystem";
import { ensureExactlyOneTargetLabel } from "../../../lib/fishing/fishingSession";
import { FISHING_ROUND, type FishingVocabItem } from "../../../types/fishing";

type FishTapOutcome = {
  kind: "correct" | "wrong" | "ignored";
  session?: unknown;
};

type FishingPixiStageProps = {
  targetWord: string;
  poolWords: readonly string[];
  enabled: boolean;
  onFishTap: (word: string) => FishTapOutcome;
};

function normalize(word: string): string {
  return word.trim().toLowerCase();
}

function toVocabPool(words: readonly string[]): FishingVocabItem[] {
  return words.map((word, index) => ({
    id: `pool-${index}`,
    word,
    imageSrc: "",
    unitId: "",
  }));
}

function randomFishCount(): number {
  const { fishCountMin, fishCountMax } = FISHING_ROUND;
  return fishCountMin + Math.floor(Math.random() * (fishCountMax - fishCountMin + 1));
}

/** Relabels idle (non-busy) fish so exactly one matches `targetWord`, reusing the rest as distractors. */
function relabelIdleFish(
  pool: FishPool,
  fish: readonly PooledFish[],
  targetWord: string,
  vocabPool: readonly FishingVocabItem[],
): void {
  const idle = fish.filter((f) => !f.busy);
  if (idle.length === 0) return;

  const targetNorm = normalize(targetWord);
  const holderIndex = Math.max(0, idle.findIndex((f) => normalize(f.word) === targetNorm));
  const holder = idle[holderIndex]!;
  const others = idle.filter((_, index) => index !== holderIndex);

  const labels = ensureExactlyOneTargetLabel(others.map((f) => f.word), targetWord, vocabPool);
  const targetLabelIndex = labels.findIndex((w) => normalize(w) === targetNorm);
  if (targetLabelIndex !== -1) labels.splice(targetLabelIndex, 1);

  others.forEach((f, index) => {
    pool.setWord(f, labels[index] ?? f.word);
  });
  pool.setWord(holder, targetWord);
}

/** Mounts a PixiJS pond: swimming labeled fish the child taps to match a target word. */
export function FishingPixiStage({
  targetWord,
  poolWords,
  enabled,
  onFishTap,
}: FishingPixiStageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const targetWordRef = useRef(targetWord);
  const enabledRef = useRef(enabled);
  const onFishTapRef = useRef(onFishTap);
  const vocabPoolRef = useRef<FishingVocabItem[]>(toVocabPool(poolWords));
  const relabelRef = useRef<(() => void) | null>(null);

  enabledRef.current = enabled;
  onFishTapRef.current = onFishTap;
  vocabPoolRef.current = toVocabPool(poolWords);

  useEffect(() => {
    targetWordRef.current = targetWord;
    relabelRef.current?.();
  }, [targetWord]);

  useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl) return;

    let disposed = false;
    const app = new Application();
    const pool = new FishPool(app.stage);
    const fish: PooledFish[] = [];
    let timeSec = 0;

    function relabel(): void {
      relabelIdleFish(pool, fish, targetWordRef.current, vocabPoolRef.current);
    }
    relabelRef.current = relabel;

    function handleTap(target: PooledFish): void {
      if (!enabledRef.current || target.busy) return;
      const result = onFishTapRef.current(target.word);
      if (result.kind === "ignored") return;

      const finishTap = () => {
        fish.splice(fish.indexOf(target), 1);
        pool.release(target);
        spawnFish("");
        relabel();
      };

      if (result.kind === "correct") {
        playCorrect(target, app, finishTap);
      } else {
        playWrong(target, app, finishTap);
      }
    }

    function spawnFish(word: string): PooledFish {
      const acquired = pool.acquire();
      pool.setWord(acquired, word);
      const occupiedYs = fish.map((f) => f.baseY);
      randomizeSpawn(acquired, app.screen.width, app.screen.height, occupiedYs);
      acquired.root.removeAllListeners("pointertap");
      acquired.root.on("pointertap", () => handleTap(acquired));
      fish.push(acquired);
      return acquired;
    }

    function tick(ticker: Ticker): void {
      timeSec += ticker.deltaMS / 1000;
      const dtSec = ticker.deltaMS / 1000;
      const width = app.screen.width;
      const height = app.screen.height;
      for (const f of fish) {
        updateSwim(f, dtSec, width, height, timeSec);
      }
    }

    async function setup(): Promise<void> {
      await app.init({
        background: "#7dd3fc",
        resizeTo: hostEl,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });
      if (disposed) {
        app.destroy(true, { children: true });
        return;
      }
      hostEl.appendChild(app.canvas);

      await pool.warmTextures();
      if (disposed) return;

      const fishCount = randomFishCount();
      for (let i = 0; i < fishCount; i++) {
        spawnFish("");
      }
      relabel();

      app.ticker.add(tick);
    }

    void setup();

    return () => {
      disposed = true;
      relabelRef.current = null;
      if (app.renderer) {
        app.ticker.remove(tick);
        for (const f of fish) {
          f.root.removeAllListeners("pointertap");
        }
        app.destroy(true, { children: true });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={hostRef} className="size-full" />;
}
