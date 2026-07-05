# Diamond Currency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add diamonds as a second currency — earned (+50) from write and complete-sentence activities on every finish, spent alongside coins on seven premium shop buildings.

**Architecture:** Extend the existing coin pipeline in `userProgressLogic.ts`: `diamonds` on `UserProgressV1`, activity rewards via `DIAMOND_REWARD_BY_ACTIVITY` map, optional `diamondPrice` on shop items, dual-currency checks in `purchaseShopItem`. UI mirrors coins with `DiamondDisplay` + `CurrencyDisplay` wrapper.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, idb (IndexedDB), tsx for runnable test scripts

**Spec:** `docs/superpowers/specs/2026-07-05-diamond-currency-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `src/types/userProgress.ts` | `diamonds` field, `DIAMOND_REWARD_BY_ACTIVITY`, `diamondsEarned` on result |
| `src/types/shop.ts` | Optional `diamondPrice` on `ShopItem` |
| `src/data/shopItems.ts` | Add `diamondPrice: 50` to 7 premium items |
| `src/lib/userProgressLogic.ts` | Earn/spend diamonds; `canAffordShopItem()` helper |
| `src/lib/diamondLogic.test.ts` | Diamond earning tests |
| `src/lib/shopLogic.test.ts` | Dual-currency purchase tests |
| `src/lib/userProgressDb.ts` | Default `diamonds` to 0 on load |
| `src/contexts/UserProgressContext.tsx` | Expose `diamonds` |
| `src/components/progress/DiamondDisplay.tsx` | Diamond balance pill |
| `src/components/progress/CurrencyDisplay.tsx` | Coin + diamond row |
| `src/components/progress/RewardToast.tsx` | Include diamonds in toast text |
| `src/hooks/useActivityCompletion.tsx` | Pass `diamondsEarned` to formatter |
| `src/components/course-practice/CourseFlashcardsSession.tsx` | Pass `diamondsEarned` to formatter |
| `src/components/shop/ShopItemCard.tsx` | Dual price on buy button |
| `src/pages/AssetsPage.tsx` | Affordability uses `canAffordShopItem` |
| `src/pages/CoursePage.tsx` | Swap `CoinDisplay` → `CurrencyDisplay` |
| `src/pages/CourseUnitPage.tsx` | Swap `CoinDisplay` → `CurrencyDisplay` |
| `src/components/course-practice/CoursePracticeHeader.tsx` | Swap `CoinDisplay` → `CurrencyDisplay` |

---

### Task 1: Types and constants

**Files:**
- Modify: `src/types/userProgress.ts`
- Modify: `src/types/shop.ts`

- [ ] **Step 1: Add diamond fields to user progress types**

In `src/types/userProgress.ts`, add the reward map and extend types:

```typescript
import type { CourseActivityId } from "./course";

export const COIN_PER_ACTIVITY = 10;
export const COIN_UNIT_BONUS = 100;
export const COIN_TREASURE_MIRROR_REWARD = 1000;
export const COIN_HINT_COST = 1;
export const TREASURE_MIRROR_UNITS_REQUIRED = 5;

export const DIAMOND_REWARD_BY_ACTIVITY: Partial<Record<CourseActivityId, number>> = {
  write: 50,
  "complete-sentence": 50,
};

// ... existing AchievementId, AchievementRecord ...

export type UserProgressV1 = {
  version: 1;
  coins: number;
  diamonds: number;
  unitActivityCompletions: Record<string, CourseActivityId[]>;
  unitBonusClaimed: Record<string, boolean>;
  achievements: Partial<Record<AchievementId, AchievementRecord>>;
  inventory: Record<string, number>;
};

export type ActivityRewardResult = {
  progress: UserProgressV1;
  coinsEarned: number;
  diamondsEarned: number;
  activityBonus: number;
  unitBonusEarned: number;
  achievementUnlocked: AchievementId | null;
  achievementReward: number;
};
```

- [ ] **Step 2: Add optional diamondPrice to ShopItem**

In `src/types/shop.ts`, extend `ShopItem`:

```typescript
export type ShopItem = {
  id: ShopItemId;
  name: string;
  price: number;
  diamondPrice?: number;
  imageUrl: string;
  position: {
    x: number | string;
    y: number | string;
  };
};
```

- [ ] **Step 3: Verify types compile**

Run: `npm run lint`  
Expected: FAIL on `getDefaultProgress()` missing `diamonds` and other downstream errors (fixed in Task 2).

---

### Task 2: Diamond earning logic (TDD)

**Files:**
- Create: `src/lib/diamondLogic.test.ts`
- Modify: `src/lib/userProgressLogic.ts`

- [ ] **Step 1: Write failing diamond earning tests**

Create `src/lib/diamondLogic.test.ts`:

```typescript
import { courseUnits } from "../data/course";
import type { UserProgressV1 } from "../types/userProgress";
import { getDefaultProgress, onActivityComplete } from "./userProgressLogic";

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

