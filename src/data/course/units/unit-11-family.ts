import { Users } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit11Family = {
  id: "unit-11",
  unitNumber: 11,
  title: "Family",
  subtitle: "",
  status: "current",
  icon: Users,
  youtubeVideoId: "FHaObkHEkHQ",
  iconBgClass: "bg-violet-100",
  iconColorClass: "text-violet-600",
  words: [
    { id: "grandfather",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/grandfather.mp3",
       word: "grandfather", translation: "ông", image: "" },
    { id: "grandmother",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/grandmother.mp3",
      word: "grandmother", translation: "bà", image: "" },
    {
      id: "father",
      audio:
        "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/father.mp3",
      word: "father",
      translation: "cha / ba",
      image:
        "https://png.pngtree.com/png-clipart/20240718/original/pngtree-father-is-holding-child-fathers-day-vector-illustration-png-image_15583116.png",
    },
    {
      id: "mother",
      audio:
        "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/mother.mp3",
      word: "mother",
      translation: "mẹ / má",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdEsSmjuAwtXLv61-CrcTSd61VvdQoAMVxCbBofgC9UkkfF-6Y4RfTsjM&s=10",
    },
    {
      id: "parents",
      audio:
        "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/parents.mp3",
      word: "parents",
      translation: "cha mẹ",
      image:
        "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/images/puzzle/parents.jpeg",
    },
    { id: "aunt",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/aunt.mp3",
      word: "aunt", translation: "dì / cô / bác gái", image: "" },
    {
      id: "brother",
      word: "brother",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/brother.mp3",
      translation: "anh trai / em trai",
      image: "",
    },
    {
      id: "sister",
      word: "sister",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/sister.mp3",
      translation: "chị gái / em gái",
      image: "",
    },
    { id: "me",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/me.mp3",
      word: "me", translation: "tôi", image: "" },
    { id: "uncle",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/uncle.mp3",
      word: "uncle", translation: "chú / bác / cậu", image: "" },
    {
      id: "cousin",
      word: "cousin",
      audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/cousin.mp3",
      translation: "anh em họ / họ hàng",
      image: "",
    },
  ],
  practiceSentences: [
    { id: "unit-11-s-1", text: "this is my brother" },
    { id: "unit-11-s-2", text: "this is my parents" },
    { id: "unit-11-s-3", text: "this is my mother" },
    { id: "unit-11-s-4", text: "this is my father" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-11-mc-1",
      textBefore: "This is my ",
      textAfter: ".",
      options: ["brother", "book", "chair", "window"],
      correctIndex: 0,
    },
    {
      id: "unit-11-mc-2",
      textBefore: "This is my ",
      textAfter: ".",
      options: ["parents", "apple", "pencil", "table"],
      correctIndex: 0,
    },
    {
      id: "unit-11-mc-3",
      textBefore: "This is my ",
      textAfter: ".",
      options: ["mother", "banana", "robot", "marker"],
      correctIndex: 0,
    },
    {
      id: "unit-11-mc-4",
      textBefore: "This is my ",
      textAfter: ".",
      options: ["father", "camera", "block", "bike"],
      correctIndex: 0,
    },
    {
      id: "unit-11-mc-5",
      textBefore: "This is my ",
      textAfter: ".",
      options: ["sister", "desk", "book", "table"],
      correctIndex: 0,
    },
  ],
  typedAnswerQuestions: [],
} satisfies CourseUnit;
