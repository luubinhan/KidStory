# Letter Crane Wrong-Cell Reward — Design Spec

**Date:** 2026-09-16  
**Status:** Approved (brainstorming session)

## Summary

Letter Crane round prize is no longer a fixed **10 diamonds**. The pot starts at **the target word’s letter count** (3–8). Each time Pac-Man **lands on a cell that holds a letter that is not the next needed character**, subtract **1** from the pot (floor **0**). Empty cells do not penalize. Completing the word still awards the remaining pot, including **0**. The in-round HUD shows the live pot. The Games V2 hub card may still show catalog `diamondReward: 10`; that number is **not** the prize.

## Decisions

| Topic | Choice |
|-------|--------|
| Base pot | `word.length` after `normalizeCraneWord` (same string as `round.word`) |
| Penalty cell | Cell with a letter whose char ≠ `nextLetter`. Empty cells: no-op |
| Repeat visit | Every **landing** on a wrong-letter cell deducts 1, including leave-and-return |
| Floor | `rewardLeft` never below 0. Play continues. Complete may award 0 |
| Fail (bomb) | Unchanged: `"failed"`, no `completeGameV2`, overlay **Boom!** |
| HUD | Live `{rewardLeft} diamonds` while `playing` |
| Award API | `completeGameV2("crane", { diamondsEarned: state.rewardLeft })` |
| Catalog | `gamesV2` crane `diamondReward: 10` unchanged — hub only |
| Approach | **A**: pot on `CraneState`; Pixi reports land; lib applies penalty |

Rejected:

- **B** — Pot only in the React hook: penalty rule not covered by `craneSession.test.ts`
- **C** — Spend wallet diamonds on each miss: contradicts “trừ trong rewards”; needs `spendDiamonds`

## Approach

**Chosen: session pot + optional award override (Approach A)**

- Pure lib: `rewardLeft` on `CraneState`; `createRound` sets it to `word.length`; `applyWrongCell` decrements by 1 with floor 0
- Hook: `onWrongCell` → `applyWrongCell`; HUD reads `state.rewardLeft`; complete passes override
- Pixi: after the walk tween ends, classify the landing cell (bomb / correct letter / wrong letter / empty)
- Progress: `onGameV2Complete` accepts an optional `diamondsEarned` override; clamp `< 0` to 0; other games unchanged

## Architecture

```
src/types/crane.ts                               CraneState.rewardLeft
src/lib/crane/craneSession.ts                    createRound pot; applyWrongCell
src/lib/crane/craneSession.test.ts               pot, decrement, floor, no-op
src/lib/userProgressLogic.ts                     onGameV2Complete override
src/contexts/UserProgressContext.tsx             completeGameV2(gameId, options?)
src/hooks/useCraneSession.ts                     onWrongCell; award override
src/components/games-v2/crane/CranePixiStage.tsx onWrongCell after land
src/pages/CraneGamePage.tsx                      HUD = rewardLeft
src/lib/gameV2Reward.test.ts                     override 4 and 0; catalog 10 still
```

### Boundaries

- **Pure lib:** pot math and grab/fail. No grid, no Pixi, no persist.
- **Hook:** wires callbacks and award. Does not decrement pot itself.
- **Pixi:** detects landing cell. Calls `onWrongCell()` / `onGrab` / `onBoom`. Does not store `rewardLeft`.
- **Progress:** generic override. Crane is the only caller that passes it in this change.
- **Page:** displays `state.rewardLeft`. Does not read catalog `diamondReward` while playing.

### Data flow

```text
createRound
  word = normalizeCraneWord(target.word)
  rewardLeft = word.length

HUD ← state.rewardLeft

arrow → step() moveTween MOVE_MS

ticker t >= 1 (land):
  bomb cell?     → busy = true; onBoom(); return
  letter == next → tryGrab() → onGrab (unchanged)
  letter != next → onWrongCell() → applyWrongCell → rewardLeft = max(0, rewardLeft - 1)
  empty          → no-op

all slots filled → status complete
  awardedRef → completeGameV2("crane", { diamondsEarned: rewardLeft })

bomb fail → status failed → no completeGameV2

restart → createRound (new word, new pot) + stageKey++
```

