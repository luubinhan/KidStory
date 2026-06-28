import { Palette } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit5Colors = {
  id: "unit-5",
  unitNumber: 5,
  title: "Colors",
  subtitle: "",
  status: "current",
  icon: Palette,
  youtubeVideoId: "7qiVlIpkIU8",
  iconBgClass: "bg-indigo-100",
  iconColorClass: "text-indigo-600",
  words: [
    { id: "red", word: "red", translation: "màu đỏ", imageUrl: "" },
    { id: "black", word: "black", translation: "màu đen", imageUrl: "" },
    { id: "blue", word: "blue", translation: "màu xanh dương", imageUrl: "" },
    { id: "white", word: "white", translation: "màu trắng", imageUrl: "" },
  ],
  practiceSentences: [
    { id: "unit-5-s-1", text: "it's red" },
    { id: "unit-5-s-2", text: "it's black" },
    { id: "unit-5-s-3", text: "what color is it" },
    { id: "unit-5-s-4", text: "it's blue" },
    { id: "unit-5-s-5", text: "is it yellow" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-5-mc-1",
      textBefore: "It's ",
      textAfter: ".",
      options: ["red", "blue", "white", "black"],
      correctIndex: 0,
    },
    {
      id: "unit-5-mc-2",
      textBefore: "It's ",
      textAfter: ".",
      options: ["black", "white", "blue", "red"],
      correctIndex: 0,
    },
    {
      id: "unit-5-mc-3",
      textBefore: "What color is ",
      textAfter: "?",
      options: ["it", "they", "we", "you"],
      correctIndex: 0,
    },
    {
      id: "unit-5-mc-4",
      textBefore: "It's ",
      textAfter: ".",
      options: ["blue", "red", "black", "white"],
      correctIndex: 0,
    },
    {
      id: "unit-5-mc-5",
      textBefore: "Is it ",
      textAfter: "?",
      options: ["yellow", "blue", "red", "black"],
      correctIndex: 0,
    },
  ],
} satisfies CourseUnit;