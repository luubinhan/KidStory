import type { CourseDictionaryEntry } from "./course";

export type MatchingCardState = "hidden" | "flipped" | "matched";
export type MatchingCardType = "image" | "word";

export type MatchingCard = {
  id: string;
  pairId: string;
  type: MatchingCardType;
  content: string;
  state: MatchingCardState;
};

export type MatchingGamePhase = "idle" | "card1Selected" | "resolving";

export type MatchingStars = 0 | 1 | 2 | 3;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function buildCardsFromEntries(entries: readonly CourseDictionaryEntry[]): MatchingCard[] {
  const cards = entries.flatMap((entry) => [
    {
      id: `${entry.id}-image`,
      pairId: entry.id,
      type: "image" as const,
      content: entry.emoji,
      state: "hidden" as const,
    },
    {
      id: `${entry.id}-word`,
      pairId: entry.id,
      type: "word" as const,
      content: entry.word,
      state: "hidden" as const,
    },
  ]);

  return shuffle(cards);
}

export function calcStars(moves: number, pairCount: number): MatchingStars {
  if (pairCount === 0) return 0;
  if (moves <= pairCount + 2) return 3;
  if (moves <= pairCount + 6) return 2;
  return 1;
}
