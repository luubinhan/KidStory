# Hungry Dog Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a PixiJS v8 drag-and-drop vocabulary game at `/games-v2/hungry-dog` where kids drag the correct English word into a puppy's mouth over 5 correct answers, earning 1 real coin per correct via progress persistence.

**Architecture:** Mirror Fishing — React owns the page shell (target image, audio prompt, coin HUD, end screen). Pixi owns the puppy animation, four draggable word cards, mouth hit-testing, and VFX. Pure lib helpers in `src/lib/hungry-dog/` build rounds and validate drops. Hunger (`idle` vs `hungry` base clip) is visual-only from `localStorage` `lastEatAt`. Sounds are no-op stubs.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, react-router-dom, PixiJS v8, Dexie progress via `UserProgressContext`

**Spec:** `docs/superpowers/specs/2026-07-20-hungry-dog-game-design.md`

## Global Constraints

- Always exactly **4** choices; never remove a wrong choice from the board.
- **5** correct answers to finish (`targetsNeeded: 5`).
- Wrong drops: unlimited retry; no lives, no game-over, no score penalty.
- **+1 coin per correct** via `addCoins(1)`; **no** `completeGameV2("hungry-dog")`.
- Hunger is **visual only** — never block gameplay (`HUNGER_MS = 60 * 60 * 1000`).
- `lastEatAt` in `localStorage` key `kidstory.hungryDog.lastEatAt` (not user progress schema).
- Vocabulary pool reuses `buildFishingVocabPool` from unlocked course units (`minPoolSize: 4`).
- Question prompt: target image + auto-play audio (Fishing pattern).
- Explicit enums for lesson status and puppy animation — no ad-hoc booleans.
- All animation timings in `timings.ts` as named constants.
- No loading screen between rounds.
- Out of scope: real SFX assets, Snyk security scan, hunger-based play lock.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/types/hungryDog.ts` | Vocab alias, round config, lesson/puppy enums, session state |
| `src/lib/hungry-dog/hungryDogSession.ts` | Pure: create lesson, pick choices, apply drop, advance |
| `src/lib/hungry-dog/hungryDogSession.test.ts` | Session + choice tests |
| `src/lib/hungry-dog/hungryDogHunger.ts` | `lastEatAt` localStorage + `isHungry(now)` |
| `src/lib/hungry-dog/hungryDogHunger.test.ts` | Hunger time math tests |
| `src/lib/hungry-dog/hungryDogSounds.ts` | No-op sound stubs with TODO comments |
| `src/lib/userProgressLogic.ts` | Add `addCoins(progress, amount)` |
| `src/lib/userProgressLogic.test.ts` | Add coins increment test (or extend existing) |
| `src/contexts/UserProgressContext.tsx` | Expose `addCoins(n)` |
| `src/hooks/useHungryDogSession.ts` | React session state, audio, coin persist, restart |
| `src/components/games-v2/hungry-dog/timings.ts` | Named animation ms constants |
| `src/components/games-v2/hungry-dog/preload.ts` | Spritesheet preload |
| `src/components/games-v2/hungry-dog/puppyController.ts` | AnimatedSprite clip map per `PuppyAnim` |
| `src/components/games-v2/hungry-dog/wordCardDrag.ts` | Pointer drag, mouth hit zone, snap-back |
| `src/components/games-v2/hungry-dog/fxSystem.ts` | `triggerEffect`, coin fly, feedback labels |
| `src/components/games-v2/hungry-dog/HungryDogPixiStage.tsx` | Application lifecycle + stage wiring |
| `src/pages/HungryDogGamePage.tsx` | Shell page (HUD + stage + end screen) |
| `src/components/games-v2/index.ts` | Export `HungryDogPixiStage` |

---

### Task 1: Hungry Dog types + round constants

**Files:**
- Create: `src/types/hungryDog.ts`

**Interfaces:**
- Produces: `HungryDogVocabItem`, `LessonStatus`, `PuppyAnim`, `RoundState`, `LessonState`, `HUNGRY_DOG_ROUND`, `DropResult`

- [ ] **Step 1: Create types file**

```typescript
import type { FishingVocabItem } from "./fishing";

export type HungryDogVocabItem = FishingVocabItem;

export type LessonStatus = "playing" | "complete";

export type PuppyAnim = "idle" | "hungry" | "ready" | "eating" | "happy" | "wrong";

