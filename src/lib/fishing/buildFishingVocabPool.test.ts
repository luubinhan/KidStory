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

const pool = buildFishingVocabPool(units);
assert.equal(pool.length, 2, "keeps only words with images");
assert.equal(pool[0]?.word, "cat");
assert.equal(pool[0]?.imageSrc, "https://example.com/cat.jpg");
assert.equal(pool[0]?.audio, "/sounds/cat.mp3");
assert.equal(pool[0]?.unitId, "unit-1");
assert.equal(pool[1]?.audio, undefined);
assert.equal(pool[1]?.id, "dog");

console.log("buildFishingVocabPool.test.ts: ok");
