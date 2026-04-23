import type { Book } from "../../types/book";

export const monAndNausFruitParty = {
    id: "12",
    title: "Mon and Nâu's Fruit Party",
    cover: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/0.jpg",
    description: "",
    pages: [
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/1.jpg",
          sentence: "Mon is a happy monkey. He lives in the jungle.",
          vocabulary: [
            { word: "happy" },
            { word: "monkey", position: { top: 379, left: 211 } },
            { word: "jungle",
              position: { top: 126, left: 253 },
             },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/2.jpg",
          sentence: "Mon is hungry. He sees many fruits.",
          vocabulary: [
            { word: "hungry" },
            { word: "fruits", position: { top: 126, left: 358 } },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/3.jpg",
          sentence: "Nâu is a friendly squirrel. He wears an orange shirt.",
          vocabulary: [
            { word: "friendly" },
            { word: "squirrel", position: { top: 394, left: 122 } },
            { word: "shirt", position: { top: 340, left: 139 } },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/4.jpg",
          sentence: "Mon finds a yellow banana. \"I like bananas!\" says Mon.",
          vocabulary: [
            { word: "yellow", position: { top: 368, left: 290 }, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Solid_yellow.svg/1280px-Solid_yellow.svg.png" },
            { word: "banana", position: { top: 454, left: 396 } },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/5.jpg",
          sentence: "Nâu finds a brown nut. \"I like nuts!\" says Nâu.",
          vocabulary: [
            { word: "brown", position: { top: 310, left: 130 } },
            { word: "nut", position: { top: 337, left: 156 } },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/6.jpg",
          sentence: "Mon sees a red apple. \"I don't like apples,\" says Mon.",
          vocabulary: [
            { word: "red", position: { top: 503, left: 176 } },
            { word: "apple", position: { top: 450, left: 176 } },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/7.jpg",
          sentence: "Nâu shares his nut. \"Try this nut, Mon!\"",
          vocabulary: [
            { word: "shares" },
            { word: "try" },
            { word: "nut", position: { top: 390, left: 200 } },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/8.jpg",
          sentence: "Mon tastes the nut. \"Mmm, I like nuts too!\"",
          vocabulary: [
            { word: "tastes" },
            { word: "nut" },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/9.jpg",
          sentence: "Mon gives an orange to Nâu. \"I like oranges,\" says Nâu.",
          vocabulary: [
            { word: "gives" },
            { word: "orange", position: { top: 200, left: 82 } },
          ]
        },
        {
          image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/mon-and-naus-fruit-party/10.jpg",
          sentence: "Mon and Nâu are happy. They eat lunch together.",
          vocabulary: [
            { word: "happy" },
            { word: "eat" },
            { word: "lunch" },
          ]
        },
    ]
} satisfies Book;
