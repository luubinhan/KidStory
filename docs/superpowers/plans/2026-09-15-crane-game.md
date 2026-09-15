# Letter Crane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a PixiJS Letter Crane mini-game at `/games-v2/crane` where a child moves a hook with arrow keys, auto-grabs the next correct letter, and earns 10 diamonds per finished word.

**Architecture:** Pure `src/lib/crane/craneSession.ts` owns word filter, round build, and `applyGrab`. `useCraneSession` holds React state, audio, and `completeGameV2("crane")`. `CranePixiStage` owns the PixiJS v8 scene (hook, letters, slots, keyboard, contact, tween). `CraneGamePage` is Games V2 chrome plus `ActivityEndShell`.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, react-router-dom, PixiJS v8, Dexie progress via `completeGameV2`, standalone `npx tsx` tests with `assert()`

**Spec:** `docs/superpowers/specs/2026-09-15-crane-game-design.md`

## Global Constraints

- Game id is exactly `crane`; route is exactly `/games-v2/crane`; catalog name is exactly `Letter Crane`
- `coinReward: 0`, `diamondReward: 10`; award only via `completeGameV2("crane")`; do not add `addDiamonds`
- Omit `thumbnailSrc` (hub pond-gradient placeholder)
- Arrow keys only (no WASD, no on-screen D-pad, no touch-drag hook)
- Auto-grab on tip AABB contact with the next needed letter; wrong letters pass through
- One course word per round; Play again starts a new word and awards again
- Vocabulary: `buildFishingVocabPool(gameUnits)` then `filterCraneWords` (3–8 letters, `/^[a-z]+$/i`)
- Hint prefix: length 3 → 1 filled slot; length ≥ 4 → 2 filled slots
- Display letters lowercase
- Tests are standalone `npx tsx src/lib/crane/craneSession.test.ts` with `assert()` — no Jest/Vitest
- Two-space indent; `satisfies` on data exports
- Do not run Snyk
- Pixi `Application`: `new Application()` then `await app.init({ backgroundAlpha: 0, resizeTo: window, antialias: true, autoDensity: true, resolution: Math.min(window.devicePixelRatio || 1, 2) })`. Destroy only after `app.renderer` exists
- Pixi `Text` uses options-object constructor, not v7 positional `(string, style)`
- Graphics uses v8 shape-then-fill (`rect`/`circle` then `fill`), not `beginFill`/`endFill`

---

## File map

| File | Responsibility |
|------|----------------|
| `src/types/crane.ts` | `CRANE_ROUND`, slot/round/state types |
| `src/lib/crane/craneSession.ts` | Filter, hint, create round, next letter, apply grab |
| `src/lib/crane/craneSession.test.ts` | assert() coverage |
| `src/data/gamesV2.ts` | Catalog card `crane` 0/10 |
| `src/lib/gameV2Reward.test.ts` | Assert `crane` yields 0 coins / 10 diamonds |
| `src/hooks/useCraneSession.ts` | React session, audio, `completeGameV2` |
| `src/components/games-v2/crane/CranePixiStage.tsx` | Pixi hook + letters + slots |
| `src/pages/CraneGamePage.tsx` | HUD, empty state, end shell, nav |
| `src/App.tsx` | Route |
| `AGENTS.md` | Route table row |

---

### Task 1: Pure crane session (TDD)

**Files:**
- Create: `src/types/crane.ts`
- Create: `src/lib/crane/craneSession.test.ts`
- Create: `src/lib/crane/craneSession.ts`

**Interfaces:**
- Consumes: `FishingVocabItem` from `src/types/fishing.ts`
- Produces:

```ts
export const CRANE_ROUND = {
  minLetters: 3,
  maxLetters: 8,
  speedPxPerSec: 280,
  flyToSlotMs: 280,
  minPoolSize: 1,
} as const;

export type CraneStatus = "playing" | "complete";

export type CraneSlot = {
  letter: string;
  filled: boolean;
};

export type CraneRound = {
  target: FishingVocabItem;
  word: string;
  slots: CraneSlot[];
  fieldLetters: string[];
};

export type CraneState = {
  status: CraneStatus;
  round: CraneRound;
};

export function normalizeCraneWord(word: string): string;
export function isCraneWord(word: string): boolean;
export function filterCraneWords(pool: readonly FishingVocabItem[]): FishingVocabItem[];
export function hintCountForWord(word: string): number;
export function nextLetter(slots: readonly CraneSlot[]): string | null;
export function createRound(
  pool: readonly FishingVocabItem[],
  previousId?: string,
  random?: () => number,
): CraneState;
export function applyGrab(state: CraneState, letter: string): CraneState;
```

