import type { CourseProfile, CourseUnit } from "../../types/course";
import { unit1Greetings } from "./units/unit-1-greetings";
import { unit2Hello } from "./units/unit-2-hello";
import { unit3Fruits } from "./units/unit-3-fruits";
import { unit4WhatIsThisThat } from "./units/unit-4-what-is-this-that";
import { unit5Colors } from "./units/unit-5-colors";
import { unit6WhatNumberIsIt } from "./units/unit-6-what-number-is-it";
import { unit7IsHeATeacher } from "./units/unit-7-is-he-a-teacher";

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
  unit5Colors,
  unit6WhatNumberIsIt,
  unit7IsHeATeacher,
];

export function getCourseUnitById(unitId: string): CourseUnit | undefined {
  return courseUnits.find((unit) => unit.id === unitId);
}

export {
  filterCourseDictionary,
  getDictionaryEntries,
  getDictionaryEntriesByUnitId,
} from "./dictionary";
