import type { UserProgressV1 } from "../types/userProgress";
import { getDefaultProgress, normalizeInventory } from "./userProgressLogic";
import { db, PROGRESS_KEY, PROGRESS_STORE } from "./db";

export async function loadUserProgress(): Promise<UserProgressV1> {
  const stored = await db.table(PROGRESS_STORE).get(PROGRESS_KEY);
  if (!stored) return getDefaultProgress();

  const inventory = normalizeInventory(
    stored.inventory as string[] | Record<string, number>,
  );

  return {
    ...stored,
    diamonds: stored.diamonds ?? 0,
    inventory,
  };
}

export async function saveUserProgress(progress: UserProgressV1): Promise<void> {
  await db.table(PROGRESS_STORE).put(progress, PROGRESS_KEY);
}

export { getDefaultProgress };
