# Fishing Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a PixiJS v8 Fishing Game at `/games-v2/fishing` where kids match a course-vocab target image to a labeled fish over 10 correct catches, then earn 50 coins and 50 diamonds.

**Architecture:** React owns the page shell (target image, progress, end screen). Pixi owns the pond (pooled fish, swim, FX). Pure lib helpers build the vocab pool and advance the round. `completeGameV2` awards hub catalog rewards once at win (replays allowed). Sounds are no-op stubs.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, react-router-dom, PixiJS v8, Dexie progress via `UserProgressContext`

**Spec:** `docs/superpowers/specs/2026-07-14-fishing-game-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `src/types/fishing.ts` | Vocab item, round config, session status types |
| `src/types/gameV2.ts` | Existing hub type (unchanged shape) |
| `src/data/gamesV2.ts` | Rename Fish Pond → Fishing Game; path `/games-v2/fishing` |
| `src/lib/fishing/buildFishingVocabPool.ts` | Unlocked units → imaged words |
| `src/lib/fishing/buildFishingVocabPool.test.ts` | Pool tests |
| `src/lib/fishing/fishingSession.ts` | Pure tap / advance / win helpers |
| `src/lib/fishing/fishingSession.test.ts` | Session tests |
| `src/lib/fishing/fishingSounds.ts` | No-op sound stubs |
| `src/lib/userProgressLogic.ts` | Add `onGameV2Complete` |
| `src/lib/gameV2Reward.test.ts` | Reward tests |
| `src/contexts/UserProgressContext.tsx` | Expose `completeGameV2` |
| `src/hooks/useFishingSession.ts` | Session React state + win reward |
| `src/components/games-v2/fishing/fishAssets.ts` | Import fish SVG URLs |
| `src/components/games-v2/fishing/fishPool.ts` | Pooled fish containers |
| `src/components/games-v2/fishing/swimSystem.ts` | Movement / bob / flip / wrap |
| `src/components/games-v2/fishing/fxSystem.ts` | Success/fail FX, floating +1 |
| `src/components/games-v2/fishing/FishingPixiStage.tsx` | Application lifecycle + ticker |
| `src/pages/FishingGamePage.tsx` | Shell page (replaces FishPondPage) |
| `src/pages/FishPondPage.tsx` | Delete |
| `src/App.tsx` | Route swap |
| `package.json` | Add `pixi.js` |

---

### Task 1: Install PixiJS v8

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install dependency**

```bash
npm install pixi.js@^8
```

Expected: `pixi.js` appears under `dependencies` in `package.json`.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add pixi.js v8 for Fishing Game"
```

---

### Task 2: Hub catalog + route rename (Fish Pond → Fishing Game)

**Files:**
- Modify: `src/data/gamesV2.ts`
- Modify: `src/App.tsx`
- Create: `src/pages/FishingGamePage.tsx` (stub)
- Delete: `src/pages/FishPondPage.tsx`

- [ ] **Step 1: Update catalog**

Replace contents of `src/data/gamesV2.ts` with:

```typescript
import type { GameV2 } from "../types/gameV2";

export const gamesV2 = [
  {
    id: "fishing",
    name: "Fishing Game",
    path: "/games-v2/fishing",
    coinReward: 50,
    diamondReward: 50,
  },
] as const satisfies readonly GameV2[];

export function getGameV2(id: string): GameV2 | undefined {
  return gamesV2.find((g) => g.id === id);
}
```

- [ ] **Step 2: Stub page + route**

Create `src/pages/FishingGamePage.tsx`:

```tsx
import { Link } from "react-router-dom";
import { AppPageHeader } from "../components/layout";

export default function FishingGamePage() {
  return (
    <div>
      <AppPageHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <Link
          to="/games-v2"
          className="mb-6 inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
        >
          Back to games
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Fishing Game
        </h1>
        <p className="mt-2 text-slate-600">Loading…</p>
      </div>
    </div>
  );
}
```

