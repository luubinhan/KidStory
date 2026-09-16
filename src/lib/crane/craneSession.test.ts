import assert from "node:assert/strict";
import type { FishingVocabItem } from "../../types/fishing";
import { CRANE_ROUND } from "../../types/crane";
import {
  applyBoom,
  applyGrab,
  applyWrongCell,
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

assert.equal(hintCountForWord("cat"), 0);
assert.equal(hintCountForWord("garden"), 0);

const garden = createRound([vocab("g", "Garden")], undefined, () => 0);
assert.equal(garden.status, "playing");
assert.equal(garden.round.word, "garden");
assert.deepEqual(
  garden.round.slots.map((s) => s.letter),
  ["g", "a", "r", "d", "e", "n"],
);
assert.deepEqual(
  garden.round.slots.map((s) => s.filled),
  [false, false, false, false, false, false],
);
assert.deepEqual([...garden.round.fieldLetters].sort(), ["a", "d", "e", "g", "n", "r"]);
assert.equal(nextLetter(garden.round.slots), "g");
assert.equal(garden.rewardLeft, 6);

const wrong = applyGrab(garden, "x");
assert.equal(wrong, garden);
assert.equal(nextLetter(wrong.round.slots), "g");

const afterG = applyGrab(garden, "G");
assert.equal(nextLetter(afterG.round.slots), "a");
assert.equal(afterG.round.slots[0]?.filled, true);
assert.equal(afterG.rewardLeft, 6);

const afterA = applyGrab(afterG, "a");
const afterR = applyGrab(afterA, "r");
const afterD = applyGrab(afterR, "d");
const afterE = applyGrab(afterD, "e");
const afterN = applyGrab(afterE, "n");
assert.equal(afterN.status, "complete");
assert.equal(nextLetter(afterN.round.slots), null);
assert.equal(applyGrab(afterN, "n"), afterN);

const happy = createRound([vocab("h", "happy")], undefined, () => 0);
assert.deepEqual(
  happy.round.slots.map((s) => s.filled),
  [false, false, false, false, false],
);
assert.deepEqual([...happy.round.fieldLetters].sort(), ["a", "h", "p", "p", "y"]);
const afterH = applyGrab(happy, "h");
const afterHa = applyGrab(afterH, "a");
const afterP1 = applyGrab(afterHa, "p");
const afterP2 = applyGrab(afterP1, "p");
const afterY = applyGrab(afterP2, "y");
assert.equal(afterY.status, "complete");

const only = [vocab("solo", "cat")];
const first = createRound(only, undefined, () => 0);
const again = createRound(only, first.round.target.id, () => 0);
assert.equal(again.round.word, "cat");
assert.equal(again.status, "playing");
assert.equal(first.rewardLeft, 3);
assert.equal(again.rewardLeft, 3);

const two = [vocab("a", "cat"), vocab("b", "dog")];
const picked = createRound(two, "a", () => 0.99);
assert.equal(picked.round.target.id, "b");

assert.equal(CRANE_ROUND.bombCount, 3);

const boomPlaying = applyBoom(garden);
assert.equal(boomPlaying.status, "failed");
assert.deepEqual(boomPlaying.round.slots, garden.round.slots);
assert.equal(applyBoom(boomPlaying), boomPlaying);
assert.equal(applyGrab(boomPlaying, "g"), boomPlaying);
assert.equal(applyBoom(afterN), afterN);

const miss1 = applyWrongCell(garden);
assert.equal(miss1.rewardLeft, 5);
assert.equal(nextLetter(miss1.round.slots), "g");
assert.deepEqual(
  miss1.round.slots.map((s) => s.filled),
  garden.round.slots.map((s) => s.filled),
);
const miss2 = applyWrongCell(miss1);
assert.equal(miss2.rewardLeft, 4);

const catRound = createRound([vocab("c", "cat")], undefined, () => 0);
assert.equal(catRound.rewardLeft, 3);
const cat0 = applyWrongCell(applyWrongCell(applyWrongCell(catRound)));
assert.equal(cat0.rewardLeft, 0);
assert.equal(applyWrongCell(cat0), cat0);

assert.equal(applyWrongCell(afterN), afterN);
assert.equal(applyWrongCell(boomPlaying), boomPlaying);
assert.equal(boomPlaying.rewardLeft, 6);

console.log("craneSession.test.ts: ok");
