import type { GameTopic } from "../../types/game";

export const preposition = {
    id: "preposition",
    title: "Preposition",
    description: "Where things are: in, on, under, and more.",
    questions: [
      {
        id: "preposition-1",
        image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/games/directions/on.jpeg",
        textBefore: "The cat is sleeping ",
        textAfter: " the warm bed.",
        options: ["on", "at", "by", "from"],
        correctIndex: 0,
      },
      {
        id: "preposition-2",
        image: "",
        textBefore: "Put your toys ",
        textAfter: " the box before dinner.",
        options: ["over", "inside", "across", "during"],
        correctIndex: 1,
      },
      {
        id: "preposition-3",
        image: "",
        textBefore: "We waited ",
        textAfter: " the bus stop.",
        options: ["in", "on", "at", "into"],
        correctIndex: 2,
      },
    ],
  } satisfies GameTopic;