Landing means the walk tween finished on that cell. Do not penalize on keydown. Do not penalize while `busy` (letter fly-to-slot) or `enabled === false`.

If a bomb and a letter ever shared a cell (they do not under current placement), bomb wins: `onBoom` only.

## Data structures

```ts
export type CraneState = {
  status: CraneStatus;
  round: CraneRound;
  rewardLeft: number;
};

export function applyWrongCell(state: CraneState): CraneState;
```

`createRound` must set `rewardLeft` to `word.length`. `applyGrab` and `applyBoom` copy `rewardLeft` through unchanged.

```ts
onGameV2Complete(
  progress: UserProgressV1,
  gameId: string,
  options?: { diamondsEarned?: number },
): ActivityRewardResult | null
```

`diamondsEarned` used for both the result field and the wallet increment:

```ts
const raw = options?.diamondsEarned ?? game.diamondReward;
const diamondsEarned = Math.max(0, raw);
```

`completeGameV2` in context forwards the same optional `options` argument.

Coins still come from `game.coinReward` (crane stays 0).

## Gameplay rules (normative)

1. Starting pot = number of letters in the normalized target word.
2. After Pac-Man finishes moving into a cell that contains a field letter, and that letter is not `nextLetter`, subtract 1 from `rewardLeft`.
3. Re-entering that same cell after leaving subtracts again.
4. Empty cells never subtract.
5. Landing on `nextLetter` grabs; it does not subtract.
6. `rewardLeft` is never negative. Further wrong-cell landings at 0 are no-ops for the pot (still no grab).
7. Completing the word awards `rewardLeft` diamonds (may be 0). End shell uses that `ActivityRewardResult`.
8. Bomb fail awards nothing.
9. While playing, the top-right HUD shows the current `rewardLeft`, not catalog 10.

## UI

- Playing HUD: diamond icon + `{rewardLeft} diamonds` (same layout as today).
- No new miss FX (shake, flash, sound) in this change. The HUD number drop is the feedback.
- Complete / fail overlays unchanged except the complete reward amount follows the override.

## Session

`useCraneSession`:

- Adds `onWrongCell` wrapping `applyWrongCell`.
- Complete effect still gated by `awardedRef` and `status === "complete"`.
- Passes `{ diamondsEarned: state.rewardLeft }` into `completeGameV2`.
- `restart` creates a new round (new pot) and clears `reward` / `awardedRef` as today.

Does not add `addDiamonds` or `spendDiamonds`. Does not write the wallet on each miss.

## Error handling

- `applyWrongCell` when `status !== "playing"`: return the same state.
- `applyWrongCell` when `rewardLeft === 0`: return the same state object (no-op, like `applyBoom` when not playing).
- Award override `< 0`: store and grant 0.
- Unmount / restart during `completeGameV2`: ignore via `runIdRef` (existing).
- Contact while `busy` or not `enabled`: ignore (existing + no `onWrongCell`).

## Testing

`npx tsx src/lib/crane/craneSession.test.ts`:

- `createRound` for `garden` → `rewardLeft === 6`; for `cat` → `3`.
- `applyWrongCell` on playing state decrements by 1; slots and `nextLetter` unchanged.
- Two calls decrement by 2.
- After `rewardLeft` reaches 0, further calls stay at 0.
- `applyGrab` preserves `rewardLeft`.
- `applyWrongCell` / `applyGrab` after `complete` or `failed`: no-op (including pot).

`npx tsx src/lib/gameV2Reward.test.ts`:

- Crane **without** override still awards catalog 10 (hub / default path).
- `onGameV2Complete(progress, "crane", { diamondsEarned: 4 })` → `diamondsEarned === 4`, wallet +4.
- Override `0` → `diamondsEarned === 0`, wallet unchanged.
- Other games unchanged.

`npm run lint` after implementation.

No Pixi / keyboard test scripts.

## Out of scope

- Miss FX (shake, tint, sound)
- Changing the hub card `diamondReward` or `GameV2` type
- `addDiamonds` / live wallet debit
- Removing the letter after a wrong landing
- Failing the round when the pot hits 0
- Touch / on-screen D-pad
