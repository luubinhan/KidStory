import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "../ui";
import type { CourseWord } from "../../types/course";
import { useCourseFlashcards } from "../../hooks/useCourseFlashcards";
import { useActivityCompletion } from "../../hooks/useActivityCompletion";
import { CourseFlashcard } from "./CourseFlashcard";
import { PracticeSummaryEndScreen } from "./PracticeSummaryEndScreen";

type CourseFlashcardsSessionProps = {
  words: readonly CourseWord[];
  sessionKey: string;
  unitId: string;
};

export function CourseFlashcardsSession({ words, sessionKey, unitId }: CourseFlashcardsSessionProps) {
  const navigate = useNavigate();
  const [sessionCounter, setSessionCounter] = useState(0);
  const [phase, setPhase] = useState<"playing" | "summary">("playing");
  const activeSessionKey = `${sessionKey}-flashcards-${sessionCounter}`;

  const {
    deck,
    cardIndex,
    currentWord,
    isFlipped,
    flip,
    goPrev,
    goNext,
    canGoPrev,
    canGoNext,
  } = useCourseFlashcards(words, activeSessionKey);

  const { reward, onReplay } = useActivityCompletion(unitId, "flashcards", phase === "summary");

  const handleFinish = () => {
    setPhase("summary");
  };

  const handleReplay = () => {
    onReplay();
    setSessionCounter((c) => c + 1);
    setPhase("playing");
  };

  const handleBackToUnit = () => {
    navigate(`/course/${unitId}`);
  };

  if (words.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No vocabulary cards for this unit yet.
      </p>
    );
  }

  if (phase === "summary") {
    return (
      <PracticeSummaryEndScreen
        reward={reward}
        subtitle={`You reviewed ${deck.length} cards`}
        onReplay={handleReplay}
        onContinue={handleBackToUnit}
        continueLabel="Back to unit"
      />
    );
  }

  if (!currentWord) {
    return null;
  }

  return (
    <div className="course-flashcards space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
          <span aria-live="polite">
            {cardIndex + 1} / {deck.length}
          </span>
        </div>
        <Progress
          value={cardIndex + 1}
          max={deck.length}
          aria-label={`Card ${cardIndex + 1} of ${deck.length}`}
        />
      </div>

      <CourseFlashcard word={currentWord} isFlipped={isFlipped} onFlip={flip} />

      <div className="flex items-center justify-center gap-3">
        {canGoNext ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="candy-glass-btn--idle inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold"
            >
              <ChevronLeft className="size-4" aria-hidden />
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              className="candy-glass-btn inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold"
            >
              Next
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="candy-glass-btn inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
