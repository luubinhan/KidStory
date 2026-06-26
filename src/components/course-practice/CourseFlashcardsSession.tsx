import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import type { CourseDictionaryEntry } from "../../types/course";
import { cn, speak } from "../../lib/utils";
import { useCourseFlashcards } from "../../hooks/useCourseFlashcards";

type CourseFlashcardsSessionProps = {
  entries: readonly CourseDictionaryEntry[];
};

export function CourseFlashcardsSession({ entries }: CourseFlashcardsSessionProps) {
  const { current, index, total, isFlipped, canGoPrev, canGoNext, flip, goPrev, goNext } =
    useCourseFlashcards(entries);

  if (!current || total === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No vocabulary cards for this unit yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-semibold text-slate-500">
        Card {index + 1} of {total}
      </p>

      <div
        role="button"
        tabIndex={0}
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            flip();
          }
        }}
        className={cn(
          "relative mx-auto flex min-h-56 w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-white bg-white p-6 shadow-md transition-transform",
          "hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
        )}
        aria-label={isFlipped ? "Show English word" : "Show translation"}
      >
        {!isFlipped ? (
          <>
            <span className="text-3xl font-bold text-sky-900">{current.word}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                speak(current.word, 0.9);
              }}
              className="mt-4 flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors hover:bg-sky-200"
              aria-label={`Hear ${current.word}`}
            >
              <Volume2 className="size-5" aria-hidden />
            </button>
            <span className="mt-4 text-xs text-slate-400">Tap to flip</span>
          </>
        ) : (
          <>
            <span className="text-5xl leading-none" aria-hidden>
              {current.emoji}
            </span>
            <span className="mt-4 text-lg font-semibold text-slate-700">{current.translation}</span>
            <span className="mt-4 text-xs text-slate-400">Tap to flip back</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="inline-flex items-center gap-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          className="inline-flex items-center gap-1 rounded-xl border-2 border-sky-500 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
