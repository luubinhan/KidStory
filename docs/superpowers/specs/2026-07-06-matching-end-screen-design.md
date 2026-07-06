# Matching End Screen — Design Spec

**Date:** 2026-07-06  
**Status:** Approved (brainstorming session)

## Summary

When the user matches all pairs in the matching activity, show a shared end screen with confetti, coin reward display, **Play again**, and **Back to unit** — matching the flashcards completion pattern. Replace the dedicated star-rated `MatchingEndScreen` with `PracticeSummaryEndScreen`. Transition to the end screen after a brief delay so the final match animation can finish.

## Decisions

| Topic | Choice |
|-------|--------|
| End screen component | `PracticeSummaryEndScreen` (shared with flashcards, MC, spell, sentence) |
| Star rating | Removed from matching end screen |
| "Do another activity" | Navigate to `/course/:unitId` ("Back to unit") |
| Transition timing | ~600ms delay after last pair matched, then show summary |
| Reward timing | Award when `phase === "summary"` (not raw `isComplete`) |
| Replay rewards | No re-award on replay if already completed (existing `useActivityCompletion` behavior) |

## Approach

**Recommended: session phase + delayed transition (Approach 1)**

Add `"playing" | "summary"` phase to `CourseMatchingSession`, mirroring `CourseFlashcardsSession`. When `isComplete` becomes true, wait ~600ms, then set `phase = "summary"`. Wire `useActivityCompletion(unitId, "matching", phase === "summary")`.

Rejected alternatives:

- **Delay inside `useCourseMatching`** — mixes animation timing into game logic; inconsistent with other sessions.
- **Keep `MatchingEndScreen`, add Back button only** — conflicts with decision to use shared summary screen and drop stars.

## Architecture

```
src/components/course-practice/CourseMatchingSession.tsx   phase state, delayed transition, navigate
src/components/course-practice/PracticeSummaryEndScreen.tsx  (unchanged — reuse)
src/components/progress/ActivityEndShell.tsx               (unchanged — confetti + reward)
src/hooks/useActivityCompletion.tsx                        (unchanged)
src/hooks/useCourseMatching.ts                             (unchanged)
src/components/course-practice/MatchingEndScreen.tsx       delete if unreferenced
```

## Data flow

1. User matches the last pair → existing match glow animation runs (~500ms).
2. `useCourseMatching` sets `isComplete = true`.
3. `CourseMatchingSession` detects `isComplete` and starts a ~600ms timeout.
4. Timeout fires → `phase = "summary"`.
5. `useActivityCompletion` calls `completeActivity(unitId, "matching")` once.
6. `PracticeSummaryEndScreen` renders via `ActivityEndShell`:
   - Confetti (when reward granted)
   - `ActivityRewardSection` (Lottie + `+N` coins)
   - Title: "Great job!"
   - Subtitle: "You matched all {pairCount} pairs"
   - **Play again** → `onReplay()` + `replay()` → reset to `"playing"`
   - **Back to unit** → `navigate(/course/${unitId})`

## CourseMatchingSession changes

```ts
const [phase, setPhase] = useState<"playing" | "summary">("playing");

useEffect(() => {
  if (!isComplete || phase === "summary") return;
  const id = window.setTimeout(() => setPhase("summary"), 600);
  return () => window.clearTimeout(id);
}, [isComplete, phase]);

const { reward, onReplay } = useActivityCompletion(
  unitId,
  "matching",
  phase === "summary",
);

const handleReplay = () => {
  onReplay();
  replay();
  setPhase("playing");
};

const handleBackToUnit = () => {
  navigate(`/course/${unitId}`);
};
```

When `phase === "summary"`, render:

```tsx
<PracticeSummaryEndScreen
  title="Great job!"
  subtitle={`You matched all ${pairCount} pairs`}
  reward={reward}
  onReplay={handleReplay}
  onContinue={handleBackToUnit}
  continueLabel="Back to unit"
/>
```

## MatchingEndScreen removal

`MatchingEndScreen.tsx` becomes unused after this change. Delete the file and remove any exports if present. Star rating CSS (`matching-star-reveal`) can remain in `index.css` unless confirmed unused elsewhere.

## Edge cases

| Case | Behavior |
|------|----------|
| Empty entries | Unchanged empty-state message |
| Unmount during delay | Clear timeout in effect cleanup |
| Replay after summary | Reset phase to `"playing"`; reward cleared via `onReplay()` |
| Already-completed unit replay | End screen shows without confetti/coins (existing dedup) |
| Navigate away during delay | Timeout cleared on unmount; no side effects |

## Testing

Manual verification:

1. Complete a matching activity → brief pause → end screen with confetti and coin count.
2. **Play again** resets the board; no second coin award if activity already completed.
3. **Back to unit** navigates to `/course/:unitId`.
4. First-time completion awards coins; celebration sound plays once.

Run `npm run lint` after changes.

## Out of scope

- Star rating or move-count display on end screen.
- Auto-opening the next activity in the unit.
- Changing coin amounts or reward logic.
- Adding "Back to unit" to write, sentence, MC, or spell end screens.
