import { BadgeCheck, Volume2, X } from "lucide-react";
import { getOptionButtonRingClasses } from "../../lib/gameOptionStyles";

type GameOptionRowProps = {
  displayIdx: number;
  originalIdx: number;
  correctIndex: number;
  label: string;
  pickedDisplayIndex: number | null;
  onPick: (displayIdx: number) => void;
  onPlayWord: (word: string) => void;
};

export function GameOptionRow({
  displayIdx,
  originalIdx,
  correctIndex,
  label,
  pickedDisplayIndex,
  onPick,
  onPlayWord,
}: GameOptionRowProps) {
  const picked = pickedDisplayIndex !== null;
  const isThis = pickedDisplayIndex === displayIdx;
  const correct = originalIdx === correctIndex;
  const ring = getOptionButtonRingClasses({
    displayIdx,
    originalIdx,
    correctIndex,
    pickedDisplayIndex,
  });

  return (
    <div className="flex min-w-0 gap-2 items-stretch">
      <button
        type="button"
        disabled={picked}
        onClick={() => onPick(displayIdx)}
        className={`min-w-0 cursor-pointer flex-1 rounded-xl cursor-pointer border-2 px-4 py-3 text-left text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 disabled:cursor-default inline-flex items-center justify-between gap-2 ${ring}`}
      >
        <span className="min-w-0">{label}</span>
        {picked && isThis ? (
          correct ? (
            <BadgeCheck className="h-6 w-6 shrink-0 text-emerald-700" aria-hidden />
          ) : (
            <X className="h-6 w-6 shrink-0 text-rose-700" aria-hidden />
          )
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => onPlayWord(label)}
        className="shrink-0 cursor-pointer inline-flex w-[3.25rem] items-center justify-center self-stretch rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
        aria-label={`Play “${label}”`}
      >
        <Volume2 className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
