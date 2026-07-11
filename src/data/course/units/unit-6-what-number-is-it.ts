import { Hash } from "lucide-react";
import { BG_UNITS } from "../../../constants/images";
import type { CourseUnit } from "../../../types/course";

export const unit6WhatNumberIsIt = {
  id: "unit-6",
  unitNumber: 6,
  title: "What number is it",
  subtitle: "",
  icon: Hash,
  backgroundUrl: BG_UNITS["bg-unit-6"],
  youtubeVideoId: "lIzEzQ_G96k",
  iconBgClass: "bg-amber-100",
  iconColorClass: "text-amber-600",
  words: [
    { id: "number", word: "number", translation: "số", image: "" },
    { id: "zero", word: "zero", translation: "0️⃣", image: "" },
    { id: "one", word: "one", translation: "1️⃣", image: "" },
    { id: "two", word: "two", translation: "2️⃣", image: "" },
    { id: "three", word: "three", translation: "3️⃣", image: "" },
    { id: "four", word: "four", translation: "4️⃣", image: "" },
    { id: "five", word: "five", translation: "5️⃣", image: "" },
    { id: "six", word: "six", translation: "6️⃣", image: "" },
    { id: "seven", word: "seven", translation: "7️⃣", image: "" },
    { id: "eight", word: "eight", translation: "8️⃣", image: "" },
    { id: "nine", word: "nine", translation: "9️⃣", image: "" },
    { id: "ten", word: "ten", translation: "🔟", image: "" },
  ],
  practiceSentences: [
    { id: "unit-6-s-1", text: "what number is it" },
    { id: "unit-6-s-2", text: "it's three" },
    { id: "unit-6-s-3", text: "what number is this" },
    { id: "unit-6-s-4", text: "this is seven" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-6-mc-1",
      textBefore: "What ",
      textAfter: " is it?",
      options: ["number", "color", "animal", "fruit"],
      correctIndex: 0,
    },
    {
      id: "unit-6-mc-2",
      textBefore: "It's ",
      textAfter: ".",
      options: ["three", "one", "five", "ten"],
      correctIndex: 0,
    },
    {
      id: "unit-6-mc-3",
      textBefore: "What number is ",
      textAfter: "?",
      options: ["this", "that", "three", "seven"],
      correctIndex: 0,
    },
    {
      id: "unit-6-mc-4",
      textBefore: "This is ",
      textAfter: ".",
      options: ["seven", "six", "eight", "four"],
      correctIndex: 0,
    },
    {
      id: "unit-6-mc-5",
      textBefore: "It is number ",
      textAfter: ".",
      options: ["ten", "five", "two", "one"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;