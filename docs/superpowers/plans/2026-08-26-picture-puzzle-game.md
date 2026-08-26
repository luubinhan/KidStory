# Picture Puzzle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Games V2 Picture Puzzle at `/games-v2/picture-puzzle` where a child rebuilds one vocabulary image from 9 drag-and-drop tiles and earns 5 coins and 1 diamond.

**Architecture:** Standalone item list (no `courseUnits` at runtime). Pure lib owns board/tray moves and win check. A session hook picks one item, plays audio, and calls `completeGameV2` once. React + `@dnd-kit` renders a 3×3 board and a tray; CSS `background-position` slices one image into nine tiles.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, react-router-dom, `@dnd-kit/core`, Dexie progress via `useUserProgress`, `playCourseAudio`

**Spec:** `docs/superpowers/specs/2026-08-26-picture-puzzle-game-design.md`

## Global Constraints

- Game id is exactly `picture-puzzle`; route is exactly `/games-v2/picture-puzzle`
- Catalog rewards are exactly `coinReward: 5` and `diamondReward: 1`
- One play = one random item = one 9-tile puzzle = one reward
- Data file must not import `courseUnits` or any course unit module
- Tiles start in the tray; board starts empty; free rearrange; no Check button; no lock-on-correct
- Prompt is English word + volume button; auto-play audio on puzzle start; no Vietnamese on the prompt
- No Pixi; no new cover art; thumbnail is `IMAGES_ACTIVITIES.flashcards`
- Tests are standalone `npx tsx …test.ts` with `assert()` — no Jest/Vitest
- Two-space indent; `satisfies` on data exports; `cn()` for Tailwind merges
- Replay still awards (same as fishing / matching-pairs)
- Do not run Snyk

---

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/picturePuzzle.ts` | `createPuzzle`, `applyDrag`, `isSolved`, `tileBackgroundPosition`, `pickPicturePuzzleItem` |
| `src/lib/picturePuzzle.test.ts` | assert() coverage for those helpers |
| `src/data/picturePuzzleGame.ts` | `PicturePuzzleItem` type + standalone seed list |
| `src/data/gamesV2.ts` | Catalog card |
| `src/lib/gameV2Reward.test.ts` | Assert 5 / 1 for `picture-puzzle` |
| `src/hooks/usePicturePuzzleSession.ts` | Item, board/tray, audio, reward, restart |
| `src/components/games-v2/picture-puzzle/PicturePuzzleTile.tsx` | One cropped tile |
| `src/components/games-v2/picture-puzzle/PicturePuzzlePlayfield.tsx` | `DndContext`, 3×3 slots, tray |
| `src/pages/PicturePuzzleGamePage.tsx` | Prompt, playfield, empty, end overlay |
| `src/App.tsx` | Route |

---

### Task 1: Pure puzzle helpers (TDD)

**Files:**
- Create: `src/lib/picturePuzzle.test.ts`
- Create: `src/lib/picturePuzzle.ts`

**Interfaces:**
- Consumes: nothing
- Produces:

```ts
export const TILE_COUNT = 9;

export type PicturePuzzleBoard = (number | null)[];

export type PicturePuzzleState = {
  board: PicturePuzzleBoard;
  tray: number[];
};

export type DragSource =
  | { kind: "tray"; tileId: number }
  | { kind: "slot"; index: number };

export type DragTarget =
  | { kind: "tray" }
  | { kind: "slot"; index: number };

export function createPuzzle(random?: () => number): PicturePuzzleState;
export function isSolved(board: PicturePuzzleBoard): boolean;
export function applyDrag(
  state: PicturePuzzleState,
  source: DragSource,
  target: DragTarget,
): PicturePuzzleState;
export function tileBackgroundPosition(tileId: number): { xPercent: number; yPercent: number };
export function pickPicturePuzzleItem<T>(items: readonly T[], random?: () => number): T | undefined;
```

- [ ] **Step 1: Write the failing test**

Create `src/lib/picturePuzzle.test.ts`:

```ts
import assert from "node:assert/strict";
import {
  applyDrag,
  createPuzzle,
  isSolved,
  pickPicturePuzzleItem,
  tileBackgroundPosition,
} from "./picturePuzzle";

