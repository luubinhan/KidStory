# Activity Reward Celebration — Design Spec

**Date:** 2026-07-05  
**Status:** Approved (brainstorming session)

## Summary

Users earn coins and diamonds only when they finish **all questions** in an activity (not per question). On completion, the end screen shows a unified celebration: full-screen confetti, a Lottie treasure animation, and earned currency amounts. Per-question confetti and celebration sounds are removed.

## Decisions

| Topic | Choice |
|-------|--------|
| Completion gate | All questions in the activity must be done (wrong answers allowed) |
| Replay rewards | Every completion awards coins/diamonds (unchanged from current logic) |
| Celebration placement | Integrated into end screen card (not overlay modal, not top toast) |
| Per-question feedback | Remove confetti and celebration sound on individual correct answers |
| Activities without end screen | Add summary/end screen (sentence, spell, MC, flashcards) |
| Lottie — coins only | `src/assets/treasure-coin.json` |
| Lottie — coins + diamonds | `src/assets/treasure-diamond-coin.json` (write, complete-sentence) |
| Reward logic | Keep `onActivityComplete` unchanged; change UI timing and presentation only |

## Approach

**Recommended: shared `ActivityRewardSection` component (Approach A)**

Embed a reusable reward block into existing and new end screens. Refactor `useActivityCompletion` to return structured reward data instead of rendering `RewardToast`. Avoid a single mega end-screen component (Approach B) or modal overlay (Approach C, rejected by user).

## Architecture

```
src/components/progress/ActivityRewardSection.tsx   Lottie + earned coin/diamond display
src/components/progress/ActivityEndScreen.tsx         Optional shared wrapper: Confetti + card shell
src/hooks/useActivityCompletion.tsx                 Return ActivityRewardResult, no RewardToast
src/components/course-practice/WriteEndScreen.tsx   Add reward section + Confetti
src/components/course-practice/MatchingEndScreen.tsx  Add reward section (Confetti already present)
src/components/course-practice/CourseWriteSession.tsx
src/components/course-practice/CourseTypedAnswerSession.tsx
src/components/course-practice/CoursePracticeSentenceSession.tsx   Add summary phase + end screen
src/components/course-practice/CourseFlashcardsSession.tsx         Add finish → end screen flow
src/components/course-practice/CourseMatchingSession.tsx
src/components/game-topic/GameTopicPracticeSession.tsx             Add summary phase for spell/MC
src/lib/gameCelebrationSound.ts                     Called once on end screen only
src/assets/treasure-coin.json                       Lottie — coin-only rewards
src/assets/treasure-diamond-coin.json               Lottie — coin + diamond rewards
```

## Data flow

1. User completes the last question and taps Next / Finish.
2. Session transitions to `phase === "summary"` (or equivalent `isComplete`).
3. `useActivityCompletion` calls `completeActivity(unitId, activityId)` once per session.
4. Hook stores `ActivityRewardResult` and exposes it to the end screen.
5. End screen renders `<Confetti />`, `ActivityRewardSection`, activity-specific summary (score, stars), and Replay / Back actions.
6. `playCelebrationSound()` fires once when the end screen mounts.

Reward persistence logic in `onActivityComplete` is unchanged: +10 coin per activity, +50 diamond for write/complete-sentence, unit bonus, treasure mirror achievement stacking.

## ActivityRewardSection

```ts
type ActivityRewardSectionProps = {
  coinsEarned: number;
  diamondsEarned: number;
  unitBonusEarned?: number;
  achievementReward?: number;
};
```

**Lottie selection:**

- `diamondsEarned > 0` → import `treasure-diamond-coin.json`
- otherwise → import `treasure-coin.json`

**Display:**

- Primary row: `+N` with coin icon; `+N` with diamond icon when `diamondsEarned > 0`
- Secondary lines when applicable: unit bonus, treasure mirror reward
- Lottie via `lottie-react` (already in dependencies), ~120–160px, `loop={false}` preferred
- Styling mirrors `CoinDisplay` / `DiamondDisplay` pill colors (amber / sky)

## useActivityCompletion changes

**Before:** returns `{ rewardToast, onReplay, rewardMessage }` and renders `<RewardToast>` internally.

**After:** returns `{ reward, onReplay }` where `reward: ActivityRewardResult | null`.

- Remove `RewardToast` from the hook.
- Keep session-key dedup so rewards fire once per play-through.
- `completeActivityOnce` helper returns `ActivityRewardResult | null` instead of formatted string.

`formatActivityReward` in `RewardToast.tsx` may remain for non-practice uses or be inlined into `ActivityRewardSection`; practice sessions stop using `RewardToast`.

## End screen per activity

| Activity | End screen | Changes |
|----------|------------|---------|
| write | `WriteEndScreen` | Add `ActivityRewardSection`, `Confetti`, sound on mount; pass `reward` prop |
| complete-sentence | `WriteEndScreen` | Same; remove standalone Confetti from session |
| matching | `MatchingEndScreen` | Add `ActivityRewardSection`; Confetti already present |
| sentence | New summary view | Add `phase: "playing" \| "summary"`; last question Next → summary with reward |
| flashcards | New summary view | Last card: "Finish" → summary with reward → "Back to unit" navigates away |
| spell (game topic) | New summary view | Add summary phase after last solved question |
| multiple-choice | New summary view | Add summary phase after last answered question |

Shared end-screen layout:

```
[Confetti — fixed full viewport]
[Card]
  ActivityRewardSection (Lottie + amounts)
  Activity-specific body (score, stars, card count)
  Replay / Back button
```

## Remove per-question celebration

Delete or stop calling in:

- `GameTopicPracticeSession.tsx` — `<Confetti />` on `isSolved`, per-question `playCelebrationSound`
- `CoursePracticeSentenceSession.tsx` — same
- `CourseTypedAnswerSession.tsx` — move Confetti/sound into end screen only

Correct-answer inline feedback (green check, "Correct!") stays; only full-screen confetti and celebration sound are removed mid-session.

## Flashcards flow

**Current:** "Back to unit" on last card calls `completeActivity` and shows `RewardToast`, then navigates.

**New:**

1. Last card shows "Finish" instead of immediate navigation.
2. Finish → summary end screen with celebration and reward.
3. "Back to unit" on summary navigates to unit page (activity already completed on summary mount).

## Testing

- `useActivityCompletion` still awards once per session; replay increments session key and awards again.
- Write / complete-sentence end screen shows `treasure-diamond-coin.json` and diamond amount.
- Matching / flashcards / sentence show `treasure-coin.json` only.
- No confetti or celebration sound during mid-session correct answers.
- Unit bonus and treasure mirror amounts appear on end screen when triggered.
- Existing `diamondLogic.test.ts` and `userProgressLogic.test.ts` remain passing (logic unchanged).

## Out of scope

- Changing coin/diamond amounts or replay economics.
- Replacing `RewardToast` outside practice flows (if any remain).
- New achievement types or shop changes.
