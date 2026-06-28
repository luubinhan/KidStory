import { BookOpen } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit7IsHeATeacher = {
  id: "unit-7",
  unitNumber: 7,
  title: "Is he a teacher",
  subtitle: "",
  status: "current",
  icon: BookOpen,
  youtubeVideoId: "lIzEzQ_G96k",
  iconBgClass: "bg-cyan-100",
  iconColorClass: "text-cyan-600",
  words: [
    { id: "teacher", word: "teacher", translation: "giáo viên", imageUrl: "" },
    { id: "doctor", word: "doctor", translation: "bác sĩ", imageUrl: "" },
    { id: "nurse", word: "nurse", translation: "y tá", imageUrl: "" },
  ],
  practiceSentences: [
    { id: "unit-7-s-1", text: "is he a teacher" },
    { id: "unit-7-s-2", text: "yes he is" },
    { id: "unit-7-s-3", text: "is he a doctor" },
    { id: "unit-7-s-4", text: "no, he isn't" },
    { id: "unit-7-s-5", text: "is she a nurse" },
    { id: "unit-7-s-6", text: "yes she is" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-7-mc-1",
      textBefore: "Is he a ",
      textAfter: "?",
      options: ["teacher", "doctor", "nurse", "student"],
      correctIndex: 0,
    },
    {
      id: "unit-7-mc-2",
      textBefore: "Yes he ",
      textAfter: ".",
      options: ["is", "isn't", "are", "am"],
      correctIndex: 0,
    },
    {
      id: "unit-7-mc-3",
      textBefore: "Is he a ",
      textAfter: "?",
      options: ["doctor", "teacher", "nurse", "book"],
      correctIndex: 0,
    },
    {
      id: "unit-7-mc-4",
      textBefore: "No, he ",
      textAfter: ".",
      options: ["isn't", "is", "are", "am"],
      correctIndex: 0,
    },
    {
      id: "unit-7-mc-5",
      textBefore: "Is she a ",
      textAfter: "?",
      options: ["nurse", "teacher", "doctor", "desk"],
      correctIndex: 0,
    },
  ],
} satisfies CourseUnit;