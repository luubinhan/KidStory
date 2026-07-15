import type { GameV2 } from "../types/gameV2";

export const gamesV2 = [
  {
    id: "fishing",
    name: "Fishing Game",
    path: "/games-v2/fishing",
    coinReward: 50,
    diamondReward: 50,
    thumbnailSrc: 'https://luubinhan.github.io/KidStory/images/fishing-cover.jpg'
  },
] as const satisfies readonly GameV2[];

export function getGameV2(id: string): GameV2 | undefined {
  return gamesV2.find((g) => g.id === id);
}
