# Doraemon Shop Catalog — Design Spec

**Date:** 2026-07-17  
**Status:** Approved (brainstorming session)

## Summary

Give `/doreamon-shop` its own gadget catalog instead of reusing farm `SHOP_ITEMS`. Purchase and inventory behavior match the farm shop (shared `buyShopItem` / IndexedDB inventory). Temporary prices are 1 coin + 1 diamond for every item; art uses one shared placeholder until real images and prices are updated later.

## Requirements (from user)

| Decision | Choice |
|----------|--------|
| Catalog | Separate from farm `SHOP_ITEMS` |
| Display names | Vietnamese, exact user list |
| Images | Shared placeholder (same pattern as farm `bread_oven.png`) |
| Price | Temporary: `price: 1`, `diamondPrice: 1` for all |
| After purchase | Quantity on Doraemon shop cards only — not on farm map `/assets` |
| Buy UX | Same as farm: afford check, deduct currencies, increment inventory |
| Farm shop | Unchanged |

## Catalog (25 items)

| ID | Name (VI) |
|----|-----------|
| `anywhere-door` | Cửa thần kỳ |
| `small-light` | Đèn pin thu nhỏ |
| `bamboo-copter` | Chong chóng tre |
| `big-light` | Đèn pin phóng đại |
| `time-machine` | Cỗ máy thời gian |
| `4d-pocket` | Túi thần kỳ |
| `hypnosis-megaphone` | Loa thôi miên |
| `request-phone` | Điện thoại yêu cầu |
| `time-cloth` | Khăn trùm thời gian |
| `invisibility-cloak` | Áo choàng tàng hình |
| `memory-bread` | Bánh mì ghi nhớ |
| `time-tv` | TV thời gian |
| `cloud-maker` | Máy tạo mây |
| `auto-translator` | Máy dịch tự động |
| `strength-gloves` | Găng tay siêu sức mạnh |
| `copy-machine` | Máy sao chép |
| `time-stopwatch` | Đồng hồ ngừng thời gian |
| `paper-airplane` | Máy bay giấy thần kỳ |
| `morph-stick` | Gậy biến hình |
| `xray-glasses` | Kính nhìn xuyên tường |
| `food-maker` | Máy tạo thức ăn |
| `mini-helper-robot` | Robot giúp việc mini |
| `healing-music-box` | Hộp âm nhạc chữa lành |
| `house-capsule` | Viên nang ngôi nhà |
| `teleport-umbrella` | Ô dịch chuyển |

Placeholder `imageUrl` for every row: farm-style shared URL  
`https://luubinhan.github.io/KidStory/images/shop/bread_oven.png`

## Architecture

```
src/types/shop.ts                    + DoreamonShopItemId, DoreamonShopItem
                                     + PurchasableItemId = ShopItemId | DoreamonShopItemId
src/data/doreamonShopItems.ts        DOREAMON_SHOP_ITEMS + getDoreamonShopItemById()
src/data/shopItems.ts                unchanged (farm only)
src/lib/userProgressLogic.ts         lookup farm OR Doraemon for purchase/afford
src/contexts/UserProgressContext.tsx buyShopItem / getItemQuantity accept PurchasableItemId
src/components/shop/DoreamonShopItemCard.tsx   grid card (name + image + buy)
src/pages/DoreamonShopPage.tsx       map DOREAMON_SHOP_ITEMS
src/lib/shopLogic.test.ts            + Doraemon purchase / lookup cases
```

Farm map `ShopItemCard` stays as-is (absolute/`position` for `/assets`). Doraemon uses a separate grid card so farm layout is not broken.

## Data model

**`DoreamonShopItem`**

- `id: DoreamonShopItemId`
- `name: string` (Vietnamese)
- `price: number` (1 for now)
- `diamondPrice: number` (1 for now)
- `imageUrl: string` (shared placeholder)

No `position` field — Doraemon gadgets are not placed on the farm map.

**Inventory:** existing `progress.inventory: Record<string, number>`. Doraemon ids must not collide with farm `ShopItemId` values (kebab-case gadget ids above are distinct).

**Lookup:** `getPurchasableItemById(id)` (or equivalent) checks farm catalog first, then Doraemon. `purchaseShopItem`, `canAffordShopItem`, and context APIs take `PurchasableItemId`.

## Purchase flow

1. User taps buy on a Doraemon card.
2. `buyShopItem(id)` → `purchaseShopItem(progress, id)`.
3. Resolve item from unified lookup; require `coins >= 1` and `diamonds >= 1`.
4. On success: deduct both currencies, `inventory[id] += 1`, persist via existing save path.
5. On failure: return existing reasons (`insufficient_coins` | `insufficient_diamonds` | `unknown_item`); button stays disabled via `canAfford`. No new toast.

## UI — DoreamonShopPage

- Keep current chrome: Farm link → `/assets`, `CurrencyDisplay`, Doraemon background, bottom nav / how-to FAB.
- Grid: `grid-cols-2`, map `DOREAMON_SHOP_ITEMS`.
- Each `DoreamonShopItemCard`: placeholder image, Vietnamese name, price row (1 coin + 1 diamond), quantity when owned, buy button wired like farm (`canAfford`, `isLoading`, `onBuy`).

`/assets` continues to list only `SHOP_ITEMS`. Cross-link between Farm and Doraemon shop unchanged.

## Out of scope

- Real per-item art and final prices (user will update later)
- Gadget gameplay effects
- Showing Doraemon items on the farm map
- Purchase confirmation modal or new toast UX
- Changing farm catalog or farm `ShopItemCard` layout

## Testing

Extend `src/lib/shopLogic.test.ts`:

- Buy a Doraemon id: deduct 1 coin + 1 diamond, quantity becomes 1
- Unified / Doraemon lookup returns expected price fields
- Existing farm purchase cases still pass

## Extensibility

Add gadgets by appending to `DOREAMON_SHOP_ITEMS` and extending the `DoreamonShopItemId` union. Swap `imageUrl` / prices in place when ready — no inventory schema change.
