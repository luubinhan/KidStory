import type { CourseWord } from "../types/course";
import type { GameQuestion } from "../types/game";

export function buildSpellQuestionsFromWords(
  words: readonly CourseWord[],
): GameQuestion[] {
  return words.map((entry) => ({
    id: `spell-${entry.id}`,
    image: entry.imageUrl || undefined,
    textBefore: "",
    textAfter: "",
    options: [entry.word] as readonly string[],
    correctIndex: 0,
    ...(entry.audio ? { audioUrl: entry.audio } : {}),
  }));
}
