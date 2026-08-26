import { useCallback, useEffect, useRef, useState } from "react";
import { useUserProgress } from "../contexts/UserProgressContext";
import { picturePuzzleItems, type PicturePuzzleItem } from "../data/picturePuzzleGame";
import {
  applyDrag,
  createPuzzle,
  isSolved,
  pickPicturePuzzleItem,
  type DragSource,
  type DragTarget,
  type PicturePuzzleState,
} from "../lib/picturePuzzle";
import { playCourseAudio } from "../lib/playCourseAudio";
import type { ActivityRewardResult } from "../types/userProgress";

function nextItem(): PicturePuzzleItem | undefined {
  return pickPicturePuzzleItem(picturePuzzleItems);
}

export function usePicturePuzzleSession() {
  const { completeGameV2 } = useUserProgress();
  const [item, setItem] = useState<PicturePuzzleItem | undefined>(() => nextItem());
  const [puzzle, setPuzzle] = useState<PicturePuzzleState>(() => createPuzzle());
  const [reward, setReward] = useState<ActivityRewardResult | null>(null);
  const awardedRef = useRef(false);
  const runIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedRef = useRef(false);

  const canPlay = Boolean(item);
  const isComplete = isSolved(puzzle.board);

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

  const playWord = useCallback(() => {
    if (!item) return;
    void playCourseAudio(item.audio, item.word, audioRef, stopAudio);
  }, [item, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [item?.id]);

  useEffect(() => {
    if (!item || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const id = window.setTimeout(() => {
      playWord();
    }, 200);
    return () => window.clearTimeout(id);
  }, [item, playWord]);

  useEffect(() => {
    if (!isComplete || awardedRef.current) return;
    awardedRef.current = true;
    const runId = runIdRef.current;
    void completeGameV2("picture-puzzle").then((result) => {
      if (result && runIdRef.current === runId) setReward(result);
    });
  }, [isComplete, completeGameV2]);

  const onDrag = useCallback((source: DragSource, target: DragTarget) => {
    setPuzzle((prev) => {
      if (isSolved(prev.board)) return prev;
      return applyDrag(prev, source, target);
    });
  }, []);

  const restart = useCallback(() => {
    runIdRef.current += 1;
    awardedRef.current = false;
    autoPlayedRef.current = false;
    setReward(null);
    setItem(nextItem());
    setPuzzle(createPuzzle());
    stopAudio();
  }, [stopAudio]);

  return {
    canPlay,
    item,
    board: puzzle.board,
    tray: puzzle.tray,
    isComplete,
    reward,
    playWord,
    onDrag,
    restart,
  };
}
