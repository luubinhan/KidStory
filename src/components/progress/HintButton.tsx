import { Lightbulb } from "lucide-react";
import { useUserProgress } from "../../contexts/UserProgressContext";
import { COIN_HINT_COST } from "../../types/userProgress";
import { cn } from "../../lib/utils";
import { ASSETS } from "@/src/constants/images";

type HintButtonProps = {
  onHint: () => void | Promise<void>;
  className?: string;
  disabled?: boolean;
};

export function HintButton({ onHint, className, disabled = false }: HintButtonProps) {
  const { canUseHint } = useUserProgress();

  const isDisabled = disabled || !canUseHint;

  return (
    <button
      type="button"
      onClick={() => void onHint()}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-colors",
        isDisabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100",
        className,
      )}
      aria-label={`Hint, costs ${COIN_HINT_COST} coin`}
    >
      <Lightbulb className="size-3.5" aria-hidden />
      Hint <img src={ASSETS.coin} alt="coin" className="inline-block h-3" /> -{COIN_HINT_COST}
    </button>
  );
}
