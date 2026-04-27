import type { GameTopic } from "../../../types/game";

export const Clothes = {
    id: "clothes",
    title: "Clothes",
    description: "Shirts, shoes, hats, and what we wear.",
    questions: [
      {
        id: "clothes-1",
        image: "",
        textBefore: "In the rain, wear your ",
        textAfter: ".",
        options: ["sandals", "boots", "scarf", "belt"],
        correctIndex: 1,
      },
      {
        id: "clothes-2",
        image: "",
        textBefore: "It is sunny; put on a ",
        textAfter: ".",
        options: ["coat", "hat", "socks", "gloves"],
        correctIndex: 1,
      },
      {
        id: "clothes-3",
        image: "",
        textBefore: "Your ",
        textAfter: " keep your feet warm.",
        options: ["shirt", "pants", "socks", "ring"],
        correctIndex: 2,
      },
    ],
  } satisfies GameTopic;