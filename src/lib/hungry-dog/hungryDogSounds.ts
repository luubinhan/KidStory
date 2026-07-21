import dogBgMusicUrl from "../../assets/sound/dog-bg-music.mp3";
import dogCryUrl from "../../assets/sound/dog-cry.mp3";
import goldUrl from "../../assets/sound/gold.mp3";
import { prefetchAudioUrls, resolveAudioSrc } from "../audioUrlCache";

const AMBIENT_VOLUME = 0.35;

let ambientAudio: HTMLAudioElement | null = null;

export function playHungryDogCorrectSound(): void {
  if (typeof window === "undefined") return;
  void (async () => {
    try {
      const src = await resolveAudioSrc(goldUrl);
      const a = new Audio(src);
      await a.play();
    } catch {
      // ignore missing or blocked playback
    }
  })();
}

export function playHungryDogWrongSound(): void {
  if (typeof window === "undefined") return;
  void (async () => {
    try {
      const src = await resolveAudioSrc(dogCryUrl);
      const a = new Audio(src);
      await a.play();
    } catch {
      // ignore missing or blocked playback
    }
  })();
}

export function playHungryDogAmbientLoop(): void {
  if (typeof window === "undefined") return;
  prefetchAudioUrls([dogCryUrl, goldUrl, dogBgMusicUrl]);
  try {
    if (!ambientAudio) {
      ambientAudio = new Audio(dogBgMusicUrl);
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

export function stopHungryDogAmbientLoop(): void {
  if (!ambientAudio) return;
  ambientAudio.pause();
  ambientAudio.currentTime = 0;
}
