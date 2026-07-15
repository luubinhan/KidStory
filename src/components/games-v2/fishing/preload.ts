import { Assets } from 'pixi.js';
import { ASSETS } from '../../../constants/images';
import displacementResource from "../../../assets/games/displacement_map.png";

export async function preload() {
  // Create an array of asset data to load.
  const assets = [
    { alias: 'displacement', src: displacementResource },
    { alias: 'coin', src: ASSETS.coin },
  ];

  // Load the assets defined above.
  await Assets.load(assets);
}