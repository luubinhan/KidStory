import { useCallback, useMemo, useState } from "react";
import type { CourseDictionaryEntry } from "../types/course";

function shuffleEntries(entries: readonly CourseDictionaryEntry[]): CourseDictionaryEntry[] {
  const copy = [...entries];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function useCourseFlashcards(entries: readonly CourseDictionaryEntry[]) {
  const deck = useMemo(() => shuffleEntries(entries), [entries]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const current = deck[index];
  const total = deck.length;
  const canGoPrev = index > 0;
  const canGoNext = index < total - 1;

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    setIndex((prev) => prev - 1);
    setIsFlipped(false);
  }, [canGoPrev]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    setIndex((prev) => prev + 1);
    setIsFlipped(false);
  }, [canGoNext]);

  return {
    deck,
    current,
    index,
    total,
    isFlipped,
    canGoPrev,
    canGoNext,
    flip,
    goPrev,
    goNext,
  };
}
