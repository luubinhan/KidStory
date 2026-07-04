import { Palette } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit5Colors = {
  id: "unit-5",
  unitNumber: 5,
  title: "Colors",
  subtitle: "",
  icon: Palette,
  backgroundUrl: "/images/bg-unit-5.png",
  youtubeVideoId: "7qiVlIpkIU8",
  iconBgClass: "bg-indigo-100",
  iconColorClass: "text-indigo-600",
  words: [
    { id: "red", word: "red", translation: "màu đỏ", imageUrl: "https://backdropshop.prasolutions.com.au/cdn/shop/products/SUPERIOR-PAPER-BACK-PAPER-SCARLET-2.75M-BY-11M_6f207131-d2e7-4533-a66c-f0c1be7eb516_large.jpg?v=1486453297" },
    { id: "black", word: "black", translation: "màu đen", imageUrl: "https://www.equilter.com/images/products/MMJETBBK.jpg" },
    { id: "blue", word: "blue", translation: "màu xanh dương", imageUrl: "https://backdropshop.prasolutions.com.au/cdn/shop/products/SUPERIOR-PAPER-BACK-PAPER-ROYAL-BLUE-1.35M-BY-11M-WITH-CORE_bb597a3b-ae74-498f-97d3-4d74acf77dfb_large.jpg?v=1486453270" },
    { id: "white", word: "white", translation: "màu trắng", imageUrl: "https://www.ober-surfaces.com/cache/images/product/34173cb38f07f89ddbebc2ac9128303f-1301-oberflex_purepapercolor_clawed_white001_detail.jpg" },
    { id: "gray", word: "gray", translation: "màu xám", imageUrl: "https://s7d9.scene7.com/is/image/daltile/AO_MN44_24x24_Gray_Polished?$PRODUCTIMAGE$" },
    { id: "white", word: "white", translation: "màu trắng", imageUrl: "https://www.ober-surfaces.com/cache/images/product/34173cb38f07f89ddbebc2ac9128303f-1301-oberflex_purepapercolor_clawed_white001_detail.jpg" },
    { id: "purple", word: "purple", translation: "màu tím", imageUrl: "https://backdropshop.prasolutions.com.au/cdn/shop/products/SUPERIOR-PAPER-BACK-PAPER-DEEP-PURPLE-2.75M-BY-11M_91c0251c-92c2-4b6f-b17e-e3f329a82f03_grande.jpg?v=1486453308" },
    
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
  typedAnswerQuestions: [],
} satisfies CourseUnit;