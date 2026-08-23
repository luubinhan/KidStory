import assert from "node:assert/strict";
import {
  MATCHING_PAIRS_COUNT,
  buildMatchingPairsWords,
  matchingPairsWords,
} from "../data/matchingPairsGame";

const units = [
  {
    words: [
      { id: "a", word: "apple", translation: "táo", image: "https://example.com/a.jpg" },
      { id: "b", word: "blank", translation: "trống", image: "" },
      { id: "c", word: "cat", translation: "mèo", image: "  " },
    ],
  },
  {
    words: [
      { id: "a", word: "apple-dup", translation: "táo 2", image: "https://example.com/a2.jpg" },
      { id: "d", word: "dog", translation: "chó", image: "https://example.com/d.jpg" },
    ],
  },
];

const built = buildMatchingPairsWords(units);
assert.deepEqual(
  built.map((w) => w.id),
  ["a", "d"],
  "skip empty image and duplicate ids",
);
assert.equal(built[0]?.word, "apple");
assert.equal(built[0]?.image, "https://example.com/a.jpg");

assert.ok(matchingPairsWords.length >= MATCHING_PAIRS_COUNT);
const ids = new Set(matchingPairsWords.map((w) => w.id));
assert.equal(ids.size, matchingPairsWords.length, "course-derived ids unique");
assert.ok(matchingPairsWords.every((w) => w.image.length > 0));

console.log("buildMatchingPairsWords.test.ts: ok");
