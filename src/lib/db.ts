import Dexie, { type Table } from "dexie";
import type { UserProgressV1 } from "../types/userProgress";

export const DB_NAME = "kidstory-user-progress";
export const DB_VERSION = 1;
export const PROGRESS_STORE = "progress";
export const PROGRESS_KEY = "main";

export class KidStoryDB extends Dexie {
  progress!: Table<UserProgressV1, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      [PROGRESS_STORE]: "",
    });
  }
}

export const db = new KidStoryDB();
