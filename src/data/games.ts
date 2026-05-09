import type { GameTopic } from "../types/game";

import { directions } from "./games/directions";
import { preposition } from "./games/preposition";
import { Jobs } from "./games/job/job";
import { BodyPart } from "./games/body-part/body-part";
import { Clothes } from "./games/clothes/clothes";
import { Food } from "./games/food/food";
import { Actions } from "./games/actions/actions";
import { pronouns } from "./games/pronouns";

export const gameTopics: readonly GameTopic[] = [
  directions,
  preposition,
  Jobs,
  BodyPart,
  Clothes,
  Food,
  Actions,
  pronouns,
];

export function getGameTopic(id: string): GameTopic | undefined {
  return gameTopics.find((t) => t.id === id);
}
