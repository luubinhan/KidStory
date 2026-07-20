import { Assets, Spritesheet, Texture, type SpritesheetData } from "pixi.js";
import spritesheetData from "../../../assets/games/spritesheet.json";
import spritesheetPng from "../../../assets/games/spritesheet.png";
import { ASSETS } from "../../../constants/images";

export const HUNGRY_DOG_SHEET_ALIAS = "hungryDogSheet";

/**
 * Vite imports JSON as a parsed object (not a URL). Pixi Assets.load expects a
 * URL string for spritesheets, so we load the PNG texture and parse the sheet
 * manually with the imported atlas data.
 */
export async function preloadHungryDogAssets(): Promise<void> {
  await Assets.load({ alias: "coin", src: ASSETS.coin });

  if (Assets.cache.has(HUNGRY_DOG_SHEET_ALIAS)) return;

  const texture = await Assets.load<Texture>(spritesheetPng);
  const sheet = new Spritesheet(
    texture,
    spritesheetData as SpritesheetData,
  );
  await sheet.parse();
  Assets.cache.set(HUNGRY_DOG_SHEET_ALIAS, sheet);
}