const emptyBoard = [null, null, null, null, null, null, null, null, null];

assert.equal(isSolved(emptyBoard), false);
assert.equal(isSolved([0, 1, 2, 3, 4, 5, 6, 7, null]), false);
assert.equal(isSolved([0, 1, 2, 3, 4, 5, 6, 7, 8]), true);
assert.equal(isSolved([1, 0, 2, 3, 4, 5, 6, 7, 8]), false);

const puzzle = createPuzzle(() => 0);
assert.deepEqual(puzzle.board, emptyBoard);
assert.equal(puzzle.tray.length, 9);
assert.deepEqual([...puzzle.tray].sort((a, b) => a - b), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
assert.equal(isSolved(puzzle.board), false);

const afterTrayToEmpty = applyDrag(
  { board: [...emptyBoard], tray: [4, 1, 0] },
  { kind: "tray", tileId: 4 },
  { kind: "slot", index: 4 },
);
assert.equal(afterTrayToEmpty.board[4], 4);
assert.deepEqual(afterTrayToEmpty.tray, [1, 0]);

const afterSwapSlots = applyDrag(
  { board: [0, 1, null, null, null, null, null, null, null], tray: [] },
  { kind: "slot", index: 0 },
  { kind: "slot", index: 1 },
);
assert.deepEqual(afterSwapSlots.board.slice(0, 2), [1, 0]);

const afterSlotToTray = applyDrag(
  { board: [0, null, null, null, null, null, null, null, null], tray: [2] },
  { kind: "slot", index: 0 },
  { kind: "tray" },
);
assert.equal(afterSlotToTray.board[0], null);
assert.deepEqual(afterSlotToTray.tray, [2, 0]);

const afterDisplace = applyDrag(
  { board: [5, null, null, null, null, null, null, null, null], tray: [3] },
  { kind: "tray", tileId: 3 },
  { kind: "slot", index: 0 },
);
assert.equal(afterDisplace.board[0], 3);
assert.deepEqual(afterDisplace.tray, [5]);

const noopMissing = applyDrag(
  { board: [...emptyBoard], tray: [1] },
  { kind: "tray", tileId: 8 },
  { kind: "slot", index: 0 },
);
assert.deepEqual(noopMissing.tray, [1]);
assert.equal(noopMissing.board[0], null);

assert.deepEqual(tileBackgroundPosition(0), { xPercent: 0, yPercent: 0 });
assert.deepEqual(tileBackgroundPosition(1), { xPercent: 50, yPercent: 0 });
assert.deepEqual(tileBackgroundPosition(3), { xPercent: 0, yPercent: 50 });
assert.deepEqual(tileBackgroundPosition(8), { xPercent: 100, yPercent: 100 });

assert.equal(pickPicturePuzzleItem([], () => 0), undefined);
assert.equal(pickPicturePuzzleItem(["a", "b", "c"], () => 0), "a");
assert.equal(pickPicturePuzzleItem(["a", "b", "c"], () => 0.99), "c");

console.log("picturePuzzle.test.ts: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/picturePuzzle.test.ts`

Expected: FAIL with a module-not-found error for `./picturePuzzle` (or `createPuzzle` / named export missing).

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/picturePuzzle.ts`:

```ts
export const TILE_COUNT = 9;

export type PicturePuzzleBoard = (number | null)[];

export type PicturePuzzleState = {
  board: PicturePuzzleBoard;
  tray: number[];
};

export type DragSource =
  | { kind: "tray"; tileId: number }
  | { kind: "slot"; index: number };

export type DragTarget =
  | { kind: "tray" }
  | { kind: "slot"; index: number };

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const current = next[i];
    const swap = next[j];
    if (current === undefined || swap === undefined) continue;
    next[i] = swap;
    next[j] = current;
  }
  return next;
}

