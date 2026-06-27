import type { CourseDictionaryEntry, CourseUnit } from "../../types/course";
import { unit1Greetings } from "./units/unit-1-greetings";
import { unit2Hello } from "./units/unit-2-hello";

const allUnits = [unit1Greetings, unit2Hello] as const;

export function getDictionaryEntries(
  units: readonly CourseUnit[] = allUnits,
): CourseDictionaryEntry[] {
  return units.flatMap((unit) =>
    unit.words.map((word) => ({
      id: word.id,
      word: word.word,
      translation: word.translation,
      imageUrl: word.imageUrl,
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
