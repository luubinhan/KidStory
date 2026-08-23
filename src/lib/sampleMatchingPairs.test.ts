import assert from "node:assert/strict";
import { sampleMatchingPairs } from "./sampleMatchingPairs";

const words = [
  { id: "a" },
  { id: "b" },
  { id: "c" },
  { id: "d" },
  { id: "e" },
  { id: "f" },
  { id: "g" },
  { id: "h" },
  { id: "i" },
  { id: "j" },
  { id: "k" },
  { id: "l" },
  { id: "m" },
  { id: "n" },
  { id: "o" },
  { id: "p" },
];

const short = words.slice(0, 9);
assert.deepEqual(sampleMatchingPairs(short, 10), [], "too-short list returns empty");

const frozen = Object.freeze([...words]);
const sampled = sampleMatchingPairs(frozen, 10);
assert.equal(sampled.length, 10);
const sourceIds = new Set(words.map((w) => w.id));
for (const item of sampled) {
  assert.ok(sourceIds.has(item.id), "sampled id must come from input");
}
const unique = new Set(sampled.map((w) => w.id));
assert.equal(unique.size, 10, "no duplicate ids");
assert.equal(frozen.length, 16, "must not mutate input length");

assert.deepEqual(sampleMatchingPairs([], 10), []);
assert.deepEqual(sampleMatchingPairs(words, 0), []);

console.log("sampleMatchingPairs.test.ts: ok");
