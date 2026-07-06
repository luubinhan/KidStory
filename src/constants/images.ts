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
}