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
    id: "windy",
    word: "windy",
    image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757668025838/989a7fb8.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/windy.mp3",
  },
  {
    id: "snowy",
    word: "snowy",
    image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757665825163/3c9f2e7e.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/snowy.mp3",
  },
] as const satisfies readonly PicturePuzzleItem[];
