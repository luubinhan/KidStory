import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shuffledOptionOrder } from "../lib/gameTopicShuffle";
import { playGameQuestionStem } from "../lib/playGameQuestionStem";
import type { GameQuestion, GameTopic } from "../types/game";

/** Dedupes initial stem audio when Strict Mode runs mount effects twice in dev. */
let lastMcInitialStemKey: string | null = null;

export function useGameTopicQuestion(
  topic: GameTopic | undefined,
  topicId: string | undefined,
) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [pickedDisplayIndex, setPickedDisplayIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const questions = topic?.questions ?? [];
  const q: GameQuestion | undefined = questions[questionIndex];
  const isLast = topic ? questionIndex >= questions.length - 1 : false;

  const optionOrder = useMemo(
    () => (q ? shuffledOptionOrder(q.options.length, q.id) : []),
    [q],
  );

  useEffect(() => {
    setQuestionIndex(0);
    setPickedDisplayIndex(null);
  }, [topicId]);

  useEffect(() => {
    setPickedDisplayIndex(null);
  }, [questionIndex]);

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

  const playAudio = useCallback(async () => {
    if (!q) return;
    await playGameQuestionStem(q, audioRef, stopAudio);
  }, [q, stopAudio]);

  useEffect(() => {
    if (!topicId || !q?.id) return;
    const key = `mc:${topicId}:${q.id}`;
    if (lastMcInitialStemKey === key) return;
    lastMcInitialStemKey = key;
    void playGameQuestionStem(q, audioRef, stopAudio);
  }, [topicId, q, stopAudio]);

  const playOptionWord = useCallback(
    (word: string) => {
      stopAudio();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(word);
        u.rate = 0.92;
        window.speechSynthesis.speak(u);
      }
    },
    [stopAudio],
  );

  const onPick = useCallback(
    (displayIndex: number) => {
      if (!q || pickedDisplayIndex !== null) return;
      setPickedDisplayIndex(displayIndex);
    },
    [q, pickedDisplayIndex],
  );

  const goNext = useCallback(() => {
    if (!topic) return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    }
  }, [topic, questionIndex, questions.length]);

  return {
    questionIndex,
    pickedDisplayIndex,
    optionOrder,
    q,
    questions,
    isLast,
    playAudio,
    playOptionWord,
    onPick,
    goNext,
  };
}
