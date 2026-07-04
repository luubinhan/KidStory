import { courseActivities } from "../data/course-activities";
import { courseUnits } from "../data/course";
import type { CourseActivityId, CourseUnit, CourseUnitStatus } from "../types/course";
import type {
  AchievementId,
  ActivityRewardResult,
  UnitProgressInfo,
  UserProgressV1,
} from "../types/userProgress";
import {
  COIN_HINT_COST,
  COIN_PER_ACTIVITY,
  COIN_TREASURE_MIRROR_REWARD,
  COIN_UNIT_BONUS,
  TREASURE_MIRROR_UNITS_REQUIRED,
} from "../types/userProgress";

export function getDefaultProgress(): UserProgressV1 {
  return {
    version: 1,
    coins: 0,
    unitActivityCompletions: {},
    unitBonusClaimed: {},
    achievements: {},
    inventory: [],
  };
}

export function getUnitPracticeActivities(unit: CourseUnit): CourseActivityId[] {
  return courseActivities
    .filter(
      (activity) =>
        activity.id !== "complete-sentence" || unit.typedAnswerQuestions.length > 0,
    )
    .map((activity) => activity.id);
}

export function getCompletedActivities(
  progress: UserProgressV1,
  unitId: string,
): CourseActivityId[] {
  return progress.unitActivityCompletions[unitId] ?? [];
}

export function getUnitProgressInfo(unit: CourseUnit, progress: UserProgressV1): UnitProgressInfo {
  const totalActivities = getUnitPracticeActivities(unit);
  const completedSet = new Set(getCompletedActivities(progress, unit.id));
  const completedCount = totalActivities.filter((id) => completedSet.has(id)).length;
  const totalCount = totalActivities.length;
  const ratio = totalCount === 0 ? 0 : completedCount / totalCount;
  const halfThreshold = Math.ceil(totalCount * 0.5);

  return {
    completedCount,
    totalCount,
    ratio,
    isAtLeastHalf: completedCount >= halfThreshold,
    isFullyComplete: totalCount > 0 && completedCount === totalCount,
  };
}

export function getUnitByNumber(unitNumber: number): CourseUnit | undefined {
  return courseUnits.find((unit) => unit.unitNumber === unitNumber);
}

export function isUnitUnlocked(unit: CourseUnit, progress: UserProgressV1): boolean {
  if (unit.unitNumber === 1) return true;

  const previousUnit = getUnitByNumber(unit.unitNumber - 1);
  if (!previousUnit) return true;

  return getUnitProgressInfo(previousUnit, progress).isAtLeastHalf;
}

export function getUnitsAtLeastHalfComplete(progress: UserProgressV1): number {
  return courseUnits.filter((unit) => getUnitProgressInfo(unit, progress).isAtLeastHalf).length;
}

export function deriveUnitStatuses(progress: UserProgressV1): Map<string, CourseUnitStatus> {
  const statuses = new Map<string, CourseUnitStatus>();
  let currentAssigned = false;

  for (const unit of courseUnits) {
    if (!isUnitUnlocked(unit, progress)) {
      statuses.set(unit.id, "locked");
      continue;
    }

    const { isFullyComplete } = getUnitProgressInfo(unit, progress);
    if (isFullyComplete) {
      statuses.set(unit.id, "completed");
      continue;
    }

    if (!currentAssigned) {
      statuses.set(unit.id, "current");
      currentAssigned = true;
    } else {
      statuses.set(unit.id, "available");
    }
  }

  return statuses;
}

export function getUnitStatus(unit: CourseUnit, progress: UserProgressV1): CourseUnitStatus {
  if (!isUnitUnlocked(unit, progress)) return "locked";

  const { isFullyComplete } = getUnitProgressInfo(unit, progress);
  if (isFullyComplete) return "completed";

  const statuses = deriveUnitStatuses(progress);
  return statuses.get(unit.id) ?? "current";
}

export function isFirstActivityCompletion(
  progress: UserProgressV1,
  unitId: string,
  activityId: CourseActivityId,
): boolean {
  const completed = getCompletedActivities(progress, unitId);
  return !completed.includes(activityId);
}

export function onActivityComplete(
  progress: UserProgressV1,
  unit: CourseUnit,
  activityId: CourseActivityId,
): ActivityRewardResult {
  const next: UserProgressV1 = {
    ...progress,
    unitActivityCompletions: { ...progress.unitActivityCompletions },
    unitBonusClaimed: { ...progress.unitBonusClaimed },
    achievements: { ...progress.achievements },
    inventory: [...progress.inventory],
  };

  let coinsEarned = COIN_PER_ACTIVITY;
  let unitBonusEarned = 0;
  let achievementUnlocked: AchievementId | null = null;
  let achievementReward = 0;

  const isFirstCompletion = isFirstActivityCompletion(next, unit.id, activityId);
  if (isFirstCompletion) {
    const existing = next.unitActivityCompletions[unit.id] ?? [];
    next.unitActivityCompletions[unit.id] = [...existing, activityId];
  }

  const progressInfo = getUnitProgressInfo(unit, next);
  if (progressInfo.isFullyComplete && !next.unitBonusClaimed[unit.id]) {
    next.unitBonusClaimed[unit.id] = true;
    unitBonusEarned = COIN_UNIT_BONUS;
    coinsEarned += unitBonusEarned;
  }

  const unitsAtHalf = getUnitsAtLeastHalfComplete(next);
  if (
    unitsAtHalf >= TREASURE_MIRROR_UNITS_REQUIRED &&
    !next.achievements.treasure_mirror
  ) {
    const unlockedAt = new Date().toISOString();
    next.achievements.treasure_mirror = { unlockedAt, rewardClaimed: true };
    if (!next.inventory.includes("treasure_mirror")) {
      next.inventory.push("treasure_mirror");
    }
    achievementUnlocked = "treasure_mirror";
    achievementReward = COIN_TREASURE_MIRROR_REWARD;
    coinsEarned += achievementReward;
  }

  next.coins += coinsEarned;

  return {
    progress: next,
    coinsEarned,
    activityBonus: COIN_PER_ACTIVITY,
    unitBonusEarned,
    achievementUnlocked,
    achievementReward,
  };
}

export function spendCoins(
  progress: UserProgressV1,
  amount: number,
): { success: true; progress: UserProgressV1 } | { success: false } {
  if (progress.coins < amount) return { success: false };

  return {
    success: true,
    progress: {
      ...progress,
      coins: progress.coins - amount,
    },
  };
}

export function canAffordHint(progress: UserProgressV1): boolean {
  return progress.coins >= COIN_HINT_COST;
}
