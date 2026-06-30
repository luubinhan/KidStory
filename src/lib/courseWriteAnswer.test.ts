import { isWriteAnswerCorrect, normalizeWriteAnswer } from "./courseWriteAnswer";

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

assert(normalizeWriteAnswer("  Cherry  ") === "cherry", "trim + lowercase");
assert(isWriteAnswerCorrect("CHERRY", "cherry"), "case insensitive");
assert(isWriteAnswerCorrect("  cherry ", "cherry"), "trim whitespace");
assert(!isWriteAnswerCorrect("cherri", "cherry"), "wrong spelling");
assert(!isWriteAnswerCorrect("", "cherry"), "empty input");

console.log("courseWriteAnswer.test.ts: all passed");
