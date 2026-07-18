import coinUpUrl from "../../assets/sound/coin-up.mp3";
import aquariumUrl from "../../assets/sound/aquarium-sound.mp3";
import fishSplashUrl from "../../assets/sound/fish-jumping-splash.mp3";
import { prefetchAudioUrls, resolveAudioSrc } from "../audioUrlCache";

const AMBIENT_VOLUME = 0.35;

let ambientAudio: HTMLAudioElement | null = null;

export function playFishingSuccessSound(): void {}

export function playFishingWrongSound(): void {
  if (typeof window === "undefined") return;
  void (async () => {
    try {
      const src = await resolveAudioSrc(fishSplashUrl);
      const a = new Audio(src);
      await a.play();
    } catch {
      // ignore missing or blocked playback
    }
  })();
}

export function playFishingCoinSound(): void {
  if (typeof window === "undefined") return;
  try {
    const a = new Audio(coinUpUrl);
    void a.play();
  } catch {
    // ignore missing or blocked playback
  }
}

export function playFishingSplashSound(): void {}

export function playFishingAmbientLoop(): void {
  if (typeof window === "undefined") return;
  prefetchAudioUrls([fishSplashUrl, coinUpUrl, aquariumUrl]);
  try {
    if (!ambientAudio) {
      ambientAudio = new Audio(aquariumUrl);
      ambientAudio.loop = true;
      ambientAudio.volume = AMBIENT_VOLUME;
    }
    if (ambientAudio.paused) {
      void ambientAudio.play();
    }
  } catch {
    // ignore missing or blocked playback
  }
}

export function stopFishingAmbientLoop(): void {
  if (!ambientAudio) return;
  ambientAudio.pause();
  ambientAudio.currentTime = 0;
}
