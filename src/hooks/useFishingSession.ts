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

  const poolRef = useRef(pool);
  poolRef.current = pool;

  const [session, setSession] = useState<FishingSessionState | null>(null);
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const awardedRef = useRef(false);
  const runIdRef = useRef(0);

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
    setSession(createInitialSession(poolRef.current));
  }, [canPlay]);

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
