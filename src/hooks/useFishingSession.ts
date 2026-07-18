import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { courseUnits } from "../data/course";
import { buildFishingVocabPool } from "../lib/fishing/buildFishingVocabPool";
import {
  applyFishTap,
  createInitialSession,
} from "../lib/fishing/fishingSession";
import {
  playFishingCoinSound,
  playFishingSuccessSound,
  playFishingWrongSound,
} from "../lib/fishing/fishingSounds";
import { playCourseAudio } from "../lib/playCourseAudio";
import { FISHING_ROUND, type FishingSessionState } from "../types/fishing";
import { useUserProgress } from "../contexts/UserProgressContext";
import type { ActivityRewardResult } from "../types/userProgress";

export function useFishingSession() {
  const { isUnitAccessible, completeGameV2 } = useUserProgress();
  const pool = useMemo(
    () => buildFishingVocabPool(courseUnits, isUnitAccessible),
    [isUnitAccessible],
  );
  const canPlay = pool.length >= FISHING_ROUND.minPoolSize;

  const poolRef = useRef(pool);
  poolRef.current = pool;

  const [session, setSession] = useState<FishingSessionState | null>(null);
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
      setSession(null);
      awardedRef.current = false;
      setReward(null);
      return;
    }
    setSession((prev) => prev ?? createInitialSession(poolRef.current));
  }, [canPlay]);

  useEffect(() => {
    if (!session || session.status !== "won" || awardedRef.current) return;
    awardedRef.current = true;
    const runId = runIdRef.current;
    void completeGameV2("fishing").then((result) => {
      if (result && runIdRef.current === runId) setReward(result);
    });
  }, [session, completeGameV2]);

  const target = session?.status === "playing" ? session.currentTarget : null;

  const playWord = useCallback(() => {
    if (!target) return;
    void playCourseAudio(target.audio, target.word, audioRef, stopAudio);
  }, [target, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [target?.id, session?.correctCount]);

  useEffect(() => {
    if (!target || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    playWord();
  }, [target, playWord]);

  const onFishTap = useCallback(
    (word: string) => {
      if (!session || session.status !== "playing") return { kind: "ignored" as const };
      const result = applyFishTap(session, poolRef.current, word);
      if (result.kind === "wrong") {
        playFishingWrongSound();
        return result;
      }
      playFishingSuccessSound();
      playFishingCoinSound();
      setSession(result.session);
      return result;
    },
    [session],
  );

  const restart = useCallback(() => {
    if (!canPlay) return;
    runIdRef.current += 1;
    awardedRef.current = false;
    setReward(null);
    stopAudio();
    setSession(createInitialSession(poolRef.current));
  }, [canPlay, stopAudio]);

  return {
    pool,
    canPlay,
    session,
    reward,
    onFishTap,
    restart,
    targetsNeeded: FISHING_ROUND.targetsNeeded,
  };
}
