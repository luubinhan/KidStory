# Doraemon Shop Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/doreamon-shop` its own 25-item gadget catalog with the same buy/inventory flow as the farm shop, temporary 1 coin + 1 diamond prices, and Vietnamese names.

**Architecture:** Separate `DOREAMON_SHOP_ITEMS` catalog and types; unify purchase lookup via `getPurchasableItemById` so farm and Doraemon share `purchaseShopItem` / inventory. Grid UI uses a new `DoreamonShopItemCard` (farm `ShopItemCard` stays map-oriented).

**Tech Stack:** React 19, TypeScript, existing `useUserProgress`, Dexie inventory, Tailwind.

**Spec:** `docs/superpowers/specs/2026-07-17-doreamon-shop-catalog-design.md`

## Global Constraints

- Display names: Vietnamese exact list from spec
- Prices: `price: 1`, `diamondPrice: 1` for all Doraemon items
- Shared placeholder image: `https://luubinhan.github.io/KidStory/images/shop/bread_oven.png`
- Farm `SHOP_ITEMS` / `ShopItemCard` / `/assets` unchanged
- Doraemon items not shown on farm map
- No new toast / confirm modal

---

### Task 1: Types + Doraemon catalog data

**Files:**
- Modify: `src/types/shop.ts`
- Create: `src/data/doreamonShopItems.ts`

**Interfaces:**
- Produces: `DoreamonShopItemId`, `DoreamonShopItem`, `PurchasableItemId`, `DOREAMON_SHOP_ITEMS`, `getDoreamonShopItemById(id)`

- [ ] **Step 1: Extend `src/types/shop.ts`**

Append (keep existing `ShopItemId` / `ShopItem`):

```ts
export type DoreamonShopItemId =
  | "anywhere-door"
  | "small-light"
  | "bamboo-copter"
  | "big-light"
  | "time-machine"
  | "4d-pocket"
  | "hypnosis-megaphone"
  | "request-phone"
  | "time-cloth"
  | "invisibility-cloak"
  | "memory-bread"
  | "time-tv"
  | "cloud-maker"
  | "auto-translator"
  | "strength-gloves"
  | "copy-machine"
  | "time-stopwatch"
  | "paper-airplane"
  | "morph-stick"
  | "xray-glasses"
  | "food-maker"
  | "mini-helper-robot"
  | "healing-music-box"
  | "house-capsule"
  | "teleport-umbrella";

export type DoreamonShopItem = {
  id: DoreamonShopItemId;
  name: string;
  price: number;
  diamondPrice: number;
  imageUrl: string;
};

export type PurchasableItemId = ShopItemId | DoreamonShopItemId;
```

- [ ] **Step 2: Create `src/data/doreamonShopItems.ts`**

25 items from spec, each `price: 1`, `diamondPrice: 1`, shared placeholder URL. Export `DOREAMON_SHOP_ITEMS` with `satisfies readonly DoreamonShopItem[]`, Map lookup, and:

```ts
export function getDoreamonShopItemById(
  id: DoreamonShopItemId,
): DoreamonShopItem | undefined
```

- [ ] **Step 3: Commit**

```bash
git add src/types/shop.ts src/data/doreamonShopItems.ts
git commit -m "feat: add Doraemon shop item types and catalog"
```

---

### Task 2: Unified purchase lookup + tests

**Files:**
- Modify: `src/lib/userProgressLogic.ts`
- Modify: `src/contexts/UserProgressContext.tsx`
- Modify: `src/lib/shopLogic.test.ts`

**Interfaces:**
- Consumes: `getDoreamonShopItemById`, `PurchasableItemId`
- Produces: `getPurchasableItemById(id)` returning `{ price: number; diamondPrice?: number } | undefined`; `purchaseShopItem` / `canAffordShopItem` / `getItemQuantity` accept `PurchasableItemId`

- [ ] **Step 1: Add failing Doraemon cases to `shopLogic.test.ts`**

