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
    <div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-2">
      <button
        type="button"
        disabled={picked}
        onClick={() => onPick(displayIdx)}
        className={`inline-flex min-h-0 min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 rounded-2xl border-2 px-5 py-4 text-left text-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 disabled:cursor-default ${ring}`}
      >
        <span className="min-w-0">{label}</span>
        {picked && isThis ? (
          correct ? (
            <BadgeCheck className="size-6 shrink-0 text-emerald-700" aria-hidden />
          ) : (
            <X className="size-6 shrink-0 text-rose-700" aria-hidden />
          )
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => onPlayWord(label)}
        className="inline-flex w-[3.25rem] shrink-0 cursor-pointer items-center justify-center self-stretch rounded-2xl border-2 border-slate-200 bg-white text-slate-700 transition-colors hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
        aria-label={`Play “${label}”`}
      >
        <Volume2 className="size-5" aria-hidden />
      </button>
    </div>
  );
}
