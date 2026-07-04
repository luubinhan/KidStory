import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isWriteAnswerCorrect } from "../lib/courseWriteAnswer";
import { shuffledOptionOrder } from "../lib/gameTopicShuffle";
import { playCourseAudio } from "../lib/playCourseAudio";
import type { CourseTypedAnswerQuestion } from "../types/course";

export type TypedAnswerQuestionResult = "correct" | "incorrect";

function fullSentence(q: CourseTypedAnswerQuestion): string {
  return `${q.textBefore}${q.answer}${q.textAfter}`;
}

export function useCourseTypedAnswerSession(
  questions: readonly CourseTypedAnswerQuestion[],
  baseSessionKey: string,
) {
  const [sessionCounter, setSessionCounter] = useState(0);
  const [phase, setPhase] = useState<"playing" | "summary">("playing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<TypedAnswerQuestionResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedRef = useRef(false);

  const sessionKey = `${baseSessionKey}-typed-answer-${sessionCounter}`;

  const questionOrder = useMemo(
    () => (questions.length > 0 ? shuffledOptionOrder(questions.length, sessionKey) : []),
    [questions.length, sessionKey],
  );

  const question: CourseTypedAnswerQuestion | undefined =
    questionOrder.length > 0 ? questions[questionOrder[questionIndex]!] : undefined;

  const total = questions.length;
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

  const playPrompt = useCallback(() => {
    if (!question) return;
    void playCourseAudio(undefined, question.prompt, audioRef, stopAudio);
  }, [question, stopAudio]);

  const playSentence = useCallback(() => {
    if (!question) return;
    void playCourseAudio(undefined, fullSentence(question), audioRef, stopAudio);
  }, [question, stopAudio]);

  useEffect(() => {
    autoPlayedRef.current = false;
  }, [question?.id, sessionKey]);

  useEffect(() => {
    if (!question || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    playPrompt();
  }, [question, playPrompt]);

  const submit = useCallback(() => {
    if (!question || submitted || !input.trim()) return;
    const correct = isWriteAnswerCorrect(input, question.answer);
    setSubmitted(true);
    setResult(correct ? "correct" : "incorrect");
    if (correct) setCorrectCount((c) => c + 1);
  }, [question, submitted, input]);

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
    question,
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
    playPrompt,
    playSentence,
  };
}
