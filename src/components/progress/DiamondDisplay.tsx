import { ASSETS } from "../../constants/images";
import { useUserProgress } from "../../contexts/UserProgressContext";
import { cn } from "../../lib/utils";

type DiamondDisplayProps = {
  className?: string;
  size?: "sm" | "md";
};

export function DiamondDisplay({ className, size = "md" }: DiamondDisplayProps) {
  const { diamonds, isLoading } = useUserProgress();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 font-bold text-sky-800",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "text-sm",
        className,
      )}
      aria-label={`${isLoading ? 0 : diamonds} diamonds`}
    >
      <img
        src={ASSETS.diamond}
        alt=""
        className="h-[16px]"
        aria-hidden
      />
      <span>{isLoading ? "…" : diamonds}</span>
    </div>
  );
}
