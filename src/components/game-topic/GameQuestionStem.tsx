import type { GameQuestion } from "../../types/game";
import { IconVolumeButton } from "./IconVolumeButton";

type GameQuestionStemProps = {
  q: GameQuestion;
  blankLabel: string | null;
  onPlaySentence: () => void;
};

export function GameQuestionStem({ q, blankLabel, onPlaySentence }: GameQuestionStemProps) {
  return (
    <div className="flex flex-wrap items-start gap-2 gap-y-3 mb-5">
      <p className="text-lg md:text-xl text-slate-900 leading-relaxed flex-1 min-w-0">
        <span>{q.textBefore}</span>
        <span className="inline-block min-w-[5ch] mx-1 border-b-2 border-dashed border-slate-400 align-baseline text-center font-semibold text-yellow-800">
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