```ts
import { getDoreamonShopItemById } from "../data/doreamonShopItems";
import { getPurchasableItemById } from "./userProgressLogic";

assert(
  getDoreamonShopItemById("anywhere-door")?.price === 1,
  "Doraemon catalog price is 1",
);
assert(
  getDoreamonShopItemById("anywhere-door")?.diamondPrice === 1,
  "Doraemon catalog diamondPrice is 1",
);
assert(
  getPurchasableItemById("anywhere-door")?.price === 1,
  "unified lookup finds Doraemon item",
);

const doraBroke = { ...defaultProgress, coins: 0, diamonds: 1 };
const doraBrokeBuy = purchaseShopItem(doraBroke, "anywhere-door");
assert(!doraBrokeBuy.success, "Doraemon buy fails without coins");

const doraNoDia = { ...defaultProgress, coins: 1, diamonds: 0 };
const doraNoDiaBuy = purchaseShopItem(doraNoDia, "anywhere-door");
assert(!doraNoDiaBuy.success, "Doraemon buy fails without diamonds");

const doraOk = { ...defaultProgress, coins: 5, diamonds: 3 };
const doraBuy = purchaseShopItem(doraOk, "anywhere-door");
assert(doraBuy.success, "Doraemon buy succeeds with 1 coin + 1 diamond");
if (doraBuy.success) {
  assert(doraBuy.progress.coins === 4, "1 coin deducted for Doraemon item");
  assert(doraBuy.progress.diamonds === 2, "1 diamond deducted for Doraemon item");
  assert(getItemQuantity(doraBuy.progress, "anywhere-door") === 1, "Doraemon qty is 1");
}
```

- [ ] **Step 2: Run test — expect fail on missing `getPurchasableItemById` / Doraemon purchase**

Run: `npx tsx src/lib/shopLogic.test.ts`

- [ ] **Step 3: Implement lookup + widen IDs in `userProgressLogic.ts`**

```ts
import { getDoreamonShopItemById } from "../data/doreamonShopItems";
import type { PurchasableItemId } from "../types/shop";

export function getPurchasableItemById(id: PurchasableItemId) {
  return getShopItemById(id as never) ?? getDoreamonShopItemById(id as never);
}
```

Prefer typed approach: try farm then Doraemon without `as never` if possible (narrow via separate lookups or cast only on each catalog helper).

Update `getItemQuantity`, `canAffordShopItem`, `purchaseShopItem` to take `PurchasableItemId` and use `getPurchasableItemById`.

- [ ] **Step 4: Widen context types to `PurchasableItemId`**

In `UserProgressContext.tsx`, change `buyShopItem` / `getItemQuantity` param types from `ShopItemId` to `PurchasableItemId`.

- [ ] **Step 5: Run tests + lint**

```bash
npx tsx src/lib/shopLogic.test.ts
npm run lint
```

Expected: all passed; no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/userProgressLogic.ts src/contexts/UserProgressContext.tsx src/lib/shopLogic.test.ts
git commit -m "feat: purchase Doraemon shop items via shared inventory"
```

---

### Task 3: Doraemon shop UI

**Files:**
- Create: `src/components/shop/DoreamonShopItemCard.tsx`
- Modify: `src/pages/DoreamonShopPage.tsx`

**Interfaces:**
- Consumes: `DOREAMON_SHOP_ITEMS`, `DoreamonShopItem`, `buyShopItem`, `canAffordShopItem`, `getItemQuantity`
- Produces: grid cards showing name, image, prices, quantity, buy button

- [ ] **Step 1: Create `DoreamonShopItemCard`**

Grid-friendly card (not absolute/positioned): image, Vietnamese `name`, quantity badge when `quantity > 0`, buy button with coin + diamond icons (`ASSETS`) matching farm buy afford/disabled pattern.

Props: `{ item: DoreamonShopItem; quantity: number; canAfford: boolean; onBuy: () => void; isLoading?: boolean }`

- [ ] **Step 2: Wire `DoreamonShopPage`**

Replace `SHOP_ITEMS` / `ShopItemCard` with `DOREAMON_SHOP_ITEMS` / `DoreamonShopItemCard`. Keep Farm link, `CurrencyDisplay`, background, bottom nav.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/DoreamonShopItemCard.tsx src/pages/DoreamonShopPage.tsx
git commit -m "feat: render Doraemon gadget catalog on shop page"
```

---

### Task 4: Plan doc commit (if not already)

**Files:**
- Create: `docs/superpowers/plans/2026-07-17-doreamon-shop-catalog.md` (this file)

- [ ] **Step 1: Ensure plan is committed on main**

```bash
git add docs/superpowers/plans/2026-07-17-doreamon-shop-catalog.md
git commit -m "docs: add Doraemon shop catalog implementation plan"
```
