import type { GameTopic } from "../../types/game";

export const pronouns = {
  id: "pronouns",
  title: "Pronouns",
  description: "We, you, they, he, and she.",
  questions: [
    {
      id: "pronouns-1",
      image:
        "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/games/pronouns/we.jpeg",
      textBefore: "",
      textAfter: " can sing",
      options: ["they", "you", "we", "he"],
      correctIndex: 2,
    },
    {
      id: "pronouns-2",
      image:
        "",
      textBefore: "",
      textAfter: " can draw",
      options: ["we", "she", "they", "you"],
      correctIndex: 3,
    },
    {
      id: "pronouns-3",
      image:
        "",
      textBefore: "",
      textAfter: " like ice cream",
      options: ["we", "he", "they", "she"],
      correctIndex: 2,
    },
    {
      id: "pronouns-4",
      image:
        "",
      textBefore: "",
      textAfter: " can swim",
      options: ["she", "he", "they", "you"],
      correctIndex: 1,
    },
    {
      id: "pronouns-5",
      image:
        "",
      textBefore: "",
      textAfter: " can dance",
      options: ["he", "they", "she", "we"],
      correctIndex: 2,
    },
  ],
} satisfies GameTopic;
