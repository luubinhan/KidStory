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
    {
      id: "bed",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/bed.mp3",
      word: "bed", translation: "cái giường", image: "https://gohome.vn/wp-content/uploads/2025/09/gh11019.png"
    },
    {
      id: "sofa",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/sofa.mp3",
      word: "sofa", translation: "ghế sofa", image: "https://made4home.com.vn/assets/media/2024/08/living-room-japandi-interior-design2-2.jpg"
    },
    { id: "tv", word: "TV", translation: "tivi", image: "https://images-na.ssl-images-amazon.com/images/I/81pieXC63IL.jpg" },
    {
      id: "shower",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/shower.mp3",
      word: "shower", translation: "vòi tắm", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnkBez3b9RiItiwoOBV1R_WV7emNd3N47gJePyfZYiQ2Pna3aS2vLrYaPP&s=10"
    },
    {
      id: "sink",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/sink.mp3",
      word: "sink", translation: "bồn rửa", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmB7zWMtd77kNyDKy47w-aBF_2uLOywxGF2FMtkn_BjmiINSqAoKHjUlQ&s=10"
    },
    {
      id: "lamp",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/lamp.mp3",
      word: "lamp", translation: "đèn", image: "https://img.magnific.com/free-psd/collection-modern-pendant-lamps-table-lamp_191095-77667.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
      id: "table",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/table.mp3", word: "table", translation: "cái bàn", image: "https://www.ldoceonline.com/media/english/illustration/dining_room_table.jpg"
    },
    {
      id: "wall",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/wall.mp3",
      word: "wall", translation: "bức tường", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWLiympXMXy5zwDA94GuBVJ8zgbBZXaAVYldQdFypClyjrRoIMWYESkGVi&s=10"
    },
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
