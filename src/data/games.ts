import type { GameTopic } from "../types/game";

import { directions } from "./games/directions";
import { preposition } from "./games/preposition";
import { Jobs } from "./games/job/job";
import { BodyPart } from "./games/body-part/body-part";
import { Clothes } from "./games/clothes/clothes";
import { Food } from "./games/food/food";
import { Actions } from "./games/actions/actions";
import { TalentShow } from "./games/talent-show/talent-show";
import { pronouns } from "./games/pronouns/pronouns";
import { Unit1School } from "./games/units/unit-1-school";
import { Unit2Friends } from "./games/units/unit-2-friends";
import { Unit3Colours } from "./games/units/unit-3-colours";
import { Unit4Body } from "./games/units/unit-4-body";
import { Unit5Nature } from "./games/units/unit-5-nature";

export const gameTopics: readonly GameTopic[] = [
  Actions,
  TalentShow,
  pronouns,
  directions,
  preposition,
  Unit1School,
  Unit2Friends,
  Unit3Colours,
  Unit4Body,
  Unit5Nature,
  // Jobs,
  // BodyPart,
  // Clothes,
  // Food,
];

export function getGameTopic(id: string): GameTopic | undefined {
  return gameTopics.find((t) => t.id === id);
}
