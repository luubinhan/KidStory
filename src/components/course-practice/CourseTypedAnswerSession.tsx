import { Check, CircleArrowRightIcon } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import type { CourseTypedAnswerQuestion } from "../../types/course";
import { useCourseTypedAnswerSession } from "../../hooks/useCourseTypedAnswerSession";
import { useActivityCompletion } from "../../hooks/useActivityCompletion";
import { useQuestionHint } from "../../hooks/useQuestionHint";
import { GameQuestionImage } from "../game-topic/GameQuestionImage";
import { IconVolumeButton } from "../game-topic/IconVolumeButton";
import { McProgressHeader } from "../game-topic/McProgressHeader";
import { cn } from "../../lib/utils";
import { WriteEndScreen } from "./WriteEndScreen";

type CourseTypedAnswerSessionProps = {
  questions: readonly CourseTypedAnswerQuestion[];
  sessionKey: string;
  unitId: string;
};

export function CourseTypedAnswerSession({
  questions,
  sessionKey,
  unitId,
}: CourseTypedAnswerSessionProps) {
  const {
    phase,
    question,
    questionIndex,
    total,
    isLast,
    input,
    setInput,
    submitted,
    result,
    correctCount,
    submit,
    goNext,
    replay,
    playPrompt,
    playSentence,
  } = useCourseTypedAnswerSession(questions, sessionKey);

  const { reward, onReplay } = useActivityCompletion(
    unitId,
    "complete-sentence",
    phase === "summary",
  );
  const { hintRevealed, hintControl } = useQuestionHint(question?.id ?? `typed-${questionIndex}`);

  const handleReplay = () => {
    onReplay();
    replay();
  };

  if (questions.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No complete-the-sentence questions for this unit yet.
      </p>
    );
  }

  if (phase === "summary") {
    return (
      <WriteEndScreen
        correctCount={correctCount}
        total={total}
        reward={reward}
        onReplay={handleReplay}
      />
    );
  }

  if (!question) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (submitted) {
      goNext();
    } else if (input.trim()) {
      submit();
    }
  };

  const blankClass =
    result === null
      ? "border-amber-900 text-slate-800"
      : result === "correct"
        ? "border-emerald-500 text-emerald-700"
        : "border-rose-500 text-rose-700";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <McProgressHeader current={questionIndex + 1} total={total} trailing={hintControl} />

      <div className="p-4 bg-[url('/images/bg-card.webp')] bg-cover bg-no-repeat md:p-6">
        <div className="backdrop-blur-xs rounded-2xl p-8 mt-4">
          <div className="mb-4 flex items-center justify-center gap-3">
            <p className="min-w-0 text-xl font-bold text-slate-800 md:text-2xl">{question.prompt}</p>
            <IconVolumeButton onClick={() => void playPrompt()} aria-label="Hear the question" />
          </div>

          <div className="relative mb-6">
            <GameQuestionImage src={question.image} />
            <div className="absolute bottom-0 left-0 right-4 flex justify-end py-4">
              <div className="h-20 w-20 rounded-3xl border-b-8 border-green-700 bg-green-500 font-kids text-6xl text-white">
                <IconVolumeButton
                  className="flex h-full w-full cursor-pointer items-center justify-center"
                  onClick={() => void playSentence()}
                  aria-label="Hear the sentence"
                />
              </div>
            </div>
          </div>

          {hintRevealed ? (
            <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-center text-sm font-bold text-amber-800">
              Hint: {question.answer}
            </p>
          ) : null}

          <div className="flex flex-wrap items-baseline justify-center gap-x-1 text-xl font-bold text-slate-900 md:text-2xl">
            <span>{question.textBefore}</span>
            <label htmlFor="typed-answer-input" className="sr-only">
              Type the missing word
            </label>
            <input
              id="typed-answer-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={submitted}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className={cn(
                "inline-block min-w-[6ch] max-w-[14ch] border-b-2 bg-transparent px-1 text-center font-bold outline-none transition-colors",
                "focus:border-sky-400 focus:ring-0",
                blankClass,
                submitted && result === "correct" && "bg-emerald-50",
                submitted && result === "incorrect" && "bg-rose-50",
              )}
              placeholder=""
            />
            <span>{question.textAfter}</span>
          </div>

          {submitted && result === "incorrect" ? (
            <p className="mt-3 text-center text-sm font-semibold text-slate-600">
              Correct answer: <span className="text-emerald-700">{question.answer}</span>
            </p>
          ) : null}

          {submitted && result === "correct" ? (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600">
              <Check className="size-4" aria-hidden />
              Correct!
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!submitted ? (
              <button
                type="button"
                onClick={submit}
                disabled={!input.trim()}
                className={cn(
                  "candy-glass-btn rounded-2xl px-6 py-3 text-sm font-bold",
                  input.trim() ? "candy-glass-btn--idle" : "cursor-not-allowed opacity-50",
                )}
              >
                Check
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="cursor-pointer rounded-full border-2 border-blue-400 bg-blue-500 text-white transition-colors hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
                aria-label={isLast ? "See results" : "Next question"}
              >
                <CircleArrowRightIcon className="h-12 w-12" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
