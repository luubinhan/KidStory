import type { MutableRefObject } from "react";

export async function playCourseAudio(
  audioUrl: string | undefined,
  ttsText: string,
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  stopPrior: () => void,
): Promise<void> {
  stopPrior();

  if (audioUrl) {
    try {
      const el = new Audio(audioUrl);
      audioRef.current = el;
      await el.play();
      return;
    } catch {
      // fall through to TTS
    }
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    const speak = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.resume();
      } catch {
        /* ignore — some engines throw if not paused */
      }
      const u = new SpeechSynthesisUtterance(ttsText);
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    };
    // cancel() then speak() in the same turn often drops the utterance on Chromium
    queueMicrotask(speak);
  }
}
