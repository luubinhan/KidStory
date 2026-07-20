import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { courseUnits } from "../data/course";
import { buildFishingVocabPool } from "../lib/fishing/buildFishingVocabPool";
import { createInitialLesson, applyDrop } from "../lib/hungry-dog/hungryDogSession";
import {
  getLastEatAt,
  isHungry,
  setLastEatAt,
} from "../lib/hungry-dog/hungryDogHunger";
import {
  playHungryDogCorrectSound,
  playHungryDogWrongSound,
} from "../lib/hungry-dog/hungryDogSounds";
import { playCourseAudio } from "../lib/playCourseAudio";
import {
  HUNGRY_DOG_ROUND,
  type LessonState,
  type PuppyAnim,
} from "../types/hungryDog";
import { useUserProgress } from "../contexts/UserProgressContext";
import type { ActivityRewardResult } from "../types/userProgress";

export function useHungryDogSession() {
  const { isUnitAccessible, addCoins, completeGameV2 } = useUserProgress();
  const pool = useMemo(
    () => buildFishingVocabPool(courseUnits, isUnitAccessible),
    [isUnitAccessible],
  );
  const canPlay = pool.length >= HUNGRY_DOG_ROUND.minPoolSize;

  const poolRef = useRef(pool);
  poolRef.current = pool;

  const [lesson, setLesson] = useState<LessonState | null>(null);
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const [lastEatAt, setLastEatAtState] = useState<number | null>(() => getLastEatAt());
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
      setLesson(null);
      awardedRef.current = false;
      setReward(null);
      return;
    }
    setLesson((prev) => prev ?? createInitialLesson(poolRef.current));
  }, [canPlay]);

  useEffect(() => {
    if (!lesson || lesson.status !== "complete" || awardedRef.current) return;
    awardedRef.current = true;
    const runId = runIdRef.current;
    void completeGameV2("hungry-dog").then((result) => {
      if (result && runIdRef.current === runId) setReward(result);
    });
  }, [lesson, completeGameV2]);

  const target = lesson?.status === "playing" ? lesson.round.target : null;

  const puppyBaseAnim: PuppyAnim = useMemo(() => {
    const hungry = isHungry(Date.now(), lastEatAt, HUNGRY_DOG_ROUND.hungerMs);
    return hungry ? "hungry" : "idle";
  }, [lastEatAt]);

  const playWord = useCallback(() => {
    if (!target) return;
    void playCourseAudio(target.audio, target.word, audioRef, stopAudio);
  }, [target, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [target?.id, lesson?.correctCount]);

  useEffect(() => {
    if (!target || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const t = setTimeout(() => playWord(), 1500);
    return () => clearTimeout(t);
  }, [target, playWord]);

  const onDrop = useCallback(
    (word: string) => {
      if (!lesson || lesson.status !== "playing") {
        return { kind: "ignored" as const };
      }
      const result = applyDrop(lesson, poolRef.current, word);
      if (result.kind === "wrong") {
        playHungryDogWrongSound();
        return result;
      }
      playHungryDogCorrectSound();
      const now = Date.now();
      setLastEatAt(now);
      setLastEatAtState(now);
      void addCoins(HUNGRY_DOG_ROUND.coinPerCorrect).catch((err) => {
        console.error("addCoins failed", err);
      });
      setLesson(result.lesson);
      return result;
    },
    [lesson, addCoins],
  );

  const restart = useCallback(() => {
    if (!canPlay) return;
    runIdRef.current += 1;
    awardedRef.current = false;
    setReward(null);
    stopAudio();
    setLesson(createInitialLesson(poolRef.current));
  }, [canPlay, stopAudio]);

  return {
    pool,
    canPlay,
    lesson,
    reward,
    puppyBaseAnim,
    onDrop,
    restart,
    playWord,
    targetsNeeded: HUNGRY_DOG_ROUND.targetsNeeded,
  };
}
