import assert from "node:assert/strict";
import type { FishingVocabItem } from "../../types/fishing";
import {
  applyGrab,
  createRound,
  filterCraneWords,
  hintCountForWord,
  isCraneWord,
  nextLetter,
  normalizeCraneWord,
} from "./craneSession";

function vocab(id: string, word: string): FishingVocabItem {
  return { id, word, imageSrc: "img", unitId: "unit-1" };
}

assert.equal(normalizeCraneWord(" Garden "), "garden");
assert.equal(isCraneWord("cat"), true);
assert.equal(isCraneWord("garden"), true);
assert.equal(isCraneWord("ox"), false);
assert.equal(isCraneWord("abcdefghij"), false);
assert.equal(isCraneWord("ice cream"), false);
assert.equal(isCraneWord("ice-cream"), false);
assert.equal(isCraneWord("café"), false);

const mixed = [
  vocab("1", "cat"),
  vocab("2", "ox"),
  vocab("3", "ice cream"),
  vocab("4", "garden"),
];
const filtered = filterCraneWords(mixed);
assert.deepEqual(
  filtered.map((item) => item.id),
  ["1", "4"],
);

assert.equal(hintCountForWord("cat"), 1);
assert.equal(hintCountForWord("garden"), 2);

const garden = createRound([vocab("g", "Garden")], undefined, () => 0);
assert.equal(garden.status, "playing");
assert.equal(garden.round.word, "garden");
assert.deepEqual(
  garden.round.slots.map((s) => s.letter),
  ["g", "a", "r", "d", "e", "n"],
);
assert.deepEqual(
  garden.round.slots.map((s) => s.filled),
  [true, true, false, false, false, false],
);
assert.deepEqual([...garden.round.fieldLetters].sort(), ["d", "e", "n", "r"]);
assert.equal(nextLetter(garden.round.slots), "r");

const wrong = applyGrab(garden, "x");
assert.equal(wrong, garden);
assert.equal(nextLetter(wrong.round.slots), "r");

const afterR = applyGrab(garden, "R");
assert.equal(nextLetter(afterR.round.slots), "d");
assert.equal(afterR.round.slots[2]?.filled, true);

const afterD = applyGrab(afterR, "d");
const afterE = applyGrab(afterD, "e");
const afterN = applyGrab(afterE, "n");
assert.equal(afterN.status, "complete");
assert.equal(nextLetter(afterN.round.slots), null);
assert.equal(applyGrab(afterN, "n"), afterN);

const happy = createRound([vocab("h", "happy")], undefined, () => 0);
assert.deepEqual(
  happy.round.slots.map((s) => s.filled),
  [true, true, false, false, false],
);
assert.deepEqual([...happy.round.fieldLetters].sort(), ["p", "p", "y"]);
const afterP1 = applyGrab(happy, "p");
const afterP2 = applyGrab(afterP1, "p");
const afterY = applyGrab(afterP2, "y");
assert.equal(afterY.status, "complete");

const only = [vocab("solo", "cat")];
const first = createRound(only, undefined, () => 0);
const again = createRound(only, first.round.target.id, () => 0);
assert.equal(again.round.word, "cat");
assert.equal(again.status, "playing");

const two = [vocab("a", "cat"), vocab("b", "dog")];
const picked = createRound(two, "a", () => 0.99);
assert.equal(picked.round.target.id, "b");

console.log("craneSession.test.ts: ok");