In `src/App.tsx`:
- Change import `FishPondPage` → `FishingGamePage`
- Change route path `/games-v2/fish-pond` → `/games-v2/fishing` and element to `<FishingGamePage />`

Delete `src/pages/FishPondPage.tsx`.

- [ ] **Step 3: Typecheck**

```bash
npm run lint
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/data/gamesV2.ts src/App.tsx src/pages/FishingGamePage.tsx
git add -u src/pages/FishPondPage.tsx
git commit -m "feat: rename Fish Pond hub entry to Fishing Game route"
```

---

### Task 3: Fishing types + vocab pool (TDD)

**Files:**
- Create: `src/types/fishing.ts`
- Create: `src/lib/fishing/buildFishingVocabPool.ts`
- Create: `src/lib/fishing/buildFishingVocabPool.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/lib/fishing/buildFishingVocabPool.test.ts`:

```typescript
import assert from "node:assert/strict";
import { buildFishingVocabPool } from "./buildFishingVocabPool";
import type { CourseUnit } from "../../types/course";
import { BookOpen } from "lucide-react";

function makeUnit(
  id: string,
  words: { id: string; word: string; image?: string }[],
): CourseUnit {
  return {
    id,
    unitNumber: 1,
    title: id,
    subtitle: "",
    icon: BookOpen,
    iconBgClass: "",
    iconColorClass: "",
    words: words.map((w) => ({
      id: w.id,
      word: w.word,
      translation: w.word,
      image: w.image,
    })),
    practiceSentences: [],
    multipleChoiceQuestions: [],
    typedAnswerQuestions: [],
  };
}

const units = [
  makeUnit("unit-1", [
    { id: "cat", word: "cat", image: "https://example.com/cat.jpg" },
    { id: "hi", word: "hi" },
  ]),
  makeUnit("unit-2", [
    { id: "dog", word: "dog", image: "https://example.com/dog.jpg" },
  ]),
];

const poolAll = buildFishingVocabPool(units, () => true);
assert.equal(poolAll.length, 2, "keeps only words with images");
assert.equal(poolAll[0]?.word, "cat");
assert.equal(poolAll[0]?.imageSrc, "https://example.com/cat.jpg");
assert.equal(poolAll[0]?.unitId, "unit-1");

const poolLocked = buildFishingVocabPool(units, (u) => u.id === "unit-1");
assert.equal(poolLocked.length, 1, "respects unlock predicate");
assert.equal(poolLocked[0]?.id, "cat");

console.log("buildFishingVocabPool.test.ts: ok");
```

- [ ] **Step 2: Run test (expect fail)**

```bash
npx tsx src/lib/fishing/buildFishingVocabPool.test.ts
```

Expected: fail (module not found).

- [ ] **Step 3: Implement types + pool**

Create `src/types/fishing.ts`:

```typescript
export type FishingVocabItem = {
  id: string;
  word: string;
  imageSrc: string;
  unitId: string;
};

export const FISHING_ROUND = {
  targetsNeeded: 10,
  fishCountMin: 6,
  fishCountMax: 10,
  coinReward: 50,
  diamondReward: 50,
  minPoolSize: 4,
} as const;

export type FishingSessionStatus = "playing" | "won";

export type FishingSessionState = {
  status: FishingSessionStatus;
  correctCount: number;
  currentTarget: FishingVocabItem;
};
```

Create `src/lib/fishing/buildFishingVocabPool.ts`:

```typescript
import type { CourseUnit } from "../../types/course";
import type { FishingVocabItem } from "../../types/fishing";

export function buildFishingVocabPool(
  units: readonly CourseUnit[],
  isUnitAccessible: (unit: CourseUnit) => boolean,
): FishingVocabItem[] {
  const items: FishingVocabItem[] = [];
  for (const unit of units) {
    if (!isUnitAccessible(unit)) continue;
    for (const w of unit.words) {
      const imageSrc = w.image?.trim();
      if (!imageSrc) continue;
      items.push({
        id: w.id,
        word: w.word,
        imageSrc,
        unitId: unit.id,
      });
    }
  }
  return items;
}
```

