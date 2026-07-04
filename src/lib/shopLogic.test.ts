import { getShopItemById } from "../data/shopItems";
import type { ShopItemId } from "../types/shop";
import type { UserProgressV1 } from "../types/userProgress";
import {
  getDefaultProgress,
  getItemQuantity,
  normalizeInventory,
  purchaseShopItem,
} from "./userProgressLogic";

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

assert(
  normalizeInventory([]).chicken === undefined,
  "empty array migrates to empty record",
);

const legacyInventory = ["treasure_mirror", "chicken", "chicken"];
const migrated = normalizeInventory(legacyInventory);
assert(migrated.treasure_mirror === 1, "legacy treasure_mirror count is 1");
assert(migrated.chicken === 2, "legacy chicken duplicates counted");

const recordInventory = { cow: 3 };
assert(
  normalizeInventory(recordInventory).cow === 3,
  "record inventory passes through unchanged",
);

const defaultProgress = getDefaultProgress();
assert(getItemQuantity(defaultProgress, "pig") === 0, "missing item quantity is 0");

const withPig: UserProgressV1 = {
  ...defaultProgress,
  inventory: { pig: 2 },
};
assert(getItemQuantity(withPig, "pig") === 2, "existing quantity returned");

const broke = { ...defaultProgress, coins: 5 };
const brokeResult = purchaseShopItem(broke, "chicken");
assert(!brokeResult.success, "purchase fails when coins insufficient");
if (brokeResult.success === false) {
  assert(brokeResult.reason === "insufficient_coins", "failure reason is insufficient_coins");
}

const rich = { ...defaultProgress, coins: 50 };
const firstBuy = purchaseShopItem(rich, "chicken");
assert(firstBuy.success, "purchase succeeds with enough coins");
if (firstBuy.success) {
  assert(firstBuy.progress.coins === 40, "10 coins deducted");
  assert(getItemQuantity(firstBuy.progress, "chicken") === 1, "quantity incremented to 1");
}

const secondBuy = purchaseShopItem(firstBuy.success ? firstBuy.progress : rich, "chicken");
assert(secondBuy.success, "second purchase of same item succeeds");
if (secondBuy.success) {
  assert(getItemQuantity(secondBuy.progress, "chicken") === 2, "quantity incremented to 2");
}

const building = { ...defaultProgress, coins: 200 };
const buildingBuy = purchaseShopItem(building, "windmill");
assert(buildingBuy.success, "100-coin building purchase succeeds");
if (buildingBuy.success) {
  assert(buildingBuy.progress.coins === 100, "100 coins deducted for windmill");
}

const unknown = purchaseShopItem(rich, "not_real" as ShopItemId);
assert(!unknown.success, "unknown item id fails");
if (unknown.success === false) {
  assert(unknown.reason === "unknown_item", "failure reason is unknown_item");
}

assert(getShopItemById("cat")?.price === 10, "catalog lookup sanity check");

console.log("shopLogic.test.ts: all passed");
