import type { GameTopic } from "../../../types/game";

const IMG =
    "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/games/talent-show";

export const TalentShow = {
    id: "talent-show",
    title: "The talent show",
    description: "What can the animals do at the show?",
    questions: [
        {
            id: "talent-show-1",
            image: `${IMG}/climb.jpg`,
            textBefore: "I can",
            textAfter: "",
            options: ["swim", "fly", "climb", "jump"],
            correctIndex: 2,
        },
        {
            id: "talent-show-2",
            image: `${IMG}/swim.jpg`,
            textBefore: "She can",
            textAfter: "",
            options: ["climb", "swim", "run", "fly"],
            correctIndex: 1,
        },
        {
            id: "talent-show-3",
            image: `${IMG}/sing.jpg`,
            textBefore: "She can",
            textAfter: "",
            options: ["sing", "jump", "swim", "fly"],
            correctIndex: 0,
        },
        {
            id: "talent-show-4",
            image: `${IMG}/fly.jpg`,
            textBefore: "They can",
            textAfter: "",
            options: ["run", "swim", "fly", "climb"],
            correctIndex: 2,
        },
        {
            id: "talent-show-5",
            image: `${IMG}/jump.jpg`,
            textBefore: "We can ",
            textAfter: "",
            options: ["swim", "jump", "fly", "run"],
            correctIndex: 1,
        },
        {
            id: "talent-show-6",
            image: `${IMG}/run.jpg`,
            textBefore: "You can",
            textAfter: "",
            options: ["fly", "climb", "swim", "run"],
            correctIndex: 3,
        },
    ],
} satisfies GameTopic;
