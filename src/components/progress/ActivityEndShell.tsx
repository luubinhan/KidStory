import { useEffect, useRef, type ReactNode } from "react";
import { Confetti } from "../Confetti";
import { playCelebrationSound } from "../../lib/gameCelebrationSound";
import type { ActivityRewardResult } from "../../types/userProgress";
import { ActivityRewardSection } from "./ActivityRewardSection";

type ActivityEndShellProps = {
  reward: ActivityRewardResult | null;
  children: ReactNode;
  className?: string;
};

export function ActivityEndShell({ reward, children, className }: ActivityEndShellProps) {
  const celebratedRef = useRef(false);

  useEffect(() => {
    if (!reward || celebratedRef.current) return;
    celebratedRef.current = true;
    playCelebrationSound();
  }, [reward]);

  return (
    <div className={`relative ${className ?? ""}`}>
      {reward ? <Confetti /> : null}
      <div className="rounded-2xl border-2 border-white bg-white p-6 text-center shadow-md">
        {reward ? (
          <ActivityRewardSection
            coinsEarned={reward.coinsEarned}
            diamondsEarned={reward.diamondsEarned}
            unitBonusEarned={reward.unitBonusEarned}
            achievementReward={reward.achievementReward}
          />
        ) : null}
        {children}
      </div>
    </div>
  );
}
