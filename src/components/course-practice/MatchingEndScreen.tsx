import { RotateCcw, Star } from "lucide-react";
import { Confetti } from "../Confetti";
import type { MatchingStars } from "../../types/matchingPairs";
import { cn } from "../../lib/utils";

type MatchingEndScreenProps = {
  stars: MatchingStars;
  moves: number;
  pairCount: number;
  onReplay: () => void;
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-center gap-1" aria-label={`${count} stars`}>
      {Array.from({ length: 3 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-10 transition-transform duration-300",
            i < count ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200",
            i < count && "matching-star-reveal",
          )}
          style={{ animationDelay: `${i * 150}ms` }}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function MatchingEndScreen({ stars, moves, pairCount, onReplay }: MatchingEndScreenProps) {
  return (
    <div className="relative space-y-6">
      <Confetti />

      <div className="rounded-2xl border-2 border-white bg-white p-6 text-center shadow-md">
        <h2 className="text-2xl font-bold text-slate-800">Great job!</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          You matched all {pairCount} pairs in {moves} {moves === 1 ? "move" : "moves"}.
        </p>

        <div className="mt-6">
          <StarRating count={stars} />
        </div>

        <button
          type="button"
          onClick={onReplay}
          className="candy-glass-btn candy-glass-btn--idle mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold"
        >
          <RotateCcw className="size-4" aria-hidden />
          Play again
        </button>
      </div>
    </div>
  );
}
