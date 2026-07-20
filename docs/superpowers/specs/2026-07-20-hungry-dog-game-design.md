# Hungry Dog Game (Games V2) — Design Spec

**Date:** 2026-07-20  
**Status:** Approved (brainstorming session)

## Summary

Build a PixiJS v8 drag-and-drop vocabulary mini-game **Hungry Dog** under Games V2. The child drags the correct English word card into the puppy's mouth. React owns the page shell, audio prompt, and coin HUD; Pixi owns the puppy animation, four draggable word cards, mouth hit-testing, and VFX. Words come from unlocked course units (same pool as Fishing). A lesson ends after 5 correct answers. Each correct answer awards **1 real coin** via progress persistence. A 1-hour hunger timer drives **visual-only** puppy animation (`idle` vs `hungry`); it does not block gameplay. Sounds are stubbed until assets are provided.

## Decisions

| Topic | Choice |
|-------|--------|
| Route | `/games-v2/hungry-dog` (page skeleton already exists) |
| Architecture | Approach 1: Mirror Fishing — React shell + pure session lib + Pixi stage |
| Vocabulary | Reuse `buildFishingVocabPool` from unlocked course units (min pool size 4) |
| Round length | **5 correct** answers to finish |
| Choices | Always exactly **4** cards (1 target + 3 random distractors from pool, no repeats within a round) |
| Wrong answers | Unlimited retry; choices stay on board; no score/life penalty |
| Rewards | **+1 coin per correct** written to IndexedDB via new `addCoins(1)` API; no `completeGameV2` |
| Hunger | Visual only: `hungry` vs `idle` base clip based on `lastEatAt`; **no gameplay lock** |
| `lastEatAt` storage | `localStorage` key `kidstory.hungryDog.lastEatAt` (not user progress schema) |
| Question prompt | Image + auto-play audio on new target (same pattern as Fishing) |
| Word cards | Full Pixi drag-and-drop; drop hit-test on puppy mouth region |
| Puppy states | Explicit enum: `idle`, `hungry`, `ready`, `eating`, `happy`, `wrong` |
| Session states | Explicit enum: `playing`, `complete` |
| Sound | Stub/no-op with TODO comments until chime/negative assets arrive |
| Out of scope | Real SFX assets, Snyk security scan, `completeGameV2("hungry-dog")`, hunger-based play lock |

## Approach

**Recommended: Mirror Fishing (Approach 1)**

- React: target image, coin counter, unlock-empty state, lesson end screen
- PixiJS v8: animated puppy, four draggable word cards, mouth hit zone, particle/coin-fly VFX
- Pure session logic in `src/lib/hungry-dog/`; hook bridges React progress/audio; Pixi calls `onDrop(word)` on mouth hit

Rejected alternatives:

- **Thick React state machine, thin Pixi** — easier debug but more React↔Pixi sync for drag/hit-test; animation timing harder to keep smooth
- **Mostly Pixi ticker** — cohesive FX but diverges from Fishing patterns, harder to test and wire progress/audio

## Architecture

```
src/
  types/hungryDog.ts                       Session enums, round constants, puppy anim states
  lib/hungry-dog/
    buildVocabPool.ts                      Thin re-export/wrap of buildFishingVocabPool
    hungryDogSession.ts                    Pure: createRound, applyDrop, advance
    hungryDogHunger.ts                     lastEatAt localStorage read/write + isHungry(now)
    hungryDogSounds.ts                     Placeholder playCorrect/playWrong (TODO)
    hungryDogSession.test.ts               Standalone assert() tests
  hooks/useHungryDogSession.ts             React state, addCoins, audio, restart
  components/games-v2/hungry-dog/
    HungryDogPixiStage.tsx                 Application mount/resize/destroy
    puppyController.ts                     Spritesheet clip map per PuppyAnim state
    wordCardDrag.ts                        Pointer drag + mouth drop test + snap-back
    fxSystem.ts                            triggerEffect('correct' | 'wrong', position)
    timings.ts                             Named animation ms constants (designer-tunable)
    preload.ts                             Spritesheet + assets preload
  pages/HungryDogGamePage.tsx              Shell: HUD overlay + stage + end screen
```

### Boundaries

- **React:** lesson lifecycle, coin persistence, audio prompt, end UI
- **Pixi:** puppy sprite, four word cards, drag/drop, mouth hit zone, VFX
- **Pure lib:** target/distractor selection, drop validation, round advance, hunger time math

### Data flow

```text
useUserProgress.isUnitAccessible
  → buildFishingVocabPool(courseUnits)   // reused pool
  → useHungryDogSession (round, correctCount, status, sessionCoins)
  → HungryDogGamePage renders target image + coin counter
  → HungryDogPixiStage receives choices, puppyPhase, enabled, onDrop
  → on correct drop → addCoins(1) + setLastEatAt(now) in localStorage
  → on 5 correct → status complete → ActivityEndShell (Play again / Back to games)
```

## Data structures

```ts
type HungryDogVocabItem = FishingVocabItem; // reuse existing type

type LessonStatus = "playing" | "complete";

type PuppyAnim = "idle" | "hungry" | "ready" | "eating" | "happy" | "wrong";

type RoundState = {
  target: HungryDogVocabItem;
  choices: [HungryDogVocabItem, HungryDogVocabItem, HungryDogVocabItem, HungryDogVocabItem];
};

type LessonState = {
  status: LessonStatus;
  correctCount: number; // 0..5; complete at 5
  round: RoundState;
  sessionCoins: number; // UI mirror of coins earned this lesson
};

export const HUNGRY_DOG_ROUND = {
  targetsNeeded: 5,
  choicesCount: 4,
  distractorsCount: 3,
  minPoolSize: 4,
  coinPerCorrect: 1,
  hungerMs: 60 * 60 * 1000, // 1 hour
} as const;
```

