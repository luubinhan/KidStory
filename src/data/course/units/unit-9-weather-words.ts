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
        {
            id: "sunny",
            word: "sunny",
            translation: "trời nắng",
            image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757659533373/35611f19.jpg",
            audio: "/sounds/sunny.mp3"
        },
        {
            id: "windy",
            audio: "/sounds/windy.mp3",
            word: "windy",
            translation: "trời nhiều gió",
            image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757668025838/989a7fb8.jpg"
        },
        {
            id: "snowy",
            audio: "/sounds/snowy.mp3",
            word: "snowy",
            translation: "trời có tuyết",
            image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757665825163/3c9f2e7e.jpg"
        },
        {
            id: "rainy",
            audio: "/sounds/rainy.mp3",
            word: "rainy",
            translation: "trời mưa",
            image: "https://kalingatv.com/wp-content/uploads/2018/08/Rainy-Day.jpg"
        },
        {
            id: "cloudy",
            audio: "/sounds/cloudy.mp3",
            word: "cloudy",
            translation: "trời nhiều mây",
            image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757657325749/9ae87f0a.jpg"
        },
        {
            id: "stormy",
            audio: "/sounds/stormy.mp3",
            word: "stormy",
            translation: "trời giông bão",
            image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757669304302/d2719759.jpg"
        },
        {
            id: "gloves",
            audio: "/sounds/glove.mp3",
            word: "gloves",
            translation: "găng tay",
            image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1769874045804/cfda3e52.jpg"
        },
        {
            id: "coat",
            audio: "/sounds/coat.mp3",
            word: "coat",
            translation: "áo khoác",
            image: "https://canifa.com/blog/wp-content/uploads/2024/10/coat-va-jacket-khac-nhau-nhu-the-nao-2.jpg.webp"
        },
    ],
    practiceSentences: [
        { id: "unit-9-s-1", text: "how's the weather" },
        { id: "unit-9-s-2", text: "it's sunny" },
        { id: "unit-9-s-3", text: "it's rainy" },
        { id: "unit-9-s-4", text: "wear a coat" },
        { id: "unit-9-s-5", text: "it's cloudy" },
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
            image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757659533373/35611f19.jpg",
            options: ["sunny", "rainy", "stormy", "cloudy"],
            correctIndex: 0,
        },
        {
            id: "unit-9-mc-3",
            textBefore: "It's ",
            textAfter: ".",
            image: "https://kalingatv.com/wp-content/uploads/2018/08/Rainy-Day.jpg",
            options: ["rainy", "sunny", "windy", "snowy"],
            correctIndex: 0,
        },
        {
            id: "unit-9-mc-4",
            textBefore: "Wear a ",
            textAfter: ".",
            options: ["coat", "gloves", "desk", "pencil"],
            correctIndex: 0,
            image: "https://canifa.com/blog/wp-content/uploads/2024/10/coat-va-jacket-khac-nhau-nhu-the-nao-2.jpg.webp",
        },
        {
            id: "unit-9-mc-5",
            textBefore: "It's ",
            textAfter: ".",
            options: ["windy", "coat", "gloves", "school"],
            correctIndex: 0,
            image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757668025838/989a7fb8.jpg",
        },
    ],
    typedAnswerQuestions: [],
} satisfies CourseUnit;
