export type PicturePuzzleItem = {
  id: string;
  word: string;
  image: string;
  audio?: string;
};

export const picturePuzzleItems = [
  {
    id: "sunny",
    word: "sunny",
    image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757659533373/35611f19.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/sunny.mp3",
  },
  {
    id: "table",
    word: "table",
    image: "https://megafurniture.sg/cdn/shop/articles/table-types-guide-find-the-perfect-table-for-your-home-megafurniture_315f2df9-35e7-4c23-a620-e8a6b72f0156.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/table.mp3",
  },
  {
    id: "tablet",
    word: "tablet",
    image: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/images/puzzle/tablet.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/tablet.mp3",
  },
] as const satisfies readonly PicturePuzzleItem[];
