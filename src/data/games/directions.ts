import type { GameTopic } from "../../types/game";

export const directions = {
    id: "direction",
    title: "Direction",
    description: "Learn words like left, right, up, and down.",
    questions: [
      {
        id: "direction-1",
        image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/games/directions/left.jpeg",
        textBefore: "Turn ",
        textAfter: " at the corner to find the park.",
        options: ["left", "slow", "happy", "soft"],
        correctIndex: 0,
      },
      {
        id: "direction-2",
        image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/games/directions/up.jpeg",
        textBefore: "The bird flew ",
        textAfter: " into the sky.",
        options: ["down", "up", "under", "inside"],
        correctIndex: 1,
      },
      {
        id: "direction-3",
        image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/games/directions/straight.jpeg",
        textBefore: "Walk ",
        textAfter: " along this path to the school gate.",
        options: ["backward", "straight", "loud", "sweet"],
        correctIndex: 1,
      },
    ],
  } satisfies GameTopic;