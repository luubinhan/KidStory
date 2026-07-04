import type { CourseActivityId } from "./course";

export const COIN_PER_ACTIVITY = 10;
export const COIN_UNIT_BONUS = 100;
export const COIN_TREASURE_MIRROR_REWARD = 1000;
export const COIN_HINT_COST = 1;
export const TREASURE_MIRROR_UNITS_REQUIRED = 5;

export type AchievementId = "treasure_mirror";

export type AchievementRecord = {
  unlockedAt: string;
  rewardClaimed: boolean;
};

export type UserProgressV1 = {
  version: 1;
  coins: number;
  unitActivityCompletions: Record<string, CourseActivityId[]>;
  unitBonusClaimed: Record<string, boolean>;
  achievements: Partial<Record<AchievementId, AchievementRecord>>;
  inventory: string[];
};

export type ActivityRewardResult = {
  progress: UserProgressV1;
  coinsEarned: number;
  activityBonus: number;
  unitBonusEarned: number;
  achievementUnlocked: AchievementId | null;
  achievementReward: number;
};

export type UnitProgressInfo = {
  completedCount: number;
  totalCount: number;
  ratio: number;
  isAtLeastHalf: boolean;
  isFullyComplete: boolean;
};
