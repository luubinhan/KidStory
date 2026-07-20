import assert from "node:assert/strict";
import {
  applyDrop,
  createInitialLesson,
  pickRoundChoices,
} from "./hungryDogSession";
import type { HungryDogVocabItem } from "../../types/hungryDog";
import { HUNGRY_DOG_ROUND } from "../../types/hungryDog";

const pool: HungryDogVocabItem[] = [
  { id: "a", word: "cat", imageSrc: "/a", unitId: "u1" },
  { id: "b", word: "dog", imageSrc: "/b", unitId: "u1" },
  { id: "c", word: "sun", imageSrc: "/c", unitId: "u1" },
  { id: "d", word: "book", imageSrc: "/d", unitId: "u1" },
  { id: "e", word: "hat", imageSrc: "/e", unitId: "u1" },
];

const lesson0 = createInitialLesson(pool);
assert.equal(lesson0.status, "playing");
assert.equal(lesson0.correctCount, 0);
assert.equal(lesson0.sessionCoins, 0);
assert.equal(lesson0.round.choices.length, 4);
assert.equal(
  lesson0.round.choices.filter((c) => c.id === lesson0.round.target.id).length,
  1,
);

const choices = pickRoundChoices(pool, lesson0.round.target);
assert.equal(choices.length, 4);
assert.equal(choices.filter((c) => c.id === lesson0.round.target.id).length, 1);
const choiceIds = new Set(choices.map((c) => c.id));
assert.equal(choiceIds.size, 4);

const wrong = applyDrop(lesson0, pool, "NOT_A_WORD");
assert.equal(wrong.kind, "wrong");
assert.equal(wrong.lesson.correctCount, 0);
assert.deepEqual(
  wrong.lesson.round.choices.map((c) => c.id),
  lesson0.round.choices.map((c) => c.id),
);

const right1 = applyDrop(lesson0, pool, lesson0.round.target.word);
assert.equal(right1.kind, "correct");
assert.equal(right1.lesson.correctCount, 1);
assert.equal(right1.lesson.sessionCoins, 1);
assert.equal(right1.lesson.status, "playing");

let lesson = lesson0;
for (let i = 0; i < HUNGRY_DOG_ROUND.targetsNeeded; i++) {
  const result = applyDrop(lesson, pool, lesson.round.target.word);
  assert.equal(result.kind, "correct");
  lesson = result.lesson;
}
assert.equal(lesson.status, "complete");
assert.equal(lesson.correctCount, HUNGRY_DOG_ROUND.targetsNeeded);

console.log("hungryDogSession.test.ts: ok");
