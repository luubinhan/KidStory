import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playCourseAudio } from "../lib/playCourseAudio";
import type { CourseWord } from "../types/course";

function shuffleWords(words: readonly CourseWord[]): CourseWord[] {
  const copy = [...words];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function useCourseFlashcards(words: readonly CourseWord[], sessionKey: string) {
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const deck = useMemo(() => shuffleWords(words), [words, sessionKey]);

  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [sessionKey]);

  const currentWord = deck[cardIndex];

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

  const playWord = useCallback(
    (word: CourseWord) => {
      void playCourseAudio(word.audio, word.word, audioRef, stopAudio);
    },
    [stopAudio],
  );

  const flip = useCallback(() => {
    if (isFlipped) {
      stopAudio();
      setIsFlipped(false);
      return;
    }
    const word = deck[cardIndex];
    if (word) playWord(word);
    setIsFlipped(true);
  }, [isFlipped, cardIndex, deck, playWord, stopAudio]);

  const goPrev = useCallback(() => {
    stopAudio();
    setIsFlipped(false);
    setCardIndex((i) => Math.max(0, i - 1));
  }, [stopAudio]);

  const goNext = useCallback(() => {
    stopAudio();
    setIsFlipped(false);
    setCardIndex((i) => Math.min(deck.length - 1, i + 1));
  }, [deck.length, stopAudio]);

  return {
    deck,
    cardIndex,
    currentWord,
    isFlipped,
    flip,
    goPrev,
    goNext,
    canGoPrev: cardIndex > 0,
    canGoNext: cardIndex < deck.length - 1,
  };
}
