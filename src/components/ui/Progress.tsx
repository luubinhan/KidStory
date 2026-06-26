import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

type ProgressProps = {
  value: number;
  max?: number;
  className?: string;
  "aria-label"?: string;
};

export function Progress({ value, max = 100, className, "aria-label": ariaLabel }: ProgressProps) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      aria-label={ariaLabel}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-sky-100", className)}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-sky-500 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
