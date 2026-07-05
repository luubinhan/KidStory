import { courseUnits } from "../data/course";
import type { UserProgressV1 } from "../types/userProgress";
import { getDefaultProgress, onActivityComplete } from "./userProgressLogic";

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

const unit = courseUnits[0];
if (!unit) throw new Error("Need at least one course unit for tests");

const base: UserProgressV1 = getDefaultProgress();
assert(base.diamonds === 0, "default diamonds is 0");

const writeResult = onActivityComplete(base, unit, "write");
assert(writeResult.coinsEarned === 50, "write awards 50 coins");
assert(writeResult.progress.coins === 50, "write adds 50 to coin balance");
assert(writeResult.diamondsEarned === 50, "write awards 50 diamonds");
assert(writeResult.progress.diamonds === 50, "write adds 50 to balance");

const typedResult = onActivityComplete(base, unit, "complete-sentence");
assert(typedResult.coinsEarned === 50, "complete-sentence awards 50 coins");
assert(typedResult.diamondsEarned === 50, "complete-sentence awards 50 diamonds");
assert(typedResult.progress.diamonds === 50, "complete-sentence adds 50 to balance");

const flashcardsResult = onActivityComplete(base, unit, "flashcards");
assert(flashcardsResult.coinsEarned === 10, "flashcards awards 10 coins");
assert(flashcardsResult.diamondsEarned === 0, "flashcards awards 0 diamonds");
assert(flashcardsResult.progress.diamonds === 0, "flashcards does not change diamonds");

const replay = onActivityComplete(writeResult.progress, unit, "write");
assert(replay.coinsEarned === 50, "write replay still awards 50 coins");
assert(replay.progress.coins === 100, "write replay stacks coins");
assert(replay.diamondsEarned === 50, "write replay still awards 50 diamonds");
assert(replay.progress.diamonds === 100, "write replay stacks diamonds");

console.log("diamondLogic.test.ts: all passed");
