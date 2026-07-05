import type { ShopItem, ShopItemId } from "../types/shop";

export const SHOP_ITEMS: readonly ShopItem[] = [
  {
    id: "chicken",
    name: "Chicken",
    price: 10,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '60dvw',
      x: '40dvw',
    }
  },
  {
    id: "fish-ponds",
    name: "Fish ponds",
    price: 50,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '76dvw',
      x: '40dvw',
    }
  },
  {
    id: "goat",
    name: "Goat",
    price: 10,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '78dvw',
      x: '76dvw',
    }
  },
  {
    id: "rice-field",
    name: "Rice field",
    price: 100,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '79dvw',
      x: '4dvw',
    }
  },
  {
    id: "mango-gardens",
    name: "Mango gardens",
    price: 50,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '97dvw',
      x: '1dvw',
    }
  },
  {
    id: "carrot-gardens",
    name: "Carrot gardens",
    price: 50,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '93dvw',
      x: '20dvw',
    }
  },
  {
    id: "tomato-gardens",
    name: "Tomato gardens",
    price: 50,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '93dvw',
      x: '41dvw',
    }
  },
  {
    id: "watermelon-gardens",
    name: "Watermelon gardens",
    price: 50,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '93dvw',
      x: '64dvw',
    }
  },
  {
    id: "durian-gardens",
    name: "Durian gardens",
    price: 50,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '110dvw',
      x: '29dvw',
    }
  },
  {
    id: "flower-gardens",
    name: "Flower gardens",
    price: 10,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '112dvw',
      x: '62dvw',
    }
  },
  {
    id: "duck",
    name: "duck",
    price: 10,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '61dvw',
      x: '76dvw',
    }
  },
  {
    id: "banana",
    name: "Banana",
    price: 10,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '59dvw',
      x: '1dvw',
    }
  },
  {
    id: "truck",
    name: "Truck",
    price: 20,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '45dvw',
      x: '12dvw',
    }
  },
  {
    id: "house",
    name: "House",
    price: 50,
    diamondPrice: 50,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '38dvw',
      x: '38dvw',
    }
  },
  {
    id: "rice-threshing-machine",
    name: "Rice threshing machine",
    price: 50,
    diamondPrice: 50,
    imageUrl: "/images/shop/chicken.png",
    position: {
      y: '26dvw',
      x: '77dvw',
    }
  },
  {
    id: "sheep", name: "Sheep", price: 10, imageUrl: "/images/shop/sheep.png", position: {
      y: '128dvw',
      x: '22dvw',
    }
  },
  {
    id: "cow", name: "Cow", price: 10, imageUrl: "/images/shop/cow.png", position: {
      y: '123dvw',
      x: '1dvw',
    }
  },
  {
    id: "pig", name: "Pig", price: 10, imageUrl: "/images/shop/pig.png", position: {
      y: '129dvw',
      x: '43dvw',
    }
  },
  {
    id: "dog", name: "Dog", price: 10, imageUrl: "/images/shop/dog.png", position: {
      y: '129dvw',
      x: '62dvw',
    }
  },
  {
    id: "cat", name: "Cat", price: 10, imageUrl: "/images/shop/cat.png", position: {
      y: '129dvw',
      x: '78dvw',
    }
  },
  {
    id: "windmill",
    name: "Windmill",
    price: 100,
    diamondPrice: 50,
    imageUrl: "/images/shop/windmill.png",
    position: {
      y: '7dvw',
      x: '8dvw',
    },
  },
  {
    id: "feed_mill",
    name: "Food Factory",
    price: 100,
    diamondPrice: 50,
    imageUrl: "/images/shop/feed_mill.png",
    position: {
      y: '6dvw',
      x: '40dvw',
    },
  },
  {
    id: "bread_oven",
    name: "Bread Oven",
    price: 100,
    diamondPrice: 50,
    imageUrl: "/images/shop/bread_oven.png",
    position: {
      y: '7dvw',
      x: '71dvw',
    },
  },
  {
    id: "yogurt_machine",
    name: "Yogurt maker",
    price: 100,
    diamondPrice: 50,
    imageUrl: "/images/shop/yogurt_machine.png",
    position: {
      y: '26dvw',
      x: '7dvw',
    },
  },
  {
    id: "juice_factory",
    name: "Juice factory",
    price: 100,
    diamondPrice: 50,
    imageUrl: "/images/shop/juice_factory.png",
    position: {
      y: '24dvw',
      x: '48dvw',
    },
  },
] as const;

const shopItemById = new Map(SHOP_ITEMS.map((item) => [item.id, item]));

export function getShopItemById(id: ShopItemId): ShopItem | undefined {
  return shopItemById.get(id);
}
