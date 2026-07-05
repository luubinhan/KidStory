import Lottie from "lottie-react";
import treasureCoinAnimation from "../../assets/treasure-coin.json";
import treasureDiamondCoinAnimation from "../../assets/treasure-diamond-coin.json";
import type { ActivityRewardResult } from "../../types/userProgress";

type ActivityRewardSectionProps = Pick<
  ActivityRewardResult,
  "coinsEarned" | "diamondsEarned" | "unitBonusEarned" | "achievementReward"
>;

export function ActivityRewardSection({
  coinsEarned,
  diamondsEarned,
  unitBonusEarned,
  achievementReward,
}: ActivityRewardSectionProps) {
  const activityCoins = coinsEarned - unitBonusEarned - achievementReward;
  const animationData = diamondsEarned > 0 ? treasureDiamondCoinAnimation : treasureCoinAnimation;

  return (
    <div className="mb-6 space-y-4" role="status" aria-live="polite">
      <div className="mx-auto h-36 w-36">
        <Lottie animationData={animationData} loop={false} className="h-full w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
          <img
            src={import.meta.env.DEV ? "/images/coin.png" : "images/coin.png"}
            alt=""
            className="h-4 w-4"
            aria-hidden
          />
          +{activityCoins}
        </span>

        {diamondsEarned > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-800">
            <img
              src={import.meta.env.DEV ? "/images/diamond.png" : "images/diamond.png"}
              alt=""
              className="h-4 w-4"
              aria-hidden
            />
            +{diamondsEarned}
          </span>
        ) : null}
      </div>

      {unitBonusEarned > 0 ? (
        <p className="text-sm font-semibold text-emerald-700">+{unitBonusEarned} unit bonus</p>
      ) : null}

      {achievementReward > 0 ? (
        <p className="text-sm font-semibold text-violet-700">+{achievementReward} treasure reward</p>
      ) : null}
    </div>
  );
}
