import type { MutableRefObject } from "react";
import type { GameQuestion } from "../types/game";
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
      const el = new Audio(q.audioUrl);
      audioRef.current = el;
      await el.play();
      return;
    } catch {
      // fall through to TTS
    }
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    const stem = ttsSentence(q).trim();
    const ttsText =
      stem && stem !== "…"
        ? stem
        : (q.options[q.correctIndex] ?? "").trim();
    if (!ttsText) return;

    const u = new SpeechSynthesisUtterance(ttsText);
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }
}
