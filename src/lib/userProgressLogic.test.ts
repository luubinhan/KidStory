import { courseUnits } from "../data/course";
import {
  addCoins,
  getDefaultProgress,
  getUnitStatus,
  isUnitUnlocked,
} from "./userProgressLogic";

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

const defaultProgress = getDefaultProgress();

assert(isUnitUnlocked(courseUnits[0], defaultProgress), "unit 1 unlocked by default");
assert(!isUnitUnlocked(courseUnits[1], defaultProgress), "unit 2 locked with default progress");
assert(
  getUnitStatus(courseUnits[1], defaultProgress) === "locked",
  "unit 2 status locked with default progress",
);

const allUnlockedOptions = { allUnitsUnlocked: true };
for (const unit of courseUnits) {
  assert(
    isUnitUnlocked(unit, defaultProgress, allUnlockedOptions),
    `unit ${unit.unitNumber} unlocked with allUnitsUnlocked`,
  );
  assert(
    getUnitStatus(unit, defaultProgress, allUnlockedOptions) !== "locked",
    `unit ${unit.unitNumber} status not locked with allUnitsUnlocked`,
  );
}

assert(defaultProgress.coins === 0, "coins unchanged after status checks");

const withCoins = addCoins(defaultProgress, 3);
assert(withCoins.coins === 3, "addCoins increments balance");
assert(addCoins(withCoins, 1).coins === 4, "addCoins stacks");

console.log("userProgressLogic.test.ts: all passed");