- [ ] **Step 4: Run test (expect pass)**

```bash
npx tsx src/lib/fishing/buildFishingVocabPool.test.ts
```

Expected: `buildFishingVocabPool.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/types/fishing.ts src/lib/fishing/buildFishingVocabPool.ts src/lib/fishing/buildFishingVocabPool.test.ts
git commit -m "feat: add fishing vocab pool from unlocked course words"
```

---

### Task 4: Pure fishing session helpers (TDD)

**Files:**
- Create: `src/lib/fishing/fishingSession.ts`
- Create: `src/lib/fishing/fishingSession.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
import assert from "node:assert/strict";
import {
  createInitialSession,
  applyFishTap,
  pickDistractorWords,
  ensureExactlyOneTargetLabel,
} from "./fishingSession";
import type { FishingVocabItem } from "../../types/fishing";
import { FISHING_ROUND } from "../../types/fishing";

const pool: FishingVocabItem[] = [
  { id: "a", word: "cat", imageSrc: "/a", unitId: "u1" },
  { id: "b", word: "dog", imageSrc: "/b", unitId: "u1" },
  { id: "c", word: "sun", imageSrc: "/c", unitId: "u1" },
  { id: "d", word: "book", imageSrc: "/d", unitId: "u1" },
];

const session0 = createInitialSession(pool);
assert.equal(session0.status, "playing");
assert.equal(session0.correctCount, 0);
assert.ok(pool.some((p) => p.id === session0.currentTarget.id));

const wrong = applyFishTap(session0, pool, "NOT_THE_TARGET");
assert.equal(wrong.kind, "wrong");
assert.equal(wrong.session.correctCount, 0);

const right1 = applyFishTap(session0, pool, session0.currentTarget.word);
assert.equal(right1.kind, "correct");
assert.equal(right1.session.correctCount, 1);
assert.equal(right1.session.status, "playing");

let s = session0;
for (let i = 0; i < FISHING_ROUND.targetsNeeded; i++) {
  const r = applyFishTap(s, pool, s.currentTarget.word);
  assert.equal(r.kind, "correct");
  s = r.session;
}
assert.equal(s.status, "won");
assert.equal(s.correctCount, FISHING_ROUND.targetsNeeded);

const labels = ensureExactlyOneTargetLabel(
  ["dog", "sun", "book"],
  "cat",
  pool,
);
assert.equal(labels.filter((w) => w.toLowerCase() === "cat").length, 1);
assert.equal(labels.length, 4);

const distractors = pickDistractorWords(pool, "cat", 3);
assert.equal(distractors.length, 3);
assert.ok(distractors.every((w) => w.toLowerCase() !== "cat"));

console.log("fishingSession.test.ts: ok");
```

- [ ] **Step 2: Run test (expect fail)**

```bash
npx tsx src/lib/fishing/fishingSession.test.ts
```

Expected: fail (module not found).

- [ ] **Step 3: Implement session helpers**

Create `src/lib/fishing/fishingSession.ts`:

