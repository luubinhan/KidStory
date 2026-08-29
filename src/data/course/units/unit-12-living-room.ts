import { Armchair } from "lucide-react";
import type { CourseUnit } from "../../../types/course";
import { BG_UNITS } from "@/src/constants/images";

export const unit12LivingRoom = {
  id: "unit-12",
  unitNumber: 12,
  title: "Living room",
  subtitle: "",
  status: "current",
  icon: Armchair,
  youtubeVideoId: "6dDzBGPcnJM",
  backgroundUrl: BG_UNITS["bg-unit-3"],
  iconBgClass: "bg-amber-100",
  iconColorClass: "text-amber-600",
  words: [
    { id: "bed", word: "bed", translation: "cái giường", image: "" },
    { id: "sofa", word: "sofa", translation: "ghế sofa", image: "" },
    { id: "tv", word: "TV", translation: "tivi", image: "" },
    { id: "shower", word: "shower", translation: "vòi tắm", image: "" },
    { id: "sink", word: "sink", translation: "bồn rửa", image: "" },
    { id: "lamp", word: "lamp", translation: "đèn", image: "" },
    { id: "table", word: "table", translation: "cái bàn", image: "" },
    { id: "wall", word: "wall", translation: "bức tường", image: "" },
  ],
  practiceSentences: [
    { id: "unit-12-s-1", text: "the lamp is on the table" },
    { id: "unit-12-s-2", text: "the bed is behind the wall" },
    { id: "unit-12-s-3", text: "the tv is in front of the sofa" },
    { id: "unit-12-s-4", text: "the shower is next to the sink" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-12-mc-1",
      textBefore: "The lamp is on the ",
      textAfter: ".",
      options: ["table", "wall", "bed", "sofa"],
      correctIndex: 0,
    },
    {
      id: "unit-12-mc-2",
      textBefore: "The bed is behind the ",
      textAfter: ".",
      options: ["wall", "lamp", "table", "tv"],
      correctIndex: 0,
    },
    {
      id: "unit-12-mc-3",
      textBefore: "The TV is in front of the ",
      textAfter: ".",
      options: ["sofa", "sink", "bed", "wall"],
      correctIndex: 0,
    },
    {
      id: "unit-12-mc-4",
      textBefore: "The shower is next to the ",
      textAfter: ".",
      options: ["sink", "lamp", "table", "bed"],
      correctIndex: 0,
    },
    {
      id: "unit-12-mc-5",
      textBefore: "The ",
      textAfter: " is next to the sink.",
      options: ["lamp", "bed", "sofa", "wall"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;
