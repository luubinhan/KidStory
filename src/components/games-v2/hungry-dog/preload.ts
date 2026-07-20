import { Assets, Spritesheet, Texture, type SpritesheetData } from "pixi.js";
import dogBgUrl from "../../../assets/games/dog-bg.webp";
import dogFeedingTrayUrl from "../../../assets/games/dog-feeding-tray.webp";
import spritesheetData from "../../../assets/games/spritesheet.json";
import spritesheetPng from "../../../assets/games/spritesheet.png";
import { ASSETS } from "../../../constants/images";

export const HUNGRY_DOG_SHEET_ALIAS = "hungryDogSheet";
export const HUNGRY_DOG_BG_ALIAS = "hungryDogBg";
export const HUNGRY_DOG_TRAY_ALIAS = "hungryDogTray";

/**
 * Vite imports JSON as a parsed object (not a URL). Pixi Assets.load expects a
 * URL string for spritesheets, so we load the PNG texture and parse the sheet
 * manually with the imported atlas data.
 */
export async function preloadHungryDogAssets(): Promise<void> {
  await Assets.load([
    { alias: "coin", src: ASSETS.coin },
    { alias: HUNGRY_DOG_BG_ALIAS, src: dogBgUrl },
    { alias: HUNGRY_DOG_TRAY_ALIAS, src: dogFeedingTrayUrl },
  ]);

  if (Assets.cache.has(HUNGRY_DOG_SHEET_ALIAS)) return;

  const texture = await Assets.load<Texture>(spritesheetPng);
  const sheet = new Spritesheet(
    texture,
    spritesheetData as SpritesheetData,
  );
  await sheet.parse();
  Assets.cache.set(HUNGRY_DOG_SHEET_ALIAS, sheet);
}
