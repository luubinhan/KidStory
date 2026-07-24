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
import { getCourseUnitById } from "../data/course";
import { loadUserProgress, saveUserProgress } from "../lib/userProgressDb";
import {
  canAffordHint,
  getDefaultProgress,
  getItemQuantity,
  getUnitProgressInfo,
  getUnitStatus,
  addCoins,
  onActivityComplete,
  onGameV2Complete,
  purchaseShopItem,
  spendCoins,
} from "../lib/userProgressLogic";
import type { CourseActivityId, CourseUnit } from "../types/course";
import type { PurchasableItemId } from "../types/shop";
import type { ActivityRewardResult, UserProgressV1 } from "../types/userProgress";
import { COIN_HINT_COST } from "../types/userProgress";

type UserProgressContextValue = {
  progress: UserProgressV1;
  isLoading: boolean;
  coins: number;
  diamonds: number;
  reloadProgress: () => Promise<void>;
  completeActivity: (
    unitId: string,
    activityId: CourseActivityId,
  ) => Promise<ActivityRewardResult | null>;
  completeGameV2: (gameId: string) => Promise<ActivityRewardResult | null>;
  addCoins: (amount: number) => Promise<void>;
  useHint: () => Promise<boolean>;
  canUseHint: boolean;
  buyShopItem: (itemId: PurchasableItemId) => Promise<boolean>;
  getItemQuantity: (itemId: PurchasableItemId) => number;
  getUnitStatus: (unit: CourseUnit) => ReturnType<typeof getUnitStatus>;
  getUnitProgress: (unit: CourseUnit) => ReturnType<typeof getUnitProgressInfo>;
};

const UserProgressContext = createContext<UserProgressContextValue | null>(null);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgressV1>(getDefaultProgress);
  const [isLoading, setIsLoading] = useState(true);
  const progressRef = useRef(progress);
  progressRef.current = progress;

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

  const reloadProgress = useCallback(async () => {
    const loaded = await loadUserProgress();
    setProgress(loaded);
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

  const completeGameV2 = useCallback(
    async (gameId: string): Promise<ActivityRewardResult | null> => {
      const result = onGameV2Complete(progressRef.current, gameId);
      if (!result) return null;

      await persist(result.progress);
      return result;
    },
    [persist],
  );

  const addCoinsToProgress = useCallback(
    async (amount: number): Promise<void> => {
      const next = addCoins(progressRef.current, amount);
      await persist(next);
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
    async (itemId: PurchasableItemId): Promise<boolean> => {
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
      reloadProgress,
      completeActivity,
      completeGameV2,
      addCoins: addCoinsToProgress,
      useHint,
      canUseHint: canAffordHint(progress),
      buyShopItem,
      getItemQuantity: (itemId: PurchasableItemId) => getItemQuantity(progress, itemId),
      getUnitStatus: (unit) => getUnitStatus(unit, progress),
      getUnitProgress: (unit) => getUnitProgressInfo(unit, progress),
    }),
    [
      progress,
      isLoading,
      reloadProgress,
      completeActivity,
      completeGameV2,
      addCoinsToProgress,
      useHint,
      buyShopItem,
    ],
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