const unit = courseUnits[0];
if (!unit) throw new Error("Need at least one course unit for tests");

const base: UserProgressV1 = getDefaultProgress();
assert(base.diamonds === 0, "default diamonds is 0");

const writeResult = onActivityComplete(base, unit, "write");
assert(writeResult.diamondsEarned === 50, "write awards 50 diamonds");
assert(writeResult.progress.diamonds === 50, "write adds 50 to balance");

const typedResult = onActivityComplete(base, unit, "complete-sentence");
assert(typedResult.diamondsEarned === 50, "complete-sentence awards 50 diamonds");
assert(typedResult.progress.diamonds === 50, "complete-sentence adds 50 to balance");

const flashcardsResult = onActivityComplete(base, unit, "flashcards");
assert(flashcardsResult.diamondsEarned === 0, "flashcards awards 0 diamonds");
assert(flashcardsResult.progress.diamonds === 0, "flashcards does not change diamonds");

const replay = onActivityComplete(writeResult.progress, unit, "write");
assert(replay.diamondsEarned === 50, "write replay still awards 50 diamonds");
assert(replay.progress.diamonds === 100, "write replay stacks diamonds");

console.log("diamondLogic.test.ts: all passed");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/diamondLogic.test.ts`  
Expected: FAIL — `diamonds` undefined or `diamondsEarned` missing

- [ ] **Step 3: Implement diamond earning in userProgressLogic**

In `src/lib/userProgressLogic.ts`:

1. Import `DIAMOND_REWARD_BY_ACTIVITY` from `../types/userProgress`.
2. Add `diamonds: 0` to `getDefaultProgress()`.
3. In `onActivityComplete`, after computing coin rewards and before `next.coins += coinsEarned`:

```typescript
  const diamondReward = DIAMOND_REWARD_BY_ACTIVITY[activityId] ?? 0;
  next.diamonds = progress.diamonds + diamondReward;
```

4. Return `diamondsEarned: diamondReward` in the result object.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/diamondLogic.test.ts`  
Expected: `diamondLogic.test.ts: all passed`

- [ ] **Step 5: Commit**

```bash
git add src/types/userProgress.ts src/types/shop.ts src/lib/userProgressLogic.ts src/lib/diamondLogic.test.ts
git commit -m "feat: award diamonds from write and complete-sentence activities"
```

---

### Task 3: Dual-currency shop purchase (TDD)

**Files:**
- Modify: `src/lib/shopLogic.test.ts`
- Modify: `src/lib/userProgressLogic.ts`
- Modify: `src/data/shopItems.ts`

- [ ] **Step 1: Add diamondPrice to premium catalog items**

In `src/data/shopItems.ts`, add `diamondPrice: 50` to these entries only:
- `house`
- `rice-threshing-machine`
- `windmill`
- `feed_mill`
- `bread_oven`
- `yogurt_machine`
- `juice_factory`

Example for `house`:

```typescript
  {
    id: "house",
    name: "House",
    price: 50,
    diamondPrice: 50,
    imageUrl: "/images/shop/chicken.png",
    position: { y: '38dvw', x: '38dvw' },
  },
```

- [ ] **Step 2: Write failing dual-currency purchase tests**

Append to `src/lib/shopLogic.test.ts` before the final `console.log`:

```typescript
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
  assert(buildingDualBuy.progress.coins === 100, "100 coins deducted for windmill");
  assert(buildingDualBuy.progress.diamonds === 0, "50 diamonds deducted for windmill");
  assert(getItemQuantity(buildingDualBuy.progress, "windmill") === 1, "windmill quantity is 1");
}

const coinsOnlyBuy = purchaseShopItem({ ...defaultProgress, coins: 50 }, "chicken");
assert(coinsOnlyBuy.success, "chicken still coins-only purchase works");
if (coinsOnlyBuy.success) {
  assert(coinsOnlyBuy.progress.diamonds === 0, "chicken purchase does not spend diamonds");
}
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx tsx src/lib/shopLogic.test.ts`  
Expected: FAIL — `insufficient_diamonds` reason not implemented or diamonds not deducted

- [ ] **Step 4: Implement dual-currency purchase**

In `src/lib/userProgressLogic.ts`, update `purchaseShopItem`:

