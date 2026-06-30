import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isWriteAnswerCorrect } from "../lib/courseWriteAnswer";
import { shuffledOptionOrder } from "../lib/gameTopicShuffle";
import { playCourseAudio } from "../lib/playCourseAudio";
import type { CourseWord } from "../types/course";

export type WriteQuestionResult = "correct" | "incorrect";

export function useCourseWriteSession(words: readonly CourseWord[], baseSessionKey: string) {
  const [sessionCounter, setSessionCounter] = useState(0);
  const [phase, setPhase] = useState<"playing" | "summary">("playing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<WriteQuestionResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedRef = useRef(false);

  const sessionKey = `${baseSessionKey}-write-${sessionCounter}`;

  const wordOrder = useMemo(
    () => (words.length > 0 ? shuffledOptionOrder(words.length, sessionKey) : []),
    [words.length, sessionKey],
  );

  const word: CourseWord | undefined =
    wordOrder.length > 0 ? words[wordOrder[questionIndex]!] : undefined;

  const total = words.length;
  const isLast = questionIndex >= total - 1;

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
    if (!word) return;
    void playCourseAudio(word.audio, word.word, audioRef, stopAudio);
  }, [word, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [word?.id, sessionKey]);

  useEffect(() => {
    if (!word || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    playWord();
  }, [word, playWord]);

  const submit = useCallback(() => {
    if (!word || submitted || !input.trim()) return;
    const correct = isWriteAnswerCorrect(input, word.word);
    setSubmitted(true);
    setResult(correct ? "correct" : "incorrect");
    if (correct) setCorrectCount((c) => c + 1);
  }, [word, submitted, input]);

  const goNext = useCallback(() => {
    if (!submitted) return;
    if (isLast) {
      setPhase("summary");
      return;
    }
    setQuestionIndex((i) => i + 1);
    setInput("");
    setSubmitted(false);
    setResult(null);
  }, [submitted, isLast]);

  const replay = useCallback(() => {
    stopAudio();
    setSessionCounter((c) => c + 1);
    setPhase("playing");
    setQuestionIndex(0);
    setInput("");
    setSubmitted(false);
    setResult(null);
    setCorrectCount(0);
  }, [stopAudio]);

  return {
    phase,
    word,
    questionIndex,
    total,
    isLast,
    input,
    setInput,
    submitted,
    result,
    correctCount,
    submit,
    goNext,
    replay,
    playWord,
  };
}