```typescript
import {
  FISHING_ROUND,
  type FishingSessionState,
  type FishingVocabItem,
} from "../../types/fishing";

function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function createInitialSession(
  pool: readonly FishingVocabItem[],
): FishingSessionState {
  if (pool.length === 0) {
    throw new Error("createInitialSession requires a non-empty pool");
  }
  return {
    status: "playing",
    correctCount: 0,
    currentTarget: pickRandom(pool),
  };
}

export function pickNextTarget(
  pool: readonly FishingVocabItem[],
  previousId: string,
): FishingVocabItem {
  const others = pool.filter((p) => p.id !== previousId);
  if (others.length === 0) return pool[0]!;
  return pickRandom(others);
}

export function pickDistractorWords(
  pool: readonly FishingVocabItem[],
  targetWord: string,
  count: number,
): string[] {
  const target = normalizeWord(targetWord);
  const distractors = pool
    .filter((p) => normalizeWord(p.word) !== target)
    .map((p) => p.word.toUpperCase());
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    if (distractors.length === 0) break;
    out.push(pickRandom(distractors));
  }
  return out;
}

/** Returns `liveCount` labels with exactly one matching targetWord (case-insensitive). */
export function ensureExactlyOneTargetLabel(
  otherLabels: readonly string[],
  targetWord: string,
  pool: readonly FishingVocabItem[],
): string[] {
  const targetUpper = targetWord.toUpperCase();
  const targetNorm = normalizeWord(targetWord);
  const cleaned = otherLabels.filter((w) => normalizeWord(w) !== targetNorm);
  const need = Math.max(0, cleaned.length);
  const distractors = pickDistractorWords(pool, targetWord, need);
  const labels = [targetUpper, ...distractors.slice(0, cleaned.length)];
  // shuffle
  for (let i = labels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [labels[i], labels[j]] = [labels[j]!, labels[i]!];
  }
  return labels;
}

export type FishTapResult =
  | { kind: "wrong"; session: FishingSessionState }
  | { kind: "correct"; session: FishingSessionState };

export function applyFishTap(
  session: FishingSessionState,
  pool: readonly FishingVocabItem[],
  tappedWord: string,
): FishTapResult {
  if (session.status !== "playing") {
    return { kind: "wrong", session };
  }
  const isCorrect =
    normalizeWord(tappedWord) === normalizeWord(session.currentTarget.word);
  if (!isCorrect) {
    return { kind: "wrong", session };
  }
  const correctCount = session.correctCount + 1;
  if (correctCount >= FISHING_ROUND.targetsNeeded) {
    return {
      kind: "correct",
      session: {
        ...session,
        correctCount,
        status: "won",
      },
    };
  }
  return {
    kind: "correct",
    session: {
      status: "playing",
      correctCount,
      currentTarget: pickNextTarget(pool, session.currentTarget.id),
    },
  };
}
```

- [ ] **Step 4: Run test (expect pass)**

```bash
npx tsx src/lib/fishing/fishingSession.test.ts
```

Expected: `fishingSession.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/lib/fishing/fishingSession.ts src/lib/fishing/fishingSession.test.ts
git commit -m "feat: add pure fishing session tap and target helpers"
```

---

### Task 5: `completeGameV2` progress reward (TDD)

**Files:**
- Modify: `src/lib/userProgressLogic.ts`
- Modify: `src/types/userProgress.ts` (optional shared result type — prefer reuse)
- Create: `src/lib/gameV2Reward.test.ts`
- Modify: `src/contexts/UserProgressContext.tsx`

- [ ] **Step 1: Write failing test**

Create `src/lib/gameV2Reward.test.ts`:

```typescript
import assert from "node:assert/strict";
import { getDefaultProgress, onGameV2Complete } from "./userProgressLogic";

const before = getDefaultProgress();
const result = onGameV2Complete(before, "fishing");
assert.ok(result, "known game returns result");
assert.equal(result!.coinsEarned, 50);
assert.equal(result!.diamondsEarned, 50);
assert.equal(result!.progress.coins, before.coins + 50);
assert.equal(result!.progress.diamonds, before.diamonds + 50);

const again = onGameV2Complete(result!.progress, "fishing");
assert.equal(again!.coinsEarned, 50, "replay still awards");
assert.equal(again!.progress.coins, before.coins + 100);

const missing = onGameV2Complete(before, "nope");
assert.equal(missing, null);

console.log("gameV2Reward.test.ts: ok");
```

- [ ] **Step 2: Run test (expect fail)**

```bash
npx tsx src/lib/gameV2Reward.test.ts
```

Expected: fail (`onGameV2Complete` missing).

- [ ] **Step 3: Implement logic + context method**

In `src/lib/userProgressLogic.ts` add:

```typescript
import { getGameV2 } from "../data/gamesV2";
import type { ActivityRewardResult } from "../types/userProgress";

export function onGameV2Complete(
  progress: UserProgressV1,
  gameId: string,
): ActivityRewardResult | null {
  const game = getGameV2(gameId);
  if (!game) return null;

  const coinsEarned = game.coinReward;
  const diamondsEarned = game.diamondReward;
  const next: UserProgressV1 = {
    ...progress,
    coins: progress.coins + coinsEarned,
    diamonds: progress.diamonds + diamondsEarned,
    unitActivityCompletions: { ...progress.unitActivityCompletions },
    unitBonusClaimed: { ...progress.unitBonusClaimed },
    achievements: { ...progress.achievements },
    inventory: { ...progress.inventory },
  };

  return {
    progress: next,
    coinsEarned,
    diamondsEarned,
    activityBonus: coinsEarned,
    unitBonusEarned: 0,
    achievementUnlocked: null,
    achievementReward: 0,
  };
}
```

Wire `UserProgressContext`:
- Add to context type: `completeGameV2: (gameId: string) => Promise<ActivityRewardResult | null>`
- Implement with `onGameV2Complete` + `persist`, same pattern as `completeActivity`
- Include in provider `value`

- [ ] **Step 4: Run test (expect pass)**

```bash
npx tsx src/lib/gameV2Reward.test.ts
```

Expected: `gameV2Reward.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/lib/userProgressLogic.ts src/lib/gameV2Reward.test.ts src/contexts/UserProgressContext.tsx
git commit -m "feat: award coins and diamonds for Games V2 completion"
```

---

### Task 6: Sound stubs + `useFishingSession`

**Files:**
- Create: `src/lib/fishing/fishingSounds.ts`
- Create: `src/hooks/useFishingSession.ts`

- [ ] **Step 1: Sound stubs**

```typescript
export function playFishingSuccessSound(): void {}
export function playFishingWrongSound(): void {}
export function playFishingCoinSound(): void {}
export function playFishingSplashSound(): void {}
export function playFishingAmbientLoop(): void {}
export function stopFishingAmbientLoop(): void {}
```

- [ ] **Step 2: Session hook**

Create `src/hooks/useFishingSession.ts`:

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { courseUnits } from "../data/course";
import { buildFishingVocabPool } from "../lib/fishing/buildFishingVocabPool";
import {
  applyFishTap,
  createInitialSession,
} from "../lib/fishing/fishingSession";
import {
  playFishingCoinSound,
  playFishingSuccessSound,
  playFishingWrongSound,
} from "../lib/fishing/fishingSounds";
import { FISHING_ROUND, type FishingSessionState } from "../types/fishing";
import { useUserProgress } from "../contexts/UserProgressContext";
import type { ActivityRewardResult } from "../types/userProgress";