export function createPuzzle(random: () => number = Math.random): PicturePuzzleState {
  return {
    board: Array.from({ length: TILE_COUNT }, () => null),
    tray: shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], random),
  };
}

export function isSolved(board: PicturePuzzleBoard): boolean {
  if (board.length !== TILE_COUNT) return false;
  return board.every((tileId, index) => tileId === index);
}

export function applyDrag(
  state: PicturePuzzleState,
  source: DragSource,
  target: DragTarget,
): PicturePuzzleState {
  const board = [...state.board];
  const tray = [...state.tray];

  if (source.kind === "tray") {
    const fromIdx = tray.indexOf(source.tileId);
    if (fromIdx === -1) return state;
    if (target.kind === "tray") return state;
    const dest = target.index;
    if (dest < 0 || dest >= TILE_COUNT) return state;
    const occupant = board[dest] ?? null;
    tray.splice(fromIdx, 1);
    board[dest] = source.tileId;
    if (occupant !== null) tray.push(occupant);
    return { board, tray };
  }

  const from = source.index;
  if (from < 0 || from >= TILE_COUNT) return state;
  const tileId = board[from];
  if (tileId === null || tileId === undefined) return state;

  if (target.kind === "tray") {
    board[from] = null;
    tray.push(tileId);
    return { board, tray };
  }

  const dest = target.index;
  if (dest < 0 || dest >= TILE_COUNT || dest === from) return state;
  const occupant = board[dest] ?? null;
  board[from] = occupant;
  board[dest] = tileId;
  return { board, tray };
}

export function tileBackgroundPosition(tileId: number): { xPercent: number; yPercent: number } {
  const row = Math.floor(tileId / 3);
  const col = tileId % 3;
  return { xPercent: col * 50, yPercent: row * 50 };
}

export function pickPicturePuzzleItem<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T | undefined {
  if (items.length === 0) return undefined;
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));
  return items[index];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/picturePuzzle.test.ts`

Expected: `picturePuzzle.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/lib/picturePuzzle.ts src/lib/picturePuzzle.test.ts
git commit -m "feat: add picture puzzle board helpers"
```

---

### Task 2: Standalone data + hub catalog + reward assert

**Files:**
- Create: `src/data/picturePuzzleGame.ts`
- Modify: `src/data/gamesV2.ts`
- Modify: `src/lib/gameV2Reward.test.ts`

**Interfaces:**
- Consumes: `GameV2` from `src/types/gameV2.ts`; `getGameV2` / `onGameV2Complete` already look up catalog ids
- Produces:

```ts
export type PicturePuzzleItem = {
  id: string;
  word: string;
  image: string;
  audio?: string;
};

export const picturePuzzleItems: readonly PicturePuzzleItem[];
```

Catalog id `picture-puzzle` with `coinReward: 5`, `diamondReward: 1`.

- [ ] **Step 1: Write the failing reward assert**

Append to `src/lib/gameV2Reward.test.ts` (keep existing asserts):

```ts
const puzzle = onGameV2Complete(getDefaultProgress(), "picture-puzzle");
assert.ok(puzzle, "picture-puzzle catalog returns result");
assert.equal(puzzle!.coinsEarned, 5);
assert.equal(puzzle!.diamondsEarned, 1);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/gameV2Reward.test.ts`

Expected: FAIL — `picture-puzzle catalog returns result` (because `getGameV2` returns undefined and `onGameV2Complete` returns `null`).

- [ ] **Step 3: Add data file and catalog entry**

Create `src/data/picturePuzzleGame.ts` (copy URL strings only — do **not** import course modules):

```ts
export type PicturePuzzleItem = {
  id: string;
  word: string;
  image: string;
  audio?: string;
};