All animation durations live in `timings.ts` as named exports (no inline magic numbers in logic).

## Session flow

### Drop handling

1. Player drags a Pixi word card and releases over the puppy mouth hit region.
2. `applyDrop(lesson, word)` runs in pure lib:
   - **Wrong:** return same `choices`; increment nothing; trigger `wrong` puppy anim; show random label from `["Oops!", "Try again!", "Not this one!"]`; card tweens back to slot; return to `ready`/`hungry` base.
   - **Correct:** trigger `eating` → `happy`; +1 session coin; call `addCoins(1)`; write `lastEatAt = now` to localStorage; show random label from `["Yummy!", "Delicious!", "Great!", "Thank you!"]`; coin-fly VFX; auto-advance to next round after animation completes (no manual Next tap).
3. After 5 correct answers, set `status: "complete"` and show React end screen.

### Round advance (correct)

- Pick new target from pool (avoid immediate repeat if pool allows).
- Pick 3 distractors from pool excluding target; shuffle all 4 into card slots.
- No loading screen between rounds; rebuild card content in place.

### Hunger (visual only)

- Read `lastEatAt` from localStorage on mount and after each correct drop.
- If missing or `now - lastEatAt >= 1 hour` → base clip `hungry`; else `idle`.
- Transient states (`ready`, `eating`, `happy`, `wrong`) overlay base during interactions.
- Hunger never disables drag or blocks starting a new lesson.

## Pixi interaction

### Drag

- Pointer down on card → card follows pointer.
- Pointer up:
  - Over mouth hit zone → `onDrop(word)`.
  - Elsewhere → tween card back to home slot.
- While `enabled === false` (during `eating`/`happy`/`wrong` animation), ignore input.

### Mouth hit zone

- Fixed rect or ellipse relative to puppy sprite anchor in stage coordinates.
- Defined once in `wordCardDrag.ts` or `puppyController.ts` as a named constant region.

### Puppy animation

Spritesheet keys (from `src/assets/games/spritesheet.json`):

| PuppyAnim | Spritesheet clip |
|-----------|------------------|
| `idle` | idle |
| `hungry` | hungry |
| `ready` | ready |
| `eating` | eat |
| `happy` | ate |
| `wrong` | sad |

Each state maps to one animated clip. `ParticleLayer` / `fxSystem` is decoupled from puppy logic via `triggerEffect('correct' | 'wrong', position)`.

## UI layout

```text
┌─────────────────────────────┐
│  Question (image + audio)   │  top — React overlay
│                             │
│        Puppy (center)       │  center — Pixi
│                             │
│  [Card][Card][Card][Card]   │  bottom — Pixi, shuffled each round
│                    [Coins]  │  bottom-right — React overlay
└─────────────────────────────┘
```

Audio auto-plays target word ~1.5s after new target (same as Fishing). Replay via existing `playCourseAudio` pattern.

## Progress API change

Add `addCoins(n: number): Promise<void>` to `UserProgressContext`:

- Calls existing pure logic in `userProgressLogic.ts` (new helper or inline increment).
- Persists to IndexedDB via existing `persist`.
- Used by Hungry Dog on each correct drop only.
- Fishing remains unchanged (still uses `completeGameV2` end-of-round reward).

## Edge cases

| Case | Behavior |
|------|----------|
| Pool size < 4 | Show unlock message (copy Fishing empty-pool pattern) |
| Drop while not `playing` | Ignore |
| Drop during feedback animation | Ignore (`enabled=false`) |
| `addCoins` persist fails | Log error; still advance gameplay and session coin counter so child is not blocked |
| Page reload mid-lesson | Session resets (acceptable v1); `lastEatAt` survives in localStorage |
| First visit (no `lastEatAt`) | Puppy shows `hungry` base clip |

## Non-negotiable rules

- Always exactly 4 choices; never remove a wrong choice from the board.
- No lives, no game-over, no score penalty for mistakes.
- No loading screen between rounds.
- Explicit state enums for lesson status and puppy animation — no ad-hoc boolean flags.
- All animation timings as named constants in `timings.ts`.

## Testing

Standalone `npx tsx src/lib/hungry-dog/hungryDogSession.test.ts`:

- Distractor selection: exactly 3, none equal target, all from pool.
- Wrong drop: `choices` unchanged, `correctCount` unchanged.
- Fifth correct: `status === "complete"`.
- `isHungry`: null `lastEatAt` → hungry; < 1h → not hungry; ≥ 1h → hungry.

Run `npm run lint` after implementation.

## Out of scope (v1)

- Real SFX audio files (stub functions only)
- Snyk security scan
- `completeGameV2("hungry-dog")` end-of-lesson diamond/coin bundle
- Hunger-based gameplay lock or cooldown gate
- Unit/topic picker beyond unlocked course pool

## Reference

- Gameplay prompt: `docs/superpowers/hungry-dog-game-play.md`
- Pattern reference: `docs/superpowers/specs/2026-07-14-fishing-game-design.md`
