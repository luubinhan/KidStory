import type { FishingVocabItem } from "./fishing";

export const CRANE_ROUND = {
  minLetters: 3,
  maxLetters: 8,
  speedPxPerSec: 280,
  flyToSlotMs: 280,
  minPoolSize: 1,
} as const;

export type CraneStatus = "playing" | "complete";

export type CraneSlot = {
  letter: string;
  filled: boolean;
};

export type CraneRound = {
  target: FishingVocabItem;
  word: string;
  slots: CraneSlot[];
  fieldLetters: string[];
};

export type CraneState = {
  status: CraneStatus;
  round: CraneRound;
};
