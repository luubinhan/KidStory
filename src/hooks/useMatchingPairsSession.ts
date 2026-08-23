import { useCallback, useEffect, useRef, useState } from "react";
import {
  MATCHING_PAIRS_COUNT,
  matchingPairsWords,
  type MatchingPairsWord,
} from "../data/matchingPairsGame";
import { useUserProgress } from "../contexts/UserProgressContext";
import { useCourseMatching } from "./useCourseMatching";
import { sampleMatchingPairs } from "../lib/sampleMatchingPairs";
import type { CourseDictionaryEntry } from "../types/course";
import type { ActivityRewardResult } from "../types/userProgress";

function toEntries(words: readonly MatchingPairsWord[]): CourseDictionaryEntry[] {
  return words.map((word) => ({
    id: word.id,
    word: word.word,
    translation: word.translation,
    image: word.image,
    unitId: "matching-pairs",
    unitNumber: 0,
  }));
}

function nextEntries(): CourseDictionaryEntry[] {
  return toEntries(sampleMatchingPairs(matchingPairsWords, MATCHING_PAIRS_COUNT));
}

export function useMatchingPairsSession() {
  const { completeGameV2 } = useUserProgress();
  const [entries, setEntries] = useState<CourseDictionaryEntry[]>(() => nextEntries());
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const awardedRef = useRef(false);
  const runIdRef = useRef(0);

  const canPlay = entries.length === MATCHING_PAIRS_COUNT;

  const matching = useCourseMatching(entries);

  useEffect(() => {
    if (!matching.isComplete || awardedRef.current) return;
    awardedRef.current = true;
    const runId = runIdRef.current;
    void completeGameV2("matching-pairs").then((result) => {
      if (result && runIdRef.current === runId) setReward(result);
    });
  }, [matching.isComplete, completeGameV2]);

  const restart = useCallback(() => {
    runIdRef.current += 1;
    awardedRef.current = false;
    setReward(null);
    setEntries(nextEntries());
  }, []);

  return {
    canPlay,
    entryMap: matching.entryMap,
    cards: matching.cards,
    phase: matching.phase,
    pairCount: matching.pairCount,
    isComplete: matching.isComplete,
    mismatchCardIds: matching.mismatchCardIds,
    recentMatchPairIds: matching.recentMatchPairIds,
    selectCard: matching.selectCard,
    reward,
    restart,
  };
}
