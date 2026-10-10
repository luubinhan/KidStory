import { House } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit16ThingsAtHome = {
    id: "unit-16",
    unitNumber: 16,
    title: "Things at Home",
    subtitle: "",
    status: "current",
    icon: House,
    youtubeVideoId: "wf5ZL2k5PLo",
    iconBgClass: "bg-sky-100",
    iconColorClass: "text-sky-600",
    words: [
        {
            id: "chair",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/chair.mp3",
            word: "chair",
            image: "https://bachma.vn/wp-content/uploads/2022/04/ghe-nhua-duc-sankyo.jpg",
            translation: "cái ghế"
        },
        {
            id: "table",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/table.mp3",
            image: "https://vahaco.vn//ckfinder/userfiles/images/ban-lam-viec-chan-sat-gia-re-1m2-c1206.jpg",
            word: "table", translation: "cái bàn"
        },
        {
            id: "clock",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/clock.mp3",
            image: "https://donghoduyanh.com/images/products/2024/03/01/large/cmg817nr19_1709262480.jpg.webp",
            word: "clock", translation: "đồng hồ"
        },
        {
            id: "plates",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/plates.mp3",
            image: "https://cuahangminhlong.com/wp-content/uploads/2020/05/D%C4%A9a-tr%C3%B2n-25-cm-Jasmine-Ph%C6%B0%E1%BB%9Bc-L%E1%BB%99c-Th%E1%BB%8D.jpg",
            word: "plates", translation: "những cái đĩa"
        },
        {
            id: "colours",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/color.mp3",
            image: "https://cdn.britannica.com/62/234462-050-6CDEB78F/color-wheels-RYB-RGB.jpg",
            word: "colours", translation: "màu sắc"
        },
        {
            id: "food",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/food.mp3",
            image: "https://assets.grab.com/wp-content/uploads/sites/11/2020/06/25120507/124.jpg",
            word: "food", translation: "thức ăn"
        },
        {
            id: "toys",
            image: "https://kidsmebaby.vn/images/product/1621978374-combo%20do%20choi%203.jpg",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/toys.mp3",
            word: "toys", translation: "đồ chơi"
        },
    ],
    practiceSentences: [
        { id: "unit-16-s-1", text: "the clock is on the table" },
        { id: "unit-16-s-2", text: "the toys are next to the chair" },
    ],
    multipleChoiceQuestions: [
        {
            id: "unit-16-mc-1",
            textBefore: "The clock is ",
            textAfter: " the table.",
            options: ["on", "under", "in", "next to"],
            correctIndex: 0,
        },
        {
            id: "unit-16-mc-2",
            textBefore: "The toys are next to the ",
            textAfter: ".",
            options: ["chair", "food", "colours", "clock"],
            correctIndex: 0,
        },
        {
            id: "unit-16-mc-3",
            textBefore: "A ",
            textAfter: " tells the time.",
            options: ["clock", "chair", "table", "plate"],
            correctIndex: 0,
        },
        {
            id: "unit-16-mc-4",
            textBefore: "The toys ",
            textAfter: " next to the chair.",
            options: ["are", "is", "am", "be"],
            correctIndex: 0,
        },
        {
            id: "unit-16-mc-5",
            textBefore: "You can sit on a ",
            textAfter: ".",
            options: ["chair", "clock", "plate", "toy"],
            correctIndex: 0,
        },
    ],
    typedAnswerQuestions: [],
} satisfies CourseUnit;