export const picturePuzzleItems = [
  {
    id: "banana",
    word: "banana",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/1280px-Banana-Single.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/banana.mp3",
  },
  {
    id: "cherry",
    word: "cherry",
    image: "https://media.istockphoto.com/id/506627545/photo/cherry-isolated-on-white-background.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/cherry.mp3",
  },
  {
    id: "hat",
    word: "hat",
    image: "https://sixhats.ca/cdn/shop/files/Charcoal_range_patch_frontside_view.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/hat.mp3",
  },
] as const satisfies readonly PicturePuzzleItem[];
```

Modify `src/data/gamesV2.ts` — add this object after matching-pairs, keep existing imports and `getGameV2`:

```ts
  {
    id: "picture-puzzle",
    name: "Picture Puzzle",
    path: "/games-v2/picture-puzzle",
    coinReward: 5,
    diamondReward: 1,
    thumbnailSrc: IMAGES_ACTIVITIES.flashcards,
  },
```

`IMAGES_ACTIVITIES` is already imported in this file.

- [ ] **Step 4: Run reward test to verify it passes**

Run: `npx tsx src/lib/gameV2Reward.test.ts`

Expected: `gameV2Reward.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/data/picturePuzzleGame.ts src/data/gamesV2.ts src/lib/gameV2Reward.test.ts
git commit -m "feat: add picture-puzzle catalog and seed words"
```

---

### Task 3: Session hook

**Files:**
- Create: `src/hooks/usePicturePuzzleSession.ts`

**Interfaces:**
- Consumes: `picturePuzzleItems` / `PicturePuzzleItem`; `createPuzzle`, `applyDrag`, `isSolved`, `pickPicturePuzzleItem`; `playCourseAudio`; `useUserProgress().completeGameV2`
- Produces hook return:

```ts
{
  canPlay: boolean;
  item: PicturePuzzleItem | undefined;
  board: PicturePuzzleBoard;
  tray: number[];
  isComplete: boolean;
  reward: ActivityRewardResult | null;
  playWord: () => void;
  onDrag: (source: DragSource, target: DragTarget) => void;
  restart: () => void;
}
```

- [ ] **Step 1: Write the hook**

Create `src/hooks/usePicturePuzzleSession.ts`:

```tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useUserProgress } from "../contexts/UserProgressContext";
import { picturePuzzleItems, type PicturePuzzleItem } from "../data/picturePuzzleGame";
import {
  applyDrag,
  createPuzzle,
  isSolved,
  pickPicturePuzzleItem,
  type DragSource,
  type DragTarget,
  type PicturePuzzleState,
} from "../lib/picturePuzzle";
import { playCourseAudio } from "../lib/playCourseAudio";
import type { ActivityRewardResult } from "../types/userProgress";

function nextItem(): PicturePuzzleItem | undefined {
  return pickPicturePuzzleItem(picturePuzzleItems);
}