- [ ] **Step 1: Write types**

Create `src/types/crane.ts`:

```ts
import type { FishingVocabItem } from "./fishing";

export const CRANE_ROUND = {
  minLetters: 3,
  maxLetters: 8,
  speedPxPerSec: 280,
  flyToSlotMs: 280,
  minPoolSize: 1,
} as const;

export type CraneStatus = "playing" | "complete";

export type CraneSlot = {
  letter: string;
  filled: boolean;
};

export type CraneRound = {
  target: FishingVocabItem;
  word: string;
  slots: CraneSlot[];
  fieldLetters: string[];
};

export type CraneState = {
  status: CraneStatus;
  round: CraneRound;
};
```

- [ ] **Step 2: Write the failing test**

Create `src/lib/crane/craneSession.test.ts`:

```ts
import assert from "node:assert/strict";
import type { FishingVocabItem } from "../../types/fishing";
import {
  applyGrab,
  createRound,
  filterCraneWords,
  hintCountForWord,
  isCraneWord,
  nextLetter,
  normalizeCraneWord,
} from "./craneSession";

function vocab(id: string, word: string): FishingVocabItem {
  return { id, word, imageSrc: "img", unitId: "unit-1" };
}

assert.equal(normalizeCraneWord(" Garden "), "garden");
assert.equal(isCraneWord("cat"), true);
assert.equal(isCraneWord("garden"), true);
assert.equal(isCraneWord("ox"), false);
assert.equal(isCraneWord("abcdefghij"), false);
assert.equal(isCraneWord("ice cream"), false);
assert.equal(isCraneWord("ice-cream"), false);
assert.equal(isCraneWord("café"), false);

const mixed = [
  vocab("1", "cat"),
  vocab("2", "ox"),
  vocab("3", "ice cream"),
  vocab("4", "garden"),
];
const filtered = filterCraneWords(mixed);
assert.deepEqual(
  filtered.map((item) => item.id),
  ["1", "4"],
);

assert.equal(hintCountForWord("cat"), 1);
assert.equal(hintCountForWord("garden"), 2);

const garden = createRound([vocab("g", "Garden")], undefined, () => 0);
assert.equal(garden.status, "playing");
assert.equal(garden.round.word, "garden");
assert.deepEqual(
  garden.round.slots.map((s) => s.letter),
  ["g", "a", "r", "d", "e", "n"],
);
assert.deepEqual(
  garden.round.slots.map((s) => s.filled),
  [true, true, false, false, false, false],
);
assert.deepEqual([...garden.round.fieldLetters].sort(), ["d", "e", "n", "r"]);
assert.equal(nextLetter(garden.round.slots), "r");

const wrong = applyGrab(garden, "x");
assert.equal(wrong, garden);
assert.equal(nextLetter(wrong.round.slots), "r");

const afterR = applyGrab(garden, "R");
assert.equal(nextLetter(afterR.round.slots), "d");
assert.equal(afterR.round.slots[2]?.filled, true);

const afterD = applyGrab(afterR, "d");
const afterE = applyGrab(afterD, "e");
const afterN = applyGrab(afterE, "n");
assert.equal(afterN.status, "complete");
assert.equal(nextLetter(afterN.round.slots), null);
assert.equal(applyGrab(afterN, "n"), afterN);

const happy = createRound([vocab("h", "happy")], undefined, () => 0);
assert.deepEqual(
  happy.round.slots.map((s) => s.filled),
  [true, true, false, false, false],
);
assert.deepEqual([...happy.round.fieldLetters].sort(), ["p", "p", "y"]);
const afterP1 = applyGrab(happy, "p");
const afterP2 = applyGrab(afterP1, "p");
const afterY = applyGrab(afterP2, "y");
assert.equal(afterY.status, "complete");

const only = [vocab("solo", "cat")];
const first = createRound(only, undefined, () => 0);
const again = createRound(only, first.round.target.id, () => 0);
assert.equal(again.round.word, "cat");
assert.equal(again.status, "playing");

const two = [vocab("a", "cat"), vocab("b", "dog")];
const picked = createRound(two, "a", () => 0.99);
assert.equal(picked.round.target.id, "b");

console.log("craneSession.test.ts: ok");
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx tsx src/lib/crane/craneSession.test.ts`

