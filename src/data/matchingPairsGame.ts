import { courseUnits } from "./course";
import type { CourseWord } from "../types/course";

export type MatchingPairsWord = {
  id: string;
  word: string;
  translation: string;
  image: string;
};

export const MATCHING_PAIRS_COUNT = 5;

export function buildMatchingPairsWords(
  units: readonly { words: readonly CourseWord[] }[],
): MatchingPairsWord[] {
  const seen = new Set<string>();
  const words: MatchingPairsWord[] = [];

  for (const unit of units) {
    for (const word of unit.words) {
      const image = word.image?.trim();
      if (!image || seen.has(word.id)) continue;
      seen.add(word.id);
      words.push({
        id: word.id,
        word: word.word,
        translation: word.translation,
        image,
      });
    }
  }

  return words;
}

export const matchingPairsWords = buildMatchingPairsWords(courseUnits);
