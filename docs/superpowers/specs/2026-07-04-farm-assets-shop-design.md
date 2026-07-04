# Farm Assets Shop — Design Spec

**Date:** 2026-07-04  
**Status:** Approved (brainstorming session)

## Summary

Replace `AchievementsPage` with a farm-style assets shop at `/assets`. Users spend coins to buy animals and buildings; inventory tracks quantities per item. Unowned items (quantity 0) appear dimmed. The catalog is data-driven for easy extension.

## Requirements (from user)

| Decision | Choice |
|----------|--------|
| Page scope | Replace achievements UI entirely — shop only |
| Purchase UX | Dedicated "Mua" button per card, no confirm dialog |
| Ownership | Multiple purchases allowed; inventory stores quantity |
| Images | PNG/SVG in `public/`; generic placeholders until real art |
| Layout | Flat grid, no category sections or tabs |
| Route | `/assets`; bottom nav label stays "Assets" |
| Visual state | Items with qty 0 are dimmed; owned items are full brightness |

## Shop catalog (initial)

| ID | Name (VI) | Price |
|----|-----------|-------|
| `chicken` | Gà | 10 |
| `sheep` | Cừu | 10 |
| `cow` | Bò | 10 |
| `pig` | Heo | 10 |
| `dog` | Chó | 10 |
| `cat` | Mèo | 10 |
| `windmill` | Cối xoay gió | 100 |
| `feed_mill` | Nhà máy thức ăn | 100 |
| `bread_oven` | Lò nướng bánh mì | 100 |
| `yogurt_machine` | Máy làm sữa chua | 100 |
| `juice_factory` | Nhà máy nước ép | 100 |

## Architecture

```
src/types/shop.ts              ShopItemId, ShopItem
src/data/shopItems.ts          SHOP_ITEMS catalog + getShopItemById()
src/types/userProgress.ts      inventory: Record<string, number>
src/lib/userProgressLogic.ts   normalizeInventory(), purchaseShopItem(), getItemQuantity()
src/lib/userProgressDb.ts      normalize on load
src/contexts/UserProgressContext.tsx   buyShopItem()
src/components/shop/ShopItemCard.tsx
src/pages/AssetsPage.tsx
public/images/shop/*.png       per-item placeholders
```

## Data model

**Before:** `inventory: string[]` (each unlock appended once, e.g. `"treasure_mirror"`).

**After:** `inventory: Record<string, number>` (item id → quantity).

**Migration on load:** If stored value is `string[]`, convert by counting occurrences. Legacy keys like `treasure_mirror` remain in the record but are excluded from the shop UI (not in catalog).

**Achievement backend:** `treasure_mirror` achievement logic unchanged (still awards coins). No UI on assets page.

## Purchase flow

1. User taps "Mua" on a card.
2. `buyShopItem(itemId)` in context calls `purchaseShopItem(progress, itemId)`.
3. Logic looks up price from catalog; if `coins >= price`, deduct coins and increment `inventory[itemId]`.
4. Persist to IndexedDB via existing `saveUserProgress`.
5. If insufficient coins, button stays disabled; no toast required for v1.

## UI — AssetsPage

- Header: back link to `/course`, `CoinDisplay`, title **Assets**, subtitle encouraging collection.
- Grid: 2 columns on mobile (`grid-cols-2`), gap consistent with app.
- Each `ShopItemCard`: image, Vietnamese name, price with coin icon, quantity badge (hidden when 0), "Mua" button.
- **Dimmed state:** `opacity-40 grayscale` when quantity === 0; full color when quantity > 0.
- **Buy button:** enabled when `coins >= price`; disabled styling when not affordable.

## Routing

| Route | Behavior |
|-------|----------|
| `/assets` | `AssetsPage` |
| `/achievements` | `<Navigate to="/assets" replace />` |
| `/shop` | `<Navigate to="/assets" replace />` |

Bottom nav: `to: "/assets"`, active when `pathname === "/assets"`.

## Extensibility

Add items by appending to `SHOP_ITEMS` in `src/data/shopItems.ts` and adding a PNG under `public/images/shop/`. No schema change required.

## Out of scope (v1)

- Category tabs/sections
- Purchase confirmation modal
- Farm placement / gameplay view
- Achievements UI
- Sound effects on purchase

## Testing

- Unit tests via `tsx` assert scripts (project convention): inventory migration, purchase success/failure, quantity increment.
- Manual: buy with sufficient/insufficient coins, verify dim/bright states, verify redirects.
