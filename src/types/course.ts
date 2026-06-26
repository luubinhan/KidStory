import type { LucideIcon } from "lucide-react";

export type CourseUnitStatus = "completed" | "current" | "locked";

export type CourseActivityId =
  | "flashcards"
  | "multiple-choice"
  | "spell"
  | "sentence"
  | "matching";

export interface CourseUnit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  status: CourseUnitStatus;
  stars?: number;
  gameTopicId: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
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
  emoji: string;
  unitId: string;
  unitNumber: number;
}
