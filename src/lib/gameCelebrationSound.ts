/** Served from `public/sounds/` (Vite root URL). */
const CELEBRATION_AUDIO_URL = "/sounds/win-sound.mp3";

export function playCelebrationSound(): void {
  if (!CELEBRATION_AUDIO_URL || typeof window === "undefined") return;
  try {
    const a = new Audio(CELEBRATION_AUDIO_URL);
    void a.play();
  } catch {
    // ignore missing or blocked playback
  }
}
