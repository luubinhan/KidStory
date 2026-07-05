import { RotateCcw } from "lucide-react";
import { ActivityEndShell } from "../progress/ActivityEndShell";
import type { ActivityRewardResult } from "../../types/userProgress";

type WriteEndScreenProps = {
  correctCount: number;
  total: number;
  reward: ActivityRewardResult | null;
  onReplay: () => void;
};

export function WriteEndScreen({ correctCount, total, reward, onReplay }: WriteEndScreenProps) {
  return (
    <ActivityEndShell reward={reward}>
      <h2 className="text-2xl font-bold text-slate-800">All done!</h2>
      <p className="mt-2 text-lg font-semibold text-slate-600">
        You got {correctCount}/{total} correct
      </p>
      <button
        type="button"
        onClick={onReplay}
        className="candy-glass-btn candy-glass-btn--idle mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold"
      >
        <RotateCcw className="size-4" aria-hidden />
        Play again
      </button>
    </ActivityEndShell>
  );
}
