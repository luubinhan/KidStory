import type { MutableRefObject } from "react";
import type { GameQuestion } from "../types/game";
import { resolveAudioSrc } from "./audioUrlCache";
import { ttsSentence } from "./gameQuestionTts";

/**
 * Plays the question stem: optional `audioUrl`, otherwise TTS of the fill-in sentence
 * (`textBefore … textAfter`), matching the main quiz speaker behavior.
 */
export async function playGameQuestionStem(
  q: GameQuestion,
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  stopPrior: () => void,
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
    const stem = ttsSentence(q).trim();
    const u = new SpeechSynthesisUtterance(stem);
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }
}
