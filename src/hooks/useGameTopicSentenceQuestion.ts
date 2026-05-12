import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sentenceWordsFromQuestion } from "../lib/gameSentenceWords";
import { shuffledIndices } from "../lib/gameTopicShuffle";
import type { GameQuestion, GameTopic } from "../types/game";

export function useGameTopicSentenceQuestion(
  topic: GameTopic | undefined,
  topicId: string | undefined,
) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [wordOrder, setWordOrder] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedOnSolveRef = useRef(false);

  const questions = topic?.questions ?? [];
  const q: GameQuestion | undefined = questions[questionIndex];
  const isLast = topic ? questionIndex >= questions.length - 1 : false;

  const words = useMemo(() => (q ? sentenceWordsFromQuestion(q) : []), [q]);

  useEffect(() => {
    setQuestionIndex(0);
  }, [topicId]);

  useEffect(() => {
    autoPlayedOnSolveRef.current = false;
  }, [q?.id, topicId]);

  useEffect(() => {
    if (!q) {
      setWordOrder([]);
      return;
    }
    const w = sentenceWordsFromQuestion(q);
    const n = w.length;
    setWordOrder(n > 0 ? shuffledIndices(n, `${q.id}-words`) : []);
  }, [q?.id, topicId]);

  const isSolved = useMemo(() => {
    if (!q || wordOrder.length !== words.length || words.length === 0) {
      return false;
    }
    return wordOrder.every((wIdx, slot) => words[wIdx] === words[slot]);
  }, [wordOrder, words, q]);

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

  const sentenceText = words.join(" ");

  const playSentence = useCallback(() => {
    if (!sentenceText) return;
    stopAudio();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(sentenceText);
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  }, [sentenceText, stopAudio]);

  useEffect(() => {
    if (!isSolved || autoPlayedOnSolveRef.current || !sentenceText) return;
    autoPlayedOnSolveRef.current = true;
    playSentence();
  }, [isSolved, sentenceText, playSentence]);

  const goNext = useCallback(() => {
    if (!topic) return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    }
  }, [topic, questionIndex, questions.length]);

  return {
    questionIndex,
    wordOrder,
    setWordOrder,
    q,
    questions,
    isLast,
    words,
    isSolved,
    playSentence,
    stopAudio,
    goNext,
  };
}
