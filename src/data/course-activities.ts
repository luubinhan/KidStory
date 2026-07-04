import {
  CaseSensitive,
  Layers,
  ListOrdered,
  MessageSquareText,
  PencilLine,
  Shuffle,
  SquareCheck,
} from "lucide-react";
import type { CourseActivity } from "../types/course";

export const courseActivities: readonly CourseActivity[] = [
  {
    id: "flashcards",
    label: "Flashcards",
    description: "Flip cards to learn new words.",
    icon: Layers,
    iconBgClass: "bg-violet-100",
    iconColorClass: "text-violet-600",
    borderClass: "border-violet-200 hover:border-violet-400",
  },
  {
    id: "multiple-choice",
    label: "Multiple choice",
    description: "Pick the right word to finish the sentence.",
    icon: SquareCheck,
    iconBgClass: "bg-sky-100",
    iconColorClass: "text-sky-600",
    borderClass: "border-sky-200 hover:border-sky-400",
  },
  {
    id: "sentence",
    label: "Order the sentence",
    description: "Drag words into the correct order.",
    icon: ListOrdered,
    iconBgClass: "bg-emerald-100",
    iconColorClass: "text-emerald-600",
    borderClass: "border-emerald-200 hover:border-emerald-400",
  },
  {
    id: "spell",
    label: "Spell the word",
    description: "Drag letters to spell the word.",
    icon: CaseSensitive,
    iconBgClass: "bg-amber-100",
    iconColorClass: "text-amber-700",
    borderClass: "border-amber-200 hover:border-amber-400",
  },
  {
    id: "write",
    label: "Write",
    description: "Type the word you see or read.",
    icon: PencilLine,
    iconBgClass: "bg-teal-100",
    iconColorClass: "text-teal-700",
    borderClass: "border-teal-200 hover:border-teal-400",
  },
  {
    id: "matching",
    label: "Matching",
    description: "Match each word to its picture.",
    icon: Shuffle,
    iconBgClass: "bg-rose-100",
    iconColorClass: "text-rose-600",
    borderClass: "border-rose-200 hover:border-rose-400",
  },
  {
    id: "complete-sentence",
    label: "Complete the sentence",
    description: "Look at the picture and type the missing word.",
    icon: MessageSquareText,
    iconBgClass: "bg-orange-100",
    iconColorClass: "text-orange-600",
    borderClass: "border-orange-200 hover:border-orange-400",
  },
];

export function getCourseActivity(id: string): CourseActivity | undefined {
  return courseActivities.find((activity) => activity.id === id);
}

export function isCourseActivityId(id: string): id is CourseActivity["id"] {
  return courseActivities.some((activity) => activity.id === id);
}
