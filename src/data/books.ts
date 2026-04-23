import type { Book } from "../types/book";
import { wolfooLearnsToShare } from "./wolfoo-learns-to-share/wolfoo-learns-to-share";
import { lucieFavoriteToy } from "./lucie-favorite-toy/lucie-favorite-toy";
import { miuTellsTheTruth } from "./miu-tells-the-truth/miu-tells-the-truth";
import { walleCleansUp } from "./walle-cleans-up/walle-cleans-up";
import { baoAndMiuAtToyStore } from "./bao-and-miu-at-the-toy-store/bao-and-miu-at-the-toy-store";
import { pandoLucieAtSchool } from "./pando-lucie-learn-at-school/pando-lucie-learn-at-school";
import { pandoHappyHome } from "./pando-happy-home/pando-happy-home";
import { miuHelpsTheFamily } from "./miu-helps-the-family/miu-helps-the-family";
import { theGreatParkAdventure } from "./the-great-park-adventure/the-great-park-adventure";
import { miuLovesWater } from "./miu-loves-water/miu-loves-water";
import { wolfooAndTheCodingRobot } from "./wolfoo-and-the-coding-robot/wolfoo-and-the-coding-robot";
import { monAndNausFruitParty } from "./mon-and-naus-fruit-party/mon-and-naus-fruit-party";
import { mapAndTheColorfulNoodles } from "./map-and-the-colorful-noodles/map-and-the-colorful-noodles";
import { lucieMiuAndTheRainbow } from "./lucie-miu-and-the-rainbow/lucie-miu-and-the-rainbow";
import { lucieAndWolfooTimeToListen } from "./15-lucie-and-wolfoo-time-to-listen/lucie-and-wolfoo-time-to-listen";
import { mitsFirstDayOfSchool } from "./16-mits-first-day-of-school/mits-first-day-of-school";
import { wolfooAndTheMorningRun } from "./17-wolfoo-and-the-morning-run/wolfoo-and-the-morning-run";
import { helpingMyParentsCleanTheKitchenAfterDinner } from "./18-helping-my-parents-clean-the-kitchen-after-dinner/helping-my-parents-clean-the-kitchen-after-dinner";

export type { Book, StoryPage, Vocabulary } from "../types/book";

export const books = [
  helpingMyParentsCleanTheKitchenAfterDinner,
  wolfooAndTheMorningRun,
  mitsFirstDayOfSchool,
  lucieAndWolfooTimeToListen,
  lucieMiuAndTheRainbow,
  mapAndTheColorfulNoodles,
  wolfooLearnsToShare,
  lucieFavoriteToy,
  miuTellsTheTruth,
  walleCleansUp,
  baoAndMiuAtToyStore,
  pandoLucieAtSchool,
  pandoHappyHome,
  miuHelpsTheFamily,
  theGreatParkAdventure,
  miuLovesWater,
  wolfooAndTheCodingRobot,
  monAndNausFruitParty,
] satisfies Book[];
