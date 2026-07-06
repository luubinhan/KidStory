import type { CourseActivityId } from "../types/course";

export type CourseActivityImages = Record<CourseActivityId, string>;

export const IMAGES_ACTIVITIES = {
  flashcards: "https://luubinhan.github.io/KidStory/map/flashcard.png",
  "multiple-choice": "https://luubinhan.github.io/KidStory/map/multiple-choice.png",
  spell: "https://luubinhan.github.io/KidStory/map/spell.png",
  write: "https://luubinhan.github.io/KidStory/map/write.png",
  sentence: "https://luubinhan.github.io/KidStory/map/sentence.png",
  matching: "https://luubinhan.github.io/KidStory/map/matching.png",
  "complete-sentence": "https://luubinhan.github.io/KidStory/map/complete-sentence.png",
} satisfies CourseActivityImages;

export const ASSETS = {
  coin: "https://luubinhan.github.io/KidStory/images/coin.png",
  diamond: "https://luubinhan.github.io/KidStory/images/diamond.png",
  'back-card': "https://luubinhan.github.io/KidStory/images/back-card.png",
}

export const BG_UNITS = {
  'bg-unit-1': "/images/bg-unit-1.png",
  'bg-unit-2': "/images/bg-unit-2.png",
  'bg-unit-3': "/images/bg-unit-3.png",
  'bg-unit-4': "/images/bg-unit-4.png",
  'bg-unit-5': "/images/bg-unit-5.png",
  'bg-unit-6': "/images/bg-unit-6.png",
  'bg-unit-7': "/images/bg-unit-7.png",
}