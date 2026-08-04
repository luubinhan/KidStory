import { Bike } from "lucide-react";
import type { CourseUnit } from "../../../types/course";
import { BG_UNITS } from "@/src/constants/images";

export const unit10WhatsThat = {
  id: "unit-10",
  unitNumber: 10,
  title: "What's that",
  subtitle: "",
  status: "current",
  icon: Bike,
  youtubeVideoId: "okde2DTrSnw",
  iconBgClass: "bg-cyan-100",
  iconColorClass: "text-cyan-600",
  backgroundUrl: BG_UNITS["bg-unit-10"],
  words: [
    {
      id: "bike",
      audio: "/sounds/bike.mp3",
      word: "bike", translation: "xe đạp", image: "https://shop.reidbikes.com/cdn/shop/files/mtb-sport-275-mountain-bike-my24-black-reid-bikes-558544.png"
    },
    {
      id: "table",
      audio: "/sounds/table.mp3",
      word: "table",
      translation: "cái bàn",
      image: "https://vox-files.com/assets/file/product/main/st_stol_rozkladany_prostokatny_oak_none1.jpg"
    },
    {
      id: "camera",
      audio: "/sounds/camera.mp3",
      word: "camera",
      translation: "máy ảnh",
      image: "https://xcamera.com.vn/wp-content/uploads/2025/08/FUJIFILM-X-M5.jpg"
    },
    {
      id: "block",
      audio: "/sounds/block.mp3",
      word: "block",
      translation: "khối đồ chơi",
      image: "https://m.media-amazon.com/images/I/813ZsAM84pL._AC_SX679_.jpg"
    },
    {
      id: "robot",
      audio: "/sounds/robot.mp3",
      word: "robot",
      translation: "rô-bốt",
      image: "https://cdn2.tuoitre.vn/thumb_w/730/471584752817336320/2026/6/7/edit-robot-1780798455727552819811.png"
    },
    {
      id: "marker",
      audio: "/sounds/marker.mp3",
      word: "marker",
      translation: "bút lông",
      image: "https://images.penguinmagic.com/images/soc_products/medium/63343-full.png"
    },
    {
      id: "tablet",
      audio: "/sounds/tablet.mp3",
      word: "tablet",
      translation: "máy tính bảng",
      image: "https://consumer.huawei.com/dam/content/dam/huawei-cbg-site/common/mkt/plp-x/tablets-v5/1211-2025-huawei-flagship-product-launch/product-shelf-and-pop-up/matepad-series/huawei-matepad-11-5-s-2026.jpg"
    },
  ],
  practiceSentences: [
    { id: "unit-10-s-1", text: "those are my robots" },
    { id: "unit-10-s-2", text: "these are her markers" },
    { id: "unit-10-s-3", text: "these are her cameras" },
    { id: "unit-10-s-4", text: "those are my blocks" },
    { id: "unit-10-s-5", text: "that is her puzzle" },
    { id: "unit-10-s-6", text: "this is his tablet" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-10-mc-1",
      textBefore: "Those are my ",
      textAfter: ".",
      options: ["robots", "table", "camera", "book"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-2",
      textBefore: "These are her ",
      textAfter: ".",
      options: ["markers", "bike", "chair", "apple"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-3",
      textBefore: "These are her ",
      textAfter: ".",
      options: ["cameras", "tablets", "windows", "pencils"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-4",
      textBefore: "Those are my ",
      textAfter: ".",
      options: ["blocks", "robot", "marker", "school"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-5",
      textBefore: "That is her ",
      textAfter: ".",
      options: ["puzzle", "tablet", "camera", "banana"],
      correctIndex: 0,
    },
    {
      id: "unit-10-mc-6",
      textBefore: "This is his ",
      textAfter: ".",
      options: ["tablet", "markers", "blocks", "robots"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;