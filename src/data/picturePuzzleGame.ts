export type PicturePuzzleItem = {
  id: string;
  word: string;
  image: string;
  audio?: string;
};

export const picturePuzzleItems = [
  {
    id: "parents",
    word: "parents",
    image: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/images/puzzle/parents.jpeg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/parents.mp3",
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
  {
    id: "dog",
    word: "dog",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dog_Breeds.jpg",
    audio: "",
  },
  {
    id: "grandmother",
    word: "grandmother",
    image: "https://bognabialecka.pl/wp-content/uploads/2025/08/saint-grandmother-1024x683.jpg",
    audio: "",
  },
  {
    id: "duck",
    word: "duck",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4PAYxurW1SzeIZOi3WWtLPumfOTSD4aGhtBymnI8Njg&s=10",
    audio: "",
  },
] as const satisfies readonly PicturePuzzleItem[];
