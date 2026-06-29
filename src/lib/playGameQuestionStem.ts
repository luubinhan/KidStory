import type { RefObject } from "react";
import type { GameQuestion } from "../types/game";
import { resolveAudioSrc } from "./audioUrlCache";
import { ttsFullSentence, ttsSentence } from "./gameQuestionTts";

/**
 * Plays the question stem: optional `audioUrl`, otherwise TTS of the sentence.
 * MC mode uses the full correct sentence; spell mode keeps the blank stem.
 */
export async function playGameQuestionStem(
  q: GameQuestion,
  audioRef: RefObject<HTMLAudioElement | null>,
  stopPrior: () => void,
  options?: { includeAnswer?: boolean },
): Promise<void> {
  stopPrior();

  if (q.audioUrl) {
    try {
      const src = await resolveAudioSrc(q.audioUrl);
      const el = new Audio(src);
      audioRef.current = el;
      await el.play();
      return;
    } catch {
      // fall through to TTS
    }
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    const stem = (options?.includeAnswer ? ttsFullSentence(q) : ttsSentence(q)).trim();
    const u = new SpeechSynthesisUtterance(stem);
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }
}
