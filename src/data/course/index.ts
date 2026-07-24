import type { CourseDictionaryEntry, CourseProfile, CourseUnit } from "../../types/course";
import { unit1Greetings } from "./units/unit-1-greetings";
import { unit2Hello } from "./units/unit-2-hello";
import { unit3Fruits } from "./units/unit-3-fruits";
import { unit4WhatIsThisThat } from "./units/unit-4-what-is-this-that";
import { unit5Colors } from "./units/unit-5-colors";
import { unit6WhatNumberIsIt } from "./units/unit-6-what-number-is-it";
import { unit7IsHeATeacher } from "./units/unit-7-is-he-a-teacher";
import { unit8Clothes } from "./units/unit-8-clothes";
import { unit9WeatherWords } from "./units/unit-9-weather-words";
import { unit10WhatsThat } from "./units/unit-10-whats-that";

export const courseProfile: CourseProfile = {
  name: "Khả Như",
  avatarEmoji: "👦",
  level: 1,
  xpCurrent: 340,
  xpMax: 500,
  curriculumLabel: "Wonder Farm",
};

export const courseUnits: readonly CourseUnit[] = [
  unit1Greetings,
  unit2Hello,
  unit3Fruits,
  unit4WhatIsThisThat,
  unit5Colors,
  unit6WhatNumberIsIt,
  unit7IsHeATeacher,
  unit8Clothes,
  unit9WeatherWords,
  unit10WhatsThat,
];
export const gameUnits: readonly CourseUnit[] = [
  
  unit10WhatsThat,
];

export function getCourseUnitById(unitId: string): CourseUnit | undefined {
  return courseUnits.find((unit) => unit.id === unitId);
}

export function getDictionaryEntries(
  units: readonly CourseUnit[] = courseUnits,
): CourseDictionaryEntry[] {
  return units.flatMap((unit) =>
    unit.words.map((word) => ({
      id: word.id,
      word: word.word,
      translation: word.translation,
      image: word.image ?? "",
      unitId: unit.id,
      unitNumber: unit.unitNumber,
    })),
  );
}

export function getDictionaryEntriesByUnitId(unitId: string): CourseDictionaryEntry[] {
  return getDictionaryEntries().filter((entry) => entry.unitId === unitId);
}

export function filterCourseDictionary(
  query: string,
  entries: readonly CourseDictionaryEntry[],
): CourseDictionaryEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...entries];

  return entries.filter(
    (entry) =>
      entry.word.toLowerCase().includes(normalized) ||
      entry.translation.toLowerCase().includes(normalized),
  );
}
