import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CourseDictionaryEntry } from "../types/course";
import {
  buildCardsFromEntries,
  calcStars,
  type MatchingCard,
  type MatchingGamePhase,
  type MatchingStars,
} from "../types/matchingPairs";

const FLIP_BACK_MS = 1200;

function updateCard(cards: MatchingCard[], cardId: string, state: MatchingCard["state"]): MatchingCard[] {
  return cards.map((card) => (card.id === cardId ? { ...card, state } : card));
}

function updateCards(
  cards: MatchingCard[],
  cardIds: readonly string[],
  state: MatchingCard["state"],
): MatchingCard[] {
  const idSet = new Set(cardIds);
  return cards.map((card) => (idSet.has(card.id) ? { ...card, state } : card));
}

export function useCourseMatching(entries: readonly CourseDictionaryEntry[]) {
  const pairCount = entries.length;

  const entryMap = useMemo(
    () => new Map(entries.map((entry) => [entry.id, entry])),
    [entries],
  );

  const [sessionKey, setSessionKey] = useState(0);
  const [cards, setCards] = useState<MatchingCard[]>(() => buildCardsFromEntries(entries));
  const [phase, setPhase] = useState<MatchingGamePhase>("idle");
  const [firstCardId, setFirstCardId] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [mismatchCardIds, setMismatchCardIds] = useState<readonly string[]>([]);
  const [recentMatchPairIds, setRecentMatchPairIds] = useState<readonly string[]>([]);

  const flipBackTimeoutRef = useRef<number | null>(null);
  const matchGlowTimeoutRef = useRef<number | null>(null);

  const matchedCount = useMemo(
    () => cards.filter((card) => card.state === "matched").length / 2,
    [cards],
  );

  const isComplete = pairCount > 0 && matchedCount === pairCount;
  const stars: MatchingStars = isComplete ? calcStars(moves, pairCount) : 0;

  const clearTimers = useCallback(() => {
    if (flipBackTimeoutRef.current !== null) {
      window.clearTimeout(flipBackTimeoutRef.current);
      flipBackTimeoutRef.current = null;
    }
    if (matchGlowTimeoutRef.current !== null) {
      window.clearTimeout(matchGlowTimeoutRef.current);
      matchGlowTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimers();
    setCards(buildCardsFromEntries(entries));
    setPhase("idle");
    setFirstCardId(null);
    setMoves(0);
    setMismatchCardIds([]);
    setRecentMatchPairIds([]);
  }, [entries, sessionKey, clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const selectCard = useCallback(
    (cardId: string) => {
      if (phase === "resolving") return;

      const card = cards.find((item) => item.id === cardId);
      if (!card || card.state !== "hidden") return;

      if (phase === "idle") {
        setCards((prev) => updateCard(prev, cardId, "flipped"));
        setFirstCardId(cardId);
        setPhase("card1Selected");
        return;
      }

      if (!firstCardId || firstCardId === cardId) return;

      const firstCard = cards.find((item) => item.id === firstCardId);
      if (!firstCard) return;

      setMoves((prev) => prev + 1);
      setCards((prev) => updateCard(updateCard(prev, firstCardId, "flipped"), cardId, "flipped"));
      setPhase("resolving");

      if (firstCard.pairId === card.pairId) {
        setRecentMatchPairIds([firstCard.pairId]);

        matchGlowTimeoutRef.current = window.setTimeout(() => {
          setRecentMatchPairIds([]);
          matchGlowTimeoutRef.current = null;
        }, 500);

        setCards((prev) =>
          updateCards(prev, [firstCardId, cardId], "matched"),
        );
        setFirstCardId(null);
        setPhase("idle");
        return;
      }

      setMismatchCardIds([firstCardId, cardId]);

      flipBackTimeoutRef.current = window.setTimeout(() => {
        setCards((prev) => updateCards(prev, [firstCardId, cardId], "hidden"));
        setMismatchCardIds([]);
        setFirstCardId(null);
        setPhase("idle");
        flipBackTimeoutRef.current = null;
      }, FLIP_BACK_MS);
    },
    [cards, firstCardId, phase],
  );

  const replay = useCallback(() => {
    clearTimers();
    setSessionKey((prev) => prev + 1);
  }, [clearTimers]);

  return {
    entryMap,
    cards,
    phase,
    moves,
    pairCount,
    matchedCount,
    isComplete,
    stars,
    mismatchCardIds,
    recentMatchPairIds,
    selectCard,
    replay,
  };
}