export type RoundState = {
  target: HungryDogVocabItem;
  choices: [
    HungryDogVocabItem,
    HungryDogVocabItem,
    HungryDogVocabItem,
    HungryDogVocabItem,
  ];
};

export type LessonState = {
  status: LessonStatus;
  correctCount: number;
  round: RoundState;
  sessionCoins: number;
};

export const HUNGRY_DOG_ROUND = {
  targetsNeeded: 5,
  choicesCount: 4,
  distractorsCount: 3,
  minPoolSize: 4,
  coinPerCorrect: 1,
  hungerMs: 60 * 60 * 1000,
} as const;

export type DropResult =
  | { kind: "wrong"; lesson: LessonState }
  | { kind: "correct"; lesson: LessonState };
```

- [ ] **Step 2: Typecheck**

```bash
npm run lint
```

Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/types/hungryDog.ts
git commit -m "feat: add Hungry Dog session types and round constants"
```

---

### Task 2: Pure session logic (TDD)

**Files:**
- Create: `src/lib/hungry-dog/hungryDogSession.ts`
- Create: `src/lib/hungry-dog/hungryDogSession.test.ts`

**Interfaces:**
- Consumes: types from `src/types/hungryDog.ts`
- Produces:
  - `createInitialLesson(pool: readonly HungryDogVocabItem[]): LessonState`
  - `pickRoundChoices(pool, target): RoundState["choices"]`
  - `applyDrop(lesson: LessonState, pool, droppedWord: string): DropResult`
  - `pickNextTarget(pool, previousId): HungryDogVocabItem`

- [ ] **Step 1: Write failing test**

Create `src/lib/hungry-dog/hungryDogSession.test.ts`:

```typescript
import assert from "node:assert/strict";
import {
  applyDrop,
  createInitialLesson,
  pickRoundChoices,
} from "./hungryDogSession";
import type { HungryDogVocabItem } from "../../types/hungryDog";
import { HUNGRY_DOG_ROUND } from "../../types/hungryDog";

const pool: HungryDogVocabItem[] = [
  { id: "a", word: "cat", imageSrc: "/a", unitId: "u1" },
  { id: "b", word: "dog", imageSrc: "/b", unitId: "u1" },
  { id: "c", word: "sun", imageSrc: "/c", unitId: "u1" },
  { id: "d", word: "book", imageSrc: "/d", unitId: "u1" },
  { id: "e", word: "hat", imageSrc: "/e", unitId: "u1" },
];

const lesson0 = createInitialLesson(pool);
assert.equal(lesson0.status, "playing");
assert.equal(lesson0.correctCount, 0);
assert.equal(lesson0.sessionCoins, 0);
assert.equal(lesson0.round.choices.length, 4);
assert.equal(
  lesson0.round.choices.filter((c) => c.id === lesson0.round.target.id).length,
  1,
);

const choices = pickRoundChoices(pool, lesson0.round.target);
assert.equal(choices.length, 4);
assert.equal(choices.filter((c) => c.id === lesson0.round.target.id).length, 1);
const choiceIds = new Set(choices.map((c) => c.id));
assert.equal(choiceIds.size, 4);

const wrong = applyDrop(lesson0, pool, "NOT_A_WORD");
assert.equal(wrong.kind, "wrong");
assert.equal(wrong.lesson.correctCount, 0);
assert.deepEqual(
  wrong.lesson.round.choices.map((c) => c.id),
  lesson0.round.choices.map((c) => c.id),
);

const right1 = applyDrop(lesson0, pool, lesson0.round.target.word);
assert.equal(right1.kind, "correct");
assert.equal(right1.lesson.correctCount, 1);
assert.equal(right1.lesson.sessionCoins, 1);
assert.equal(right1.lesson.status, "playing");

let lesson = lesson0;
for (let i = 0; i < HUNGRY_DOG_ROUND.targetsNeeded; i++) {
  const result = applyDrop(lesson, pool, lesson.round.target.word);
  assert.equal(result.kind, "correct");
  lesson = result.lesson;
}
assert.equal(lesson.status, "complete");
assert.equal(lesson.correctCount, HUNGRY_DOG_ROUND.targetsNeeded);

console.log("hungryDogSession.test.ts: ok");
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx tsx src/lib/hungry-dog/hungryDogSession.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement session logic**

Create `src/lib/hungry-dog/hungryDogSession.ts`:

```typescript
import {
  HUNGRY_DOG_ROUND,
  type DropResult,
  type HungryDogVocabItem,
  type LessonState,
  type RoundState,
} from "../../types/hungryDog";

