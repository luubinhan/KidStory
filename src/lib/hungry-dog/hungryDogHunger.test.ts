import assert from "node:assert/strict";
import { isHungry } from "./hungryDogHunger";
import { HUNGRY_DOG_ROUND } from "../../types/hungryDog";

const hour = HUNGRY_DOG_ROUND.hungerMs;
const now = 1_000_000_000_000;

assert.equal(isHungry(now, null, hour), true);
assert.equal(isHungry(now, now - hour + 1, hour), false);
assert.equal(isHungry(now, now - hour, hour), true);
assert.equal(isHungry(now, now - hour - 1, hour), true);

console.log("hungryDogHunger.test.ts: ok");
