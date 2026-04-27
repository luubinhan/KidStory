import type { GameQuestion } from "../types/game";

export function ttsSentence(q: GameQuestion): string {
  return `${q.textBefore.trimEnd()} … ${q.textAfter.trimStart()}`;
}