function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function pickNextTarget(
  pool: readonly HungryDogVocabItem[],
  previousId: string,
): HungryDogVocabItem {
  const others = pool.filter((p) => p.id !== previousId);
  if (others.length === 0) return pool[0]!;
  return pickRandom(others);
}

export function pickRoundChoices(
  pool: readonly HungryDogVocabItem[],
  target: HungryDogVocabItem,
): RoundState["choices"] {
  const distractors = pool.filter((p) => p.id !== target.id);
  const picked: HungryDogVocabItem[] = [target];
  const shuffled = shuffle([...distractors]);
  for (const item of shuffled) {
    if (picked.length >= HUNGRY_DOG_ROUND.choicesCount) break;
    if (!picked.some((p) => p.id === item.id)) picked.push(item);
  }
  while (picked.length < HUNGRY_DOG_ROUND.choicesCount) {
    picked.push(pickRandom(pool));
  }
  const choices = shuffle(picked.slice(0, HUNGRY_DOG_ROUND.choicesCount));
  return choices as RoundState["choices"];
}

export function createInitialLesson(
  pool: readonly HungryDogVocabItem[],
): LessonState {
  if (pool.length === 0) {
    throw new Error("createInitialLesson requires a non-empty pool");
  }
  const target = pickRandom(pool);
  return {
    status: "playing",
    correctCount: 0,
    sessionCoins: 0,
    round: {
      target,
      choices: pickRoundChoices(pool, target),
    },
  };
}

