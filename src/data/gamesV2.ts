import type { GameV2 } from "../types/gameV2";
import { IMAGES_ACTIVITIES } from "../constants/images";

export const gamesV2 = [
  {
    id: "fishing",
    name: "Fishing Game",
    path: "/games-v2/fishing",
    coinReward: 50,
    diamondReward: 50,
    thumbnailSrc: "https://luubinhan.github.io/KidStory/images/fishing-cover.jpg",
  },
  {
    id: "hungry-dog",
    name: "Hungry Dog",
    path: "/games-v2/hungry-dog",
    coinReward: 5,
    diamondReward: 0,
    thumbnailSrc: "https://luubinhan.github.io/KidStory/images/hungry-dog-cover.jpg",
  },
  {
    id: "matching-pairs",
    name: "Matching Pairs",
    path: "/games-v2/matching-pairs",
    coinReward: 20,
    diamondReward: 10,
    thumbnailSrc: IMAGES_ACTIVITIES.matching,
  },
  {
    id: "picture-puzzle",
    name: "Picture Puzzle",
    path: "/games-v2/picture-puzzle",
    coinReward: 5,
    diamondReward: 1,
    thumbnailSrc: IMAGES_ACTIVITIES["complete-sentence"],
  },
] as const satisfies readonly GameV2[];

export function getGameV2(id: string): GameV2 | undefined {
  return gamesV2.find((g) => g.id === id);
}
