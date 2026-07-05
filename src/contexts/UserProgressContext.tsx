import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import { getCourseUnitById } from "../data/course";
import { loadUserProgress, saveUserProgress } from "../lib/userProgressDb";
import { activateUnblockAll, isUnblockAllActive } from "../lib/unblockAllUnits";
import {
  canAffordHint,
  getDefaultProgress,
  getItemQuantity,
  getUnitProgressInfo,
  getUnitStatus,
  isUnitUnlocked,
  onActivityComplete,
  purchaseShopItem,
  spendCoins,
} from "../lib/userProgressLogic";
import type { CourseActivityId, CourseUnit } from "../types/course";
import type { ShopItemId } from "../types/shop";
import type { ActivityRewardResult, UserProgressV1 } from "../types/userProgress";
import { COIN_HINT_COST } from "../types/userProgress";

type UserProgressContextValue = {
  progress: UserProgressV1;
  isLoading: boolean;
  coins: number;
  diamonds: number;
  completeActivity: (
    unitId: string,
    activityId: CourseActivityId,
  ) => Promise<ActivityRewardResult | null>;
  useHint: () => Promise<boolean>;
  canUseHint: boolean;
  buyShopItem: (itemId: ShopItemId) => Promise<boolean>;
  getItemQuantity: (itemId: ShopItemId) => number;
  getUnitStatus: (unit: CourseUnit) => ReturnType<typeof getUnitStatus>;
  isUnitAccessible: (unit: CourseUnit) => boolean;
  getUnitProgress: (unit: CourseUnit) => ReturnType<typeof getUnitProgressInfo>;
};

const UserProgressContext = createContext<UserProgressContextValue | null>(null);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const [progress, setProgress] = useState<UserProgressV1>(getDefaultProgress);
  const [isLoading, setIsLoading] = useState(true);
  const [allUnitsUnlocked, setAllUnitsUnlocked] = useState(isUnblockAllActive);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    if (searchParams.get("unblock") === "all") {
      activateUnblockAll();
      setAllUnitsUnlocked(true);
    }
  }, [searchParams]);

  const progressOptions = useMemo(
    () => (allUnitsUnlocked ? { allUnitsUnlocked: true as const } : undefined),
    [allUnitsUnlocked],
  );

  useEffect(() => {
    let cancelled = false;

    loadUserProgress()
      .then((loaded) => {
        if (!cancelled) setProgress(loaded);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: UserProgressV1) => {
    setProgress(next);
    await saveUserProgress(next);
  }, []);

  const completeActivity = useCallback(
    async (unitId: string, activityId: CourseActivityId): Promise<ActivityRewardResult | null> => {
      const unit = getCourseUnitById(unitId);
      if (!unit) return null;

      const result = onActivityComplete(progressRef.current, unit, activityId);
      await persist(result.progress);
      return result;
    },
    [persist],
  );

  const useHint = useCallback(async (): Promise<boolean> => {
    const result = spendCoins(progressRef.current, COIN_HINT_COST);
    if (!result.success) return false;

    await persist(result.progress);
    return true;
  }, [persist]);

  const buyShopItem = useCallback(
    async (itemId: ShopItemId): Promise<boolean> => {
      const result = purchaseShopItem(progressRef.current, itemId);
      if (!result.success) return false;

      await persist(result.progress);
      return true;
    },
    [persist],
  );

  const value = useMemo<UserProgressContextValue>(
    () => ({
      progress,
      isLoading,
      coins: progress.coins,
      diamonds: progress.diamonds,
      completeActivity,
      useHint,
      canUseHint: canAffordHint(progress),
      buyShopItem,
      getItemQuantity: (itemId: ShopItemId) => getItemQuantity(progress, itemId),
      getUnitStatus: (unit) => getUnitStatus(unit, progress, progressOptions),
      isUnitAccessible: (unit) => isUnitUnlocked(unit, progress, progressOptions),
      getUnitProgress: (unit) => getUnitProgressInfo(unit, progress),
    }),
    [progress, isLoading, completeActivity, useHint, buyShopItem, progressOptions],
  );

  return (
    <UserProgressContext.Provider value={value}>{children}</UserProgressContext.Provider>
  );
}

export function useUserProgress(): UserProgressContextValue {
  const ctx = useContext(UserProgressContext);
  if (!ctx) {
    throw new Error("useUserProgress must be used within UserProgressProvider");
  }
  return ctx;
}
