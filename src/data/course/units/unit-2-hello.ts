import { MessageCircle } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit2Hello = {
  id: "unit-2",
  unitNumber: 2,
  title: "Hello, How are you?",
  subtitle: "",
  icon: MessageCircle,
  youtubeVideoId: "by1QAoRcc-U",
  iconBgClass: "bg-sky-100",
  iconColorClass: "text-sky-600",
  words: [
    { id: "student", word: "student", translation: "học sinh", imageUrl: "https://www.eurokidsindia.com/blog/wp-content/uploads/2024/10/Top10_Essential_Trait_GoodStudent.jpg-870x437.jpg" },
    { id: "fine", word: "fine", translation: "khỏe", imageUrl: "" },
  ],
  practiceSentences: [
    { id: "unit-2-s-1", text: "are you a student" },
    { id: "unit-2-s-2", text: "yes i am" },
    { id: "unit-2-s-3", text: "how are you" },
    { id: "unit-2-s-4", text: "i am fine" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-2-mc-1",
      textBefore: "Are you a ",
      textAfter: "?",
      options: ["student", "teacher", "doctor", "driver"],
      correctIndex: 0,
    },
    {
      id: "unit-2-mc-2",
      textBefore: "I am ",
      textAfter: ".",
      options: ["fine", "sad", "big", "red"],
      correctIndex: 0,
    },
    {
      id: "unit-2-mc-3",
      textBefore: "",
      textAfter: " you a student?",
      options: ["Are", "Is", "Am", "Do"],
      correctIndex: 0,
    },
    {
      id: "unit-2-mc-4",
      textBefore: "How are ",
      textAfter: "?",
      options: ["you", "I", "we", "they"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;
