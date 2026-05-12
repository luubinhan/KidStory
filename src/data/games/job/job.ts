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
        textAfter: "",
        options: ["teacher", "doctor", "chef", "pilot"],
        correctIndex: 1,
      },
      {
        id: "job-2",
        image: "",
        textBefore: "A ",
        textAfter: "",
        options: ["farmer", "pilot", "artist", "driver"],
        correctIndex: 1,
      },
      {
        id: "job-3",
        image: "",
        textBefore: "The ",
        textAfter: "",
        options: ["chef", "nurse", "builder", "singer"],
        correctIndex: 0,
      },
    ],
  } satisfies GameTopic;