export function usePicturePuzzleSession() {
  const { completeGameV2 } = useUserProgress();
  const [item, setItem] = useState<PicturePuzzleItem | undefined>(() => nextItem());
  const [puzzle, setPuzzle] = useState<PicturePuzzleState>(() => createPuzzle());
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const awardedRef = useRef(false);
  const runIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedRef = useRef(false);

  const canPlay = Boolean(item);
  const isComplete = isSolved(puzzle.board);

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

  const playWord = useCallback(() => {
    if (!item) return;
    void playCourseAudio(item.audio, item.word, audioRef, stopAudio);
  }, [item, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [item?.id]);

  useEffect(() => {
    if (!item || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const id = window.setTimeout(() => {
      playWord();
    }, 200);
    return () => window.clearTimeout(id);
  }, [item, playWord]);

  useEffect(() => {
    if (!isComplete || awardedRef.current) return;
    awardedRef.current = true;
    const runId = runIdRef.current;
    void completeGameV2("picture-puzzle").then((result) => {
      if (result && runIdRef.current === runId) setReward(result);
    });
  }, [isComplete, completeGameV2]);

  const onDrag = useCallback((source: DragSource, target: DragTarget) => {
    setPuzzle((prev) => {
      if (isSolved(prev.board)) return prev;
      return applyDrag(prev, source, target);
    });
  }, []);

  const restart = useCallback(() => {
    runIdRef.current += 1;
    awardedRef.current = false;
    autoPlayedRef.current = false;
    setReward(null);
    setItem(nextItem());
    setPuzzle(createPuzzle());
    stopAudio();
  }, [stopAudio]);

  return {
    canPlay,
    item,
    board: puzzle.board,
    tray: puzzle.tray,
    isComplete,
    reward,
    playWord,
    onDrag,
    restart,
  };
}
```

- [ ] **Step 2: Typecheck hook file**

Run: `npm run lint`

Expected: no errors related to `usePicturePuzzleSession` (other pre-existing errors must not be introduced). If lint fails only because later files are missing, that is fine as long as this hook typechecks; otherwise fix types before committing.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/usePicturePuzzleSession.ts
git commit -m "feat: add picture puzzle session hook"
```

---

### Task 4: Tile + dnd playfield

**Files:**
- Create: `src/components/games-v2/picture-puzzle/PicturePuzzleTile.tsx`
- Create: `src/components/games-v2/picture-puzzle/PicturePuzzlePlayfield.tsx`

**Interfaces:**
- Consumes: `tileBackgroundPosition`; `DragSource` / `DragTarget`; `@dnd-kit/core` `DndContext`, `useDraggable`, `useDroppable`, `PointerSensor`, `TouchSensor`, `closestCorners`
- Produces:
  - `PicturePuzzleTile({ tileId, imageSrc, className? })`
  - `PicturePuzzlePlayfield({ imageSrc, board, tray, disabled, onDrag })`
  - Draggable id format `tile-${tileId}`
  - Droppable id format `slot-${index}` and `tray`

- [ ] **Step 1: Write tile**

Create `src/components/games-v2/picture-puzzle/PicturePuzzleTile.tsx`:

```tsx
import { tileBackgroundPosition } from "../../../lib/picturePuzzle";
import { cn } from "../../../lib/utils";

type PicturePuzzleTileProps = {
  tileId: number;
  imageSrc: string;
  className?: string;
};

export function PicturePuzzleTile({ tileId, imageSrc, className }: PicturePuzzleTileProps) {
  const { xPercent, yPercent } = tileBackgroundPosition(tileId);

  return (
    <div
      className={cn("size-full bg-slate-200 bg-no-repeat", className)}
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "300% 300%",
        backgroundPosition: `${xPercent}% ${yPercent}%`,
      }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 2: Write playfield**

Create `src/components/games-v2/picture-puzzle/PicturePuzzlePlayfield.tsx`:

```tsx
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { DragSource, DragTarget, PicturePuzzleBoard } from "../../../lib/picturePuzzle";
import { cn } from "../../../lib/utils";
import { PicturePuzzleTile } from "./PicturePuzzleTile";

type PicturePuzzlePlayfieldProps = {
  imageSrc: string;
  board: PicturePuzzleBoard;
  tray: readonly number[];
  disabled?: boolean;
  onDrag: (source: DragSource, target: DragTarget) => void;
};

function parseTileId(id: string): number | null {
  const match = /^tile-(\d+)$/.exec(id);
  if (!match) return null;
  return Number(match[1]);
}

function parseTarget(id: string): DragTarget | null {
  if (id === "tray") return { kind: "tray" };
  const match = /^slot-(\d+)$/.exec(id);
  if (!match) return null;
  return { kind: "slot", index: Number(match[1]) };
}

function locateSource(tileId: number, board: PicturePuzzleBoard): DragSource {
  const slot = board.findIndex((id) => id === tileId);
  if (slot >= 0) return { kind: "slot", index: slot };
  return { kind: "tray", tileId };
}

function DraggableTile({
  tileId,
  imageSrc,
  disabled,
}: {
  tileId: number;
  imageSrc: string;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tile-${tileId}`,
    disabled,
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      className={cn(
        "size-full cursor-grab touch-manipulation overflow-hidden rounded-lg border-2 border-white shadow-sm active:cursor-grabbing",
        isDragging && "z-10 opacity-90 shadow-lg",
        disabled && "cursor-default opacity-80",
      )}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      aria-label={`Puzzle piece ${tileId + 1}`}
    >
      <PicturePuzzleTile tileId={tileId} imageSrc={imageSrc} />
    </button>
  );
}

function Slot({
  index,
  tileId,
  imageSrc,
  disabled,
}: {
  index: number;
  tileId: number | null;
  imageSrc: string;
  disabled: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}` });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-white/70",
        isOver && "border-yellow-400 bg-yellow-50",
      )}
    >
      {tileId !== null ? (
        <DraggableTile tileId={tileId} imageSrc={imageSrc} disabled={disabled} />
      ) : null}
    </div>
  );
}

