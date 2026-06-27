import type { LucideIcon } from "lucide-react";
import type { GameQuestion } from "./game";

export type CourseUnitStatus = "completed" | "current";

export type CourseActivityId =
  | "flashcards"
  | "multiple-choice"
  | "spell"
  | "sentence"
  | "matching";

export interface CourseWord {
  id: string;
  word: string;
  translation: string;
  imageUrl: string;
}

export interface CoursePracticeSentence {
  id: string;
  text: string;
}

export interface CourseUnit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  status: CourseUnitStatus;
  stars?: number;
  icon: LucideIcon;
  youtubeVideoId?: string;
  iconBgClass: string;
  iconColorClass: string;
  words: readonly CourseWord[];
  practiceSentences: readonly CoursePracticeSentence[];
  multipleChoiceQuestions: readonly GameQuestion[];
}

export interface CourseActivity {
  id: CourseActivityId;
  label: string;
  description: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  borderClass: string;
}

export interface CourseProfile {
  name: string;
  avatarEmoji: string;
  level: number;
  xpCurrent: number;
  xpMax: number;
  curriculumLabel: string;
}

export interface CourseDictionaryEntry {
  id: string;
  word: string;
  translation: string;
  imageUrl: string;
  unitId: string;
  unitNumber: number;
}
