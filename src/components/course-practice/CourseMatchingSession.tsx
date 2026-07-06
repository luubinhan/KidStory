import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CourseDictionaryEntry } from "../../types/course";
import { useCourseMatching } from "../../hooks/useCourseMatching";
import { useActivityCompletion } from "../../hooks/useActivityCompletion";
import { MatchingCard } from "./MatchingCard";
import { PracticeSummaryEndScreen } from "./PracticeSummaryEndScreen";

type CourseMatchingSessionProps = {
  entries: readonly CourseDictionaryEntry[];
  unitId: string;
};

export function CourseMatchingSession({ entries, unitId }: CourseMatchingSessionProps) {
  const navigate = useNavigate();
  const [sessionPhase, setSessionPhase] = useState<"playing" | "summary">("playing");
  const completionHandledRef = useRef(false);

  const {
    entryMap,
    cards,
    phase,
    pairCount,
    isComplete,
    mismatchCardIds,
    recentMatchPairIds,
    selectCard,
    replay,
  } = useCourseMatching(entries);

  useEffect(() => {
    if (!isComplete) {
      completionHandledRef.current = false;
      return;
    }
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    const id = window.setTimeout(() => setSessionPhase("summary"), 600);
    return () => window.clearTimeout(id);
  }, [isComplete]);

  const { reward, onReplay } = useActivityCompletion(
    unitId,
    "matching",
    sessionPhase === "summary",
  );

  const handleReplay = () => {
    onReplay();
    replay();
    setSessionPhase("playing");
  };

  const handleBackToUnit = () => {
    navigate(`/course/${unitId}`);
  };

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No vocabulary to match for this unit yet.
      </p>
    );
  }

  if (sessionPhase === "summary") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <PracticeSummaryEndScreen
          title="Great job!"
          subtitle={`You matched all ${pairCount} pairs`}
          reward={reward}
          onReplay={handleReplay}
          onContinue={handleBackToUnit}
          continueLabel="Back to unit"
        />
      </div>
    );
  }

  const mismatchSet = new Set(mismatchCardIds);
  const recentMatchSet = new Set(recentMatchPairIds);
  const inputLocked = phase === "resolving";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
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