export function applyDrop(
  lesson: LessonState,
  pool: readonly HungryDogVocabItem[],
  droppedWord: string,
): DropResult {
  if (lesson.status !== "playing") {
    return { kind: "wrong", lesson };
  }
  const isCorrect =
    normalizeWord(droppedWord) === normalizeWord(lesson.round.target.word);
  if (!isCorrect) {
    return { kind: "wrong", lesson };
  }

  const correctCount = lesson.correctCount + 1;
  const sessionCoins = lesson.sessionCoins + HUNGRY_DOG_ROUND.coinPerCorrect;

  if (correctCount >= HUNGRY_DOG_ROUND.targetsNeeded) {
    return {
      kind: "correct",
      lesson: {
        ...lesson,
        status: "complete",
        correctCount,
        sessionCoins,
      },
    };
  }

  const nextTarget = pickNextTarget(pool, lesson.round.target.id);
  return {
    kind: "correct",
    lesson: {
      status: "playing",
      correctCount,
      sessionCoins,
      round: {
        target: nextTarget,
        choices: pickRoundChoices(pool, nextTarget),
      },
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx tsx src/lib/hungry-dog/hungryDogSession.test.ts
```

Expected: `hungryDogSession.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/lib/hungry-dog/hungryDogSession.ts src/lib/hungry-dog/hungryDogSession.test.ts
git commit -m "feat: add Hungry Dog pure session logic with tests"
```

---

### Task 3: Hunger localStorage helper (TDD)

**Files:**
- Create: `src/lib/hungry-dog/hungryDogHunger.ts`
- Create: `src/lib/hungry-dog/hungryDogHunger.test.ts`

**Interfaces:**
- Produces:
  - `LAST_EAT_AT_KEY = "kidstory.hungryDog.lastEatAt"`
  - `getLastEatAt(): number | null`
  - `setLastEatAt(timestampMs: number): void`
  - `isHungry(nowMs: number, lastEatAt: number | null, hungerMs: number): boolean`

- [ ] **Step 1: Write failing test**

```typescript
import assert from "node:assert/strict";
import { isHungry } from "./hungryDogHunger";
import { HUNGRY_DOG_ROUND } from "../../types/hungryDog";

const hour = HUNGRY_DOG_ROUND.hungerMs;
const now = 1_000_000_000_000;

assert.equal(isHungry(now, null, hour), true);
assert.equal(isHungry(now, now - hour + 1, hour), false);
assert.equal(isHungry(now, now - hour, hour), true);
assert.equal(isHungry(now, now - hour - 1, hour), true);

console.log("hungryDogHunger.test.ts: ok");
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx tsx src/lib/hungry-dog/hungryDogHunger.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement hunger helper**

```typescript
export const LAST_EAT_AT_KEY = "kidstory.hungryDog.lastEatAt";

export function getLastEatAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LAST_EAT_AT_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setLastEatAt(timestampMs: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_EAT_AT_KEY, String(timestampMs));
}

export function isHungry(
  nowMs: number,
  lastEatAt: number | null,
  hungerMs: number,
): boolean {
  if (lastEatAt === null) return true;
  return nowMs - lastEatAt >= hungerMs;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx tsx src/lib/hungry-dog/hungryDogHunger.test.ts
```

Expected: `hungryDogHunger.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/lib/hungry-dog/hungryDogHunger.ts src/lib/hungry-dog/hungryDogHunger.test.ts
git commit -m "feat: add Hungry Dog hunger localStorage helpers"
```

---

### Task 4: `addCoins` progress API (TDD)

**Files:**
- Modify: `src/lib/userProgressLogic.ts`
- Create or modify: `src/lib/userProgressLogic.test.ts` (add test block if file exists)
- Modify: `src/contexts/UserProgressContext.tsx`

**Interfaces:**
- Produces:
  - `addCoins(progress: UserProgressV1, amount: number): UserProgressV1`
  - `useUserProgress().addCoins(n: number): Promise<void>`

- [ ] **Step 1: Write failing test**

Add to `src/lib/userProgressLogic.test.ts` (create file with imports from existing patterns if missing):

```typescript
import assert from "node:assert/strict";
import { addCoins, getDefaultProgress } from "./userProgressLogic";

const base = getDefaultProgress();
const next = addCoins(base, 3);
assert.equal(next.coins, 3);
assert.equal(addCoins(next, 1).coins, 4);

console.log("userProgressLogic addCoins: ok");
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx tsx src/lib/userProgressLogic.test.ts
```

Expected: FAIL — `addCoins` not exported.

- [ ] **Step 3: Add `addCoins` to userProgressLogic**

After `spendCoins` in `src/lib/userProgressLogic.ts`:

```typescript
export function addCoins(progress: UserProgressV1, amount: number): UserProgressV1 {
  if (amount <= 0) return progress;
  return {
    ...progress,
    coins: progress.coins + amount,
  };
}
```

- [ ] **Step 4: Expose in UserProgressContext**

In `src/contexts/UserProgressContext.tsx`:

Add to type:
```typescript
addCoins: (amount: number) => Promise<void>;
```

Import `addCoins` from `userProgressLogic`.

Add callback:
```typescript
const addCoinsToProgress = useCallback(
  async (amount: number): Promise<void> => {
    const next = addCoins(progressRef.current, amount);
    await persist(next);
  },
  [persist],
);
```

Add `addCoins: addCoinsToProgress` to context value and dependency array.

- [ ] **Step 5: Run tests + lint**

```bash
npx tsx src/lib/userProgressLogic.test.ts
npm run lint
```

Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/userProgressLogic.ts src/lib/userProgressLogic.test.ts src/contexts/UserProgressContext.tsx
git commit -m "feat: add addCoins API for per-action coin rewards"
```

---

### Task 5: Sound stubs

**Files:**
- Create: `src/lib/hungry-dog/hungryDogSounds.ts`

**Interfaces:**
- Produces: `playHungryDogCorrectSound(): void`, `playHungryDogWrongSound(): void`

- [ ] **Step 1: Create stubs**

```typescript
// TODO: replace with real chime/success asset when provided
export function playHungryDogCorrectSound(): void {}

// TODO: replace with soft negative cue asset when provided
export function playHungryDogWrongSound(): void {}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/hungry-dog/hungryDogSounds.ts
git commit -m "feat: add Hungry Dog sound stubs"
```

---

### Task 6: `useHungryDogSession` hook

**Files:**
- Create: `src/hooks/useHungryDogSession.ts`

**Interfaces:**
- Consumes: `buildFishingVocabPool`, `createInitialLesson`, `applyDrop`, hunger helpers, `playCourseAudio`, sound stubs, `useUserProgress().addCoins`
- Produces:
  - `{ pool, canPlay, lesson, puppyBaseAnim, onDrop, restart, playWord }`
  - `onDrop(word: string): { kind: "correct" | "wrong" | "ignored" }`

- [ ] **Step 1: Implement hook**

Mirror `src/hooks/useFishingSession.ts` structure:

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { courseUnits } from "../data/course";
import { buildFishingVocabPool } from "../lib/fishing/buildFishingVocabPool";
import { createInitialLesson, applyDrop } from "../lib/hungry-dog/hungryDogSession";
import {
  getLastEatAt,
  isHungry,
  setLastEatAt,
} from "../lib/hungry-dog/hungryDogHunger";
import {
  playHungryDogCorrectSound,
  playHungryDogWrongSound,
} from "../lib/hungry-dog/hungryDogSounds";
import { playCourseAudio } from "../lib/playCourseAudio";
import {
  HUNGRY_DOG_ROUND,
  type LessonState,
  type PuppyAnim,
} from "../types/hungryDog";
import { useUserProgress } from "../contexts/UserProgressContext";

export function useHungryDogSession() {
  const { isUnitAccessible, addCoins } = useUserProgress();
  const pool = useMemo(
    () => buildFishingVocabPool(courseUnits, isUnitAccessible),
    [isUnitAccessible],
  );
  const canPlay = pool.length >= HUNGRY_DOG_ROUND.minPoolSize;

  const poolRef = useRef(pool);
  poolRef.current = pool;

  const [lesson, setLesson] = useState<LessonState | null>(null);
  const [lastEatAt, setLastEatAtState] = useState<number | null>(() => getLastEatAt());
  const runIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedRef = useRef(false);

  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  useEffect(() => {
    if (!canPlay) {
      runIdRef.current += 1;
      setLesson(null);
      return;
    }
    setLesson((prev) => prev ?? createInitialLesson(poolRef.current));
  }, [canPlay]);

  const target = lesson?.status === "playing" ? lesson.round.target : null;

  const puppyBaseAnim: PuppyAnim = useMemo(() => {
    const hungry = isHungry(Date.now(), lastEatAt, HUNGRY_DOG_ROUND.hungerMs);
    return hungry ? "hungry" : "idle";
  }, [lastEatAt]);

  const playWord = useCallback(() => {
    if (!target) return;
    void playCourseAudio(target.audio, target.word, audioRef, stopAudio);
  }, [target, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [target?.id, lesson?.correctCount]);

  useEffect(() => {
    if (!target || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const t = setTimeout(() => playWord(), 1500);
    return () => clearTimeout(t);
  }, [target, playWord]);

  const onDrop = useCallback(
    (word: string) => {
      if (!lesson || lesson.status !== "playing") {
        return { kind: "ignored" as const };
      }
      const result = applyDrop(lesson, poolRef.current, word);
      if (result.kind === "wrong") {
        playHungryDogWrongSound();
        return result;
      }
      playHungryDogCorrectSound();
      const now = Date.now();
      setLastEatAt(now);
      setLastEatAtState(now);
      void addCoins(HUNGRY_DOG_ROUND.coinPerCorrect).catch((err) => {
        console.error("addCoins failed", err);
      });
      setLesson(result.lesson);
      return result;
    },
    [lesson, addCoins],
  );

  const restart = useCallback(() => {
    if (!canPlay) return;
    runIdRef.current += 1;
    stopAudio();
    setLesson(createInitialLesson(poolRef.current));
  }, [canPlay, stopAudio]);

  return {
    pool,
    canPlay,
    lesson,
    puppyBaseAnim,
    onDrop,
    restart,
    playWord,
    targetsNeeded: HUNGRY_DOG_ROUND.targetsNeeded,
  };
}
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHungryDogSession.ts
git commit -m "feat: add useHungryDogSession hook"
```

---

### Task 7: Pixi timings + preload

**Files:**
- Create: `src/components/games-v2/hungry-dog/timings.ts`
- Create: `src/components/games-v2/hungry-dog/preload.ts`

**Interfaces:**
- Produces:
  - `HUNGRY_DOG_TIMINGS` object with `wrongMs`, `eatingMs`, `happyMs`, `cardSnapBackMs`, `coinFlyMs`, `advanceDelayMs`
  - `preloadHungryDogAssets(): Promise<void>`

- [ ] **Step 1: Create timings**

```typescript
export const HUNGRY_DOG_TIMINGS = {
  wrongMs: 900,
  eatingMs: 700,
  happyMs: 900,
  cardSnapBackMs: 350,
  coinFlyMs: 600,
  advanceDelayMs: 400,
  feedbackLabelMs: 800,
} as const;
```

- [ ] **Step 2: Create preload**

```typescript
import { Assets } from "pixi.js";
import spritesheetUrl from "../../../assets/games/spritesheet.json";

export async function preloadHungryDogAssets(): Promise<void> {
  await Assets.load({ alias: "hungryDogSheet", src: spritesheetUrl });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/games-v2/hungry-dog/timings.ts src/components/games-v2/hungry-dog/preload.ts
git commit -m "feat: add Hungry Dog Pixi preload and timing constants"
```

---

### Task 8: Puppy animation controller

**Files:**
- Create: `src/components/games-v2/hungry-dog/puppyController.ts`

**Interfaces:**
- Consumes: `PuppyAnim` from types, spritesheet alias `hungryDogSheet`
- Produces:
  - `createPuppyController(stage): { sprite, setAnim(anim: PuppyAnim, loop?: boolean): void, getMouthBounds(): Rectangle, destroy(): void }`

Spritesheet frame prefixes (from `spritesheet.json`):
- `idle` → `idle-*`
- `hungry` → `hungry-*`
- `ready` → `ready-*`
- `eating` → `eat-*`
- `happy` → `ate-*`
- `wrong` → `sad-*`

- [ ] **Step 1: Implement controller**

Build `AnimatedSprite` frames by sorting texture keys with matching prefix from `Assets.get("hungryDogSheet").textures`. Center puppy on stage. Export fixed mouth hit rect relative to sprite:

```typescript
export const MOUTH_HIT = { x: -40, y: -20, width: 80, height: 50 } as const;
```

`setAnim` switches textures, plays once for transient states (`eating`, `happy`, `wrong`), loops for base states (`idle`, `hungry`, `ready`).

- [ ] **Step 2: Commit**

```bash
git add src/components/games-v2/hungry-dog/puppyController.ts
git commit -m "feat: add Hungry Dog puppy animation controller"
```

---

### Task 9: Word card drag system

**Files:**
- Create: `src/components/games-v2/hungry-dog/wordCardDrag.ts`

**Interfaces:**
- Consumes: `HungryDogVocabItem`, `MOUTH_HIT`, `HUNGRY_DOG_TIMINGS`
- Produces:
  - `createWordCards(opts): { containers, setEnabled(bool), updateChoices(choices), destroy() }`
  - Each card: `Container` with rounded `Graphics` background + `Text` (word uppercase)
  - Drag: pointerdown → globalmove → pointerup
  - Hit test: card center in mouth world bounds → call `onDrop(word)`
  - Miss: tween back to home slot over `cardSnapBackMs`

- [ ] **Step 1: Implement drag module**

Place four cards in bottom row slots (evenly spaced). Randomize slot assignment when `updateChoices` called. Set `eventMode = "static"` and `cursor = "pointer"` on cards.

- [ ] **Step 2: Commit**

```bash
git add src/components/games-v2/hungry-dog/wordCardDrag.ts
git commit -m "feat: add Hungry Dog Pixi word card drag system"
```

---

### Task 10: FX system + feedback labels

**Files:**
- Create: `src/components/games-v2/hungry-dog/fxSystem.ts`

**Interfaces:**
- Produces:
  - `triggerEffect(kind: "correct" | "wrong", x: number, y: number, stage): void`
  - `showFeedbackLabel(text: string, x: number, y: number, stage): void`
  - `playCoinFly(fromX, fromY, toX, toY, stage): void`

Label pools (from spec):
- Correct: `["Yummy!", "Delicious!", "Great!", "Thank you!"]`
- Wrong: `["Oops!", "Try again!", "Not this one!"]`

Use `HUNGRY_DOG_TIMINGS.feedbackLabelMs` and `coinFlyMs`. Keep particles simple (reuse patterns from `fishing/fxSystem.ts` where practical).

- [ ] **Step 1: Implement fxSystem**

- [ ] **Step 2: Commit**

```bash
git add src/components/games-v2/hungry-dog/fxSystem.ts
git commit -m "feat: add Hungry Dog VFX and feedback labels"
```

---

### Task 11: `HungryDogPixiStage` component

**Files:**
- Create: `src/components/games-v2/hungry-dog/HungryDogPixiStage.tsx`
- Modify: `src/components/games-v2/index.ts`

**Interfaces:**
- Consumes: hook outputs — `choices`, `puppyBaseAnim`, `enabled`, `onDrop`
- Props:
```typescript
type HungryDogPixiStageProps = {
  choices: readonly HungryDogVocabItem[];
  puppyBaseAnim: PuppyAnim;
  enabled: boolean;
  onDrop: (word: string) => { kind: "correct" | "wrong" | "ignored" };
  onCoinFly?: () => void;
};
```

**Animation sequence on drop:**
1. Wrong: `setAnim("wrong")` → feedback label → snap card → return to `puppyBaseAnim` or `"ready"`
2. Correct: `setAnim("eating")` → wait `eatingMs` → `setAnim("happy")` → coin fly + `onCoinFly` → wait `happyMs + advanceDelayMs` → callback already updated lesson in hook; stage sets `enabled=true`, `setAnim(puppyBaseAnim)`, `updateChoices`

- [ ] **Step 1: Implement stage**

Follow `FishingPixiStage.tsx` lifecycle:
- `useRef` host div
- `useEffect` creates `Application`, calls `preloadHungryDogAssets`, builds puppy + cards
- Resize handler
- Cleanup on unmount
- Refs for `enabled`, `onDrop`, `choices`, `puppyBaseAnim` to avoid stale closures

- [ ] **Step 2: Export from index**

```typescript
export { HungryDogPixiStage } from "./hungry-dog/HungryDogPixiStage";
```

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/games-v2/hungry-dog/HungryDogPixiStage.tsx src/components/games-v2/index.ts
git commit -m "feat: add HungryDogPixiStage with drag-drop and puppy animations"
```

---

### Task 12: `HungryDogGamePage` shell

**Files:**
- Modify: `src/pages/HungryDogGamePage.tsx`

**Interfaces:**
- Consumes: `useHungryDogSession`, `HungryDogPixiStage`, `ActivityEndShell`, `CourseBottomNav`, `useUserProgress().coins`

- [ ] **Step 1: Build page shell**

Mirror `FishingGamePage.tsx` layout:

- Empty pool → unlock message + link `?unblock=all`
- Playing:
  - Top center: target image in liquidGlass circle (tap to replay audio via `playWord`)
  - Bottom right: coin counter showing `progress.coins` from `useUserProgress()` (global balance)
  - Full-screen `HungryDogPixiStage` with `enabled={lesson.status === "playing" && !animating}` — track local `animating` state or let stage manage `enabled` internally during feedback
  - Pass `choices={lesson.round.choices}`, `puppyBaseAnim`, `onDrop`
- Complete:
  - Overlay with `ActivityEndShell` (no reward prop — coins already awarded per correct)
  - Title: "Great job!" or similar
  - Buttons: Play again (`restart`), Back to games (`/games-v2`)

Do **not** call `completeGameV2`.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/HungryDogGamePage.tsx
git commit -m "feat: wire Hungry Dog game page shell and end screen"
```

---

### Task 13: Final verification

**Files:** (none — run commands only)

- [ ] **Step 1: Run all new tests**

```bash
npx tsx src/lib/hungry-dog/hungryDogSession.test.ts
npx tsx src/lib/hungry-dog/hungryDogHunger.test.ts
npx tsx src/lib/userProgressLogic.test.ts
```

Expected: all print `ok`.

- [ ] **Step 2: Typecheck**

```bash
npm run lint
```

Expected: exit 0.

- [ ] **Step 3: Manual smoke test**

```bash
npm start
```

Open `http://localhost:3000/games-v2/hungry-dog?unblock=all`

Verify:
- 4 word cards visible, draggable
- Wrong drop keeps all 4 choices
- Correct drop advances round, coin counter increments
- After 5 correct → end screen
- Puppy shows hungry base when no `lastEatAt` in localStorage
- Audio auto-plays on new target

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address Hungry Dog integration issues from smoke test"
```

(Only if fixes were needed.)

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Route `/games-v2/hungry-dog` | Pre-existing; Task 12 wires page |
| Reuse fishing vocab pool | Task 6 |
| 5 correct to complete | Task 2 |
| Always 4 choices, no removal on wrong | Task 2, 9 |
| +1 coin per correct via `addCoins` | Task 4, 6 |
| No `completeGameV2` | Task 6, 12 |
| Visual hunger from localStorage | Task 3, 6, 8 |
| Image + auto audio prompt | Task 6, 12 |
| Pixi drag-and-drop | Task 9, 11 |
| Puppy animation states enum | Task 1, 8, 11 |
| Named timing constants | Task 7 |
| Sound stubs | Task 5 |
| Out of scope: Snyk, real SFX | Not implemented (by design) |

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-07-20-hungry-dog-game.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** — execute tasks in this session with checkpoints

Which approach?
