import { courseUnits } from "../data/course";
import {
  addCoins,
  getDefaultProgress,
  getUnitStatus,
} from "./userProgressLogic";

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

const defaultProgress = getDefaultProgress();

assert(
  ["available", "current", "completed"].includes(
    getUnitStatus(courseUnits[0], defaultProgress),
  ),
  "unit 1 status is one of available/current/completed",
);
assert(
  ["available", "current", "completed"].includes(
    getUnitStatus(courseUnits[1], defaultProgress),
  ),
  "unit 2 status is one of available/current/completed",
);

for (const unit of courseUnits) {
  assert(
    ["available", "current", "completed"].includes(
      getUnitStatus(unit, defaultProgress),
    ),
    `unit ${unit.unitNumber} status is one of available/current/completed`,
  );
}

assert(defaultProgress.coins === 0, "coins unchanged after status checks");

const withCoins = addCoins(defaultProgress, 3);
assert(withCoins.coins === 3, "addCoins increments balance");
assert(addCoins(withCoins, 1).coins === 4, "addCoins stacks");

console.log("userProgressLogic.test.ts: all passed");
