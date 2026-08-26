export type PicturePuzzleItem = {
  id: string;
  word: string;
  image: string;
  audio?: string;
};

export const picturePuzzleItems = [
  {
    id: "banana",
    word: "banana",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/1280px-Banana-Single.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/banana.mp3",
  },
  {
    id: "cherry",
    word: "cherry",
    image: "https://media.istockphoto.com/id/506627545/photo/cherry-isolated-on-white-background.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/cherry.mp3",
  },
  {
    id: "hat",
    word: "hat",
    image: "https://sixhats.ca/cdn/shop/files/Charcoal_range_patch_frontside_view.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/hat.mp3",
  },
] as const satisfies readonly PicturePuzzleItem[];
