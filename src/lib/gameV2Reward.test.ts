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

const matching = onGameV2Complete(getDefaultProgress(), "matching-pairs");
assert.ok(matching, "matching-pairs catalog returns result");
assert.equal(matching!.coinsEarned, 20);
assert.equal(matching!.diamondsEarned, 10);

const puzzle = onGameV2Complete(getDefaultProgress(), "picture-puzzle");
assert.ok(puzzle, "picture-puzzle catalog returns result");
assert.equal(puzzle!.coinsEarned, 5);
assert.equal(puzzle!.diamondsEarned, 1);

console.log("gameV2Reward.test.ts: ok");
