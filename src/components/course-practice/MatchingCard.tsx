import type { MatchingCard as MatchingCardData } from "../../types/matchingPairs";
import { cn } from "../../lib/utils";
import { CourseWordImage } from "../course/CourseWordImage";

type MatchingCardProps = {
  card: MatchingCardData;
  label: string;
  disabled: boolean;
  isMismatch: boolean;
  isRecentMatch: boolean;
  onSelect: (cardId: string) => void;
};

export function MatchingCard({
  card,
  label,
  disabled,
  isMismatch,
  isRecentMatch,
  onSelect,
}: MatchingCardProps) {
  const isRevealed = card.state === "flipped" || card.state === "matched";
  const isAnimating = isMismatch || isRecentMatch;

  return (
    <button
      type="button"
      disabled={disabled || card.state === "matched"}
      onClick={() => onSelect(card.id)}
      className={cn(
        "matching-card cursor-pointer aspect-[2/2] w-full min-w-[72px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        isAnimating && "pointer-events-none",
        card.state === "matched" && "pointer-events-none",
      )}
      aria-label={
        card.type === "image"
          ? isRevealed
            ? label
            : "Hidden picture card"
          : isRevealed
            ? card.content
            : "Hidden word card"
      }
    >
      <div
        className={cn(
          "matching-card-inner h-full w-full",
          isRevealed && "matching-card-inner--flipped",
          isMismatch && "matching-card-inner--shake",
          isRecentMatch && "matching-card-inner--match",
        )}
      >
        <div className="matching-card-face matching-card-face--front" aria-hidden={isRevealed}>
          <span className="text-2xl text-sky-200/90">?</span>
        </div>

        <div className="matching-card-face matching-card-face--back" aria-hidden={!isRevealed}>
          {card.type === "image" ? (
            <CourseWordImage imageUrl={card.content} translation={card.translation} fallbackClassName="size-14" />
          ) : (
            <span className="px-2 text-center text-lg font-bold font-kids text-slate-800">
              {card.content}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