Expected: FAIL with `Cannot find module './craneSession'` (or equivalent).

- [ ] **Step 4: Write implementation**

Create `src/lib/crane/craneSession.ts`:

```ts
import { CRANE_ROUND, type CraneSlot, type CraneState } from "../../types/crane";
import type { FishingVocabItem } from "../../types/fishing";

export function normalizeCraneWord(word: string): string {
  return word.trim().toLowerCase();
}

export function isCraneWord(word: string): boolean {
  const w = normalizeCraneWord(word);
  return (
    w.length >= CRANE_ROUND.minLetters &&
    w.length <= CRANE_ROUND.maxLetters &&
    /^[a-z]+$/.test(w)
  );
}

export function filterCraneWords(
  pool: readonly FishingVocabItem[],
): FishingVocabItem[] {
  return pool.filter((item) => isCraneWord(item.word));
}

export function hintCountForWord(word: string): number {
  return normalizeCraneWord(word).length >= 4 ? 2 : 1;
}

export function nextLetter(slots: readonly CraneSlot[]): string | null {
  const slot = slots.find((s) => !s.filled);
  return slot ? slot.letter : null;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function pickItem<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

export function createRound(
  pool: readonly FishingVocabItem[],
  previousId?: string,
  random: () => number = Math.random,
): CraneState {
  if (pool.length === 0) {
    throw new Error("createRound requires a non-empty pool");
  }
  const candidates =
    previousId && pool.length > 1
      ? pool.filter((item) => item.id !== previousId)
      : pool;
  const target = pickItem(candidates.length > 0 ? candidates : pool, random);
  const word = normalizeCraneWord(target.word);
  const hintCount = hintCountForWord(word);
  const slots: CraneSlot[] = [...word].map((letter, index) => ({
    letter,
    filled: index < hintCount,
  }));
  const fieldLetters = shuffle([...word.slice(hintCount)], random);
  return {
    status: "playing",
    round: { target, word, slots, fieldLetters },
  };
}

export function applyGrab(state: CraneState, letter: string): CraneState {
  if (state.status !== "playing") return state;
  const expected = nextLetter(state.round.slots);
  const got = normalizeCraneWord(letter);
  if (!expected || got !== expected) return state;
  const emptyIndex = state.round.slots.findIndex((s) => !s.filled);
  const slots = state.round.slots.map((s, i) =>
    i === emptyIndex ? { ...s, filled: true } : s,
  );
  const complete = slots.every((s) => s.filled);
  return {
    status: complete ? "complete" : "playing",
    round: { ...state.round, slots },
  };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx tsx src/lib/crane/craneSession.test.ts`

Expected: `craneSession.test.ts: ok`

If `picked.round.target.id` is not `"b"` with `random: () => 0.99`, adjust only the test's `random` so `Math.floor(random() * 1)` still picks the sole candidate `"b"` after filtering out `"a"`. With one candidate, any `random` in `[0, 1)` works — keep `() => 0.99`.

- [ ] **Step 6: Commit**

```bash
git add src/types/crane.ts src/lib/crane/craneSession.ts src/lib/crane/craneSession.test.ts
git commit -m "feat: add Letter Crane session rules"
```

---

### Task 2: Catalog + reward

**Files:**
- Modify: `src/data/gamesV2.ts`
- Modify: `src/lib/gameV2Reward.test.ts`

**Interfaces:**
- Consumes: `GameV2` type (unchanged)
- Produces: catalog id `crane` with `coinReward: 0`, `diamondReward: 10`, no `thumbnailSrc`

- [ ] **Step 1: Write the failing reward assertion**

Append to `src/lib/gameV2Reward.test.ts` before `console.log`:

```ts
const crane = onGameV2Complete(getDefaultProgress(), "crane");
assert.ok(crane, "crane catalog returns result");
assert.equal(crane!.coinsEarned, 0);
assert.equal(crane!.diamondsEarned, 10);
assert.equal(crane!.progress.diamonds, getDefaultProgress().diamonds + 10);
assert.equal(crane!.progress.coins, getDefaultProgress().coins);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/gameV2Reward.test.ts`

