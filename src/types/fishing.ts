export type FishingVocabItem = {
  id: string;
  word: string;
  imageSrc: string;
  unitId: string;
};

export const FISHING_ROUND = {
  targetsNeeded: 10,
  fishCountMin: 6,
  fishCountMax: 10,
  coinReward: 50,
  diamondReward: 50,
  minPoolSize: 4,
} as const;

export type FishingSessionStatus = "playing" | "won";

export type FishingSessionState = {
  status: FishingSessionStatus;
  correctCount: number;
  currentTarget: FishingVocabItem;
};
