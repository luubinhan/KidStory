import type { GameQuestion } from "../../types/game";
import { IconVolumeButton } from "./IconVolumeButton";

type GameQuestionStemProps = {
  q: GameQuestion;
  blankLabel: string | null;
  /** null before an answer is chosen */
  answerCorrect: boolean | null;
  onPlaySentence: () => void;
};

export function GameQuestionStem({
  q,
  blankLabel,
  answerCorrect,
  onPlaySentence,
}: GameQuestionStemProps) {
  const blankTextClass =
    answerCorrect === null
      ? "text-amber-700 border-amber-900"
      : answerCorrect
        ? "text-emerald-600 border-emerald-500"
        : "text-rose-600 border-rose-500";

  return (
    <div className="flex items-start gap-3">
      <p className="min-w-0 flex-1 text-xl font-bold leading-snug text-slate-900 md:text-2xl">
        <span>{q.textBefore}</span>
        <span
          className={`mx-1 inline-block min-w-[5ch] border-b-2 border-dashed px-1 text-center align-baseline ${blankTextClass}`}
        >
          {blankLabel ?? "\u00a0"}
        </span>
        <span>{q.textAfter}</span>
      </p>
      <IconVolumeButton
        onClick={() => void onPlaySentence()}
        aria-label="Play sentence audio"
      />
    </div>
  );
}
