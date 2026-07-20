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
          className="h-2.5 flex-1"
          indicatorClassName=""
          aria-label={`Question ${current} of ${total}`}
        />
        {trailing}
        <p className="text-md font-bold text-slate-800 text-shadow-[0_1px_0px_rgb(255_255_255_/1)]" aria-live="polite">
          {current}/{total}
        </p>
      </div>
     
    </div>
  );
}