function PlayfieldBody({
  imageSrc,
  board,
  tray,
  disabled,
}: {
  imageSrc: string;
  board: PicturePuzzleBoard;
  tray: readonly number[];
  disabled: boolean;
}) {
  const { setNodeRef: setTrayRef, isOver: trayOver } = useDroppable({ id: "tray" });

  return (
    <>
      <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-2">
        {board.map((tileId, index) => (
          <Slot
            key={`slot-${index}`}
            index={index}
            tileId={tileId}
            imageSrc={imageSrc}
            disabled={disabled}
          />
        ))}
      </div>
      <div
        ref={setTrayRef}
        className={cn(
          "mt-6 flex min-h-24 flex-wrap justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-3",
          trayOver && "border-yellow-400 bg-yellow-50",
        )}
      >
        {tray.map((tileId) => (
          <div key={`tray-${tileId}`} className="size-20 sm:size-24">
            <DraggableTile tileId={tileId} imageSrc={imageSrc} disabled={disabled} />
          </div>
        ))}
      </div>
    </>
  );
}

export function PicturePuzzlePlayfield({
  imageSrc,
  board,
  tray,
  disabled = false,
  onDrag,
}: PicturePuzzlePlayfieldProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return;
    const overId = event.over?.id;
    if (overId == null) return;
    const tileId = parseTileId(String(event.active.id));
    const target = parseTarget(String(overId));
    if (tileId === null || !target) return;
    if (target.kind === "slot" && board[target.index] === tileId) return;
    onDrag(locateSource(tileId, board), target);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <PlayfieldBody imageSrc={imageSrc} board={board} tray={tray} disabled={disabled} />
    </DndContext>
  );
}
```

`useDroppable({ id: "tray" })` lives in `PlayfieldBody` so it runs under `DndContext`.

- [ ] **Step 3: Commit**

```bash
git add src/components/games-v2/picture-puzzle/PicturePuzzleTile.tsx src/components/games-v2/picture-puzzle/PicturePuzzlePlayfield.tsx
git commit -m "feat: add picture puzzle drag playfield"
```

---

### Task 5: Page, route, typecheck

**Files:**
- Create: `src/pages/PicturePuzzleGamePage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `usePicturePuzzleSession`; `PicturePuzzlePlayfield`; `IconVolumeButton`; `ActivityEndShell`; `CourseBottomNav`; `IMAGES_ACTIVITIES.flashcards`
- Produces: default-export page; route `/games-v2/picture-puzzle`

- [ ] **Step 1: Write the page**

Create `src/pages/PicturePuzzleGamePage.tsx` (mirror matching-pairs chrome):

```tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CourseBottomNav } from "../components/course";
import { PicturePuzzlePlayfield } from "../components/games-v2/picture-puzzle/PicturePuzzlePlayfield";
import { IconVolumeButton } from "../components/game-topic/IconVolumeButton";
import { ActivityEndShell } from "../components/progress/ActivityEndShell";
import { IMAGES_ACTIVITIES } from "../constants/images";
import { usePicturePuzzleSession } from "../hooks/usePicturePuzzleSession";

export default function PicturePuzzleGamePage() {
  const {
    canPlay,
    item,
    board,
    tray,
    isComplete,
    reward,
    playWord,
    onDrag,
    restart,
  } = usePicturePuzzleSession();

  const [sessionPhase, setSessionPhase] = useState<"playing" | "summary">("playing");
  const completionHandledRef = useRef(false);

  useEffect(() => {
    if (!isComplete) {
      completionHandledRef.current = false;
      return;
    }
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;
    const id = window.setTimeout(() => setSessionPhase("summary"), 400);
    return () => window.clearTimeout(id);
  }, [isComplete]);

  const handleReplay = () => {
    restart();
    setSessionPhase("playing");
  };

  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24"
      style={{ backgroundImage: `url(${IMAGES_ACTIVITIES.flashcards})` }}
    >
      {!canPlay || !item ? (
        <p className="mx-auto mt-12 max-w-lg rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
          No puzzle words yet.
        </p>
      ) : sessionPhase === "summary" ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-sky-100/20 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-xl backdrop-blur-xs inset-shadow-white/80">
            <ActivityEndShell reward={reward}>
              <h2 className="text-2xl font-bold text-white">Great job!</h2>
              <p className="mt-2 text-sm font-semibold text-white/90">
                You built the picture for {item.word}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex cursor-pointer items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800 transition-colors hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
                >
                  Play again
                </button>
                <Link
                  to="/games-v2"
                  className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
                >
                  Back to games
                </Link>
              </div>
            </ActivityEndShell>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-lg flex-col px-4 py-6">
          <div className="mb-4 flex items-center justify-center gap-3">
            <p className="text-3xl font-bold capitalize text-slate-900">{item.word}</p>
            <IconVolumeButton aria-label={`Play ${item.word}`} onClick={playWord} />
          </div>
          <PicturePuzzlePlayfield
            imageSrc={item.image}
            board={board}
            tray={tray}
            disabled={isComplete}
            onDrag={onDrag}
          />
        </div>
      )}
      <CourseBottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Register the route**

In `src/App.tsx`:

1. Add import next to `MatchingPairsGamePage`:

```ts
import PicturePuzzleGamePage from "./pages/PicturePuzzleGamePage";
```

2. Add route immediately after the matching-pairs route:

```tsx
            <Route path="/games-v2/picture-puzzle" element={<PicturePuzzleGamePage />} />
```

Do not change other routes.

- [ ] **Step 3: Run tests and lint**

```bash
npx tsx src/lib/picturePuzzle.test.ts
npx tsx src/lib/gameV2Reward.test.ts
npm run lint
```

Expected:

- `picturePuzzle.test.ts: ok`
- `gameV2Reward.test.ts: ok`
- `tsc --noEmit` exits 0

- [ ] **Step 4: Manual check**

1. `npm start` (dev server :3000).
2. Open `/games-v2` — new **Picture Puzzle** card shows 5 coins and 1 diamond.
3. Open `/games-v2/picture-puzzle` — English word + speaker; audio auto-plays; empty 3×3; 9 tiles in tray.
4. Drag tray → empty slot; swap two filled slots; return a tile to tray.
5. Fill all 9 correctly — overlay **Great job!** with reward; Play again starts a new (possibly same) word; Back to games returns to hub.

- [ ] **Step 5: Commit**

```bash
git add src/pages/PicturePuzzleGamePage.tsx src/App.tsx
git commit -m "feat: add picture puzzle game page"
```

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| Catalog id/path/rewards 5/1 | Task 2 |
| Standalone list, no `courseUnits` import | Task 2 |
| Seed ≥ 3 with image + audio URLs | Task 2 |
| Pure shuffle / move / win | Task 1 |
| CSS 3×3 crop `background-position` | Task 1 + 4 |
| Tray start, empty board | Task 1 + 3 |
| Drag rules (tray↔slot, swap, return) | Task 1 + 4 |
| Auto audio + volume button | Task 3 + 5 |
| `completeGameV2` once; replay awards | Task 2 + 3 |
| End overlay / empty state / `CourseBottomNav` | Task 5 |
| Route + hub card | Task 2 + 5 |
| `picturePuzzle.test.ts` + reward assert + lint | Task 1, 2, 5 |
| Out of scope (Pixi, Check, lock, VN prompt, preview) | Not in any task |