```typescript
export function canAffordShopItem(progress: UserProgressV1, itemId: ShopItemId): boolean {
  const item = getShopItemById(itemId);
  if (!item) return false;
  if (progress.coins < item.price) return false;
  const diamondCost = item.diamondPrice ?? 0;
  return progress.diamonds >= diamondCost;
}

export function purchaseShopItem(
  progress: UserProgressV1,
  itemId: ShopItemId,
):
  | { success: true; progress: UserProgressV1 }
  | { success: false; reason: "insufficient_coins" | "insufficient_diamonds" | "unknown_item" } {
  const item = getShopItemById(itemId);
  if (!item) return { success: false, reason: "unknown_item" };

  const diamondCost = item.diamondPrice ?? 0;
  if (progress.diamonds < diamondCost) {
    return { success: false, reason: "insufficient_diamonds" };
  }
  if (progress.coins < item.price) {
    return { success: false, reason: "insufficient_coins" };
  }

  const currentQty = progress.inventory[itemId] ?? 0;

  return {
    success: true,
    progress: {
      ...progress,
      coins: progress.coins - item.price,
      diamonds: progress.diamonds - diamondCost,
      inventory: {
        ...progress.inventory,
        [itemId]: currentQty + 1,
      },
    },
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx tsx src/lib/shopLogic.test.ts && npx tsx src/lib/diamondLogic.test.ts`  
Expected: both print `all passed`

- [ ] **Step 6: Commit**

```bash
git add src/data/shopItems.ts src/lib/userProgressLogic.ts src/lib/shopLogic.test.ts
git commit -m "feat: dual-currency shop purchases for premium buildings"
```

---

### Task 4: IndexedDB migration

**Files:**
- Modify: `src/lib/userProgressDb.ts`

- [ ] **Step 1: Default diamonds on load**

In `src/lib/userProgressDb.ts`, update `loadUserProgress` return:

```typescript
  return {
    ...stored,
    diamonds: stored.diamonds ?? 0,
    inventory,
  };
```

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint`  
Expected: PASS (or only unrelated pre-existing errors)

- [ ] **Step 3: Commit**

```bash
git add src/lib/userProgressDb.ts
git commit -m "fix: default missing diamonds to 0 on progress load"
```

---

### Task 5: Context exposes diamonds

**Files:**
- Modify: `src/contexts/UserProgressContext.tsx`

- [ ] **Step 1: Add diamonds to context value**

In `src/contexts/UserProgressContext.tsx`:

1. Add `diamonds: number` to `UserProgressContextValue`.
2. In the `useMemo` value object, add `diamonds: progress.diamonds`.

- [ ] **Step 2: Verify lint**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/contexts/UserProgressContext.tsx
git commit -m "feat: expose diamond balance from UserProgressContext"
```

---

### Task 6: Reward toast shows diamonds

**Files:**
- Modify: `src/components/progress/RewardToast.tsx`
- Modify: `src/hooks/useActivityCompletion.tsx`
- Modify: `src/components/course-practice/CourseFlashcardsSession.tsx`

- [ ] **Step 1: Extend formatActivityReward**

In `src/components/progress/RewardToast.tsx`, update signature and body:

```typescript
export function formatActivityReward(
  coinsEarned: number,
  unitBonusEarned: number,
  achievementUnlocked: string | null,
  achievementReward: number,
  diamondsEarned: number,
): string {
  const parts: string[] = [`+${coinsEarned - unitBonusEarned - achievementReward} coin`];

  if (diamondsEarned > 0) {
    parts.push(`+${diamondsEarned} diamond`);
  }

  if (unitBonusEarned > 0) {
    parts.push(`+${unitBonusEarned} unit bonus`);
  }

  if (achievementUnlocked && achievementReward > 0) {
    parts.push(`+${achievementReward} treasure reward`);
  }

  return parts.join(" · ");
}
```

- [ ] **Step 2: Update callers**

In `src/hooks/useActivityCompletion.tsx`, pass `result.diamondsEarned` in both `formatActivityReward` calls (inside the hook and in `completeActivityOnce`).

In `src/components/course-practice/CourseFlashcardsSession.tsx`, pass `result.diamondsEarned` (will be `0` for flashcards).

- [ ] **Step 3: Verify lint**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/progress/RewardToast.tsx src/hooks/useActivityCompletion.tsx src/components/course-practice/CourseFlashcardsSession.tsx
git commit -m "feat: show diamond rewards in activity completion toast"
```

---

### Task 7: Currency display components

**Files:**
- Create: `src/components/progress/DiamondDisplay.tsx`
- Create: `src/components/progress/CurrencyDisplay.tsx`
- Modify: `src/pages/CoursePage.tsx`
- Modify: `src/pages/CourseUnitPage.tsx`
- Modify: `src/components/course-practice/CoursePracticeHeader.tsx`
- Modify: `src/pages/AssetsPage.tsx`

- [ ] **Step 1: Create DiamondDisplay**

Create `src/components/progress/DiamondDisplay.tsx`:

```typescript
import { useUserProgress } from "../../contexts/UserProgressContext";
import { cn } from "../../lib/utils";

type DiamondDisplayProps = {
  className?: string;
  size?: "sm" | "md";
};

