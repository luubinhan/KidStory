import type { CourseDictionaryEntry } from "../../types/course";
import { useCourseMatching } from "../../hooks/useCourseMatching";
import { Progress } from "../ui";
import { MatchingCard } from "./MatchingCard";
import { MatchingEndScreen } from "./MatchingEndScreen";

type CourseMatchingSessionProps = {
  entries: readonly CourseDictionaryEntry[];
};

export function CourseMatchingSession({ entries }: CourseMatchingSessionProps) {
  const {
    entryMap,
    cards,
    phase,
    moves,
    pairCount,
    matchedCount,
    isComplete,
    stars,
    mismatchCardIds,
    recentMatchPairIds,
    selectCard,
    replay,
  } = useCourseMatching(entries);

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No vocabulary to match for this unit yet.
      </p>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MatchingEndScreen stars={stars} moves={moves} pairCount={pairCount} onReplay={replay} />
      </div>
    );
  }

  const mismatchSet = new Set(mismatchCardIds);
  const recentMatchSet = new Set(recentMatchPairIds);
  const inputLocked = phase === "resolving";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
      <div className="shrink-0 space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
          <span aria-live="polite">
            {matchedCount} / {pairCount}
          </span>
        </div>
        <Progress
          value={matchedCount}
          max={pairCount}
          aria-label={`Matched ${matchedCount} of ${pairCount}`}
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-5 content-start gap-2 sm:gap-3">
        {cards.map((card) => {
          const entry = entryMap.get(card.pairId);
          const label = entry?.word ?? card.content;

          return (
            <MatchingCard
              key={card.id}
              card={card}
              label={label}
              disabled={inputLocked}
              isMismatch={mismatchSet.has(card.id)}
              isRecentMatch={recentMatchSet.has(card.pairId)}
              onSelect={selectCard}
            />
          );
        })}
      </div>
    </div>
  );
}
