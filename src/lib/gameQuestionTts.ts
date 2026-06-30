import type { GameQuestion } from "../types/game";
import { sentenceWordsFromQuestion } from "./gameSentenceWords";

/** Fill-in stem with a blank (for spell mode / before the answer is known). */
export function ttsSentence(q: GameQuestion): string {
  return `${q.textBefore.trimEnd()} … ${q.textAfter.trimStart()}`;
}

/** Complete sentence with the correct option filled in. */
export function ttsFullSentence(q: GameQuestion): string {
  return sentenceWordsFromQuestion(q).join(" ");
}