Expected: FAIL (`crane` is null or diamonds not 10).

- [ ] **Step 3: Add catalog entry**

In `src/data/gamesV2.ts`, append this object to `gamesV2` (after the `caro` entry, before `] as const`):

```ts
  {
    id: "crane",
    name: "Letter Crane",
    path: "/games-v2/crane",
    coinReward: 0,
    diamondReward: 10,
  },
```

Do not set `thumbnailSrc`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/gameV2Reward.test.ts`

Expected: `gameV2Reward.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/data/gamesV2.ts src/lib/gameV2Reward.test.ts
git commit -m "feat: add Letter Crane to Games V2 catalog"
```

---

### Task 3: Session hook

**Files:**
- Create: `src/hooks/useCraneSession.ts`

**Interfaces:**
- Consumes: `filterCraneWords`, `createRound`, `applyGrab`, `CRANE_ROUND`; `buildFishingVocabPool`; `gameUnits`; `playCourseAudio`; `useUserProgress().completeGameV2`
- Produces:

```ts
export function useCraneSession(): {
  canPlay: boolean;
  state: CraneState | null;
  reward: ActivityRewardResult | null;
  onGrab: (letter: string) => void;
  restart: () => void;
  playWord: () => void;
};
```

- [ ] **Step 1: Write the hook**

Create `src/hooks/useCraneSession.ts`:

```ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gameUnits } from "../data/course";
import { buildFishingVocabPool } from "../lib/fishing/buildFishingVocabPool";
import {
  applyGrab,
  createRound,
  filterCraneWords,
} from "../lib/crane/craneSession";
import { playCourseAudio } from "../lib/playCourseAudio";
import { CRANE_ROUND, type CraneState } from "../types/crane";
import { useUserProgress } from "../contexts/UserProgressContext";
import type { ActivityRewardResult } from "../types/userProgress";

