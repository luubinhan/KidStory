import { Assets } from 'pixi.js';
import displacementResource from "../../../assets/games/displacement_map.png";

export async function preload() {
  // Create an array of asset data to load.
  const assets = [
    { alias: 'displacement', src: displacementResource },
  ];

  // Load the assets defined above.
  await Assets.load(assets);
}