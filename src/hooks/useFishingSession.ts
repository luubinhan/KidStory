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

  const [session, setSession] = useState<FishingSessionState | null>(null);
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const awardedRef = useRef(false);

  useEffect(() => {
    if (!canPlay) {
      setSession(null);
      return;
    }
    setSession(createInitialSession(pool));
    awardedRef.current = false;
    setReward(null);
  }, [canPlay, pool]);

  useEffect(() => {
    if (!session || session.status !== "won" || awardedRef.current) return;
    awardedRef.current = true;
    void completeGameV2("fishing").then((result) => {
      if (result) setReward(result);
    });
  }, [session, completeGameV2]);

  const onFishTap = useCallback(
    (word: string) => {
      if (!session || session.status !== "playing") return { kind: "ignored" as const };
      const result = applyFishTap(session, pool, word);
      if (result.kind === "wrong") {
        playFishingWrongSound();
        return result;
      }
      playFishingSuccessSound();
      playFishingCoinSound();
      setSession(result.session);
      return result;
    },
    [session, pool],
  );

  const restart = useCallback(() => {
    if (!canPlay) return;
    awardedRef.current = false;
    setReward(null);
    setSession(createInitialSession(pool));
  }, [canPlay, pool]);

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
