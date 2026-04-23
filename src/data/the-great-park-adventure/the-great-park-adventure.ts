import type { Book } from "../../types/book";

export const theGreatParkAdventure = {
    id: "9",
    title: "The Great Park Adventure",
    cover: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/0.jpg",
    description: "",
    pages: [
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/1.jpg",
            sentence: "Bao and Mập are inside. They see the bright sun.",
            vocabulary: [
                { word: "inside" },
                { word: "bright",
                    position: { top: 87, left: 440 },
                 },
                { word: "sun" },
            ]
        },
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/2.jpg",
            sentence: "\"Let's go play!\" says Bao. They do not ask Mom.",
            vocabulary: [
                { word: "play" },
                { word: "ask" },
            ]
        },
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/3.jpg",
            sentence: "They run to the green park. The grass is very soft.",
            vocabulary: [
                { word: "green", position: { top: 548, left: 265 } },
                { word: "park" },
                { word: "soft" },
            ]
        },
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/4.jpg",
            sentence: "They play with a red ball. They jump and laugh.",
            vocabulary: [
                { word: "ball", position: { top: 396, left: 235 } },
                { word: "jump" },
                { word: "laugh" },
            ]
        },
        
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/5.jpg",
            sentence: "The sun goes down. The sky is orange and purple.",
            vocabulary: [
                { word: "sky", image: "https://img.freepik.com/free-photo/white-cloud-blue-sky-sea_74190-4488.jpg",
                    position: { top: 133, left: 253 },
                 },
                { word: "orange",
                    position: { top: 320, left: 173 },
                     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1280px-Orange_logo.svg.png" },
                { word: "purple",
                    image: "https://cdn.sanity.io/images/599r6htc/regionalized/89f0bb77e25ab7f3de88f97102f15aa794f6ffe5-1440x810.png",
                    position: { top: 44, left: 370 }
                 },
            ]
        },
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/6.jpg",
            sentence: "It is dark now. Bao and Mập are scared.",
            vocabulary: [
                { word: "dark", position: { top: 108, left: 300 } },
                { word: "scared" },
            ]
        },
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/7.jpg",
            sentence: "Mom looks for them. \"Bao! Mập! Where are you?\"",
            vocabulary: [
                { word: "looks", position: { top: 211, left: 254 } },
            ]
        },
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/8.jpg",
            sentence: "Mom finds Mập too. She gives them a big hug.",
            vocabulary: [
                { word: "finds" },
                { word: "hug", position: { top: 380, left: 300 } },
            ]
        },
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/9.jpg",
            sentence: "\"Always ask before you go,\" says Mom. They say sorry.",
            vocabulary: [
                { word: "always" },
                { word: "sorry" },
            ]
        },
        {
            image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/the-great-park-adventure/10.jpg",
            sentence: "Now they are home. It is time for sleep.",
            vocabulary: [
                { word: "home", image: "https://static.vecteezy.com/system/resources/previews/032/461/353/non_2x/home-icon-for-dwelling-and-residence-vector.jpg" },
                { word: "sleep", position: { top: 253, left: 450 } },
            ]
        },
    ]
} satisfies Book;
