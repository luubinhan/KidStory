import { Activity } from "lucide-react";
import { BG_UNITS } from "@/src/constants/images";
import type { CourseUnit } from "../../../types/course";

export const unit17WhatAreTheyDoing = {
  id: "unit-17",
  unitNumber: 17,
  title: "What are they doing?",
  subtitle: "",
  status: "current",
  icon: Activity,
  backgroundUrl: BG_UNITS["bg-unit-1"],
  youtubeVideoId: "cB5f5yPHEZc",
  iconBgClass: "bg-violet-100",
  iconColorClass: "text-violet-600",
  words: [
    { id: "eat", 
      word: "eat",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/eat.mp3",
      image: "https://static.vecteezy.com/system/resources/previews/005/162/056/large_2x/cartoon-little-boy-eating-spaghetti-free-vector.jpg",
      translation: "ăn" 
    },
    { id: "drink", 
      word: "drink",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/drink.mp3",
      image: "https://aquafreshrosystem.com/wp-content/uploads/2016/03/men-drinking-water-from-bot.jpg",
      translation: "uống" 
    },
    { id: "sleep", 
      word: "sleep",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/sleep.mp3",
      image: "https://www.takingcharge.csh.umn.edu/sites/default/files/styles/landing_page_banner/public/1%20-%20header%20illustrations/Sleep.png.webp?itok=a37mcIhl",
      translation: "ngủ" 
    },
    { id: "cook", 
      word: "cook",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/cook.mp3",
      image: "https://d1z6f5143ueszi.cloudfront.net/image_attachments/11656/large_1648499849-shutterstock_1984460819__1_.jpg",
      translation: "nấu ăn" 
    },
    { id: "watch", 
      word: "watch",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/watch.mp3",
      image: "https://img.magnific.com/vector-mien-phi/nguoi-dan-ong-xem-tv-tren-ghe-sofa-voi-hinh-minh-hoa-coc-ca-phe-xem-tv-va-uong-ca-phe-thu-gian-tai-nha-tren-ghe-dai_1284-51608.jpg",
      translation: "xem" 
    },
    { id: "listen", 
      word: "listen",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/listen.mp3",
      image: "https://img.magnific.com/vector-cao-cap/co-be-thuong-thuc-am-nhac-voi-tai-nghe-vector-hoat-hinh_149195-1592.jpg",
      translation: "nghe" 
    },
    { id: "play", 
      word: "play",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/play.mp3",
      image: "https://img.magnific.com/hinh-chup-mien-phi/co-gai-choi-tro-choi-dien-tu-tren-may-tinh-xach-tay_23-2148963899.jpg",
      translation: "chơi" 
    },
  ],
  practiceSentences: [
    { id: "unit-17-s-1", text: "i eat an apple" },
    { id: "unit-17-s-2", text: "i drink milk" },
    { id: "unit-17-s-3", text: "i watch tv" },
    { id: "unit-17-s-4", text: "my mother cook dinner" },
    { id: "unit-17-s-5", text: "i sleep in my bed" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-17-mc-1",
      textBefore: "I ",
      textAfter: " an apple.",
      options: ["drink", "eat", "sleep", "cook"],
      correctIndex: 1,
    },
    {
      id: "unit-17-mc-2",
      textBefore: "I ",
      textAfter: " milk.",
      options: ["drink", "eat", "cook", "sleep"],
      correctIndex: 0,
    },
    {
      id: "unit-17-mc-3",
      textBefore: "I ",
      textAfter: ".",
      options: ["cook", "sleep", "watch tv", "eat"],
      correctIndex: 2,
    },
    {
      id: "unit-17-mc-4",
      textBefore: "My mother ",
      textAfter: " dinner.",
      options: ["sleep", "drink", "play video games", "cook"],
      correctIndex: 3,
    },
    {
      id: "unit-17-mc-5",
      textBefore: "I ",
      textAfter: " in my bed.",
      options: ["eat", "sleep", "drink", "cook"],
      correctIndex: 1,
    },
    {
      id: "unit-17-mc-6",
      textBefore: "I ",
      textAfter: ".",
      options: ["listen to music", "cook", "eat", "drink"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;
