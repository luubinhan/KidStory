import type { CourseDictionaryEntry } from "../types/course";

export const courseDictionary: readonly CourseDictionaryEntry[] = [
  {
    id: "school",
    word: "school",
    translation: "trường học",
    emoji: "🏫",
    unitId: "unit-1",
    unitNumber: 1,
  },
  {
    id: "teacher",
    word: "teacher",
    translation: "giáo viên",
    emoji: "👩‍🏫",
    unitId: "unit-1",
    unitNumber: 1,
  },
  {
    id: "friend",
    word: "friend",
    translation: "bạn bè",
    emoji: "👫",
    unitId: "unit-2",
    unitNumber: 2,
  },
  {
    id: "hello",
    word: "hello",
    translation: "xin chào",
    emoji: "👋",
    unitId: "unit-2",
    unitNumber: 2,
  },
  {
    id: "red",
    word: "red",
    translation: "màu đỏ",
    emoji: "🔴",
    unitId: "unit-3",
    unitNumber: 3,
  },
  {
    id: "blue",
    word: "blue",
    translation: "màu xanh dương",
    emoji: "🔵",
    unitId: "unit-3",
    unitNumber: 3,
  },
  {
    id: "green",
    word: "green",
    translation: "màu xanh lá",
    emoji: "🟢",
    unitId: "unit-3",
    unitNumber: 3,
  },
  {
    id: "head",
    word: "head",
    translation: "đầu",
    emoji: "🗣️",
    unitId: "unit-4",
    unitNumber: 4,
  },
  {
    id: "hand",
    word: "hand",
    translation: "bàn tay",
    emoji: "✋",
    unitId: "unit-4",
    unitNumber: 4,
  },
];

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
