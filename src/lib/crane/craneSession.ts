import { CRANE_ROUND, type CraneSlot, type CraneState } from "../../types/crane";
import type { FishingVocabItem } from "../../types/fishing";

export function normalizeCraneWord(word: string): string {
  return word.trim().toLowerCase();
}

export function isCraneWord(word: string): boolean {
  const w = normalizeCraneWord(word);
  return (
    w.length >= CRANE_ROUND.minLetters &&
    w.length <= CRANE_ROUND.maxLetters &&
    /^[a-z]+$/.test(w)
  );
}

export function filterCraneWords(
  pool: readonly FishingVocabItem[],
): FishingVocabItem[] {
  return pool.filter((item) => isCraneWord(item.word));
}

export function hintCountForWord(_word: string): number {
  return 0;
}

export function nextLetter(slots: readonly CraneSlot[]): string | null {
  const slot = slots.find((s) => !s.filled);
  return slot ? slot.letter : null;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function pickItem<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

export function createRound(
  pool: readonly FishingVocabItem[],
  previousId?: string,
  random: () => number = Math.random,
): CraneState {
  if (pool.length === 0) {
    throw new Error("createRound requires a non-empty pool");
  }
  const candidates =
    previousId && pool.length > 1
      ? pool.filter((item) => item.id !== previousId)
      : pool;
  const target = pickItem(candidates.length > 0 ? candidates : pool, random);
  const word = normalizeCraneWord(target.word);
  const slots: CraneSlot[] = [...word].map((letter) => ({
    letter,
    filled: false,
  }));
  const fieldLetters = shuffle([...word], random);
  return {
    status: "playing",
    round: { target, word, slots, fieldLetters },
  };
}

export function applyGrab(state: CraneState, letter: string): CraneState {
  if (state.status !== "playing") return state;
  const expected = nextLetter(state.round.slots);
  const got = normalizeCraneWord(letter);
  if (!expected || got !== expected) return state;
  const emptyIndex = state.round.slots.findIndex((s) => !s.filled);
  const slots = state.round.slots.map((s, i) =>
    i === emptyIndex ? { ...s, filled: true } : s,
  );
  const complete = slots.every((s) => s.filled);
  return {
    status: complete ? "complete" : "playing",
    round: { ...state.round, slots },
  };
}

export function applyBoom(state: CraneState): CraneState {
  if (state.status !== "playing") return state;
  return { ...state, status: "failed" };
}
