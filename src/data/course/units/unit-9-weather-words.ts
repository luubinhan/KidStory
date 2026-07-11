import { CloudSun } from "lucide-react";
import type { CourseUnit } from "../../../types/course";
import { BG_UNITS } from "@/src/constants/images";

export const unit9WeatherWords = {
  id: "unit-9",
  unitNumber: 9,
  title: "Weather words",
  subtitle: "",
  status: "current",
  icon: CloudSun,
  youtubeVideoId: "QweyFFeqTgA",
  iconBgClass: "bg-sky-100",
  iconColorClass: "text-sky-600",
  backgroundUrl: BG_UNITS["bg-unit-9"],
  words: [
    { id: "sunny", word: "sunny", translation: "trời nắng", imageUrl: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757659533373/35611f19.jpg" },
    { id: "windy", word: "windy", translation: "trời nhiều gió", imageUrl: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757668025838/989a7fb8.jpg" },
    { id: "snowy", word: "snowy", translation: "trời có tuyết", imageUrl: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757665825163/3c9f2e7e.jpg" },
    { id: "rainy", word: "rainy", translation: "trời mưa", imageUrl: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757669960035/c46cc657.jpg" },
    { id: "cloudy", word: "cloudy", translation: "trời nhiều mây", imageUrl: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757657325749/9ae87f0a.jpg" },
    { id: "stormy", word: "stormy", translation: "trời giông bão", imageUrl: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757669304302/d2719759.jpg" },
    { id: "gloves", word: "gloves", translation: "găng tay", imageUrl: "https://cdn11.bigcommerce.com/s-rmuu4bbtny/images/stencil/1280x1280/products/418/5541/81Po83AqiUL._SL1500___49628.1743020070.jpg?c=2&format=webp" },
    { id: "coat", word: "coat", translation: "áo khoác", imageUrl: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757657854449/8529762c.jpg" },
  ],
  practiceSentences: [
    { id: "unit-9-s-1", text: "how's the weather" },
    { id: "unit-9-s-2", text: "it's sunny" },
    { id: "unit-9-s-3", text: "it's rainy" },
    { id: "unit-9-s-4", text: "wear a coat" },
    { id: "unit-9-s-5", text: "it's" },
    { id: "unit-9-s-6", text: "it's windy" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-9-mc-1",
      textBefore: "How's the ",
      textAfter: "?",
      options: ["weather", "banana", "teacher", "book"],
      correctIndex: 0,
    },
    {
      id: "unit-9-mc-2",
      textBefore: "It's ",
      textAfter: ".",
      options: ["sunny", "rainy", "stormy", "cloudy"],
      correctIndex: 0,
    },
    {
      id: "unit-9-mc-3",
      textBefore: "It's ",
      textAfter: ".",
      options: ["rainy", "sunny", "windy", "snowy"],
      correctIndex: 0,
    },
    {
      id: "unit-9-mc-4",
      textBefore: "Wear a ",
      textAfter: ".",
      options: ["coat", "gloves", "desk", "pencil"],
      correctIndex: 0,
    },
    {
      id: "unit-9-mc-5",
      textBefore: "It's ",
      textAfter: ".",
      options: ["windy", "coat", "gloves", "school"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;
