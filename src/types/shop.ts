export type ShopItemId =
  | "chicken"
  | "duck"
  | "banana"
  | "truck"
  | "house"
  | "rice-threshing-machine"
  | "fish-ponds"
  | "rice-field"
  | "goat"
  | "mango-gardens"
  | "watermelon-gardens"
  | "durian-gardens"
  | "flower-gardens"
  | "carrot-gardens"
  | "tomato-gardens"
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
  position: {
    x: number | string;
    y: number | string;
  };
};
