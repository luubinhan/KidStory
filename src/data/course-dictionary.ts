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
  {
    id: "pencil",
    word: "pencil",
    translation: "bút chì",
    emoji: "✏️",
    unitId: "unit-1",
    unitNumber: 1,
  },
  {
    id: "book",
    word: "book",
    translation: "sách",
    emoji: "📚",
    unitId: "unit-1",
    unitNumber: 1,
  },
  {
    id: "desk",
    word: "desk",
    translation: "bàn học",
    emoji: "🪑",
    unitId: "unit-1",
    unitNumber: 1,
  },
  {
    id: "name",
    word: "name",
    translation: "tên",
    emoji: "🏷️",
    unitId: "unit-2",
    unitNumber: 2,
  },
  {
    id: "goodbye",
    word: "goodbye",
    translation: "tạm biệt",
    emoji: "👋",
    unitId: "unit-2",
    unitNumber: 2,
  },
  {
    id: "smile",
    word: "smile",
    translation: "nụ cười",
    emoji: "😊",
    unitId: "unit-2",
    unitNumber: 2,
  },
  {
    id: "yellow",
    word: "yellow",
    translation: "màu vàng",
    emoji: "🟡",
    unitId: "unit-3",
    unitNumber: 3,
  },
  {
    id: "foot",
    word: "foot",
    translation: "bàn chân",
    emoji: "🦶",
    unitId: "unit-4",
    unitNumber: 4,
  },
  {
    id: "eye",
    word: "eye",
    translation: "mắt",
    emoji: "👁️",
    unitId: "unit-4",
    unitNumber: 4,
  },
  {
    id: "tree",
    word: "tree",
    translation: "cây",
    emoji: "🌳",
    unitId: "unit-5",
    unitNumber: 5,
  },
  {
    id: "flower",
    word: "flower",
    translation: "hoa",
    emoji: "🌸",
    unitId: "unit-5",
    unitNumber: 5,
  },
  {
    id: "bird",
    word: "bird",
    translation: "chim",
    emoji: "🐦",
    unitId: "unit-5",
    unitNumber: 5,
  },
  {
    id: "fish",
    word: "fish",
    translation: "cá",
    emoji: "🐟",
    unitId: "unit-5",
    unitNumber: 5,
  },
  {
    id: "sun",
    word: "sun",
    translation: "mặt trời",
    emoji: "☀️",
    unitId: "unit-5",
    unitNumber: 5,
  },
  {
    id: "rain",
    word: "rain",
    translation: "mưa",
    emoji: "🌧️",
    unitId: "unit-5",
    unitNumber: 5,
  },
];

export function getDictionaryEntriesByUnitId(unitId: string): CourseDictionaryEntry[] {
  return courseDictionary.filter((entry) => entry.unitId === unitId);
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
