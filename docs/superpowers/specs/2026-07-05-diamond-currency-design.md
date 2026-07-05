# Diamond Currency — Design Spec

**Date:** 2026-07-05  
**Status:** Approved (brainstorming session)

## Summary

Introduce a second currency, **diamonds**, earned from write and complete-sentence practice activities. Seven premium shop buildings require both coins (existing price) and 50 diamonds to purchase. Diamond balance appears everywhere coin balance appears today.

## Decisions

| Topic | Choice |
|-------|--------|
| Diamond earn timing | Every activity finish, including replays (same as coins) |
| Earn amount | +50 diamonds per write or complete-sentence completion |
| Other activities | Coins only; no diamonds |
| Balance visibility | Anywhere `CoinDisplay` appears (course map, unit page, practice header, assets page) |
| Reward toast | Show `+50 diamond` alongside coin rewards |
| Shop button layout | Single line with both icons: `Name 🪙50 💎50` |
| Purchase rule | Dual-currency items deduct **both** coin price and diamond price atomically |

## Premium shop items

| Item ID | Coin price | Diamond price |
|---------|------------|---------------|
| `house` | 50 | 50 |
| `rice-threshing-machine` | 50 | 50 |
| `windmill` | 100 | 50 |
| `feed_mill` | 100 | 50 |
| `bread_oven` | 100 | 50 |
| `yogurt_machine` | 100 | 50 |
| `juice_factory` | 100 | 50 |

All other catalog items remain coins-only (`diamondPrice` omitted).

## Architecture

```
src/types/userProgress.ts       diamonds field, DIAMOND_REWARD_BY_ACTIVITY, diamondsEarned on result
src/types/shop.ts               optional diamondPrice on ShopItem
src/data/shopItems.ts           diamondPrice on 7 premium items
src/lib/userProgressLogic.ts    earn diamonds in onActivityComplete; dual-currency purchaseShopItem; canAffordShopItem
src/lib/userProgressDb.ts       default diamonds to 0 on load
src/contexts/UserProgressContext.tsx   expose diamonds
src/components/progress/DiamondDisplay.tsx   balance pill (mirrors CoinDisplay)
src/components/progress/CurrencyDisplay.tsx   CoinDisplay + DiamondDisplay row
src/components/progress/RewardToast.tsx       formatActivityReward includes diamonds
src/components/shop/ShopItemCard.tsx          dual price on buy button
src/pages/AssetsPage.tsx                        canAfford checks coins + diamonds
public/images/diamond.png                     existing asset reused
```

## Data model

**UserProgressV1** — add `diamonds: number` (default `0`).

**ActivityRewardResult** — add `diamondsEarned: number`.

**ShopItem** — add optional `diamondPrice?: number`.

**Constants:**

```ts
export const DIAMOND_REWARD_BY_ACTIVITY: Partial<Record<CourseActivityId, number>> = {
  write: 50,
  "complete-sentence": 50,
};
```

**Migration:** On load, if `diamonds` is missing/undefined, set to `0`. Keep `version: 1`.

## Earning flow

1. User finishes write or complete-sentence session (`phase === "summary"`).
2. `useActivityCompletion` calls `completeActivity(unitId, activityId)`.
3. `onActivityComplete` awards coins as today, **plus** looks up `DIAMOND_REWARD_BY_ACTIVITY[activityId]` and adds to `progress.diamonds`.
4. Diamonds awarded on every completion (including replays), matching coin behavior.
5. Reward toast shows `+50 diamond` when `diamondsEarned > 0`.

## Purchase flow

1. User taps buy on a shop item.
2. `purchaseShopItem` checks catalog: if `diamondPrice` set, require `progress.diamonds >= diamondPrice` **and** `progress.coins >= price`.
3. On success, deduct both currencies and increment inventory quantity.
4. Failure reasons: `insufficient_coins`, `insufficient_diamonds`, `unknown_item`.
5. Buy button disabled when user cannot afford either currency.

## UI

**CurrencyDisplay** — horizontal flex of `CoinDisplay` + `DiamondDisplay`. Replace standalone `CoinDisplay` in:
- `CoursePage.tsx`
- `CourseUnitPage.tsx`
- `CoursePracticeHeader.tsx`
- `AssetsPage.tsx`

**DiamondDisplay** — sky/cyan pill with `/images/diamond.png` icon, mirrors `CoinDisplay` sizing (`sm` | `md`).

**ShopItemCard** — when `item.diamondPrice` is set, buy button shows: `{name} [coin icon] {price} [diamond icon] {diamondPrice}`.

## Out of scope

- Diamond spending outside shop (hints stay coins-only)
- Diamond rewards for flashcards, multiple-choice, or other activities
- Purchase confirmation modal
- Diamond animation beyond existing reward toast

## Testing

- `npx tsx src/lib/diamondLogic.test.ts` — earn on write/complete-sentence, replay earns again, other activities earn 0
- Extend `src/lib/shopLogic.test.ts` — dual-currency purchase success/failure, coins-only items unchanged
- `npx tsx src/lib/userProgressDb.test.ts` or inline in diamondLogic — missing diamonds defaults to 0 on load
- `npm run lint` — TypeScript clean
- Manual: finish write session → toast shows diamonds, header updates; buy windmill with/without enough diamonds
