import assert from "node:assert/strict";
import {
  createInitialSession,
  applyFishTap,
  pickDistractorWords,
  ensureExactlyOneTargetLabel,
} from "./fishingSession";
import type { FishingVocabItem } from "../../types/fishing";
import { FISHING_ROUND } from "../../types/fishing";

const pool: FishingVocabItem[] = [
  { id: "a", word: "cat", imageSrc: "/a", unitId: "u1" },
  { id: "b", word: "dog", imageSrc: "/b", unitId: "u1" },
  { id: "c", word: "sun", imageSrc: "/c", unitId: "u1" },
  { id: "d", word: "book", imageSrc: "/d", unitId: "u1" },
];

const session0 = createInitialSession(pool);
assert.equal(session0.status, "playing");
assert.equal(session0.correctCount, 0);
assert.ok(pool.some((p) => p.id === session0.currentTarget.id));

const wrong = applyFishTap(session0, pool, "NOT_THE_TARGET");
assert.equal(wrong.kind, "wrong");
assert.equal(wrong.session.correctCount, 0);

const right1 = applyFishTap(session0, pool, session0.currentTarget.word);
assert.equal(right1.kind, "correct");
assert.equal(right1.session.correctCount, 1);
assert.equal(right1.session.status, "playing");

let s = session0;
for (let i = 0; i < FISHING_ROUND.targetsNeeded; i++) {
  const r = applyFishTap(s, pool, s.currentTarget.word);
  assert.equal(r.kind, "correct");
  s = r.session;
}
assert.equal(s.status, "won");
assert.equal(s.correctCount, FISHING_ROUND.targetsNeeded);

const labels = ensureExactlyOneTargetLabel(
  ["dog", "sun", "book"],
  "cat",
  pool,
);
assert.equal(labels.filter((w) => w.toLowerCase() === "cat").length, 1);
assert.equal(labels.length, 4);

const distractors = pickDistractorWords(pool, "cat", 3);
assert.equal(distractors.length, 3);
assert.ok(distractors.every((w) => w.toLowerCase() !== "cat"));

console.log("fishingSession.test.ts: ok");
