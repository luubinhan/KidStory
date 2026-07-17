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
  diamondPrice?: number;
  imageUrl: string;
  position: {
    x: number | string;
    y: number | string;
  };
};

export type DoreamonShopItemId =
  | "anywhere-door"
  | "small-light"
  | "bamboo-copter"
  | "big-light"
  | "time-machine"
  | "4d-pocket"
  | "hypnosis-megaphone"
  | "request-phone"
  | "time-cloth"
  | "invisibility-cloak"
  | "memory-bread"
  | "time-tv"
  | "cloud-maker"
  | "auto-translator"
  | "strength-gloves"
  | "copy-machine"
  | "time-stopwatch"
  | "paper-airplane"
  | "morph-stick"
  | "xray-glasses"
  | "food-maker"
  | "mini-helper-robot"
  | "healing-music-box"
  | "house-capsule"
  | "teleport-umbrella";

export type DoreamonShopItem = {
  id: DoreamonShopItemId;
  name: string;
  price: number;
  diamondPrice: number;
  imageUrl: string;
};

export type PurchasableItemId = ShopItemId | DoreamonShopItemId;
