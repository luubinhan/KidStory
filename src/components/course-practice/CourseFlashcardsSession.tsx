import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "../ui";
import type { CourseWord } from "../../types/course";
import { useCourseFlashcards } from "../../hooks/useCourseFlashcards";
import { useUserProgress } from "../../contexts/UserProgressContext";
import { formatActivityReward, RewardToast } from "../progress/RewardToast";
import { CourseFlashcard } from "./CourseFlashcard";

type CourseFlashcardsSessionProps = {
  words: readonly CourseWord[];
  sessionKey: string;
  unitId: string;
};

export function CourseFlashcardsSession({ words, sessionKey, unitId }: CourseFlashcardsSessionProps) {
  const { completeActivity } = useUserProgress();
  const navigate = useNavigate();
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
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
  } = useCourseFlashcards(words, sessionKey);

  const handleBackToUnit = async () => {
    const result = await completeActivity(unitId, "flashcards");
    if (result) {
      setRewardMessage(
        formatActivityReward(
          result.coinsEarned,
          result.unitBonusEarned,
          result.achievementUnlocked,
          result.achievementReward,
          result.diamondsEarned,
        ),
      );
      setTimeout(() => navigate(`/course/${unitId}`), 800);
      return;
    }
    navigate(`/course/${unitId}`);
  };

  if (words.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No vocabulary cards for this unit yet.
      </p>
    );
  }

  if (!currentWord) {
    return null;
  }

  return (
    <div className="course-flashcards space-y-4">
      <RewardToast message={rewardMessage} onDone={() => setRewardMessage(null)} />
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
            onClick={() => void handleBackToUnit()}
            className="candy-glass-btn inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Back to unit
          </button>
        )}
      </div>
    </div>
  );
}
