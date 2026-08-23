export type MatchingPairsWord = {
  id: string;
  word: string;
  translation: string;
  image: string;
};

export const MATCHING_PAIRS_COUNT = 5;

export const matchingPairsWords = [
  {
    id: "student",
    word: "student",
    translation: "học sinh",
    image: "https://www.eurokidsindia.com/blog/wp-content/uploads/2024/10/Top10_Essential_Trait_GoodStudent.jpg-870x437.jpg",
  },
  {
    id: "cherry",
    word: "cherry",
    translation: "quả anh đào",
    image: "https://media.istockphoto.com/id/506627545/photo/cherry-isolated-on-white-background.jpg",
  },
  {
    id: "orange",
    word: "orange",
    translation: "quả cam",
    image: "https://www.quanta.org/thumbs/thumb-orange-640x480-orange.jpg",
  },
  {
    id: "pineapple",
    word: "pineapple",
    translation: "quả dứa",
    image: "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1769956258594/edca6379.jpg",
  },
  {
    id: "banana",
    word: "banana",
    translation: "quả chuối",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/1280px-Banana-Single.jpg",
  },
  {
    id: "dog",
    word: "dog",
    translation: "con chó",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dog_Breeds.jpg",
  },
  {
    id: "cow",
    word: "cow",
    translation: "con bò",
    image: "https://assets.farmsanctuary.org/content/uploads/2025/02/05152106/2023_06-09_FSNY_Aggie_cow_LH_4179-1600x1065.jpg",
  },
  {
    id: "duck",
    word: "duck",
    translation: "con vịt",
    image: "https://media.4-paws.org/e/b/a/f/ebafc46d9fcca9f374d5990f8f9c832fdb04bb05/VIER%20PFOTEN_2019-07-18_013-2890x2000-1920x1329.webp",
  },
  {
    id: "cat",
    word: "cat",
    translation: "con mèo",
    image: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187.jpg?w=1436&h=958",
  },
  {
    id: "red",
    word: "red",
    translation: "màu đỏ",
    image: "https://backdropshop.prasolutions.com.au/cdn/shop/products/SUPERIOR-PAPER-BACK-PAPER-SCARLET-2.75M-BY-11M_6f207131-d2e7-4533-a66c-f0c1be7eb516_large.jpg?v=1486453297",
  },
  {
    id: "black",
    word: "black",
    translation: "màu đen",
    image: "https://www.equilter.com/images/products/MMJETBBK.jpg",
  },
  {
    id: "blue",
    word: "blue",
    translation: "màu xanh dương",
    image: "https://backdropshop.prasolutions.com.au/cdn/shop/products/SUPERIOR-PAPER-BACK-PAPER-ROYAL-BLUE-1.35M-BY-11M-WITH-CORE_bb597a3b-ae74-498f-97d3-4d74acf77dfb_large.jpg?v=1486453270",
  },
  {
    id: "purple",
    word: "purple",
    translation: "màu tím",
    image: "https://backdropshop.prasolutions.com.au/cdn/shop/products/SUPERIOR-PAPER-BACK-PAPER-DEEP-PURPLE-2.75M-BY-11M_91c0251c-92c2-4b6f-b17e-e3f329a82f03_grande.jpg?v=1486453308",
  },
  {
    id: "hat",
    word: "hat",
    translation: "mũ",
    image: "https://sixhats.ca/cdn/shop/files/Charcoal_range_patch_frontside_view.jpg",
  },
  {
    id: "dress",
    word: "dress",
    translation: "váy",
    image: "https://www.betsyandadam.com/cdn/shop/files/BetsyAndAdam-LateSummerRefresh-HeroDesktop2.jpg?v=1782410646&width=3000",
  },
  {
    id: "shorts",
    word: "shorts",
    translation: "quần short",
    image: "https://www.32degrees.com/cdn/shop/files/stretchwoven_hero_banner_desktop_1866x950_twilltech7in_short.jpg?format=pjpg&v=1781192730&width=2000",
  },
  {
    id: "socks",
    word: "socks",
    translation: "tất",
    image: "https://cdn.thewirecutter.com/wp-content/media/2025/10/BEST-SOCKS-SUB-02281-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp",
  },
  {
    id: "shoes",
    word: "shoes",
    translation: "đôi giày",
    image: "https://api.muji.com.vn/media/catalog/category/shoes_-_Desktop_Banner_.jpg",
  },
] as const satisfies readonly MatchingPairsWord[];
