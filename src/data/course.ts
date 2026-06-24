import { Dumbbell, Lock, Palette, School, Users } from "lucide-react";
import type { CourseProfile, CourseUnit } from "../types/course";

export const courseProfile: CourseProfile = {
  name: "Minh Anh",
  avatarEmoji: "👦",
  level: 3,
  xpCurrent: 340,
  xpMax: 500,
  curriculumLabel: "Global Success • Lớp 3",
};

export const courseUnits: readonly CourseUnit[] = [
  {
    id: "unit-1",
    unitNumber: 1,
    title: "School",
    subtitle: "Classroom & Supplies",
    status: "completed",
    stars: 3,
    icon: School,
    iconBgClass: "bg-emerald-100",
    iconColorClass: "text-emerald-600",
  },
  {
    id: "unit-2",
    unitNumber: 2,
    title: "My Friends",
    subtitle: "Greetings & Names",
    status: "completed",
    stars: 3,
    icon: Users,
    iconBgClass: "bg-orange-100",
    iconColorClass: "text-orange-500",
  },
  {
    id: "unit-3",
    unitNumber: 3,
    title: "Colours",
    subtitle: "Rainbow Words",
    status: "completed",
    stars: 2,
    icon: Palette,
    iconBgClass: "bg-purple-100",
    iconColorClass: "text-purple-600",
  },
  {
    id: "unit-4",
    unitNumber: 4,
    title: "My Body",
    subtitle: "Body Parts",
    status: "current",
    icon: Dumbbell,
    iconBgClass: "bg-sky-100",
    iconColorClass: "text-sky-600",
  },
  {
    id: "unit-5",
    unitNumber: 5,
    title: "Natural World",
    subtitle: "Animals & Plants",
    status: "locked",
    icon: Lock,
    iconBgClass: "bg-slate-100",
    iconColorClass: "text-slate-400",
  },
];

export function getCourseUnitById(unitId: string): CourseUnit | undefined {
  return courseUnits.find((unit) => unit.id === unitId);
}
