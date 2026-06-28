import type { CourseProfile, CourseUnit } from "../../types/course";
import { unit1Greetings } from "./units/unit-1-greetings";
import { unit2Hello } from "./units/unit-2-hello";
import { unit3Fruits } from "./units/unit-3-fruits";
import { unit4WhatIsThisThat } from "./units/unit-4-what-is-this-that";

export const courseProfile: CourseProfile = {
  name: "Khả Như",
  avatarEmoji: "👦",
  level: 1,
  xpCurrent: 340,
  xpMax: 500,
  curriculumLabel: "Grade 1",
};

export const courseUnits: readonly CourseUnit[] = [
  unit1Greetings,
  unit2Hello,
  unit3Fruits,
  unit4WhatIsThisThat,
];

export function getCourseUnitById(unitId: string): CourseUnit | undefined {
  return courseUnits.find((unit) => unit.id === unitId);
}

export {
  filterCourseDictionary,
  getDictionaryEntries,
  getDictionaryEntriesByUnitId,
} from "./dictionary";
