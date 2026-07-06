import { Sun } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit1Greetings = {
  id: "unit-1",
  unitNumber: 1,
  title: "Greetings",
  subtitle: "",
  icon: Sun,
  backgroundUrl: "/images/bg-unit-1.png",
  youtubeVideoId: "by1QAoRcc-U",
  iconBgClass: "bg-amber-100",
  iconColorClass: "text-amber-600",
  words: [
    { id: "morning", word: "morning", translation: "buổi sáng" },
    { id: "afternoon", word: "afternoon", translation: "buổi chiều"},
    { id: "evening", word: "evening", translation: "buổi tối"},
    { id: "night", word: "night", translation: "ban đêm"},
  ],
  practiceSentences: [
    { id: "unit-1-s-1", text: "hello" },
    { id: "unit-1-s-2", text: "good morning" },
    { id: "unit-1-s-3", text: "good afternoon" },
    { id: "unit-1-s-4", text: "good evening" },
    { id: "unit-1-s-5", text: "good night" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-1-mc-1",
      textBefore: "Good ",
      textAfter: ".",
      options: ["morning", "afternoon", "book", "desk"],
      correctIndex: 0,
    },
    {
      id: "unit-1-mc-2",
      textBefore: "Good ",
      textAfter: ".",
      options: ["night", "morning", "pencil", "tree"],
      correctIndex: 0,
    },
    {
      id: "unit-1-mc-3",
      textBefore: "We say good ",
      textAfter: " in the afternoon.",
      options: ["afternoon", "morning", "night", "school"],
      correctIndex: 0,
    },
    {
      id: "unit-1-mc-4",
      textBefore: "",
      textAfter: " morning.",
      options: ["Good", "Bad", "Big", "Red"],
      correctIndex: 0,
    },
    {
      id: "unit-1-mc-5",
      textBefore: "I say ",
      textAfter: ".",
      options: ["hello", "goodbye", "sorry", "please"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;
