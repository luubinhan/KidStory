import { Activity } from "lucide-react";
import { BG_UNITS } from "@/src/constants/images";
import type { CourseUnit } from "../../../types/course";

export const unit17WhatAreTheyDoing = {
  id: "unit-17",
  unitNumber: 17,
  title: "What are they doing?",
  subtitle: "",
  status: "current",
  icon: Activity,
  backgroundUrl: BG_UNITS["bg-unit-1"],
  youtubeVideoId: "cB5f5yPHEZc",
  iconBgClass: "bg-violet-100",
  iconColorClass: "text-violet-600",
  words: [
    { id: "eat", word: "eat", translation: "ăn" },
    { id: "drink", word: "drink", translation: "uống" },
    { id: "sleep", word: "sleep", translation: "ngủ" },
    { id: "cook", word: "cook", translation: "nấu ăn" },
    { id: "watch-tv", word: "watch tv", translation: "xem tivi" },
    { id: "listen-to-music", word: "listen to music", translation: "nghe nhạc" },
    { id: "play-video-games", word: "play video games", translation: "chơi trò chơi điện tử" },
  ],
  practiceSentences: [
    { id: "unit-17-s-1", text: "i eat an apple" },
    { id: "unit-17-s-2", text: "i drink milk" },
    { id: "unit-17-s-3", text: "i watch tv" },
    { id: "unit-17-s-4", text: "my mother cook dinner" },
    { id: "unit-17-s-5", text: "i sleep in my bed" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-17-mc-1",
      textBefore: "I ",
      textAfter: " an apple.",
      options: ["drink", "eat", "sleep", "cook"],
      correctIndex: 1,
    },
    {
      id: "unit-17-mc-2",
      textBefore: "I ",
      textAfter: " milk.",
      options: ["drink", "eat", "cook", "sleep"],
      correctIndex: 0,
    },
    {
      id: "unit-17-mc-3",
      textBefore: "I ",
      textAfter: ".",
      options: ["cook", "sleep", "watch tv", "eat"],
      correctIndex: 2,
    },
    {
      id: "unit-17-mc-4",
      textBefore: "My mother ",
      textAfter: " dinner.",
      options: ["sleep", "drink", "play video games", "cook"],
      correctIndex: 3,
    },
    {
      id: "unit-17-mc-5",
      textBefore: "I ",
      textAfter: " in my bed.",
      options: ["eat", "sleep", "drink", "cook"],
      correctIndex: 1,
    },
    {
      id: "unit-17-mc-6",
      textBefore: "I ",
      textAfter: ".",
      options: ["listen to music", "cook", "eat", "drink"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;
