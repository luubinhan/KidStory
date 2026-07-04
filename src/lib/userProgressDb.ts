import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { UserProgressV1 } from "../types/userProgress";
import { getDefaultProgress } from "./userProgressLogic";

const DB_NAME = "kidstory-user-progress";
const DB_VERSION = 1;
const STORE_NAME = "progress";
const PROGRESS_KEY = "main";

interface KidStoryProgressDB extends DBSchema {
  progress: {
    key: string;
    value: UserProgressV1;
  };
}

let dbPromise: Promise<IDBPDatabase<KidStoryProgressDB>> | null = null;

function getDb(): Promise<IDBPDatabase<KidStoryProgressDB>> {
  if (!dbPromise) {
    dbPromise = openDB<KidStoryProgressDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function loadUserProgress(): Promise<UserProgressV1> {
  const db = await getDb();
  const stored = await db.get(STORE_NAME, PROGRESS_KEY);
  return stored ?? getDefaultProgress();
}

export async function saveUserProgress(progress: UserProgressV1): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, progress, PROGRESS_KEY);
}

export { getDefaultProgress };
