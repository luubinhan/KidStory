# Matching Pairs (Games V2) — Design Spec

**Date:** 2026-08-23  
**Status:** Approved (brainstorming session)

## Summary

Add a **Matching Pairs** mini-game to Games V2. The child flips cards to match each English word to its picture, using the same flip behavior as course matching. Words come from a **standalone list** in `src/data/` (seeded by copying existing course words that already have images). Each play samples **10 pairs**. Completing the board awards **20 coins and 0 diamonds** via `completeGameV2`. No Pixi.

## Decisions

| Topic | Choice |
|-------|--------|
| Route | `/games-v2/matching-pairs` |
| Hub card | `id: "matching-pairs"`, name **Matching Pairs**, rewards 20 / 0 |
| Architecture | New V2 page + session hook; reuse `MatchingCard` and `useCourseMatching`; do not change `CourseMatchingSession` |
| Vocabulary | Fixed standalone list in `src/data/matchingPairsGame.ts`, seeded from course words that have `image` |
| Round length | Sample **10 pairs** (20 cards) per play |
| Pair type | Image card + word card (same as course matching) |
| Rewards | **20 coins / 0 diamonds** from `gamesV2` catalog; `onGameV2Complete` already reads those fields |
| Replay awards | Allowed (same as fishing / hungry-dog) |
| Thumbnail | Existing matching art (`IMAGES_ACTIVITIES.matching`) |
| Audio | None this pass |
| Out of scope | Pixi, new cover art, audio on flip, course matching refactor, stars on V2 end screen, unit picker, difficulty |

## Approach

**Chosen: new V2 page + session hook, reuse cards/logic**

- React page mirrors fishing chrome (sky gradient, `CourseBottomNav`, `ActivityEndShell` overlay).
- Flip logic stays in `useCourseMatching` + `MatchingCard`.
- Session hook loads the standalone list, samples 10, maps to `CourseDictionaryEntry`, awards on complete.

Rejected alternatives:

- **Stretch `CourseMatchingSession`** — session is wired to `useActivityCompletion` and `/course/:unitId` navigation; course risk for little gain.
- **Extract shared `MatchingSession` now** — extra refactor; YAGNI until both surfaces need to stay identical.

## Architecture

```
src/App.tsx                              Route /games-v2/matching-pairs
src/data/gamesV2.ts                      Catalog entry matching-pairs (20/0)
src/data/matchingPairsGame.ts            MATCHING_PAIRS_COUNT + word list
src/pages/MatchingPairsGamePage.tsx      Board + empty + end overlay
src/hooks/useMatchingPairsSession.ts     Sample 10, wire matching + reward
src/lib/sampleMatchingPairs.ts           Pure shuffle + take N
src/lib/sampleMatchingPairs.test.ts      assert() script
```

Reuse without changing:

```
src/hooks/useCourseMatching.ts
src/components/course-practice/MatchingCard.tsx
src/types/matchingPairs.ts               buildCardsFromEntries, card types
```

### Data flow

```text
matchingPairsWords
  → sampleMatchingPairs(words, MATCHING_PAIRS_COUNT)
  → map to CourseDictionaryEntry (unitId `"matching-pairs"`, unitNumber `0`; unused by hook)
  → useCourseMatching(entries)
  → MatchingPairsGamePage renders MatchingCard grid
  → isComplete → completeGameV2("matching-pairs") once
  → ActivityEndShell (Play again / Back to games)
```

## Data structures

```ts
type MatchingPairsWord = {
  id: string;
  word: string;
  translation: string;
  image: string;
};

export const MATCHING_PAIRS_COUNT = 10;
export const matchingPairsWords: readonly MatchingPairsWord[];
```

- Stored rows have **no** `unitId`. Mapping to `CourseDictionaryEntry` exists only so `useCourseMatching` keeps its current argument type.
- Seed **16–20** words copied from early course units (ids, word, translation, image URLs unchanged). Only include entries with a non-empty `image`.
- `sampleMatchingPairs(words, count)`: if `words.length < count`, return empty array (page shows empty state). Else shuffle a copy and return the first `count` items.

`GameV2` catalog entry:

```ts
{
  id: "matching-pairs",
  name: "Matching Pairs",
  path: "/games-v2/matching-pairs",
  coinReward: 20,
  diamondReward: 0,
  thumbnailSrc: IMAGES_ACTIVITIES.matching,
}
```

`GamesV2Page` already maps `gamesV2`; no hub layout change beyond the new card.

## UI

- Full-height page, sky gradient, `CourseBottomNav`.
- Playing: 5-column grid, 20 `MatchingCard`s (4 rows). Same flip, mismatch shake (~1200ms), match glow, input lock while `phase === "resolving"`.
- Win: ~600ms delay, then overlay with `ActivityEndShell` + reward. **Play again** reshuffles 10 pairs and clears the award-once flag. **Back to games** goes to `/games-v2`.
- Empty: if sampled list is empty (`matchingPairsWords.length < 10`), show a friendly message. Do not crash.

No audio. No stars on the V2 end screen (hook may still compute stars; unused).

## Session + rewards

`useMatchingPairsSession` follows fishing:

- Hold sampled entries + `useCourseMatching` outputs.
- `awardedRef` / run id so `completeGameV2("matching-pairs")` fires once per completed board.
- Replay increments run id, clears reward, samples a new 10.

`onGameV2Complete` needs no change; it looks up `getGameV2(gameId)` and applies catalog rewards. Replay still awards (covered by existing `gameV2Reward.test.ts` for fishing; optional extra assert for `matching-pairs` after catalog exists).

## Error handling

- Missing catalog id → `completeGameV2` returns `null` (existing behavior); end screen still shows, reward toast empty.
- List shorter than 10 → empty state, no session start.
- Course matching files stay untouched; no migration.

## Testing

- `npx tsx src/lib/sampleMatchingPairs.test.ts`: too-short list → `[]`; list of 16 with count 10 → length 10, subset of ids, no mutation of input.
- `npm run lint` after implementation.
- No new Jest/Vitest. No UI/hook test scripts.

## Out of scope

- Pixi / new illustrations
- Audio on flip
- Refactoring `CourseMatchingSession`
- Showing matching stars on the V2 end screen
- Unit picker or difficulty
- New dedicated cover image
