import { Shirt } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit18WhatAreTheyWearing = {
  id: "unit-18",
  unitNumber: 18,
  title: "What are they wearing?",
  subtitle: "",
  status: "current",
  icon: Shirt,
  youtubeVideoId: "FIo1_1-xg60",
  iconBgClass: "bg-lime-100",
  iconColorClass: "text-lime-700",
  words: [
    { id: "cap", word: "cap", translation: "mũ lưỡi trai" },
    { id: "jeans", word: "jeans", translation: "quần jeans" },
    { id: "sneakers", word: "sneakers", translation: "giày thể thao" },
    { id: "sunglasses", word: "sunglasses", translation: "kính râm" },
    { id: "coat", word: "coat", translation: "áo khoác" },
    { id: "shirt", word: "shirt", translation: "áo sơ mi" },
    { id: "flip-flops", word: "flip-flops", translation: "dép xỏ ngón" },
  ],
  practiceSentences: [
    { id: "unit-18-s-1", text: "he is wearing jeans" },
    { id: "unit-18-s-2", text: "she is wearing flip-flops" },
    { id: "unit-18-s-3", text: "they are wearing sneakers" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-18-mc-1",
      textBefore: "He is wearing ",
      textAfter: ".",
      options: ["jeans", "sunglasses", "a cap", "a coat"],
      correctIndex: 0,
    },
    {
      id: "unit-18-mc-2",
      textBefore: "She is wearing ",
      textAfter: ".",
      options: ["a shirt", "flip-flops", "a coat", "jeans"],
      correctIndex: 1,
    },
    {
      id: "unit-18-mc-3",
      textBefore: "They are wearing ",
      textAfter: ".",
      options: ["sunglasses", "a cap", "sneakers", "a shirt"],
      correctIndex: 2,
    },
    {
      id: "unit-18-mc-4",
      textBefore: "You wear a cap on your ",
      textAfter: ".",
      options: ["feet", "head", "hands", "legs"],
      correctIndex: 1,
    },
    {
      id: "unit-18-mc-5",
      textBefore: "You wear sunglasses over your ",
      textAfter: ".",
      options: ["eyes", "ears", "knees", "hands"],
      correctIndex: 0,
    },
    {
      id: "unit-18-mc-6",
      textBefore: "He is wearing a shirt under his ",
      textAfter: ".",
      options: ["sneakers", "flip-flops", "coat", "cap"],
      correctIndex: 2,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;