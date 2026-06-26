import type { GameTopic } from "../../../types/game";

export const Unit2Friends = {
  id: "unit-2-friends",
  title: "My Friends",
  description: "Greetings and names.",
  questions: [
    {
      id: "unit-2-friends-1",
      image: "",
      textBefore: "She is my ",
      textAfter: ".",
      options: ["friend", "teacher", "doctor", "driver"],
      correctIndex: 0,
    },
    {
      id: "unit-2-friends-2",
      image: "",
      textBefore: "I say ",
      textAfter: " to my friend.",
      options: ["hello", "goodbye", "sorry", "please"],
      correctIndex: 0,
    },
    {
      id: "unit-2-friends-3",
      image: "",
      textBefore: "What is your ",
      textAfter: "?",
      options: ["name", "age", "colour", "food"],
      correctIndex: 0,
    },
    {
      id: "unit-2-friends-4",
      image: "",
      textBefore: "We wave and say ",
      textAfter: ".",
      options: ["goodbye", "hello", "thanks", "yes"],
      correctIndex: 0,
    },
    {
      id: "unit-2-friends-5",
      image: "",
      textBefore: "My friend has a big ",
      textAfter: ".",
      options: ["smile", "car", "house", "book"],
      correctIndex: 0,
    },
    {
      id: "unit-2-friends-6",
      image: "",
      textBefore: "I play with my ",
      textAfter: " at school.",
      options: ["friends", "cars", "shoes", "desks"],
      correctIndex: 0,
    },
  ],
} satisfies GameTopic;
