import { useCallback, useEffect, useRef, useState } from "react";
import { useUserProgress } from "../contexts/UserProgressContext";
import type { CourseActivityId } from "../types/course";
import type { ActivityRewardResult } from "../types/userProgress";

export function useActivityCompletion(
  unitId: string | undefined,
  activityId: CourseActivityId | undefined,
  isComplete: boolean,
) {
  const { completeActivity } = useUserProgress();
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const sessionKeyRef = useRef(0);
  const awardedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!isComplete || !unitId || !activityId) return;

    const sessionKey = sessionKeyRef.current;
    if (awardedRef.current.has(sessionKey)) return;

    awardedRef.current.add(sessionKey);

    void completeActivity(unitId, activityId).then((result) => {
      if (!result) return;
      setReward(result);
    });
  }, [isComplete, unitId, activityId, completeActivity]);

  const onReplay = useCallback(() => {
    sessionKeyRef.current += 1;
    setReward(null);
  }, []);

  return { reward, onReplay };
}

export async function completeActivityOnce(
  completeActivity: ReturnType<typeof useUserProgress>["completeActivity"],
  unitId: string,
  activityId: CourseActivityId,
): Promise<ActivityRewardResult | null> {
  return completeActivity(unitId, activityId);
}
