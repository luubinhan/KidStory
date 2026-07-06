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
      className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-200/20", className)}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full bg-green-400 transition-transform duration-300 ease-out",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
