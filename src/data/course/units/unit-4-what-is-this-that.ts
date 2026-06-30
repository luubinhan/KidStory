import { HelpCircle } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit4WhatIsThisThat = {
  id: "unit-4",
  unitNumber: 4,
  title: "What is this/that?",
  subtitle: "",
  icon: HelpCircle,
  youtubeVideoId: "7qiVlIpkIU8",
  iconBgClass: "bg-emerald-100",
  iconColorClass: "text-emerald-600",
  words: [
    { id: "dog", word: "dog", translation: "con chó", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dog_Breeds.jpg" },
    { id: "cow", word: "cow", translation: "con bò", imageUrl: "https://assets.farmsanctuary.org/content/uploads/2025/02/05152106/2023_06-09_FSNY_Aggie_cow_LH_4179-1600x1065.jpg" },
    { id: "duck", word: "duck", translation: "con vịt", imageUrl: "https://media.4-paws.org/e/b/a/f/ebafc46d9fcca9f374d5990f8f9c832fdb04bb05/VIER%20PFOTEN_2019-07-18_013-2890x2000-1920x1329.webp" },
    { id: "cat", word: "cat", translation: "con mèo", imageUrl: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187.jpg?w=1436&h=958" },
  ],
  practiceSentences: [
    { id: "unit-4-s-1", text: "what is this" },
    { id: "unit-4-s-2", text: "this is a dog" },
    { id: "unit-4-s-3", text: "this is a cat" },
    { id: "unit-4-s-4", text: "what is that" },
    { id: "unit-4-s-5", text: "that is a cow" },
    { id: "unit-4-s-6", text: "that is a duck" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-4-mc-1",
      textBefore: "What is ",
      textAfter: "?",
      options: ["this", "dog", "cow", "duck"],
      correctIndex: 0,
    },
    {
      id: "unit-4-mc-2",
      textBefore: "This is a ",
      textAfter: ".",
      options: ["dog", "cat", "duck", "cow"],
      correctIndex: 0,
    },
    {
      id: "unit-4-mc-3",
      textBefore: "What is ",
      textAfter: "?",
      options: ["that", "this", "dog", "cat"],
      correctIndex: 0,
    },
    {
      id: "unit-4-mc-4",
      textBefore: "That is a ",
      textAfter: ".",
      options: ["cow", "duck", "dog", "cat"],
      correctIndex: 0,
    },
    {
      id: "unit-4-mc-5",
      textBefore: "That is a ",
      textAfter: ".",
      options: ["duck", "cow", "cat", "dog"],
      correctIndex: 0,
    },
  ],
} satisfies CourseUnit;
