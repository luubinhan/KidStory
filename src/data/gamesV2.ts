import type { GameV2 } from "../types/gameV2";

export const gamesV2 = [
  {
    id: "fish-pond",
    name: "Fish Pond",
    path: "/games-v2/fish-pond",
    coinReward: 50,
    diamondReward: 50,
  },
] as const satisfies readonly GameV2[];
