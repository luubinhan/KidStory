import { CircleArrowRightIcon, TrophyIcon, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

type GameQuestionFooterProps = {
  isLast: boolean;
  onNext: () => void;
  lastAction?: "home" | "next";
};

export function GameQuestionFooter({ isLast, onNext, lastAction = "home" }: GameQuestionFooterProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {!isLast || lastAction === "next" ? (
        <button
          type="button"
          onClick={onNext}
          className="cursor-pointer items-center rounded-full border-2 border-blue-400 bg-blue-500 text-white hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
          aria-label={isLast ? "See results" : "Next question"}
        >
          <CircleArrowRightIcon className="h-12 w-12" aria-hidden />
        </button>
      ) : (
        <>
          <p className="text-sm font-medium text-slate-600">
            <TrophyIcon className="h-12 w-12" aria-hidden />
          </p>
          <Link
            to="/"
            className="cursor-pointer items-center rounded-xl border-2 border-blue-400 bg-blue-500 text-white hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
          >
            <HomeIcon className="h-12 w-12" aria-hidden />
          </Link>
        </>
      )}
    </div>
  );
}
