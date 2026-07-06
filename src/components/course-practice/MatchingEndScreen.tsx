import { RotateCcw, Star } from "lucide-react";
import { ActivityEndShell } from "../progress/ActivityEndShell";
import type { MatchingStars } from "../../types/matchingPairs";
import type { ActivityRewardResult } from "../../types/userProgress";
import { cn } from "../../lib/utils";

type MatchingEndScreenProps = {
  stars: MatchingStars;
  moves: number;
  pairCount: number;
  reward: ActivityRewardResult | null;
  onReplay: () => void;
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-center gap-1" aria-label={`${count} stars`}>
      {Array.from({ length: 3 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-10 transition-transform duration-300 border-2 border-white bg-white rounded-full",
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

export function MatchingEndScreen({
  stars,
  moves,
  pairCount,
  reward,
  onReplay,
}: MatchingEndScreenProps) {
  return (
    <ActivityEndShell reward={reward} className="space-y-6">
      <div className="py-6 px-12 text-center backdrop-blur-xs rounded-full">
        <h2 className="text-2xl font-bold text-white">Great job!</h2>
        <p className="mt-2 text-sm font-semibold text-white">
          You matched all {pairCount} pairs in {moves} {moves === 1 ? "move" : "moves"}.
        </p>

        <div className="mt-6">
          <StarRating count={stars} />
        </div>
      </div>

      <button
        type="button"
        onClick={onReplay}
        className="candy-glass-btn candy-glass-btn--idle mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold"
      >
        <RotateCcw className="size-4" aria-hidden />
        Play again
      </button>
    </ActivityEndShell>
  );
}