export function useFishingSession() {
  const { isUnitAccessible, completeGameV2 } = useUserProgress();
  const pool = useMemo(
    () => buildFishingVocabPool(courseUnits, isUnitAccessible),
    [isUnitAccessible],
  );
  const canPlay = pool.length >= FISHING_ROUND.minPoolSize;

  const [session, setSession] = useState<FishingSessionState | null>(null);
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const awardedRef = useRef(false);

  useEffect(() => {
    if (!canPlay) {
      setSession(null);
      return;
    }
    setSession(createInitialSession(pool));
    awardedRef.current = false;
    setReward(null);
  }, [canPlay, pool]);

  useEffect(() => {
    if (!session || session.status !== "won" || awardedRef.current) return;
    awardedRef.current = true;
    void completeGameV2("fishing").then((result) => {
      if (result) setReward(result);
    });
  }, [session, completeGameV2]);

  const onFishTap = useCallback(
    (word: string) => {
      if (!session || session.status !== "playing") return { kind: "ignored" as const };
      const result = applyFishTap(session, pool, word);
      if (result.kind === "wrong") {
        playFishingWrongSound();
        return result;
      }
      playFishingSuccessSound();
      playFishingCoinSound();
      setSession(result.session);
      return result;
    },
    [session, pool],
  );

  return {
    pool,
    canPlay,
    session,
    reward,
    onFishTap,
    targetsNeeded: FISHING_ROUND.targetsNeeded,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/fishing/fishingSounds.ts src/hooks/useFishingSession.ts
git commit -m "feat: add fishing session hook and sound stubs"
```

---

### Task 7: Pixi fish assets, pool, swim, FX

**Files:**
- Create: `src/components/games-v2/fishing/fishAssets.ts`
- Create: `src/components/games-v2/fishing/fishPool.ts`
- Create: `src/components/games-v2/fishing/swimSystem.ts`
- Create: `src/components/games-v2/fishing/fxSystem.ts`

Ensure fish SVGs live at `src/assets/games/fish-1.svg` … `fish-10.svg` (commit asset move from `games/` if still untracked).

- [ ] **Step 1: Asset URLs**

```typescript
import fish1 from "../../../assets/games/fish-1.svg";
import fish2 from "../../../assets/games/fish-2.svg";
import fish3 from "../../../assets/games/fish-3.svg";
import fish4 from "../../../assets/games/fish-4.svg";
import fish5 from "../../../assets/games/fish-5.svg";
import fish6 from "../../../assets/games/fish-6.svg";
import fish7 from "../../../assets/games/fish-7.svg";
import fish8 from "../../../assets/games/fish-8.svg";
import fish9 from "../../../assets/games/fish-9.svg";
import fish10 from "../../../assets/games/fish-10.svg";

export const FISH_SPRITE_URLS = [
  fish1, fish2, fish3, fish4, fish5,
  fish6, fish7, fish8, fish9, fish10,
] as const;
```

If Vite + TS complains about SVG modules, add `src/vite-env.d.ts` (or extend existing):

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 2: Fish pool + swim + FX**

Implement in Pixi v8 idioms:

`fishPool.ts`:
- Type `PooledFish = { root: Container; sprite: Sprite; label: Text; word: string; vx: number; baseY: number; bobPhase: number; busy: boolean }`
- `acquire()` / `release(fish)` / `setWord(fish, word)`
- Label: white bold uppercase Text, centered on sprite
- `eventMode = "static"`, `cursor = "pointer"`

`swimSystem.ts`:
- Each frame: `x += vx * dt`; bob `y = baseY + sin(t + phase) * amplitude`
- When off left/right bounds, reverse `vx` and set `sprite.scale.x = sign(vx)` (flip)
- `randomizeSpawn(fish, width, height, occupiedYs)` picks baseY in bands to reduce overlap
- Speeds vary (e.g. 40–120 px/s)

`fxSystem.ts`:
- `playCorrect(fish, onDone)`: brief scale up, sparkle dots (small Graphics circles pooled), floating “+1 Coin” Text rising + fading, then call `onDone`
- `playWrong(fish, onDone)`: multiply `vx` by ~3, optional splash Graphics, then `onDone` when off-screen
- While `busy`, ignore further taps on that fish

Keep implementations focused; prefer Graphics particles over heavy Sprite sheets.

- [ ] **Step 3: Commit assets + Pixi helpers**

```bash
git add src/assets/games src/components/games-v2/fishing/
git add -u games/   # if removing old games/*.svg paths
git commit -m "feat: add Pixi fish pool, swim, and FX helpers"
```

---

### Task 8: `FishingPixiStage` + wire `FishingGamePage`

**Files:**
- Create: `src/components/games-v2/fishing/FishingPixiStage.tsx`
- Modify: `src/pages/FishingGamePage.tsx`
- Modify: `src/components/games-v2/index.ts` (optional export)

- [ ] **Step 1: Pixi stage component**

`FishingPixiStage` props:

```typescript
type FishingPixiStageProps = {
  targetWord: string;
  poolWords: readonly string[]; // all vocab words for distractors
  enabled: boolean;
  onFishTap: (word: string) => { kind: "correct" | "wrong" | "ignored"; session?: unknown };
};
```

Behavior:
1. `useEffect` create `Application`, `await app.init({ background: "#7dd3fc", resizeTo: hostEl, antialias: true })`, append `app.canvas` to host
2. Maintain 6–10 fish via pool; when `targetWord` changes, rewrite labels so exactly one fish matches (use `ensureExactlyOneTargetLabel`)
3. Ticker updates swim; pointertap → if not busy and enabled, call `onFishTap(fish.word)`; branch correct/wrong FX; on FX done release + respawn replacement word (keep one target invariant)
4. Cleanup: `app.destroy(true, { children: true })`

Do **not** call `setState` from the ticker except through `onFishTap` return path owned by the session hook.

- [ ] **Step 2: Full page**

Replace `FishingGamePage` with:

- `AppPageHeader` + back link
- `useFishingSession()`
- If `!canPlay`: message “Unlock more course units to play.” + link to `/course`
- If playing: centered target `<img src={session.currentTarget.imageSrc} alt={session.currentTarget.word} />`, text `{correctCount} / {targetsNeeded}`, pond region `min-h-[50vh]` with `FishingPixiStage`
- If `session.status === "won"`: hide/disable stage; show `ActivityEndShell` with `reward` and buttons “Play again” (reset by remounting session via key or `window.location` reload of state — prefer `key={playId}` increment) and “Back to games”

Play again: increment a `runId` state that `useFishingSession` depends on, or expose `restart()` from the hook that resets session and `awardedRef`.

Add `restart` to the hook:

```typescript
const restart = useCallback(() => {
  if (!canPlay) return;
  awardedRef.current = false;
  setReward(null);
  setSession(createInitialSession(pool));
}, [canPlay, pool]);
```

- [ ] **Step 3: Typecheck**

```bash
npm run lint
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/games-v2/fishing/FishingPixiStage.tsx src/pages/FishingGamePage.tsx src/hooks/useFishingSession.ts
git commit -m "feat: wire Fishing Game page with Pixi pond and end rewards"
```

---

### Task 9: Verification

- [ ] **Step 1: Run all fishing-related tests**

```bash
npx tsx src/lib/fishing/buildFishingVocabPool.test.ts
npx tsx src/lib/fishing/fishingSession.test.ts
npx tsx src/lib/gameV2Reward.test.ts
npm run lint
```

Expected: all ok / exit 0.

- [ ] **Step 2: Manual checklist**

1. Open `/games-v2` — card titled Fishing Game, 50 coin + 50 diamond
2. Open `/games-v2/fishing` — target image, fish swimming with words
3. Tap wrong fish — flees; no progress change
4. Tap correct fish — FX + progress increments; new target
5. Complete 10 — end screen shows +50 / +50; wallet increases
6. Leave mid-round — no award
7. Replay — awards again
8. Optional: with only locked units beyond unit 1, confirm pool still works when unit 1 has ≥4 imaged words; empty state if not

- [ ] **Step 3: Final commit if any fixups**

```bash
git add -A
git commit -m "fix: fishing game polish from manual verification"
```

(Skip empty commit if nothing to fix.)

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Route `/games-v2/fishing`, replace Fish Pond | Task 2 |
| Hub card name/rewards | Task 2 |
| React shell + Pixi pond | Tasks 7–8 |
| Vocab from unlocked imaged course words | Task 3 |
| 10 correct round | Task 4 |
| Unlimited wrongs | Task 4 |
| End award 50/50 via `completeGameV2` | Task 5 |
| Cosmetic +1 mid-play | Task 7 FX |
| Fish SVGs 1–10 | Task 7 |
| Sound stubs | Task 6 |
| Pool 6–10, swim, flip, FX | Tasks 7–8 |
| Empty pool state | Task 8 |
| Unit tests + lint | Tasks 3–5, 9 |
| No live wallet per tap | Tasks 5–6 |

## Notes for implementers

- Prefer importing SVG as Vite URLs over copying into `public/` unless HMR/loading fails in Pixi `Assets.load`.
- Do not put React state updates inside the Pixi ticker except via the session `onFishTap` callback.
- Keep `FishPondPage` deleted; do not leave both routes.
