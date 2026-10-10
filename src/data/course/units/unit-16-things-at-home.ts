import { House } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit16ThingsAtHome = {
  id: "unit-16",
  unitNumber: 16,
  title: "Things at Home",
  subtitle: "",
  status: "current",
  icon: House,
  youtubeVideoId: "wf5ZL2k5PLo",
  iconBgClass: "bg-sky-100",
  iconColorClass: "text-sky-600",
  words: [
    { id: "chair", word: "chair", translation: "cái ghế" },
    { id: "table", word: "table", translation: "cái bàn" },
    { id: "clock", word: "clock", translation: "đồng hồ" },
    { id: "plates", word: "plates", translation: "những cái đĩa" },
    { id: "colours", word: "colours", translation: "màu sắc" },
    { id: "food", word: "food", translation: "thức ăn" },
    { id: "toys", word: "toys", translation: "đồ chơi" },
  ],
  practiceSentences: [
    { id: "unit-16-s-1", text: "the clock is on the table" },
    { id: "unit-16-s-2", text: "the toys are next to the chair" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-16-mc-1",
      textBefore: "The clock is ",
      textAfter: " the table.",
      options: ["on", "under", "in", "next to"],
      correctIndex: 0,
    },
    {
      id: "unit-16-mc-2",
      textBefore: "The toys are next to the ",
      textAfter: ".",
      options: ["chair", "food", "colours", "clock"],
      correctIndex: 0,
    },
    {
      id: "unit-16-mc-3",
      textBefore: "A ",
      textAfter: " tells the time.",
      options: ["clock", "chair", "table", "plate"],
      correctIndex: 0,
    },
    {
      id: "unit-16-mc-4",
      textBefore: "The toys ",
      textAfter: " next to the chair.",
      options: ["are", "is", "am", "be"],
      correctIndex: 0,
    },
    {
      id: "unit-16-mc-5",
      textBefore: "You can sit on a ",
      textAfter: ".",
      options: ["chair", "clock", "plate", "toy"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;