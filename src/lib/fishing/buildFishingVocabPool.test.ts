import assert from "node:assert/strict";
import { buildFishingVocabPool } from "./buildFishingVocabPool";
import type { CourseUnit } from "../../types/course";
import { BookOpen } from "lucide-react";

function makeUnit(
  id: string,
  words: { id: string; word: string; image?: string; audio?: string }[],
): CourseUnit {
  return {
    id,
    unitNumber: 1,
    title: id,
    subtitle: "",
    icon: BookOpen,
    iconBgClass: "",
    iconColorClass: "",
    words: words.map((w) => ({
      id: w.id,
      word: w.word,
      translation: w.word,
      image: w.image,
      audio: w.audio,
    })),
    practiceSentences: [],
    multipleChoiceQuestions: [],
    typedAnswerQuestions: [],
  };
}

const units = [
  makeUnit("unit-1", [
    {
      id: "cat",
      word: "cat",
      image: "https://example.com/cat.jpg",
      audio: "/sounds/cat.mp3",
    },
    { id: "hi", word: "hi" },
  ]),
  makeUnit("unit-2", [
    { id: "dog", word: "dog", image: "https://example.com/dog.jpg" },
  ]),
];

const poolAll = buildFishingVocabPool(units, () => true);
assert.equal(poolAll.length, 2, "keeps only words with images");
assert.equal(poolAll[0]?.word, "cat");
assert.equal(poolAll[0]?.imageSrc, "https://example.com/cat.jpg");
assert.equal(poolAll[0]?.audio, "/sounds/cat.mp3");
assert.equal(poolAll[0]?.unitId, "unit-1");
assert.equal(poolAll[1]?.audio, undefined);

const poolLocked = buildFishingVocabPool(units, (u) => u.id === "unit-1");
assert.equal(poolLocked.length, 1, "respects unlock predicate");
assert.equal(poolLocked[0]?.id, "cat");

console.log("buildFishingVocabPool.test.ts: ok");
