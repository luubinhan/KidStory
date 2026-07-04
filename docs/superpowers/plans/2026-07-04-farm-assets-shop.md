# Farm Assets Shop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the achievements page with a coin shop at `/assets` where users buy farm animals and buildings; inventory tracks quantities and unowned items appear dimmed.

**Architecture:** Static catalog in `src/data/shopItems.ts`, inventory as `Record<string, number>` with load-time migration from legacy `string[]`. Purchase logic lives in `userProgressLogic.ts` and is exposed via `buyShopItem()` on `UserProgressContext`. UI is a flat 2-column grid of `ShopItemCard` components.

**Tech Stack:** React 19, TypeScript, Vite, react-router-dom, Tailwind CSS v4, idb (IndexedDB), tsx for runnable test scripts

**Spec:** `docs/superpowers/specs/2026-07-04-farm-assets-shop-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `src/types/shop.ts` | `ShopItemId`, `ShopItem` types |
| `src/data/shopItems.ts` | Catalog array + `getShopItemById()` |
| `src/types/userProgress.ts` | Change `inventory` to `Record<string, number>` |
| `src/lib/userProgressLogic.ts` | `normalizeInventory`, `getItemQuantity`, `purchaseShopItem`; update defaults and achievement inventory write |
| `src/lib/userProgressLogic.test.ts` | Existing smoke tests (update default inventory assertion) |
| `src/lib/shopLogic.test.ts` | Purchase + migration tests |
| `src/lib/userProgressDb.ts` | Normalize inventory on load |
| `src/contexts/UserProgressContext.tsx` | `buyShopItem()`, `getItemQuantity()` |
| `src/components/shop/ShopItemCard.tsx` | Single item card with dim state + buy button |
| `src/pages/AssetsPage.tsx` | Shop page (replaces AchievementsPage) |
| `src/App.tsx` | Routes: `/assets`, redirects from `/achievements` and `/shop` |
| `src/components/course/CourseBottomNav.tsx` | Point nav to `/assets` |
| `public/images/shop/*.png` | Placeholder images (one per item) |
| Delete: `src/pages/AchievementsPage.tsx`, `src/pages/ShopPage.tsx` | Replaced by AssetsPage |

---

### Task 1: Shop types and catalog

**Files:**
- Create: `src/types/shop.ts`
- Create: `src/data/shopItems.ts`

- [ ] **Step 1: Create shop types**

Create `src/types/shop.ts`:

```typescript
export type ShopItemId =
  | "chicken"
  | "sheep"
  | "cow"
  | "pig"
  | "dog"
  | "cat"
  | "windmill"
  | "feed_mill"
  | "bread_oven"
  | "yogurt_machine"
  | "juice_factory";

export type ShopItem = {
  id: ShopItemId;
  name: string;
  price: number;
  imageUrl: string;
};
```

- [ ] **Step 2: Create shop catalog**

Create `src/data/shopItems.ts`:

```typescript
import type { ShopItem, ShopItemId } from "../types/shop";

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: "chicken", name: "Gà", price: 10, imageUrl: "/images/shop/chicken.png" },
  { id: "sheep", name: "Cừu", price: 10, imageUrl: "/images/shop/sheep.png" },
  { id: "cow", name: "Bò", price: 10, imageUrl: "/images/shop/cow.png" },
  { id: "pig", name: "Heo", price: 10, imageUrl: "/images/shop/pig.png" },
  { id: "dog", name: "Chó", price: 10, imageUrl: "/images/shop/dog.png" },
  { id: "cat", name: "Mèo", price: 10, imageUrl: "/images/shop/cat.png" },
  {
    id: "windmill",
    name: "Cối xoay gió",
    price: 100,
    imageUrl: "/images/shop/windmill.png",
  },
  {
    id: "feed_mill",
    name: "Nhà máy thức ăn",
    price: 100,
    imageUrl: "/images/shop/feed_mill.png",
  },
  {
    id: "bread_oven",
    name: "Lò nướng bánh mì",
    price: 100,
    imageUrl: "/images/shop/bread_oven.png",
  },
  {
    id: "yogurt_machine",
    name: "Máy làm sữa chua",
    price: 100,
    imageUrl: "/images/shop/yogurt_machine.png",
  },
  {
    id: "juice_factory",
    name: "Nhà máy nước ép",
    price: 100,
    imageUrl: "/images/shop/juice_factory.png",
  },
] as const;

const shopItemById = new Map(SHOP_ITEMS.map((item) => [item.id, item]));

export function getShopItemById(id: ShopItemId): ShopItem | undefined {
  return shopItemById.get(id);
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run lint`  
Expected: PASS (no errors related to new files)

- [ ] **Step 4: Commit**

```bash
git add src/types/shop.ts src/data/shopItems.ts
git commit -m "feat: add farm shop item catalog and types"
```

---

### Task 2: Inventory model + purchase logic (TDD)

**Files:**
- Modify: `src/types/userProgress.ts`
- Modify: `src/lib/userProgressLogic.ts`
- Create: `src/lib/shopLogic.test.ts`
- Modify: `src/lib/userProgressLogic.test.ts`

- [ ] **Step 1: Update inventory type**

In `src/types/userProgress.ts`, change line 22:

```typescript
  inventory: Record<string, number>;
```

- [ ] **Step 2: Write failing shop logic tests**

Create `src/lib/shopLogic.test.ts`:

```typescript
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

// --- normalizeInventory ---

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

// --- getItemQuantity ---

const defaultProgress = getDefaultProgress();
assert(getItemQuantity(defaultProgress, "pig") === 0, "missing item quantity is 0");

const withPig: UserProgressV1 = {
  ...defaultProgress,
  inventory: { pig: 2 },
};
assert(getItemQuantity(withPig, "pig") === 2, "existing quantity returned");

// --- purchaseShopItem ---

const broke = { ...defaultProgress, coins: 5 };
const brokeResult = purchaseShopItem(broke, "chicken");
assert(!brokeResult.success, "purchase fails when coins insufficient");
if (!brokeResult.success) {
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
if (!unknown.success) {
  assert(unknown.reason === "unknown_item", "failure reason is unknown_item");
}

assert(getShopItemById("cat")?.price === 10, "catalog lookup sanity check");

console.log("shopLogic.test.ts: all passed");
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx tsx src/lib/shopLogic.test.ts`  
Expected: FAIL — `normalizeInventory is not defined` (or similar)

- [ ] **Step 4: Implement inventory + purchase logic**

In `src/lib/userProgressLogic.ts`:

1. Add imports at top:

```typescript
import { getShopItemById } from "../data/shopItems";
import type { ShopItemId } from "../types/shop";
```

2. Change default inventory in `getDefaultProgress()`:

```typescript
    inventory: {},
```

3. Add these functions after `spendCoins`:

```typescript
export function normalizeInventory(
  inventory: string[] | Record<string, number>,
): Record<string, number> {
  if (Array.isArray(inventory)) {
    const record: Record<string, number> = {};
    for (const id of inventory) {
      record[id] = (record[id] ?? 0) + 1;
    }
    return record;
  }
  return { ...inventory };
}

export function getItemQuantity(progress: UserProgressV1, itemId: ShopItemId): number {
  return progress.inventory[itemId] ?? 0;
}

export function purchaseShopItem(
  progress: UserProgressV1,
  itemId: ShopItemId,
):
  | { success: true; progress: UserProgressV1 }
  | { success: false; reason: "insufficient_coins" | "unknown_item" } {
  const item = getShopItemById(itemId);
  if (!item) return { success: false, reason: "unknown_item" };
  if (progress.coins < item.price) return { success: false, reason: "insufficient_coins" };

  const currentQty = progress.inventory[itemId] ?? 0;

  return {
    success: true,
    progress: {
      ...progress,
      coins: progress.coins - item.price,
      inventory: {
        ...progress.inventory,
        [itemId]: currentQty + 1,
      },
    },
  };
}
```

4. Update `onActivityComplete` inventory copy (around line 151):

```typescript
    inventory: { ...progress.inventory },
```

5. Update treasure_mirror inventory write (around lines 179–181):

```typescript
    const current = next.inventory.treasure_mirror ?? 0;
    next.inventory = {
      ...next.inventory,
      treasure_mirror: current + 1,
    };
```

- [ ] **Step 5: Fix existing test default inventory assertion**

In `src/lib/userProgressLogic.test.ts`, no change needed if tests don't touch inventory. Run both test files after implementation.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx tsx src/lib/shopLogic.test.ts && npx tsx src/lib/userProgressLogic.test.ts`  
Expected: both print `all passed`

- [ ] **Step 7: Commit**

```bash
git add src/types/userProgress.ts src/lib/userProgressLogic.ts src/lib/shopLogic.test.ts
git commit -m "feat: add shop purchase logic and inventory migration"
```

---

### Task 3: Normalize inventory on load

**Files:**
- Modify: `src/lib/userProgressDb.ts`

- [ ] **Step 1: Add normalization on load**

Replace `loadUserProgress` in `src/lib/userProgressDb.ts`:

```typescript
import { getDefaultProgress, normalizeInventory } from "./userProgressLogic";

export async function loadUserProgress(): Promise<UserProgressV1> {
  const db = await getDb();
  const stored = await db.get(STORE_NAME, PROGRESS_KEY);
  if (!stored) return getDefaultProgress();

  const inventory = normalizeInventory(
    stored.inventory as string[] | Record<string, number>,
  );

  return {
    ...stored,
    inventory,
  };
}
```

Remove duplicate `getDefaultProgress` import if now imported from `userProgressLogic` only (keep the re-export at bottom).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/userProgressDb.ts
git commit -m "feat: migrate legacy inventory array on progress load"
```

---

### Task 4: Expose buyShopItem in context

**Files:**
- Modify: `src/contexts/UserProgressContext.tsx`

- [ ] **Step 1: Add imports and context methods**

Add to imports from `userProgressLogic`:

```typescript
  getItemQuantity,
  purchaseShopItem,
```

Add import:

```typescript
import type { ShopItemId } from "../types/shop";
```

Extend `UserProgressContextValue`:

```typescript
  buyShopItem: (itemId: ShopItemId) => Promise<boolean>;
  getItemQuantity: (itemId: ShopItemId) => number;
```

Add callbacks inside provider (after `useHint`):

```typescript
  const buyShopItem = useCallback(
    async (itemId: ShopItemId): Promise<boolean> => {
      const result = purchaseShopItem(progressRef.current, itemId);
      if (!result.success) return false;

      await persist(result.progress);
      return true;
    },
    [persist],
  );

  const getItemQuantityForItem = useCallback(
    (itemId: ShopItemId) => getItemQuantity(progressRef.current, itemId),
    [],
  );
```

Note: `getItemQuantityForItem` uses `progressRef` for sync reads but the value exposed to UI should derive from `progress` state for re-renders:

```typescript
  getItemQuantity: (itemId: ShopItemId) => getItemQuantity(progress, itemId),
```

Add both to the `useMemo` value object:

```typescript
      buyShopItem,
      getItemQuantity: (itemId: ShopItemId) => getItemQuantity(progress, itemId),
```

Add `buyShopItem` to the dependency array (not the inline getItemQuantity — it closes over `progress` which is already a dependency).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/contexts/UserProgressContext.tsx
git commit -m "feat: expose buyShopItem and getItemQuantity on progress context"
```

---

### Task 5: ShopItemCard component

**Files:**
- Create: `src/components/shop/ShopItemCard.tsx`

- [ ] **Step 1: Create ShopItemCard**

Create `src/components/shop/ShopItemCard.tsx`:

```tsx
import type { ShopItem } from "../../types/shop";
import { cn } from "../../lib/utils";

type ShopItemCardProps = {
  item: ShopItem;
  quantity: number;
  canAfford: boolean;
  onBuy: () => void;
  isLoading?: boolean;
};

export function ShopItemCard({
  item,
  quantity,
  canAfford,
  onBuy,
  isLoading = false,
}: ShopItemCardProps) {
  const isOwned = quantity > 0;

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-sm transition-all",
        !isOwned && "opacity-40 grayscale",
      )}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[120px]">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="size-full rounded-xl object-contain"
        />
        {isOwned && (
          <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
            {quantity}
          </span>
        )}
      </div>

      <h2 className="mt-2 text-center text-sm font-bold text-slate-800">{item.name}</h2>

      <p className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-700">
        <img src="/images/coin.png" alt="" className="size-3.5" aria-hidden />
        {item.price}
      </p>

      <button
        type="button"
        onClick={onBuy}
        disabled={!canAfford || isLoading}
        className={cn(
          "mt-3 w-full rounded-xl py-2 text-xs font-bold transition-colors",
          canAfford && !isLoading
            ? "bg-sky-500 text-white hover:bg-sky-600"
            : "cursor-not-allowed bg-slate-200 text-slate-400",
        )}
      >
        Mua
      </button>
    </article>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/shop/ShopItemCard.tsx
git commit -m "feat: add ShopItemCard with dim state and buy button"
```

---

### Task 6: Placeholder shop images

**Files:**
- Create: `public/images/shop/chicken.png`
- Create: `public/images/shop/sheep.png`
- Create: `public/images/shop/cow.png`
- Create: `public/images/shop/pig.png`
- Create: `public/images/shop/dog.png`
- Create: `public/images/shop/cat.png`
- Create: `public/images/shop/windmill.png`
- Create: `public/images/shop/feed_mill.png`
- Create: `public/images/shop/bread_oven.png`
- Create: `public/images/shop/yogurt_machine.png`
- Create: `public/images/shop/juice_factory.png`

- [ ] **Step 1: Copy coin image as temporary placeholder for all items**

Run:

```bash
mkdir -p public/images/shop
for id in chicken sheep cow pig dog cat windmill feed_mill bread_oven yogurt_machine juice_factory; do
  cp public/images/coin.png "public/images/shop/${id}.png"
done
```

Expected: 11 PNG files exist under `public/images/shop/`

- [ ] **Step 2: Commit**

```bash
git add public/images/shop/
git commit -m "chore: add placeholder shop item images"
```

---

### Task 7: AssetsPage

**Files:**
- Create: `src/pages/AssetsPage.tsx`
- Delete: `src/pages/AchievementsPage.tsx`

- [ ] **Step 1: Create AssetsPage**

Create `src/pages/AssetsPage.tsx`:

```tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CourseBottomNav } from "../components/course";
import { ShopItemCard } from "../components/shop/ShopItemCard";
import { CoinDisplay } from "../components/progress/CoinDisplay";
import { SHOP_ITEMS } from "../data/shopItems";
import { useUserProgress } from "../contexts/UserProgressContext";

export default function AssetsPage() {
  const { coins, isLoading, buyShopItem, getItemQuantity } = useUserProgress();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Study
          </Link>
          <CoinDisplay />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-800">Assets</h1>
        <p className="mt-1 text-sm text-slate-600">
          Dùng coin để mua động vật và công trình cho nông trại của bạn!
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {SHOP_ITEMS.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              canAfford={!isLoading && coins >= item.price}
              isLoading={isLoading}
              onBuy={() => {
                void buyShopItem(item.id);
              }}
            />
          ))}
        </div>
      </div>
      <CourseBottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Delete AchievementsPage**

Run: `rm src/pages/AchievementsPage.tsx`

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run lint`  
Expected: FAIL until Task 8 updates App.tsx imports — proceed to Task 8 before expecting PASS

- [ ] **Step 4: Commit**

```bash
git add src/pages/AssetsPage.tsx
git rm src/pages/AchievementsPage.tsx
git commit -m "feat: add AssetsPage farm shop grid"
```

---

### Task 8: Routing and navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/course/CourseBottomNav.tsx`
- Delete: `src/pages/ShopPage.tsx`

- [ ] **Step 1: Update App.tsx routes**

Replace imports:

```typescript
import AssetsPage from "./pages/AssetsPage";
```

Remove:

```typescript
import AchievementsPage from "./pages/AchievementsPage";
import ShopPage from "./pages/ShopPage";
```

Add `Navigate` to react-router import:

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
```

Replace route lines:

```typescript
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/achievements" element={<Navigate to="/assets" replace />} />
            <Route path="/shop" element={<Navigate to="/assets" replace />} />
```

- [ ] **Step 2: Update CourseBottomNav**

In `src/components/course/CourseBottomNav.tsx`:

Change nav item:

```typescript
  { id: "achievements", label: "Assets", icon: Boxes, to: "/assets" },
```

Change active check:

```typescript
            (item.id === "achievements" && pathname === "/assets") ||
```

- [ ] **Step 3: Delete ShopPage**

Run: `rm src/pages/ShopPage.tsx`

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/course/CourseBottomNav.tsx
git rm src/pages/ShopPage.tsx
git commit -m "feat: route /assets shop and redirect legacy paths"
```

---

### Task 9: Final verification

**Files:** (none — verification only)

- [ ] **Step 1: Run all tests**

Run: `npx tsx src/lib/shopLogic.test.ts && npx tsx src/lib/userProgressLogic.test.ts`  
Expected: both print `all passed`

- [ ] **Step 2: Run TypeScript check**

Run: `npm run lint`  
Expected: PASS with no errors

- [ ] **Step 3: Manual smoke test**

Run: `npm start`

Verify in browser:
1. Open `/assets` — 11 items in 2-column grid, all dimmed initially
2. Complete an activity to earn coins (or use devtools to bump coins in IndexedDB)
3. Tap "Mua" on Gà (10 coin) — coin balance drops, card brightens, quantity badge shows `1`
4. Buy Gà again — quantity becomes `2`
5. With insufficient coins, "Mua" button is disabled (grey)
6. `/achievements` and `/shop` redirect to `/assets`
7. Bottom nav "Assets" highlights on `/assets`

- [ ] **Step 4: Commit (if any fixups were needed)**

Only if fixes were made during verification.

---

## Plan self-review

| Spec requirement | Task |
|------------------|------|
| Replace achievements with shop | Task 7, 8 |
| Buy button, no confirm dialog | Task 5 (ShopItemCard) |
| Multiple purchases + quantity | Task 2, 4 |
| PNG images + placeholders | Task 6 |
| Flat grid | Task 7 |
| Route `/assets` + nav update | Task 8 |
| Dim unowned items | Task 5 (`opacity-40 grayscale`) |
| Extensible catalog | Task 1 |
| Legacy inventory migration | Task 2, 3 |
| Achievement backend unchanged | Task 2 (treasure_mirror write updated only) |
| Redirect `/achievements`, `/shop` | Task 8 |

No placeholders or TBD items remain in this plan.
