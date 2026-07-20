import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

type ProgressProps = {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  "aria-label"?: string;
};

export function Progress({
  value,
  max = 100,
  className,
  indicatorClassName,
  "aria-label": ariaLabel,
}: ProgressProps) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      aria-label={ariaLabel}
      className={cn("h-2 w-full overflow-hidden rounded-full brightness-120 shadow-sm backdrop-blur-md inset-shadow-sm inset-shadow-white/80 bg-white/30 border border-emerald-200/30 backdrop-saturate-150", className)}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full bg-linear-to-r from-green-600 to-green-500 transition-transform duration-300 ease-out rounded-xs inset-shadow-xs inset-shadow-black/20 ring ring-white/90",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
