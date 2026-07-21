import dogCryUrl from "../../assets/sound/dog-cry.mp3";
import goldUrl from "../../assets/sound/gold.mp3";
import { resolveAudioSrc } from "../audioUrlCache";

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
