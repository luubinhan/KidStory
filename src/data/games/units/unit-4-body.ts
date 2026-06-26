import type { GameTopic } from "../../../types/game";

export const Unit4Body = {
  id: "unit-4-body",
  title: "My Body",
  description: "Body parts.",
  questions: [
    {
      id: "unit-4-body-1",
      image: "",
      textBefore: "I think with my ",
      textAfter: ".",
      options: ["head", "foot", "hand", "knee"],
      correctIndex: 0,
    },
    {
      id: "unit-4-body-2",
      image: "",
      textBefore: "I wave with my ",
      textAfter: ".",
      options: ["hand", "foot", "ear", "nose"],
      correctIndex: 0,
    },
    {
      id: "unit-4-body-3",
      image: "",
      textBefore: "We see with our ",
      textAfter: "s.",
      options: ["eye", "ear", "toe", "knee"],
      correctIndex: 0,
    },
    {
      id: "unit-4-body-4",
      image: "",
      textBefore: "I kick the ball with my ",
      textAfter: ".",
      options: ["foot", "hand", "head", "nose"],
      correctIndex: 0,
    },
    {
      id: "unit-4-body-5",
      image: "",
      textBefore: "She touched her ",
      textAfter: " gently.",
      options: ["head", "desk", "book", "shoe"],
      correctIndex: 0,
    },
    {
      id: "unit-4-body-6",
      image: "",
      textBefore: "Clap your ",
      textAfter: "s together.",
      options: ["hand", "foot", "eye", "ear"],
      correctIndex: 0,
    },
  ],
} satisfies GameTopic;
