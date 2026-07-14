# Fishing Game (Games V2) — Design Spec

**Date:** 2026-07-14  
**Status:** Approved (brainstorming session)

## Summary

Build a polished PixiJS v8 mini-game **Fishing Game** under Games V2. The child matches a target vocabulary image to the fish labeled with that English word. React owns the page shell and progress UI; Pixi owns the swimming pond. Words come from unlocked course units. A round ends after 10 correct catches and awards 50 coins + 50 diamonds. Sounds are stubbed until assets are provided.

## Decisions

| Topic | Choice |
|-------|--------|
| Route | `/games-v2/fishing` — replaces Fish Pond stub |
| Hub card | Rename Fish Pond → **Fishing Game**; path `/games-v2/fishing`; display rewards 50/50 |
| Architecture | Approach A: React shell + Pixi pond + thin session bridge |
| Vocabulary | Course words from **all unlocked units**, only entries with `image` |
| Round length | **10 correct** catches to finish |
| Mistakes | Unlimited; wrongs do not affect progress |
| Rewards | Award **50 coins / 50 diamonds once at end of round**; mid-play “+1 Coin” is cosmetic progress only |
| Replay awards | Allowed (same spirit as course activity replay) |
| Fish art | `src/assets/games/fish-1.svg` … `fish-10.svg` |
| Sound | Stub/no-op until success, wrong, coin, splash, ambient assets arrive |
| Out of scope (v1) | Real audio files, diamond mid-play bonuses, lives/timer, unit picker |

## Approach

**Recommended: React shell + Pixi pond (Approach A)**

- React: target image, progress `n / 10`, back navigation, empty-pool state, win end screen
- PixiJS v8: fish sprites + word labels, continuous swim, tap hits, success/fail FX, particles
- Session logic in a hook + pure helpers; Pixi calls into handlers; React state updates only on meaningful events (target change, correct count, win)—not per frame

Rejected alternatives:

- **All-in-Pixi HUD** — cohesive FX, but harder layout/a11y and fights `AppPageHeader`
- **React/CSS fish only** — misses Pixi v8, pooling, and 60 FPS requirements

## Architecture

```
src/App.tsx                              Route /games-v2/fishing; remove fish-pond
src/data/gamesV2.ts                      Catalog: fishing entry (50/50)
src/pages/FishingGamePage.tsx            Shell + end screen (replaces FishPondPage)
src/types/fishing.ts                     FishingVocabItem, round config, session state types
src/lib/fishing/buildFishingVocabPool.ts Pure: unlocked units → vocab items
src/lib/fishing/fishingSession.ts        Pure: pick target, validate tap, advance/win
src/hooks/useFishingSession.ts           React state + reward call on win
src/components/games-v2/fishing/
  FishingPixiStage.tsx                   Mount/resize/destroy Application
  fishPool.ts                            Object pool (sprite + Text)
  swimSystem.ts                          Movement, bob, flip, spawn spacing
  fxSystem.ts                            Success/fail FX, floating +1, particles
```

### Data flow

```text
useUserProgress.isUnitAccessible
  → buildFishingVocabPool(courseUnits)
  → useFishingSession (currentTarget, correctCount, status)
  → FishingGamePage renders target image + n/10
  → FishingPixiStage receives target word + onFishTap
  → on win → completeGameV2("fishing") → end screen with coins/diamonds
```

## Data structures

```ts
type FishingVocabItem = {
  id: string;
  word: string;
  imageSrc: string;
  unitId: string;
};

type FishingRoundConfig = {
  targetsNeeded: 10;
  fishCountMin: 6;
  fishCountMax: 10;
  coinReward: 50;
  diamondReward: 50;
  minPoolSize: 4;
};

type FishingSessionStatus = "playing" | "won";

type FishingSessionState = {
  status: FishingSessionStatus;
  correctCount: number;
  currentTarget: FishingVocabItem;
};
```

Label on fish: uppercase English `word`. Exactly one live fish matches `currentTarget` at all times.

Hub catalog (`GameV2`) updates:

- `id: "fishing"`
- `name: "Fishing Game"`
- `path: "/games-v2/fishing"`
- `coinReward: 50`, `diamondReward: 50`

## Gameplay

### Layout

- Top center: large target image (`currentTarget.imageSrc`)
- Below: full-width Pixi pond with 6–10 animated fish
- Progress indicator: `correctCount / 10`
- Back link to `/games-v2`

### Correct tap

1. Fish jumps / scales; sparkle particles
2. Floating “+1 Coin” (cosmetic)
3. Fish removed smoothly; replacement spawned
4. `correctCount += 1`; new target from pool (prefer avoiding immediate repeats)
5. Ensure exactly one matching fish among live fish
6. Stub success sound

### Incorrect tap

1. Fish accelerates away; splash FX
2. Removed; replacement distractor spawned
3. Stub wrong sound
4. No progress / wallet change

### Win

- After 10th correct: pause/destroy pond interaction, show end screen
- Call new progress API `completeGameV2("fishing")` granting 50 coins + 50 diamonds
- Reuse reward display patterns (`ActivityRewardSection` / end-shell style)
- Confetti/celebration may reuse existing helpers where practical

### Empty pool

If fewer than `minPoolSize` (4) imaged words from unlocked units: show message to unlock more course content; do not start Pixi.

## Fish behavior (Pixi)

- Continuous motion L→R and R→L, varied speeds, slight vertical bob
- Flip sprite when direction changes
- Random spawn positions with soft spacing (Y bands / avoid stacking)
- Object pool for fish containers; recycle on despawn
- Smooth ticker at target 60 FPS
- Proper `Application` destroy on unmount (`destroy({ children: true })`)

## Rewards API

`completeActivity` is course-scoped (`unitId` + `CourseActivityId`). Add a mini-game path:

- `completeGameV2(gameId: string)` on progress context (or equivalent in `userProgressLogic`)
- Reads rewards from `gamesV2` catalog entry
- Persists coins/diamonds; supports replay awards
- Does not unlock course units or grant unit-completion bonuses

## Sound (deferred)

Stub hooks for: success, wrong, coin, water splash, ambient ocean loop. No files required in v1.

## Testing

- `npx tsx` unit tests: vocab pool filtering, exactly-one-target invariant helpers, round advance to win
- Manual: hub card → play → wrong taps → complete 10 → rewards; leave early → no award; pool empty state if applicable
- `npm run lint`

## Non-goals

- Installing game logic inside quiz `GameTopic` types
- Live wallet credit on each correct tap
- Pixi-rendered target image / header (stay in React for v1)
