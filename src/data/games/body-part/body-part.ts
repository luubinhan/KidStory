import type { GameTopic } from "../../../types/game";

export const BodyPart = {
    id: "body-part",
    title: "Body part",
    description: "Name your head, hands, feet, and more.",
    questions: [
      {
        id: "body-1",
        image: "",
        textBefore: "We see with our ",
        textAfter: ".",
        options: ["ears", "eyes", "knees", "toes"],
        correctIndex: 1,
      },
      {
        id: "body-2",
        image: "",
        textBefore: "We hear with our ",
        textAfter: ".",
        options: ["mouth", "nose", "ears", "hair"],
        correctIndex: 2,
      },
      {
        id: "body-3",
        image: "",
        textBefore: "She waved with her ",
        textAfter: ".",
        options: ["foot", "hand", "neck", "back"],
        correctIndex: 1,
      },
    ],
  } satisfies GameTopic;