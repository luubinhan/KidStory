import type { DoreamonShopItem, DoreamonShopItemId } from "../types/shop";

const PLACEHOLDER_IMAGE =
  "https://luubinhan.github.io/KidStory/images/shop/bread_oven.png";

export const DOREAMON_SHOP_ITEMS = [
  {
    id: "anywhere-door",
    name: "Cửa thần kỳ",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "small-light",
    name: "Đèn pin thu nhỏ",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "bamboo-copter",
    name: "Chong chóng tre",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "big-light",
    name: "Đèn pin phóng đại",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "time-machine",
    name: "Cỗ máy thời gian",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "4d-pocket",
    name: "Túi thần kỳ",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "hypnosis-megaphone",
    name: "Loa thôi miên",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "request-phone",
    name: "Điện thoại yêu cầu",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "time-cloth",
    name: "Khăn trùm thời gian",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "invisibility-cloak",
    name: "Áo choàng tàng hình",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "memory-bread",
    name: "Bánh mì ghi nhớ",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "time-tv",
    name: "TV thời gian",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "cloud-maker",
    name: "Máy tạo mây",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "auto-translator",
    name: "Máy dịch tự động",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "strength-gloves",
    name: "Găng tay siêu sức mạnh",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "copy-machine",
    name: "Máy sao chép",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "time-stopwatch",
    name: "Đồng hồ ngừng thời gian",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "paper-airplane",
    name: "Máy bay giấy thần kỳ",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "morph-stick",
    name: "Gậy biến hình",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "xray-glasses",
    name: "Kính nhìn xuyên tường",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "food-maker",
    name: "Máy tạo thức ăn",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "mini-helper-robot",
    name: "Robot giúp việc mini",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "healing-music-box",
    name: "Hộp âm nhạc chữa lành",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "house-capsule",
    name: "Viên nang ngôi nhà",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "teleport-umbrella",
    name: "Ô dịch chuyển",
    price: 1,
    diamondPrice: 1,
    imageUrl: PLACEHOLDER_IMAGE,
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
