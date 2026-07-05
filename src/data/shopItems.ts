import type { ShopItem, ShopItemId } from "../types/shop";

export const SHOP_ITEMS: readonly ShopItem[] = [
  {
    id: "chicken",
    name: "Chicken",
    price: 10,
    imageUrl: "/images/shop/chicken.png",
    position: {
      x: '40dvw',
      y: '60dvw',
    }
  },
  {
    id: "duck",
    name: "duck",
    price: 10,
    imageUrl: "/images/shop/chicken.png",
    position: {
      x: '76dvw',
      y: '61dvw',
    }
  },
  {
    id: "sheep", name: "Sheep", price: 10, imageUrl: "/images/shop/sheep.png", position: {
      x: '22dvw',
      y: '128dvw',
    }
  },
  {
    id: "cow", name: "Cow", price: 10, imageUrl: "/images/shop/cow.png", position: {
      x: '1dvw',
      y: '123dvw',
    }
  },
  {
    id: "pig", name: "Pig", price: 10, imageUrl: "/images/shop/pig.png", position: {
      x: '43dvw',
      y: '129dvw',
    }
  },
  {
    id: "dog", name: "Dog", price: 10, imageUrl: "/images/shop/dog.png", position: {
      x: '62dvw',
      y: '129dvw',
    }
  },
  {
    id: "cat", name: "Cat", price: 10, imageUrl: "/images/shop/cat.png", position: {
      x: '78dvw',
      y: '129dvw',
    }
  },
  {
    id: "windmill",
    name: "Windmill",
    price: 100,
    imageUrl: "/images/shop/windmill.png",
    position: {
      x: '8dvw',
      y: '7dvw',
    },
  },
  {
    id: "feed_mill",
    name: "Food Factory",
    price: 100,
    imageUrl: "/images/shop/feed_mill.png",
    position: {
      x: '40dvw',
      y: '6dvw',
    },
  },
  {
    id: "bread_oven",
    name: "Bread Oven",
    price: 100,
    imageUrl: "/images/shop/bread_oven.png",
    position: {
      x: '71dvw',
      y: '7dvw',
    },
  },
  {
    id: "yogurt_machine",
    name: "Yogurt maker",
    price: 100,
    imageUrl: "/images/shop/yogurt_machine.png",
    position: {
      x: '7dvw',
      y: '26dvw',
    },
  },
  {
    id: "juice_factory",
    name: "Juice factory",
    price: 100,
    imageUrl: "/images/shop/juice_factory.png",
    position: {
      x: '48dvw',
      y: '24dvw',
    },
  },
] as const;

const shopItemById = new Map(SHOP_ITEMS.map((item) => [item.id, item]));

export function getShopItemById(id: ShopItemId): ShopItem | undefined {
  return shopItemById.get(id);
}
