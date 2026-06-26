import type { GameTopic } from "../../../types/game";

export const Unit1School = {
  id: "unit-1-school",
  title: "School",
  description: "Classroom and school supplies.",
  questions: [
    {
      id: "unit-1-school-1",
      image: "",
      textBefore: "I go to ",
      textAfter: " every day.",
      options: ["school", "park", "shop", "zoo"],
      correctIndex: 0,
    },
    {
      id: "unit-1-school-2",
      image: "",
      textBefore: "The ",
      textAfter: " helps us learn.",
      options: ["teacher", "doctor", "driver", "chef"],
      correctIndex: 0,
    },
    {
      id: "unit-1-school-3",
      image: "",
      textBefore: "I write with a ",
      textAfter: ".",
      options: ["pencil", "spoon", "ball", "hat"],
      correctIndex: 0,
    },
    {
      id: "unit-1-school-4",
      image: "",
      textBefore: "I read a ",
      textAfter: " in class.",
      options: ["book", "shoe", "cup", "tree"],
      correctIndex: 0,
    },
    {
      id: "unit-1-school-5",
      image: "",
      textBefore: "My ",
      textAfter: " is in the classroom.",
      options: ["desk", "car", "bed", "boat"],
      correctIndex: 0,
    },
    {
      id: "unit-1-school-6",
      image: "",
      textBefore: "We put our bags on the ",
      textAfter: ".",
      options: ["floor", "desk", "ceiling", "window"],
      correctIndex: 1,
    },
  ],
} satisfies GameTopic;
