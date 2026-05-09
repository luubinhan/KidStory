import { CircleArrowRightIcon, TrophyIcon } from "lucide-react";

type GameQuestionFooterProps = {
  isLast: boolean;
  onNext: () => void;
};

export function GameQuestionFooter({ isLast, onNext }: GameQuestionFooterProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          className="cursor-pointer items-center rounded-full border-2 border-blue-400 bg-blue-500 text-white hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
        >
          <CircleArrowRightIcon className="h-12 w-12" aria-hidden />
        </button>
      ) : (
        <p className="text-sm font-medium text-slate-600"><TrophyIcon className="h-12 w-12" aria-hidden /></p>
      )}
    </div>
  );
}
