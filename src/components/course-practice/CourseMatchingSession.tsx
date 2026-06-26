import { useEffect, useRef } from "react";
import type { CourseDictionaryEntry } from "../../types/course";
import { cn } from "../../lib/utils";
import { useCourseMatching } from "../../hooks/useCourseMatching";
import { Confetti } from "../Confetti";
import { playCelebrationSound } from "../../lib/gameCelebrationSound";

type CourseMatchingSessionProps = {
  entries: readonly CourseDictionaryEntry[];
};

export function CourseMatchingSession({ entries }: CourseMatchingSessionProps) {
  const {
    entryMap,
    wordOrder,
    emojiOrder,
    matchedIds,
    isComplete,
    selectItem,
    isSelected,
    isWrong,
  } = useCourseMatching(entries);

  const celebratedRef = useRef(false);

  useEffect(() => {
    celebratedRef.current = false;
  }, [entries]);

  useEffect(() => {
    if (!isComplete || celebratedRef.current) return;
    celebratedRef.current = true;
    playCelebrationSound();
  }, [isComplete]);

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No vocabulary to match for this unit yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {isComplete ? <Confetti /> : null}

      <p className="text-center text-sm font-semibold text-slate-500">
        {isComplete
          ? "Great job! All pairs matched."
          : `Matched ${matchedIds.size} of ${entries.length}`}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Words</p>
          {wordOrder.map((entryId) => {
            const entry = entryMap.get(entryId);
            if (!entry) return null;

            const matched = matchedIds.has(entryId);
            const selected = isSelected("word", entryId);
            const wrong = isWrong("word", entryId);

            return (
              <button
                key={`word-${entryId}`}
                type="button"
                disabled={matched}
                onClick={() => selectItem("word", entryId)}
                className={cn(
                  "w-full rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all",
                  matched && "border-emerald-400 bg-emerald-50 text-emerald-700",
                  !matched && selected && "border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-200",
                  !matched &&
                    !selected &&
                    !wrong &&
                    "border-slate-100 bg-white text-slate-800 hover:border-sky-200",
                  wrong && "animate-pulse border-rose-400 bg-rose-50 text-rose-700",
                )}
              >
                {entry.word}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Pictures</p>
          {emojiOrder.map((entryId) => {
            const entry = entryMap.get(entryId);
            if (!entry) return null;

            const matched = matchedIds.has(entryId);
            const selected = isSelected("emoji", entryId);
            const wrong = isWrong("emoji", entryId);

            return (
              <button
                key={`emoji-${entryId}`}
                type="button"
                disabled={matched}
                onClick={() => selectItem("emoji", entryId)}
                className={cn(
                  "flex w-full items-center justify-center rounded-xl border-2 px-3 py-3 text-3xl transition-all",
                  matched && "border-emerald-400 bg-emerald-50",
                  !matched && selected && "border-sky-500 bg-sky-50 ring-2 ring-sky-200",
                  !matched && !selected && !wrong && "border-slate-100 bg-white hover:border-sky-200",
                  wrong && "animate-pulse border-rose-400 bg-rose-50",
                )}
                aria-label={entry.word}
              >
                <span aria-hidden>{entry.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
