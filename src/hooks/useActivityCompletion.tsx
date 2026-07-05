import { useCallback, useEffect, useRef, useState } from "react";
import { useUserProgress } from "../contexts/UserProgressContext";
import type { CourseActivityId } from "../types/course";
import { formatActivityReward, RewardToast } from "../components/progress/RewardToast";

export function useActivityCompletion(
  unitId: string | undefined,
  activityId: CourseActivityId | undefined,
  isComplete: boolean,
) {
  const { completeActivity } = useUserProgress();
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const sessionKeyRef = useRef(0);
  const awardedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!isComplete || !unitId || !activityId) return;

    const sessionKey = sessionKeyRef.current;
    if (awardedRef.current.has(sessionKey)) return;

    awardedRef.current.add(sessionKey);

    void completeActivity(unitId, activityId).then((result) => {
      if (!result) return;
      setRewardMessage(
        formatActivityReward(
          result.coinsEarned,
          result.unitBonusEarned,
          result.achievementUnlocked,
          result.achievementReward,
          result.diamondsEarned,
        ),
      );
    });
  }, [isComplete, unitId, activityId, completeActivity]);

  const onReplay = useCallback(() => {
    sessionKeyRef.current += 1;
    setRewardMessage(null);
  }, []);

  const rewardToast = (
    <RewardToast message={rewardMessage} onDone={() => setRewardMessage(null)} />
  );

  return { rewardToast, onReplay, rewardMessage };
}

export async function completeActivityOnce(
  completeActivity: ReturnType<typeof useUserProgress>["completeActivity"],
  unitId: string,
  activityId: CourseActivityId,
): Promise<string | null> {
  const result = await completeActivity(unitId, activityId);
  if (!result) return null;

  return formatActivityReward(
    result.coinsEarned,
    result.unitBonusEarned,
    result.achievementUnlocked,
    result.achievementReward,
    result.diamondsEarned,
  );
}
