import { Bike } from "lucide-react";
import type { CourseUnit } from "../../../types/course";
import { BG_UNITS } from "@/src/constants/images";

export const unit10WhatsThat = {
  id: "unit-10",
  unitNumber: 10,
  title: "What's that",
  subtitle: "",
  status: "current",
  icon: Bike,
  youtubeVideoId: "okde2DTrSnw",
  iconBgClass: "bg-cyan-100",
  iconColorClass: "text-cyan-600",
  backgroundUrl: BG_UNITS["bg-unit-10"],
  words: [
    { id: "bike", word: "bike", translation: "xe đạp", image: "" },
    { id: "table", word: "table", translation: "cái bàn", image: "" },
    { id: "camera", word: "camera", translation: "máy ảnh", image: "" },
    { id: "block", word: "block", translation: "khối đồ chơi", image: "" },
    { id: "robot", word: "robot", translation: "rô-bốt", image: "" },
    { id: "marker", word: "marker", translation: "bút lông", image: "" },
    { id: "tablet", word: "tablet", translation: "máy tính bảng", image: "" },
  ],
  practiceSentences: [
    { id: "unit-10-s-1", text: "those are my robots" },
    { id: "unit-10-s-2", text: "these are her markers" },
    { id: "unit-10-s-3", text: "these are her cameras" },
    { id: "unit-10-s-4", text: "those are my blocks" },
    { id: "unit-10-s-5", text: "that is her puzzle" },
    { id: "unit-10-s-6", text: "this is his tablet" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-10-mc-1",
      textBefore: "Those are my ",
      textAfter: ".",
      options: ["robots", "table", "camera", "book"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-2",
      textBefore: "These are her ",
      textAfter: ".",
      options: ["markers", "bike", "chair", "apple"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-3",
      textBefore: "These are her ",
      textAfter: ".",
      options: ["cameras", "tablets", "windows", "pencils"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-4",
      textBefore: "Those are my ",
      textAfter: ".",
      options: ["blocks", "robot", "marker", "school"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-5",
      textBefore: "That is her ",
      textAfter: ".",
      options: ["puzzle", "tablet", "camera", "banana"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-6",
      textBefore: "This is his ",
      textAfter: ".",
      options: ["tablet", "markers", "blocks", "robots"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;