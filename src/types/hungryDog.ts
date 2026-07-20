import type { FishingVocabItem } from "./fishing";

export type HungryDogVocabItem = FishingVocabItem;

export type LessonStatus = "playing" | "complete";

export type PuppyAnim = "idle" | "hungry" | "ready" | "eating" | "happy" | "wrong";

export type RoundState = {
  target: HungryDogVocabItem;
  choices: [
    HungryDogVocabItem,
    HungryDogVocabItem,
    HungryDogVocabItem,
    HungryDogVocabItem,
  ];
};

export type LessonState = {
  status: LessonStatus;
  correctCount: number;
  round: RoundState;
  sessionCoins: number;
};

export const HUNGRY_DOG_ROUND = {
  targetsNeeded: 5,
  choicesCount: 4,
  distractorsCount: 3,
  minPoolSize: 4,
  coinPerCorrect: 1,
  hungerMs: 60 * 60 * 1000,
} as const;

export type DropResult =
  | { kind: "wrong"; lesson: LessonState }
  | { kind: "correct"; lesson: LessonState };
