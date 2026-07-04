import { Coins } from "lucide-react";
import { useUserProgress } from "../../contexts/UserProgressContext";
import { cn } from "../../lib/utils";

type CoinDisplayProps = {
  className?: string;
  size?: "sm" | "md";
};

export function CoinDisplay({ className, size = "md" }: CoinDisplayProps) {
  const { coins, isLoading } = useUserProgress();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-800",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "text-sm",
        className,
      )}
      aria-label={`${isLoading ? 0 : coins} coins`}
    >
      <img src="/assets/coin.png" alt={coins.toString()} className="h-[16px]" />
      <span>{isLoading ? "…" : coins}</span>
    </div>
  );
}
