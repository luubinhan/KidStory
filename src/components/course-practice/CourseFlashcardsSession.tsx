import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { Progress } from "../ui";
import { FlashcardArray, useFlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import type { CourseDictionaryEntry } from "../../types/course";
import { speak } from "../../lib/utils";

type CourseFlashcardsSessionProps = {
  entries: readonly CourseDictionaryEntry[];
};

function shuffleEntries(entries: readonly CourseDictionaryEntry[]): CourseDictionaryEntry[] {
  const copy = [...entries];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function buildSession(entries: readonly CourseDictionaryEntry[]) {
  const shuffled = shuffleEntries(entries);
  const deck = shuffled.map((entry) => ({
    front: {
      html: (
        <div className="flex h-full flex-col items-center justify-center p-6">
          <span className="text-3xl font-bold text-sky-900">{entry.word}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              speak(entry.word, 0.9);
            }}
            className="candy-glass-btn--idle mt-4 flex size-10 items-center justify-center rounded-full"
            aria-label={`Hear ${entry.word}`}
          >
            <Volume2 className="size-5" aria-hidden />
          </button>
          <span className="mt-4 text-xs text-slate-400">Tap to flip</span>
        </div>
      ),
    },
    back: {
      html: (
        <div className="flex h-full flex-col items-center justify-center p-6">
          <span className="text-5xl leading-none" aria-hidden>
            {entry.emoji}
          </span>
          <span className="mt-4 text-lg font-semibold text-slate-700">{entry.translation}</span>
          <span className="mt-4 text-xs text-slate-400">Tap to flip back</span>
        </div>
      ),
    },
  }));
  return { deck, cards: shuffled };
}

export function CourseFlashcardsSession({ entries }: CourseFlashcardsSessionProps) {
  const { deck, cards } = useMemo(() => buildSession(entries), [entries]);

  const flipArrayHook = useFlashcardArray({
    deckLength: deck.length,
    showControls: false,
    showCount: false,
    showProgressBar: false,
  });

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No vocabulary cards for this unit yet.
      </p>
    );
  }

  const current = cards[flipArrayHook.currentCard]!;

  return (
    <div className="course-flashcards space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
          <span aria-live="polite">
            {flipArrayHook.currentCard + 1} / {deck.length}
          </span>
        </div>
        <Progress
          value={flipArrayHook.currentCard + 1}
          max={deck.length}
          aria-label={`Card ${flipArrayHook.currentCard + 1} of ${deck.length}`}
        />
      </div>

      <FlashcardArray
        deck={deck}
        flipArrayHook={flipArrayHook}
        className="mx-auto w-full max-w-sm"
      />

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={flipArrayHook.prevCard}
          disabled={!flipArrayHook.canGoPrev}
          className="candy-glass-btn--idle inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </button>
        <button
          type="button"
          onClick={flipArrayHook.nextCard}
          disabled={!flipArrayHook.canGoNext}
          className="candy-glass-btn inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
