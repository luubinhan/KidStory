import { Progress } from "../ui";
import type { ReactNode } from "react";

type McProgressHeaderProps = {
  current: number;
  total: number;
  trailing?: ReactNode;
};

export function McProgressHeader({ current, total, trailing }: McProgressHeaderProps) {
  return (
    <div className="mb-4 shrink-0 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Progress
          value={current}
          max={total}
          className="h-2.5 flex-1 bg-slate-200"
          indicatorClassName="bg-emerald-500"
          aria-label={`Question ${current} of ${total}`}
        />
        {trailing}
      </div>
      <p className="text-sm font-bold text-emerald-600" aria-live="polite">
        {current}/{total}
      </p>
    </div>
  );
}
