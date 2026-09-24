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
    { id: "school", word: "school", translation: "trường học", image: "https://dictionary.cambridge.org/vi/images/full/school_noun_002_32354.jpg?version=6.0.83" },
    { id: "park", word: "park", translation: "công viên", image: "https://app-api.glodival.vn/storage/4/images/nghia-do-park-1756952513RgFVp.jpg" },
    { id: "zoo", word: "zoo", translation: "sở thú", image: "https://image.vietnamnews.vn/uploadvnnews/Article/2024/12/16/393820_84.jpg" },
    { id: "store", word: "store", translation: "cửa hàng", image: "https://image.vietnix.vn/wp-content/uploads/2022/08/grocery-store.webp" },
    { id: "library", word: "library", translation: "thư viện", image: "https://www.vietnambooking.com/wp-content/uploads/2017/03/tin-tuc-thu-vien-lon-nhat-the-gioi-10-3-2017.jpg" },
    { id: "restaurant", word: "restaurant", translation: "nhà hàng", image: "https://statics.vincom.com.vn/xu-huong/nha-hang-da-nang/crystal-jade.png" },
    { id: "street", word: "street", translation: "đường phố", image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/29/914509/Duong-Pho.jpg" },
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
