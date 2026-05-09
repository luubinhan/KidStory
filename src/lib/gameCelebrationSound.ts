/**
 * TODO: Add `public/sounds/celebration.mp3` (or similar) and set the URL below when the asset is ready.
 */
const CELEBRATION_AUDIO_URL: string | null = null;

export function playCelebrationSound(): void {
  if (!CELEBRATION_AUDIO_URL || typeof window === "undefined") return;
  try {
    const a = new Audio(CELEBRATION_AUDIO_URL);
    void a.play();
  } catch {
    // ignore missing or blocked playback
  }
}
