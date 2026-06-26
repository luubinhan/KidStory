import type { GameTopic } from "../../../types/game";

export const Unit3Colours = {
  id: "unit-3-colours",
  title: "Colours",
  description: "Rainbow words.",
  questions: [
    {
      id: "unit-3-colours-1",
      image: "",
      textBefore: "An apple can be ",
      textAfter: ".",
      options: ["red", "blue", "green", "yellow"],
      correctIndex: 0,
    },
    {
      id: "unit-3-colours-2",
      image: "",
      textBefore: "The sky is ",
      textAfter: ".",
      options: ["blue", "red", "green", "yellow"],
      correctIndex: 0,
    },
    {
      id: "unit-3-colours-3",
      image: "",
      textBefore: "Grass is ",
      textAfter: ".",
      options: ["green", "red", "blue", "yellow"],
      correctIndex: 0,
    },
    {
      id: "unit-3-colours-4",
      image: "",
      textBefore: "The sun is ",
      textAfter: ".",
      options: ["yellow", "blue", "green", "red"],
      correctIndex: 0,
    },
    {
      id: "unit-3-colours-5",
      image: "",
      textBefore: "I like the colour ",
      textAfter: ".",
      options: ["red", "table", "chair", "book"],
      correctIndex: 0,
    },
    {
      id: "unit-3-colours-6",
      image: "",
      textBefore: "My favourite colour is ",
      textAfter: ".",
      options: ["blue", "desk", "shoe", "pen"],
      correctIndex: 0,
    },
  ],
} satisfies GameTopic;
