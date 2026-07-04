import { Check, CircleArrowRightIcon } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { CourseWord } from "../../types/course";
import { useCourseWriteSession } from "../../hooks/useCourseWriteSession";
import { useActivityCompletion } from "../../hooks/useActivityCompletion";
import { useQuestionHint } from "../../hooks/useQuestionHint";
import { GameQuestionImage } from "../game-topic/GameQuestionImage";
import { IconVolumeButton } from "../game-topic/IconVolumeButton";
import { McProgressHeader } from "../game-topic/McProgressHeader";
import { cn } from "../../lib/utils";
import { WriteEndScreen } from "./WriteEndScreen";

type CourseWriteSessionProps = {
  words: readonly CourseWord[];
  sessionKey: string;
  unitId: string;
};

export function CourseWriteSession({ words, sessionKey, unitId }: CourseWriteSessionProps) {
  const {
    phase,
    word,
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
    playWord,
  } = useCourseWriteSession(words, sessionKey);

  const { rewardToast, onReplay } = useActivityCompletion(unitId, "write", phase === "summary");
  const { hintRevealed, hintControl } = useQuestionHint(word?.id ?? `write-${questionIndex}`);

  const handleReplay = () => {
    onReplay();
    replay();
  };

  if (words.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No vocabulary to write for this unit yet.
      </p>
    );
  }

  if (phase === "summary") {
    return (
      <>
        {rewardToast}
        <WriteEndScreen correctCount={correctCount} total={total} onReplay={handleReplay} />
      </>
    );
  }

  if (!word) return null;

  const hasImage = Boolean(word.imageUrl?.trim());

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !submitted && input.trim()) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <McProgressHeader current={questionIndex + 1} total={total} trailing={hintControl} />

      <div className="rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-md md:p-6">
        {hasImage ? (
          <div className="relative mb-6">
            <GameQuestionImage src={word.imageUrl} />
            <div className="absolute bottom-0 left-0 right-4 flex justify-end py-4">
              <div className="h-20 w-20 rounded-3xl border-b-8 border-green-700 bg-green-500 font-kids text-6xl text-white">
                <IconVolumeButton
                  className="flex h-full w-full cursor-pointer items-center justify-center"
                  onClick={() => void playWord()}
                  aria-label="Hear the word"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 space-y-4 text-center">
            <p className="text-3xl font-bold text-slate-800">{word.translation}</p>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-3xl border-b-8 border-green-700 bg-green-500 font-kids text-6xl text-white">
                <IconVolumeButton
                  className="flex h-full w-full cursor-pointer items-center justify-center"
                  onClick={() => void playWord()}
                  aria-label="Hear the word"
                />
              </div>
            </div>
          </div>
        )}

        {hintRevealed ? (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-center text-sm font-bold text-amber-800">
            Hint: {word.word}
          </p>
        ) : null}

        <label htmlFor="write-answer" className="sr-only">
          Type the English word
        </label>
        <input
          id="write-answer"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitted}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={cn(
            "w-full rounded-xl border-2 px-4 py-3 text-lg font-semibold text-slate-800 outline-none transition-colors",
            "focus:border-sky-400 focus:ring-2 focus:ring-sky-200",
            submitted && result === "correct" && "border-emerald-500 bg-emerald-50",
            submitted && result === "incorrect" && "border-rose-500 bg-rose-50",
            !submitted && "border-slate-200 bg-white",
          )}
          placeholder="Type the word…"
        />

        {submitted && result === "incorrect" ? (
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Correct answer: <span className="text-emerald-700">{word.word}</span>
          </p>
        ) : null}

        {submitted && result === "correct" ? (
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
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
              aria-label={isLast ? "See results" : "Next word"}
            >
              <CircleArrowRightIcon className="h-12 w-12" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
