import assert from "node:assert/strict";
import { getDefaultProgress, onGameV2Complete } from "./userProgressLogic";

const before = getDefaultProgress();
const result = onGameV2Complete(before, "fishing");
assert.ok(result, "known game returns result");
assert.equal(result!.coinsEarned, 50);
assert.equal(result!.diamondsEarned, 50);
assert.equal(result!.progress.coins, before.coins + 50);
assert.equal(result!.progress.diamonds, before.diamonds + 50);

const again = onGameV2Complete(result!.progress, "fishing");
assert.equal(again!.coinsEarned, 50, "replay still awards");
assert.equal(again!.progress.coins, before.coins + 100);

const missing = onGameV2Complete(before, "nope");
assert.equal(missing, null);

console.log("gameV2Reward.test.ts: ok");
