import type { CourseUnit } from "../types/course";
import type { GameTopic } from "../types/game";
import { buildSpellQuestionsFromWords } from "./courseSpellQuestions";

export function buildMcTopic(unit: CourseUnit): GameTopic {
  return {
    id: unit.id,
    title: unit.title,
    questions: unit.multipleChoiceQuestions,
  };
}

export function buildSpellTopic(unit: CourseUnit): GameTopic {
  return {
    id: unit.id,
    title: unit.title,
    questions: buildSpellQuestionsFromWords(unit.words),
  };
}
