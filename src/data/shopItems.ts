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
