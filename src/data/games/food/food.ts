import type { GameTopic } from "../../../types/game";

export const Food = {
    id: "food",
    title: "Food",
    description: "Yummy words for things we eat.",
    questions: [
      {
        id: "food-1",
        image: "",
        textBefore: "For breakfast I like ",
        textAfter: " and milk.",
        options: ["cereal", "soap", "paper", "rock"],
        correctIndex: 0,
      },
      {
        id: "food-2",
        image: "",
        textBefore: "An ",
        textAfter: " is a fruit that is red or green.",
        options: ["apple", "chair", "cloud", "bike"],
        correctIndex: 0,
      },
      {
        id: "food-3",
        image: "",
        textBefore: "We drink ",
        textAfter: " from a cup when it is cold outside.",
        options: ["soup", "hot chocolate", "sand", "paint"],
        correctIndex: 1,
      },
    ],
  } satisfies GameTopic;