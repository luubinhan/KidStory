import type { GameTopic } from "../types/game";

const img = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/480/360`;
import { directions } from "./games/directions";
import { preposition } from "./games/preposition";

export const gameTopics: readonly GameTopic[] = [
  directions,
  preposition,
  {
    id: "job",
    title: "Job",
    description: "People who help us every day.",
    questions: [
      {
        id: "job-1",
        image: img("kidstory-job-1"),
        textBefore: "The ",
        textAfter: " helps us when we are sick.",
        options: ["teacher", "doctor", "chef", "pilot"],
        correctIndex: 1,
      },
      {
        id: "job-2",
        image: img("kidstory-job-2"),
        textBefore: "A ",
        textAfter: " flies an airplane.",
        options: ["farmer", "pilot", "artist", "driver"],
        correctIndex: 1,
      },
      {
        id: "job-3",
        image: img("kidstory-job-3"),
        textBefore: "The ",
        textAfter: " cooks food in a restaurant.",
        options: ["chef", "nurse", "builder", "singer"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "body-part",
    title: "Body part",
    description: "Name your head, hands, feet, and more.",
    questions: [
      {
        id: "body-1",
        image: img("kidstory-body-1"),
        textBefore: "We see with our ",
        textAfter: ".",
        options: ["ears", "eyes", "knees", "toes"],
        correctIndex: 1,
      },
      {
        id: "body-2",
        image: img("kidstory-body-2"),
        textBefore: "We hear with our ",
        textAfter: ".",
        options: ["mouth", "nose", "ears", "hair"],
        correctIndex: 2,
      },
      {
        id: "body-3",
        image: img("kidstory-body-3"),
        textBefore: "She waved with her ",
        textAfter: ".",
        options: ["foot", "hand", "neck", "back"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "clothes",
    title: "Clothes",
    description: "Shirts, shoes, hats, and what we wear.",
    questions: [
      {
        id: "clothes-1",
        image: img("kidstory-clothes-1"),
        textBefore: "In the rain, wear your ",
        textAfter: ".",
        options: ["sandals", "boots", "scarf", "belt"],
        correctIndex: 1,
      },
      {
        id: "clothes-2",
        image: img("kidstory-clothes-2"),
        textBefore: "It is sunny; put on a ",
        textAfter: ".",
        options: ["coat", "hat", "socks", "gloves"],
        correctIndex: 1,
      },
      {
        id: "clothes-3",
        image: img("kidstory-clothes-3"),
        textBefore: "Your ",
        textAfter: " keep your feet warm.",
        options: ["shirt", "pants", "socks", "ring"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "food",
    title: "Food",
    description: "Yummy words for things we eat.",
    questions: [
      {
        id: "food-1",
        image: img("kidstory-food-1"),
        textBefore: "For breakfast I like ",
        textAfter: " and milk.",
        options: ["cereal", "soap", "paper", "rock"],
        correctIndex: 0,
      },
      {
        id: "food-2",
        image: img("kidstory-food-2"),
        textBefore: "An ",
        textAfter: " is a fruit that is red or green.",
        options: ["apple", "chair", "cloud", "bike"],
        correctIndex: 0,
      },
      {
        id: "food-3",
        image: img("kidstory-food-3"),
        textBefore: "We drink ",
        textAfter: " from a cup when it is cold outside.",
        options: ["soup", "hot chocolate", "sand", "paint"],
        correctIndex: 1,
      },
    ],
  },
];

export function getGameTopic(id: string): GameTopic | undefined {
  return gameTopics.find((t) => t.id === id);
}
