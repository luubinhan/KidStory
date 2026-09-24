import { MapPin } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit14AroundTown = {
  id: "unit-14",
  unitNumber: 14,
  title: "Around Town",
  subtitle: "",
  status: "current",
  icon: MapPin,
  youtubeVideoId: "EfD2k9beP-4",
  iconBgClass: "bg-emerald-100",
  iconColorClass: "text-emerald-600",
  words: [
    { id: "school", word: "school", translation: "trường học", image: "" },
    { id: "park", word: "park", translation: "công viên", image: "" },
    { id: "zoo", word: "zoo", translation: "sở thú", image: "" },
    { id: "store", word: "store", translation: "cửa hàng", image: "" },
    { id: "library", word: "library", translation: "thư viện", image: "" },
    { id: "restaurant", word: "restaurant", translation: "nhà hàng", image: "" },
    { id: "street", word: "street", translation: "đường phố", image: "" },
  ],
  practiceSentences: [
    { id: "unit-14-s-1", text: "let's go to the park" },
    { id: "unit-14-s-2", text: "where is the store" },
    { id: "unit-14-s-3", text: "it's next to the zoo" },
    { id: "unit-14-s-4", text: "let's go to the restaurant" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-14-mc-1",
      textBefore: "Let's go to the ",
      textAfter: ".",
      options: ["park", "school", "library", "street"],
      correctIndex: 0,
    },
    {
      id: "unit-14-mc-2",
      textBefore: "Where is the ",
      textAfter: "?",
      options: ["store", "zoo", "park", "school"],
      correctIndex: 0,
    },
    {
      id: "unit-14-mc-3",
      textBefore: "It's next to the ",
      textAfter: ".",
      options: ["zoo", "store", "library", "restaurant"],
      correctIndex: 0,
    },
    {
      id: "unit-14-mc-4",
      textBefore: "Let's go to the ",
      textAfter: ".",
      options: ["restaurant", "street", "school", "park"],
      correctIndex: 0,
    },
    {
      id: "unit-14-mc-5",
      textBefore: "We can read books at the ",
      textAfter: ".",
      options: ["library", "zoo", "store", "restaurant"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;
