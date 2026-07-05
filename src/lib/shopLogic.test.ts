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

const building = { ...defaultProgress, coins: 200, diamonds: 50 };
const buildingBuy = purchaseShopItem(building, "windmill");
assert(buildingBuy.success, "100-coin building purchase succeeds");
if (buildingBuy.success) {
  assert(buildingBuy.progress.coins === 100, "100 coins deducted for windmill");
}

const noDiamonds = { ...defaultProgress, coins: 200, diamonds: 0 };
const noDiamondsBuy = purchaseShopItem(noDiamonds, "windmill");
assert(!noDiamondsBuy.success, "windmill fails without diamonds");
if (noDiamondsBuy.success === false) {
  assert(noDiamondsBuy.reason === "insufficient_diamonds", "failure reason is insufficient_diamonds");
}

const noCoins = { ...defaultProgress, coins: 50, diamonds: 100 };
const noCoinsBuy = purchaseShopItem(noCoins, "windmill");
assert(!noCoinsBuy.success, "windmill fails without enough coins");
if (noCoinsBuy.success === false) {
  assert(noCoinsBuy.reason === "insufficient_coins", "failure reason is insufficient_coins");
}

const canBuyBuilding = { ...defaultProgress, coins: 200, diamonds: 50 };
const buildingDualBuy = purchaseShopItem(canBuyBuilding, "windmill");
assert(buildingDualBuy.success, "windmill succeeds with coins and diamonds");
if (buildingDualBuy.success) {
  assert(buildingDualBuy.progress.coins === 100, "100 coins deducted for windmill dual buy");
  assert(buildingDualBuy.progress.diamonds === 0, "50 diamonds deducted for windmill");
  assert(getItemQuantity(buildingDualBuy.progress, "windmill") === 1, "windmill quantity is 1");
}

const coinsOnlyBuy = purchaseShopItem({ ...defaultProgress, coins: 50 }, "chicken");
assert(coinsOnlyBuy.success, "chicken still coins-only purchase works");
if (coinsOnlyBuy.success) {
  assert(coinsOnlyBuy.progress.diamonds === 0, "chicken purchase does not spend diamonds");
}

const unknown = purchaseShopItem(rich, "not_real" as ShopItemId);
assert(!unknown.success, "unknown item id fails");
if (unknown.success === false) {
  assert(unknown.reason === "unknown_item", "failure reason is unknown_item");
}

assert(getShopItemById("cat")?.price === 10, "catalog lookup sanity check");

console.log("shopLogic.test.ts: all passed");
