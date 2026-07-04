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
      <Coins className={cn("shrink-0 text-amber-500", size === "sm" ? "size-3.5" : "size-4")} aria-hidden />
      <span>{isLoading ? "…" : coins}</span>
    </div>
  );
}
