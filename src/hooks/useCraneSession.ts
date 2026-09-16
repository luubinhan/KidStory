import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gameUnits } from "../data/course";
import { buildFishingVocabPool } from "../lib/fishing/buildFishingVocabPool";
import {
  applyBoom,
  applyGrab,
  applyWrongCell,
  createRound,
  filterCraneWords,
} from "../lib/crane/craneSession";
import { playCourseAudio } from "../lib/playCourseAudio";
import { CRANE_ROUND, type CraneState } from "../types/crane";
import { useUserProgress } from "../contexts/UserProgressContext";
import type { ActivityRewardResult } from "../types/userProgress";

export function useCraneSession() {
  const { completeGameV2 } = useUserProgress();
  const pool = useMemo(
    () => filterCraneWords(buildFishingVocabPool(gameUnits)),
    [],
  );
  const canPlay = pool.length >= CRANE_ROUND.minPoolSize;

  const poolRef = useRef(pool);
  poolRef.current = pool;

  const [state, setState] = useState<CraneState | null>(null);
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const awardedRef = useRef(false);
  const runIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedRef = useRef(false);

  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  useEffect(() => {
    if (!canPlay) {
      runIdRef.current += 1;
      setState(null);
      awardedRef.current = false;
      setReward(null);
      return;
    }
    setState((prev) => prev ?? createRound(poolRef.current));
  }, [canPlay]);

  useEffect(() => {
    if (!state || state.status !== "complete" || awardedRef.current) return;
    awardedRef.current = true;
    const runId = runIdRef.current;
    void completeGameV2("crane", { diamondsEarned: state.rewardLeft }).then(
      (result) => {
        if (result && runIdRef.current === runId) setReward(result);
      },
    );
  }, [state, completeGameV2]);

  const target =
    state?.status === "playing" ? state.round.target : null;

  const playWord = useCallback(() => {
    if (!target) return;
    void playCourseAudio(target.audio, target.word, audioRef, stopAudio);
  }, [target, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [target?.id]);

  useEffect(() => {
    if (!target || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const id = window.setTimeout(() => {
      playWord();
    }, 1500);
    return () => window.clearTimeout(id);
  }, [target, playWord]);

  const onGrab = useCallback((letter: string) => {
    setState((prev) => (prev ? applyGrab(prev, letter) : prev));
  }, []);

  const onBoom = useCallback(() => {
    setState((prev) => (prev ? applyBoom(prev) : prev));
  }, []);

  const onWrongCell = useCallback(() => {
    setState((prev) => (prev ? applyWrongCell(prev) : prev));
  }, []);

  const restart = useCallback(() => {
    if (!canPlay) return;
    runIdRef.current += 1;
    awardedRef.current = false;
    setReward(null);
    stopAudio();
    setState((prev) =>
      createRound(poolRef.current, prev?.round.target.id),
    );
  }, [canPlay, stopAudio]);

  return {
    canPlay,
    state,
    reward,
    onGrab,
    onBoom,
    onWrongCell,
    restart,
    playWord,
  };
}
