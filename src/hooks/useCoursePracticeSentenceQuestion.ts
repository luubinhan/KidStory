import { useCallback, useEffect, useMemo, useState } from "react";
import { formatPracticeSentence } from "../lib/courseSentenceDisplay";
import { shuffledIndices } from "../lib/gameTopicShuffle";
import type { CoursePracticeSentence } from "../types/course";

export function useCoursePracticeSentenceQuestion(
  sentences: readonly CoursePracticeSentence[],
  sessionKey: string,
) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [wordOrder, setWordOrder] = useState<number[]>([]);

  const sentence = sentences[sentenceIndex];
  const isLast = sentenceIndex >= sentences.length - 1;

  const words = useMemo(() => {
    if (!sentence) return [];
    return sentence.text.trim().split(/\s+/).filter(Boolean);
  }, [sentence]);

  useEffect(() => {
    setSentenceIndex(0);
  }, [sessionKey]);

  useEffect(() => {
    if (!sentence) {
      setWordOrder([]);
      return;
    }
    const n = words.length;
    setWordOrder(n > 0 ? shuffledIndices(n, `${sentence.id}-words`) : []);
  }, [sentence?.id, sessionKey, words.length]);

  const isSolved = useMemo(() => {
    if (!sentence || wordOrder.length !== words.length || words.length === 0) {
      return false;
    }
    return wordOrder.every((wIdx, slot) => words[wIdx] === words[slot]);
  }, [wordOrder, words, sentence]);

  const displayText = sentence ? formatPracticeSentence(sentence.text) : "";

  const playSentence = useCallback(() => {
    if (!displayText) return;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(displayText);
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  }, [displayText]);

  const goNext = useCallback(() => {
    if (sentenceIndex < sentences.length - 1) {
      setSentenceIndex((i) => i + 1);
    }
  }, [sentenceIndex, sentences.length]);

  return {
    sentenceIndex,
    sentence,
    sentences,
    isLast,
    words,
    wordOrder,
    setWordOrder,
    isSolved,
    displayText,
    playSentence,
    goNext,
  };
}
