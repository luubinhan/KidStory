import { House } from "lucide-react";
import type { CourseUnit } from "../../../types/course";
import { BG_UNITS } from "@/src/constants/images";

export const unit13RoomsInHouse = {
    id: "unit-13",
    unitNumber: 13,
    title: "Rooms in house",
    subtitle: "",
    status: "current",
    icon: House,
    youtubeVideoId: "WfLBN0FVYNM",
    backgroundUrl: BG_UNITS["bg-unit-13"],
    iconBgClass: "bg-sky-100",
    iconColorClass: "text-sky-600",
    words: [
        {
            id: "bedroom",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/bedroom.mp3",
            word: "bedroom", 
            translation: "phòng ngủ",
            image: "https://dkorinteriors.com/wp-content/uploads/2022/03/Bay-Harbor-Island-Residence-21.webp"
        },
        {
            id: "bathroom",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/bathroom.mp3",
            word: "bathroom",
            translation: "phòng tắm",
            image: "https://kbhi.com.au/wp-content/uploads/2025/03/bath-renovation.jpg"
        },
        {
            id: "living-room",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/living-room.mp3",
            word: "living room",
            translation: "phòng khách",
            image: "https://media.designcafe.com/wp-content/uploads/2022/12/20165040/eclectic-living-room-with-wall-mounted-tv-unit.jpg"
        },
        {
            id: "kitchen",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/kitchen.mp3",
            word: "kitchen",
            translation: "nhà bếp",
            image: "https://st.hzcdn.com/simgs/71d118620470598a_16-0042/home-design.jpg"
        },
        {
            id: "garage",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/garage.mp3",
            word: "garage",
            translation: "ga-ra",
            image: "https://www.self-build.co.uk/wp-content/uploads/2023/07/Oakwrights-building-a-garage-guide_1-e1746097063932.webp"
        },
        {
            id: "garden",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/garden.mp3",
            word: "garden",
            translation: "khu vườn",
            image: "https://anpsa.org.au/wp-content/uploads/McMillan-garden-Melbourne-image-Deb-McMillan-1.jpg"
        },
        {
            id: "house",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/house.mp3",
            word: "house",
            translation: "ngôi nhà",
            image: "https://decoxdesign.com/upload/images/101-mau-nha-mai-nhat-2-tang-dep-hien-dai-thiet-ke-moi-2026.png"
        },
        {
            id: "big",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/big.mp3",
            word: "big",
            translation: "to, lớn",
            image: "https://assets.blog.engoo.com/wp-content/uploads/sites/9/2024/09/20034228/big_1-1024x768.jpg.webp"
        },
        {
            id: "small",
            audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/small.mp3",
            word: "small",
            translation: "nhỏ",
            image: "https://prod.cdn-mw.com/assets/mw/images/gallery/gal-wap-slideshow-slide/bubkes-words-for-small-things-almond-on-plate-photo-6277-be49ef799f7b09e44c72201dec3cf100@2x.jpg"
        },
    ],
    practiceSentences: [
        { id: "unit-13-s-1", text: "under" },
        { id: "unit-13-s-2", text: "in" },
        { id: "unit-13-s-3", text: "in front of" },
        { id: "unit-13-s-4", text: "behind" },
        { id: "unit-13-s-5", text: "on" },
        { id: "unit-13-s-6", text: "next to" },
        { id: "unit-13-s-7", text: "behind" },
    ],
    multipleChoiceQuestions: [
        {
            id: "unit-13-mc-2",
            textBefore: "The car is in the ",
            textAfter: ".",
            options: ["garage", "kitchen", "bedroom", "garden"],
            correctIndex: 0,
        },
        {
            id: "unit-13-mc-4",
            textBefore: "The garden is in front of the ",
            textAfter: ".",
            options: ["house", "bathroom", "garage", "bedroom"],
            correctIndex: 0,
        },
        {
            id: "unit-13-mc-5",
            textBefore: "The house is ",
            textAfter: ".",
            options: ["big", "behind", "under", "in"],
            correctIndex: 0,
        },
    ],
    typedAnswerQuestions: [],
} satisfies CourseUnit;
