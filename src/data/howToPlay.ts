import type { CourseActivityId } from "../types/course";

export const howToPlayHero = {
  title: "How to play",
  subtitle:
    "Wonder Farm teaches English words through units and practice games. This page explains the learning path, each activity, and how rewards work.",
} as const;

export const howToPlaySections = {
  flow: "How the course works",
  activities: "Practice activities",
  rewards: "Coins, diamonds, and the shop",
} as const;

export const howToPlayFlowSteps: readonly string[] = [
  "Open the course map and pick an unlocked unit.",
  "Complete the activities listed on the unit page.",
  "The next unit unlocks when the previous unit has at least half of its activities completed.",
  "Unit 1 is always unlocked.",
];

/** Short parent-facing tips; labels/descriptions come from `courseActivities`. */
export const howToPlayActivityTips: Record<CourseActivityId, string> = {
  flashcards: "Tap a card to flip it and learn the word.",
  "multiple-choice": "Read the sentence and pick the correct word from four choices.",
  sentence: "Drag the word tiles into the correct order to build the sentence.",
  spell: "Drag letters into place to spell the target word.",
  write: "Type the word you see or hear, then check your answer.",
  matching: "Match each word to its picture until every pair is connected.",
  "complete-sentence": "Look at the picture and type the missing word in the sentence.",
};

export const howToPlayCtaLabel = "Start learning" as const;
