import type { GameQuestion } from "../types/game";

/** Words of the correct sentence: textBefore + correct option + textAfter, split on whitespace. */
export function sentenceWordsFromQuestion(q: GameQuestion): string[] {
  const answer = q.options[q.correctIndex] ?? "";
  const raw = `${q.textBefore}${answer}${q.textAfter}`.replace(/\s+/g, " ").trim();
  if (!raw) return [];
  return raw.split(/\s+/).filter(Boolean);
}
