import type { LucideIcon } from "lucide-react";
import type { GameQuestion } from "./game";

export type CourseUnitStatus = "completed" | "current";

export type CourseActivityId =
  | "flashcards"
  | "multiple-choice"
  | "spell"
  | "write"
  | "sentence"
  | "matching"
  | "complete-sentence";

export interface CourseTypedAnswerQuestion {
  id: string;
  prompt: string;
  textBefore: string;
  textAfter: string;
  answer: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface CourseWord {
  id: string;
  word: string;
  translation: string;
  imageUrl: string;
  audio?: string;
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
  status?: CourseUnitStatus;
  stars?: number;
  icon: LucideIcon;
  youtubeVideoId?: string;
  iconBgClass: string;
  iconColorClass: string;
  words: readonly CourseWord[];
  practiceSentences: readonly CoursePracticeSentence[];
  multipleChoiceQuestions: readonly GameQuestion[];
  typedAnswerQuestions: readonly CourseTypedAnswerQuestion[];
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
