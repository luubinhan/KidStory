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
  position: {
    x: number | string;
    y: number | string;
  };
};
