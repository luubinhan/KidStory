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
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/parent.mp3",
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
    audio:
        "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/grandmother.mp3",
  },
  {
    id: "duck",
    word: "duck",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4PAYxurW1SzeIZOi3WWtLPumfOTSD4aGhtBymnI8Njg&s=10",
    audio: "",
  },
  {
    id: "sofa",
    word: "sofa",
    image: "https://made4home.com.vn/assets/media/2024/08/living-room-japandi-interior-design2-2.jpg",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/sofa.mp3",
  },
  {
    id: "bed",
    word: "bed",
    image: "https://gohome.vn/wp-content/uploads/2025/09/gh11019.png",
    audio: "https://github.com/luubinhan/KidStory/raw/refs/heads/main/public/sounds/bed.mp3",
  },
] as const satisfies readonly PicturePuzzleItem[];
