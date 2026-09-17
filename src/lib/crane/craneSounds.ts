import boomUrl from "../../assets/sound/boom.mp3";
import dogCryUrl from "../../assets/sound/dog-cry.mp3";
import goldUrl from "../../assets/sound/gold.mp3";
import stepUrl from "../../assets/sound/step.mp3";
import { prefetchAudioUrls, resolveAudioSrc } from "../audioUrlCache";

function playSfx(url: string): void {
  if (typeof window === "undefined") return;
  void (async () => {
    try {
      const src = await resolveAudioSrc(url);
      const a = new Audio(src);
      await a.play();
    } catch {
      // ignore missing or blocked playback
    }
  })();
}

export function prefetchCraneSounds(): void {
  prefetchAudioUrls([stepUrl, goldUrl, dogCryUrl, boomUrl]);
}

export function playCraneStepSound(): void {
  playSfx(stepUrl);
}

export function playCraneCorrectSound(): void {
  playSfx(goldUrl);
}

export function playCraneWrongSound(): void {
  playSfx(dogCryUrl);
}

export function playCraneBoomSound(): void {
  playSfx(boomUrl);
}
