import type { GameTopic } from "../../../types/game";

export const Jobs = {
    id: "job",
    title: "Job",
    description: "People who help us every day.",
    questions: [
      {
        id: "job-1",
        image: "",
        textBefore: "The ",
        textAfter: " helps us when we are sick.",
        options: ["teacher", "doctor", "chef", "pilot"],
        correctIndex: 1,
      },
      {
        id: "job-2",
        image: "",
        textBefore: "A ",
        textAfter: " flies an airplane.",
        options: ["farmer", "pilot", "artist", "driver"],
        correctIndex: 1,
      },
      {
        id: "job-3",
        image: "",
        textBefore: "The ",
        textAfter: " cooks food in a restaurant.",
        options: ["chef", "nurse", "builder", "singer"],
        correctIndex: 0,
      },
    ],
  } satisfies GameTopic;