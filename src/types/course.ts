import type { LucideIcon } from "lucide-react";

export type CourseUnitStatus = "completed" | "current" | "locked";

export interface CourseUnit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  status: CourseUnitStatus;
  stars?: number;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
}

export interface CourseProfile {
  name: string;
  avatarEmoji: string;
  level: number;
  xpCurrent: number;
  xpMax: number;
  curriculumLabel: string;
}
