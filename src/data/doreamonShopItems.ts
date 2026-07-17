import type { DoreamonShopItem, DoreamonShopItemId } from "../types/shop";

const PLACEHOLDER_IMAGE =
  "https://luubinhan.github.io/KidStory/images/shop/bread_oven.png";

export const DOREAMON_SHOP_ITEMS = [
  {
    id: "anywhere-door",
    name: "Cửa thần kỳ",
    price: 100,
    diamondPrice: 100,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "40vw",
      x: "2vw",
    },
  },
  {
    id: "small-light",
    name: "Đèn pin thu nhỏ",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "40vw",
      x: "18vw",
    },
  },
  {
    id: "bamboo-copter",
    name: "Chong chóng tre",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "40vw",
      x: "35vw",
    },
  },
  {
    id: "big-light",
    name: "Đèn pin phóng đại",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "40vw",
      x: "53vw",
    },
  },
  {
    id: "time-machine",
    name: "Cỗ máy thời gian",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "40vw",
      x: "73vw",
    },
  },
  {
    id: "4d-pocket",
    name: "Túi thần kỳ",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "63vw",
      x: "18vw",
    },
  },
  {
    id: "hypnosis-megaphone",
    name: "Loa thôi miên",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "63vw",
      x: "35vw",
    },
  },
  {
    id: "request-phone",
    name: "Điện thoại yêu cầu",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "63vw",
      x: "53vw",
    },
  },
  {
    id: "time-cloth",
    name: "Khăn trùm thời gian",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "63vw",
      x: "2vw",
    },
  },
  {
    id: "invisibility-cloak",
    name: "Áo choàng tàng hình",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "63vw",
      x: "73vw",
    },
  },
  {
    id: "memory-bread",
    name: "Bánh mì ghi nhớ",
    price: 50,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "88vw",
      x: "35vw",
    },
  },
  {
    id: "time-tv",
    name: "TV thời gian",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "88vw",
      x: "53vw",
    },
  },
  {
    id: "cloud-maker",
    name: "Máy tạo mây",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "88vw",
      x: "2vw",
    },
  },
  {
    id: "auto-translator",
    name: "Máy dịch tự động",
    price: 50,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "88vw",
      x: "18vw",
    },
  },
  {
    id: "strength-gloves",
    name: "Găng tay siêu sức mạnh",
    price: 50,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "88vw",
      x: "73vw",
    },
  },
  {
    id: "copy-machine",
    name: "Máy sao chép",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "112vw",
      x: "53vw",
    },
  },
  {
    id: "time-stopwatch",
    name: "Đồng hồ ngừng thời gian",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "112vw",
      x: "2vw",
    },
  },
  {
    id: "paper-airplane",
    name: "Máy bay giấy thần kỳ",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "112vw",
      x: "18vw",
    },
  },
  {
    id: "morph-stick",
    name: "Gậy biến hình",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "112vw",
      x: "35vw",
    },
  },
  {
    id: "xray-glasses",
    name: "Kính nhìn xuyên tường",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "112vw",
      x: "73vw",
    },
  },
  {
    id: "food-maker",
    name: "Máy tạo thức ăn",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "140vw",
      x: "2vw",
    },
  },
  {
    id: "mini-helper-robot",
    name: "Robot giúp việc mini",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "140vw",
      x: "18vw",
    },
  },
  {
    id: "healing-music-box",
    name: "Hộp âm nhạc chữa lành",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "140vw",
      x: "35vw",
    },
  },
  {
    id: "house-capsule",
    name: "Viên nang ngôi nhà",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "140vw",
      x: "53vw",
    },
  },
  {
    id: "teleport-umbrella",
    name: "Ô dịch chuyển",
    price: 100,
    diamondPrice: 50,
    imageUrl: PLACEHOLDER_IMAGE,
    position: {
      y: "140vw",
      x: "73vw",
    },
  },
] as const satisfies readonly DoreamonShopItem[];

const doreamonShopItemById = new Map(
  DOREAMON_SHOP_ITEMS.map((item) => [item.id, item]),
);

export function getDoreamonShopItemById(
  id: DoreamonShopItemId,
): DoreamonShopItem | undefined {
  return doreamonShopItemById.get(id);
}
