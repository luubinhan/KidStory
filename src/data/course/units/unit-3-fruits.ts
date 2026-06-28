import { Apple } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit3Fruits = {
  id: "unit-3",
  unitNumber: 3,
  title: "Fruits",
  subtitle: "",
  status: "current",
  icon: Apple,
  youtubeVideoId: "dDbNM3AhUOw",
  iconBgClass: "bg-rose-100",
  iconColorClass: "text-rose-600",
  words: [
    {
      id: "cherry",
      word: "cherry",
      translation: "quả anh đào",
      imageUrl: "https://media.istockphoto.com/id/506627545/photo/cherry-isolated-on-white-background.jpg",
      audio: "/sounds/cherry.mp3",
    },
    {
      id: "orange",
      word: "orange",
      translation: "quả cam",
      imageUrl: "https://www.quanta.org/thumbs/thumb-orange-640x480-orange.jpg",
      
    },
    {
      id: "pineapple",
      word: "pineapple",
      translation: "quả dứa",
      imageUrl: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1769956258594/edca6379.jpg",
     
    },
    {
      id: "banana",
      word: "banana",
      translation: "quả chuối",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/1280px-Banana-Single.jpg",
      audio: "https://dictionary.cambridge.org/vi/media/english/us_pron/b/ban/banan/banana.mp3",
    },
  ],
  practiceSentences: [
    { id: "unit-3-s-1", text: "is it an orange" },
    { id: "unit-3-s-2", text: "yes it is" },
    { id: "unit-3-s-3", text: "it's a cherry" },
    { id: "unit-3-s-4", text: "it is pineapple" },
    { id: "unit-3-s-5", text: "is it a melon" },
    { id: "unit-3-s-6", text: "no it isn't" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-3-mc-1",
      textBefore: "Is it an ",
      textAfter: "?",
      options: ["orange", "banana", "desk", "book"],
      correctIndex: 0,
    },
    {
      id: "unit-3-mc-2",
      textBefore: "It's a ",
      textAfter: ".",
      options: ["cherry", "pencil", "window", "chair"],
      correctIndex: 0,
    },
    {
      id: "unit-3-mc-3",
      textBefore: "It is ",
      textAfter: ".",
      options: ["pineapple", "teacher", "student", "school"],
      correctIndex: 0,
    },
    {
      id: "unit-3-mc-4",
      textBefore: "No it ",
      textAfter: ".",
      options: ["isn't", "is", "am", "are"],
      correctIndex: 0,
    },
    {
      id: "unit-3-mc-5",
      textBefore: "Is it a ",
      textAfter: "?",
      options: ["melon", "orange", "banana", "pineapple"],
      correctIndex: 0,
    },
  ],
} satisfies CourseUnit;