export function DiamondDisplay({ className, size = "md" }: DiamondDisplayProps) {
  const { diamonds, isLoading } = useUserProgress();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 font-bold text-sky-800",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "text-sm",
        className,
      )}
      aria-label={`${isLoading ? 0 : diamonds} diamonds`}
    >
      <img
        src={import.meta.env.DEV ? "/images/diamond.png" : "images/diamond.png"}
        alt=""
        className="h-[16px]"
        aria-hidden
      />
      <span>{isLoading ? "…" : diamonds}</span>
    </div>
  );
}
```

- [ ] **Step 2: Create CurrencyDisplay**

Create `src/components/progress/CurrencyDisplay.tsx`:

```typescript
import { CoinDisplay } from "./CoinDisplay";
import { DiamondDisplay } from "./DiamondDisplay";
import { cn } from "../../lib/utils";

type CurrencyDisplayProps = {
  className?: string;
  size?: "sm" | "md";
};

export function CurrencyDisplay({ className, size = "md" }: CurrencyDisplayProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CoinDisplay size={size} />
      <DiamondDisplay size={size} />
    </div>
  );
}
```

- [ ] **Step 3: Replace CoinDisplay with CurrencyDisplay in headers**

In each file, replace:
```typescript
import { CoinDisplay } from ".../CoinDisplay";
// ...
<CoinDisplay ... />
```
with:
```typescript
import { CurrencyDisplay } from ".../CurrencyDisplay";
// ...
<CurrencyDisplay ... />  // preserve className and size props
```

Files: `CoursePage.tsx`, `CourseUnitPage.tsx`, `CoursePracticeHeader.tsx`, `AssetsPage.tsx`.

- [ ] **Step 4: Verify lint**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/progress/DiamondDisplay.tsx src/components/progress/CurrencyDisplay.tsx src/pages/CoursePage.tsx src/pages/CourseUnitPage.tsx src/components/course-practice/CoursePracticeHeader.tsx src/pages/AssetsPage.tsx
git commit -m "feat: show diamond balance alongside coins in headers"
```

---

### Task 8: Shop card dual price and affordability

**Files:**
- Modify: `src/components/shop/ShopItemCard.tsx`
- Modify: `src/pages/AssetsPage.tsx`

- [ ] **Step 1: Update ShopItemCard buy button**

In `src/components/shop/ShopItemCard.tsx`, replace the price span inside the button:

```typescript
        <span className="flex items-center justify-center gap-1">
          {item.name}
          <img
            src={import.meta.env.DEV ? "/images/coin.png" : "images/coin.png"}
            alt=""
            className="size-3.5"
            aria-hidden
          />
          {item.price}
          {item.diamondPrice != null && item.diamondPrice > 0 ? (
            <>
              <img
                src={import.meta.env.DEV ? "/images/diamond.png" : "images/diamond.png"}
                alt=""
                className="size-3.5"
                aria-hidden
              />
              {item.diamondPrice}
            </>
          ) : null}
        </span>
```

- [ ] **Step 2: Update AssetsPage affordability**

In `src/pages/AssetsPage.tsx`:

1. Import `canAffordShopItem` from `../lib/userProgressLogic`.
2. Destructure `progress` from `useUserProgress()` (or pass `progress` — use `const { progress, isLoading, ... } = useUserProgress()`).
3. Replace `canAfford={!isLoading && coins >= item.price}` with:

```typescript
canAfford={!isLoading && canAffordShopItem(progress, item.id)}
```

- [ ] **Step 3: Run full test suite**

Run: `npx tsx src/lib/diamondLogic.test.ts && npx tsx src/lib/shopLogic.test.ts && npx tsx src/lib/userProgressLogic.test.ts && npm run lint`  
Expected: all tests pass, lint clean

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/ShopItemCard.tsx src/pages/AssetsPage.tsx
git commit -m "feat: dual-currency price display and affordability on shop cards"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run all tests**

Run: `npx tsx src/lib/diamondLogic.test.ts && npx tsx src/lib/shopLogic.test.ts && npx tsx src/lib/userProgressLogic.test.ts`  
Expected: all print `all passed`

- [ ] **Step 2: Typecheck**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 3: Manual smoke test**

Run: `npm start`

Checklist:
- [ ] Finish a **write** session → toast shows `+10 coin · +50 diamond`; header diamond count increases
- [ ] Replay write → diamonds increase again
- [ ] Finish **complete-sentence** → same diamond toast
- [ ] Finish **flashcards** → toast has coins only, no diamond line
- [ ] On `/assets`, premium building button shows both coin and diamond icons/prices
- [ ] Buy windmill with 100 coins + 50 diamonds → both balances decrease, quantity badge appears
- [ ] Buy button disabled when diamonds < 50 even if coins sufficient