export function useCraneSession() {
  const { completeGameV2 } = useUserProgress();
  const pool = useMemo(
    () => filterCraneWords(buildFishingVocabPool(gameUnits)),
    [],
  );
  const canPlay = pool.length >= CRANE_ROUND.minPoolSize;

  const poolRef = useRef(pool);
  poolRef.current = pool;

  const [state, setState] = useState<CraneState | null>(null);
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const awardedRef = useRef(false);
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
      setState(null);
      awardedRef.current = false;
      setReward(null);
      return;
    }
    setState((prev) => prev ?? createRound(poolRef.current));
  }, [canPlay]);

  useEffect(() => {
    if (!state || state.status !== "complete" || awardedRef.current) return;
    awardedRef.current = true;
    const runId = runIdRef.current;
    void completeGameV2("crane").then((result) => {
      if (result && runIdRef.current === runId) setReward(result);
    });
  }, [state, completeGameV2]);

  const target =
    state?.status === "playing" ? state.round.target : null;

  const playWord = useCallback(() => {
    if (!target) return;
    void playCourseAudio(target.audio, target.word, audioRef, stopAudio);
  }, [target, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [target?.id]);

  useEffect(() => {
    if (!target || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const id = window.setTimeout(() => {
      playWord();
    }, 1500);
    return () => window.clearTimeout(id);
  }, [target, playWord]);

  const onGrab = useCallback((letter: string) => {
    setState((prev) => (prev ? applyGrab(prev, letter) : prev));
  }, []);

  const restart = useCallback(() => {
    if (!canPlay) return;
    runIdRef.current += 1;
    awardedRef.current = false;
    setReward(null);
    stopAudio();
    setState((prev) =>
      createRound(poolRef.current, prev?.round.target.id),
    );
  }, [canPlay, stopAudio]);

  return {
    canPlay,
    state,
    reward,
    onGrab,
    restart,
    playWord,
  };
}
```

- [ ] **Step 2: Typecheck hook**

Run: `npx tsc --noEmit --pretty false 2>&1 | rg "useCraneSession|craneSession" || true`

Expected: no errors naming `useCraneSession.ts`. (Other pre-existing project errors, if any, are out of scope.) Prefer `npm run lint` later in Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCraneSession.ts
git commit -m "feat: add Letter Crane session hook"
```

---

### Task 4: Pixi stage

**Files:**
- Create: `src/components/games-v2/crane/CranePixiStage.tsx`

**Interfaces:**
- Consumes: `CRANE_ROUND`, `CraneSlot`, `nextLetter`, `normalizeCraneWord`
- Produces:

```ts
type CranePixiStageProps = {
  word: string;
  slots: readonly CraneSlot[];
  fieldLetters: readonly string[];
  enabled: boolean;
  onGrab: (letter: string) => void;
};

export function CranePixiStage(props: CranePixiStageProps): JSX.Element;
```

Rules inside the stage (do not put these in React):

- Window `keydown`/`keyup` for `ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown`. `preventDefault` only while `enabled && !busy`.
- Move hook at `CRANE_ROUND.speedPxPerSec` using `ticker.deltaMS / 1000`. If two axes held, multiply both by `Math.SQRT1_2`.
- Clamp hook to playfield: `x` in `[16, width-16]`, `y` in `[hudTop, slotTop - 16]` where `hudTop = 180` and `slotTop = height - 100`.
- Hook `Container` position is the **grab tip**. Draw an L-arm left/up from the tip plus a gray circle at the top of the arm. Tip hitbox is 28×28 centered on the tip.
- Field `Text` letters from `fieldLetters` (lowercase). Rejection sample positions (max 20 tries) so they stay in the playfield and at least 48px from each other; fallback to a row/grid.
- Wrong letter: no collision response.
- Correct next letter: set `busy`, tween letter to the first empty slot center over `CRANE_ROUND.flyToSlotMs`, then `onGrab(letter)`, remove that `Text`, clear `busy`.
- Ignore contacts and movement while `busy` or `!enabled`.
- `resizeTo: window`. On resize, re-layout the slot row; clamp hook; do not re-scatter letters.
- Destroy: `if (!app.renderer) return; app.destroy(true, { children: true })`.

- [ ] **Step 1: Write CranePixiStage**

Create `src/components/games-v2/crane/CranePixiStage.tsx`:

```tsx
import { useEffect, useRef } from "react";
import { Application, Container, Graphics, Text, type Ticker } from "pixi.js";
import { nextLetter, normalizeCraneWord } from "../../../lib/crane/craneSession";
import { CRANE_ROUND, type CraneSlot } from "../../../types/crane";

const HUD_TOP = 180;
const SLOT_AREA = 100;
const TIP_SIZE = 28;
const LETTER_GAP = 48;

type CranePixiStageProps = {
  word: string;
  slots: readonly CraneSlot[];
  fieldLetters: readonly string[];
  enabled: boolean;
  onGrab: (letter: string) => void;
};

type FieldLetter = {
  char: string;
  text: Text;
};

type Tween = {
  letter: FieldLetter;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  elapsed: number;
};

function aabbOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function slotCenters(
  width: number,
  height: number,
  count: number,
): { x: number; y: number }[] {
  const slotW = 52;
  const gap = 10;
  const total = count * slotW + (count - 1) * gap;
  const startX = (width - total) / 2 + slotW / 2;
  const y = height - SLOT_AREA / 2;
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * (slotW + gap),
    y,
  }));
}

export function CranePixiStage({
  word,
  slots,
  fieldLetters,
  enabled,
  onGrab,
}: CranePixiStageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const slotsRef = useRef(slots);
  const enabledRef = useRef(enabled);
  const onGrabRef = useRef(onGrab);
  slotsRef.current = slots;
  enabledRef.current = enabled;
  onGrabRef.current = onGrab;

  useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl) return;

    let disposed = false;
    const app = new Application();
    const keys = new Set<string>();
    let busy = false;
    let tween: Tween | null = null;
    const letters: FieldLetter[] = [];
    const slotGfx: Graphics[] = [];
    const slotTexts: Text[] = [];
    const hook = new Container();
    const letterStyle = {
      fontFamily: "Arial, sans-serif",
      fontSize: 36,
      fill: 0x1e293b,
      fontWeight: "700",
    } as const;

    function destroyApp(): void {
      if (!app.renderer) return;
      app.destroy(true, { children: true });
    }

    function playfield(width: number, height: number) {
      return {
        minX: 24,
        maxX: width - 24,
        minY: HUD_TOP,
        maxY: height - SLOT_AREA - 16,
      };
    }

    function layoutSlots(width: number, height: number): void {
      const centers = slotCenters(width, height, slotsRef.current.length);
      const slotW = 52;
      const slotH = 56;
      for (let i = 0; i < slotsRef.current.length; i++) {
        const g = slotGfx[i];
        const t = slotTexts[i];
        const c = centers[i];
        if (!g || !t || !c) continue;
        g.clear();
        g.roundRect(c.x - slotW / 2, c.y - slotH / 2, slotW, slotH, 8).fill(0xd6d3d1);
        const slot = slotsRef.current[i];
        t.text = slot?.filled ? slot.letter : "";
        t.position.set(c.x, c.y);
      }
    }

    function scatterLetters(width: number, height: number): void {
      const area = playfield(width, height);
      const placed: { x: number; y: number }[] = [];
      for (const item of letters) {
        let x = (area.minX + area.maxX) / 2;
        let y = (area.minY + area.maxY) / 2;
        let found = false;
        for (let attempt = 0; attempt < 20; attempt++) {
          const tx = area.minX + Math.random() * (area.maxX - area.minX);
          const ty = area.minY + Math.random() * (area.maxY - area.minY);
          const ok = placed.every(
            (p) => Math.hypot(p.x - tx, p.y - ty) >= LETTER_GAP,
          );
          if (!ok) continue;
          x = tx;
          y = ty;
          found = true;
          break;
        }
        if (!found && placed.length > 0) {
          const col = placed.length % 4;
          const row = Math.floor(placed.length / 4);
          x = area.minX + 40 + col * LETTER_GAP;
          y = area.minY + 40 + row * LETTER_GAP;
        }
        item.text.position.set(x, y);
        placed.push({ x, y });
      }
    }

    function firstEmptyCenter(width: number, height: number) {
      const index = slotsRef.current.findIndex((s) => !s.filled);
      return slotCenters(width, height, slotsRef.current.length)[index] ?? null;
    }

    function tick(ticker: Ticker): void {
      const width = app.screen.width;
      const height = app.screen.height;
      const dt = ticker.deltaMS / 1000;

      for (let i = 0; i < slotTexts.length; i++) {
        const slot = slotsRef.current[i];
        const label = slotTexts[i];
        if (slot && label) label.text = slot.filled ? slot.letter : "";
      }

      if (tween) {
        tween.elapsed += ticker.deltaMS;
        const t = Math.min(1, tween.elapsed / CRANE_ROUND.flyToSlotMs);
        tween.letter.text.x = tween.startX + (tween.endX - tween.startX) * t;
        tween.letter.text.y = tween.startY + (tween.endY - tween.startY) * t;
        if (t >= 1) {
          const char = tween.letter.char;
          app.stage.removeChild(tween.letter.text);
          tween.letter.text.destroy();
          const idx = letters.indexOf(tween.letter);
          if (idx !== -1) letters.splice(idx, 1);
          tween = null;
          busy = false;
          onGrabRef.current(char);
        }
        return;
      }

      if (!enabledRef.current || busy) return;

      let vx = 0;
      let vy = 0;
      if (keys.has("ArrowLeft")) vx -= 1;
      if (keys.has("ArrowRight")) vx += 1;
      if (keys.has("ArrowUp")) vy -= 1;
      if (keys.has("ArrowDown")) vy += 1;
      if (vx !== 0 && vy !== 0) {
        vx *= Math.SQRT1_2;
        vy *= Math.SQRT1_2;
      }
      const speed = CRANE_ROUND.speedPxPerSec;
      hook.x += vx * speed * dt;
      hook.y += vy * speed * dt;
      const area = playfield(width, height);
      hook.x = Math.min(area.maxX, Math.max(area.minX, hook.x));
      hook.y = Math.min(area.maxY, Math.max(area.minY, hook.y));

      const expected = nextLetter(slotsRef.current);
      if (!expected) return;
      const tipX = hook.x - TIP_SIZE / 2;
      const tipY = hook.y - TIP_SIZE / 2;
      for (const item of letters) {
        if (normalizeCraneWord(item.char) !== expected) continue;
        const b = item.text.getBounds();
        if (
          !aabbOverlap(tipX, tipY, TIP_SIZE, TIP_SIZE, b.x, b.y, b.width, b.height)
        ) {
          continue;
        }
        const dest = firstEmptyCenter(width, height);
        if (!dest) return;
        busy = true;
        tween = {
          letter: item,
          startX: item.text.x,
          startY: item.text.y,
          endX: dest.x,
          endY: dest.y,
          elapsed: 0,
        };
        return;
      }
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight" &&
        event.key !== "ArrowUp" &&
        event.key !== "ArrowDown"
      ) {
        return;
      }
      if (enabledRef.current && !busy) event.preventDefault();
      keys.add(event.key);
    }

    function onKeyUp(event: KeyboardEvent): void {
      keys.delete(event.key);
    }

    void (async () => {
      await app.init({
        backgroundAlpha: 0,
        resizeTo: window,
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

      const arm = new Graphics();
      arm
        .rect(-48, -6, 48, 12)
        .fill(0x111111)
        .rect(-48, -54, 12, 48)
        .fill(0x111111)
        .circle(-42, -62, 10)
        .fill(0xc4c4c4);
      hook.addChild(arm);
      hook.position.set(app.screen.width * 0.25, app.screen.height * 0.4);
      app.stage.addChild(hook);

      for (const slot of slotsRef.current) {
        const g = new Graphics();
        const t = new Text({
          text: slot.filled ? slot.letter : "",
          style: letterStyle,
        });
        t.anchor.set(0.5);
        slotGfx.push(g);
        slotTexts.push(t);
        app.stage.addChild(g);
        app.stage.addChild(t);
      }

      for (const char of fieldLetters) {
        const text = new Text({ text: char, style: letterStyle });
        text.anchor.set(0.5);
        app.stage.addChild(text);
        letters.push({ char, text });
      }

      layoutSlots(app.screen.width, app.screen.height);
      scatterLetters(app.screen.width, app.screen.height);

      app.ticker.add(tick);
      app.renderer.on("resize", () => {
        layoutSlots(app.screen.width, app.screen.height);
        const area = playfield(app.screen.width, app.screen.height);
        hook.x = Math.min(area.maxX, Math.max(area.minX, hook.x));
        hook.y = Math.min(area.maxY, Math.max(area.minY, hook.y));
      });

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
    })();

    return () => {
      disposed = true;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      destroyApp();
    };
  }, [fieldLetters, word]);

  return <div ref={hostRef} className="absolute inset-0 z-0" aria-hidden />;
}
```

`slotsRef.current = slots` in the render body is enough for live slot labels; `tick` copies filled letters onto `slotTexts`. Parent `CraneGamePage` remounts the stage with `key={stageKey}` on replay.

- [ ] **Step 2: Fix destroy vs listeners**

`onKeyDown` / `onKeyUp` are referenced in cleanup before `async setup` finishes. Declare them in the effect scope (as in Step 1) so cleanup can always remove them. If `addEventListener` never ran, `removeEventListener` is still safe.

If `app.destroy` throws `_cancelResize is not a function`, the destroy ran before `init` — keep the `if (!app.renderer) return` guard.

- [ ] **Step 3: Commit**

```bash
git add src/components/games-v2/crane/CranePixiStage.tsx
git commit -m "feat: add Letter Crane Pixi stage"
```

---

### Task 5: Page, route, lint

**Files:**
- Create: `src/pages/CraneGamePage.tsx`
- Modify: `src/App.tsx`
- Modify: `AGENTS.md` (route table)

**Interfaces:**
- Consumes: `useCraneSession`, `CranePixiStage`, `getGameV2("crane")`, `ActivityEndShell`, `CourseBottomNav`, `ASSETS.diamond`
- Produces: playable route `/games-v2/crane`

- [ ] **Step 1: Write the page**

Create `src/pages/CraneGamePage.tsx`:

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { CranePixiStage } from "../components/games-v2/crane/CranePixiStage";
import { CourseBottomNav } from "../components/course";
import { ActivityEndShell } from "../components/progress/ActivityEndShell";
import { useCraneSession } from "../hooks/useCraneSession";
import { getGameV2 } from "../data/gamesV2";
import { ASSETS } from "../constants/images";

export default function CraneGamePage() {
  const { canPlay, state, reward, onGrab, restart, playWord } = useCraneSession();
  const [stageKey, setStageKey] = useState(0);
  const game = getGameV2("crane");
  const diamondReward = game?.diamondReward ?? 10;
  const playing = state?.status === "playing";

  const handleRestart = () => {
    restart();
    setStageKey((k) => k + 1);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80">
      {!canPlay || !state ? (
        <p className="mx-auto mt-12 max-w-lg rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
          Not enough words to play Letter Crane yet.
        </p>
      ) : (
        <div className="relative h-screen overflow-hidden">
          <CranePixiStage
            key={stageKey}
            word={state.round.word}
            slots={state.round.slots}
            fieldLetters={state.round.fieldLetters}
            enabled={playing}
            onGrab={onGrab}
          />

          {playing ? (
            <>
              <button
                type="button"
                onClick={playWord}
                className="absolute top-10 right-0 left-0 z-10 mx-auto flex h-[230px] w-[200px] flex-col items-center gap-2"
                aria-label={`Play word ${state.round.target.word}`}
              >
                <div className="liquidGlass flex items-center rounded-full border border-emerald-200/30 bg-white/30 p-1 shadow-sm brightness-120 inset-shadow-sm inset-shadow-white/80 backdrop-blur-md backdrop-saturate-150">
                  <div className="flex size-32 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={state.round.target.imageSrc}
                      alt={state.round.target.word}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              </button>
              <div className="absolute top-10 right-10 z-10 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <img src={ASSETS.diamond} alt="" className="h-6" aria-hidden />
                  {diamondReward} diamonds
                </span>
              </div>
            </>
          ) : null}

          {state.status === "complete" ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-900/40 p-4">
              <div className="w-full max-w-md rounded-2xl bg-sky-100/20 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xl backdrop-blur-xs inset-shadow-white/80">
                <ActivityEndShell reward={reward}>
                  <h2 className="text-2xl font-bold text-white">Great job!</h2>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex cursor-pointer items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800"
                    >
                      Play again
                    </button>
                    <Link
                      to="/games-v2"
                      className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800"
                    >
                      Back to games
                    </Link>
                  </div>
                </ActivityEndShell>
              </div>
            </div>
          ) : null}
        </div>
      )}
      <CourseBottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Register the route**

In `src/App.tsx`:

1. Add import next to the other game page imports:

```ts
import CraneGamePage from "./pages/CraneGamePage";
```

2. Add route next to the caro route:

```ts
<Route path="/games-v2/crane" element={<CraneGamePage />} />
```

- [ ] **Step 3: Document the route**

In `AGENTS.md` route table, add:

```
| `/games-v2/crane` | Letter Crane (hook spelling) |
```

- [ ] **Step 4: Lint + session tests**

Run:

```bash
npx tsx src/lib/crane/craneSession.test.ts
npx tsx src/lib/gameV2Reward.test.ts
npm run lint
```

Expected:

```
craneSession.test.ts: ok
gameV2Reward.test.ts: ok
```

and `tsc --noEmit` exit 0.

- [ ] **Step 5: Browser check**

Start `npm start` if needed. Open `/games-v2`, confirm **Letter Crane** card. Open `/games-v2/crane`. Confirm: image, `10 diamonds` label, slots with prefix filled, scattered letters, arrow-key hook, auto-grab next letter, pass-through on wrong letter, end shell + 10 diamonds, Play again loads a new word.

If no keyboard in the environment, say so; still typecheck and tests must pass.

- [ ] **Step 6: Commit**

```bash
git add src/pages/CraneGamePage.tsx src/App.tsx AGENTS.md
git commit -m "feat: add Letter Crane game page and route"
```

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Catalog `crane` 0/10, omit thumbnail | 2 |
| Route `/games-v2/crane` | 5 |
| Filter 3–8 a–z, course pool | 1, 3 |
| Hint 1 vs 2 prefix | 1 |
| `applyGrab` / duplicates / complete | 1 |
| Arrow move, auto-grab, pass-through, tween, busy | 4 |
| `completeGameV2` once per word, replay awards | 3, 2 |
| Image + audio, 10 diamonds HUD, `ActivityEndShell` | 5 |
| Empty pool | 5 |
| Pixi init/destroy | 4 |
| `craneSession.test.ts` + reward test + lint | 1, 2, 5 |
| Out of scope (D-pad, carry, pendulum, decoys, addDiamonds) | none — do not implement |
