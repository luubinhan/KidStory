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
    image: "https://www.ldoceonline.com/media/english/illustration/dining_room_table.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/table.mp3",
  },
  {
    id: "tablet",
    word: "tablet",
    image: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/images/puzzle/tablet.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/tablet.mp3",
  },
] as const satisfies readonly PicturePuzzleItem[];
