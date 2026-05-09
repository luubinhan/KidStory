import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shuffledIndices } from "../lib/gameTopicShuffle";
import type { GameQuestion, GameTopic } from "../types/game";

export function useGameTopicSpellQuestion(
  topic: GameTopic | undefined,
  topicId: string | undefined,
) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [letterOrder, setLetterOrder] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const questions = topic?.questions ?? [];
  const q: GameQuestion | undefined = questions[questionIndex];
  const isLast = topic ? questionIndex >= questions.length - 1 : false;

  const targetWord = q ? q.options[q.correctIndex]! : "";
  const graphemes = useMemo(() => Array.from(targetWord), [targetWord]);

  useEffect(() => {
    setQuestionIndex(0);
  }, [topicId]);

  useEffect(() => {
    if (!q) {
      setLetterOrder([]);
      return;
    }
    const word = q.options[q.correctIndex]!;
    const n = Array.from(word).length;
    setLetterOrder(n > 0 ? shuffledIndices(n, q.id) : []);
  }, [q?.id, topicId]);

  const isSolved = useMemo(() => {
    if (!q || letterOrder.length !== graphemes.length || graphemes.length === 0) {
      return false;
    }
    return letterOrder.every((gIdx, slot) => graphemes[gIdx] === graphemes[slot]);
  }, [letterOrder, graphemes, q]);

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

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  const playWord = useCallback(() => {
    if (!targetWord) return;
    stopAudio();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(targetWord);
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  }, [targetWord, stopAudio]);

  const goNext = useCallback(() => {
    if (!topic) return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    }
  }, [topic, questionIndex, questions.length]);

  return {
    questionIndex,
    letterOrder,
    setLetterOrder,
    q,
    questions,
    isLast,
    targetWord,
    graphemes,
    isSolved,
    playWord,
    stopAudio,
    goNext,
  };
}
