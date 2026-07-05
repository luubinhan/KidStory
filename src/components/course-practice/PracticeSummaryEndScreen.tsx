import { RotateCcw } from "lucide-react";
import { ActivityEndShell } from "../progress/ActivityEndShell";
import type { ActivityRewardResult } from "../../types/userProgress";

type PracticeSummaryEndScreenProps = {
  title?: string;
  subtitle?: string;
  reward: ActivityRewardResult | null;
  onReplay?: () => void;
  replayLabel?: string;
  onContinue?: () => void;
  continueLabel?: string;
};

export function PracticeSummaryEndScreen({
  title = "All done!",
  subtitle,
  reward,
  onReplay,
  replayLabel = "Play again",
  onContinue,
  continueLabel = "Continue",
}: PracticeSummaryEndScreenProps) {
  return (
    <ActivityEndShell reward={reward}>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      {subtitle ? <p className="mt-2 text-lg font-semibold text-slate-600">{subtitle}</p> : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {onReplay ? (
          <button
            type="button"
            onClick={onReplay}
            className="candy-glass-btn candy-glass-btn--idle inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold"
          >
            <RotateCcw className="size-4" aria-hidden />
            {replayLabel}
          </button>
        ) : null}

        {onContinue ? (
          <button
            type="button"
            onClick={onContinue}
            className="candy-glass-btn inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold"
          >
            {continueLabel}
          </button>
        ) : null}
      </div>
    </ActivityEndShell>
  );
}
