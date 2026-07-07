import type { CourseActivityId } from "../types/course";

export type CourseActivityImages = Record<CourseActivityId, string>;

export const IMAGES_ACTIVITIES = {
  flashcards: "https://luubinhan.github.io/KidStory/map/flashcard.webp",
  "multiple-choice": "https://luubinhan.github.io/KidStory/map/multiple-choice.webp",
  spell: "https://luubinhan.github.io/KidStory/map/spell.webp",
  write: "https://luubinhan.github.io/KidStory/map/write.webp",
  sentence: "https://luubinhan.github.io/KidStory/map/sentence.webp",
  matching: "https://luubinhan.github.io/KidStory/map/matching.webp",
  "complete-sentence": "https://luubinhan.github.io/KidStory/map/complete-sentence.webp",
} satisfies CourseActivityImages;

export const ASSETS = {
  coin: "https://luubinhan.github.io/KidStory/images/coin.webp",
  diamond: "https://luubinhan.github.io/KidStory/images/diamond.webp",
  'back-card': "https://luubinhan.github.io/KidStory/images/back-card.webp",
}

export const BG_UNITS = {
  'bg-unit-1': "https://luubinhan.github.io/KidStory/images/bg-unit-1.webp",
  'bg-unit-2': "https://luubinhan.github.io/KidStory/images/bg-unit-2.webp",
  'bg-unit-3': "https://luubinhan.github.io/KidStory/images/bg-unit-3.webp",
  'bg-unit-4': "https://luubinhan.github.io/KidStory/images/bg-unit-4.webp",
  'bg-unit-5': "https://luubinhan.github.io/KidStory/images/bg-unit-5.webp",
  'bg-unit-6': "https://luubinhan.github.io/KidStory/images/bg-unit-6.webp",
  'bg-unit-7': "https://luubinhan.github.io/KidStory/images/bg-unit-7.webp",
}