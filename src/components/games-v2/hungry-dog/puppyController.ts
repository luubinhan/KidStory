import {
  AnimatedSprite,
  Assets,
  Rectangle,
  Spritesheet,
  type Container,
} from "pixi.js";
import type { PuppyAnim } from "../../../types/hungryDog";
import { HUNGRY_DOG_SHEET_ALIAS } from "./preload";

export const MOUTH_HIT = { x: -40, y: -20, width: 80, height: 50 } as const;

const ANIM_PREFIX: Record<PuppyAnim, string> = {
  idle: "idle-",
  hungry: "hungry-",
  ready: "ready-",
  eating: "eating-",
  happy: "ate-",
  wrong: "sad-",
};

const LOOPING: Record<PuppyAnim, boolean> = {
  idle: true,
  hungry: true,
  ready: true,
  eating: true, // loops while user drags card toward mouth
  happy: false,
  wrong: false,
};

function frameNumber(key: string): number {
  const match = key.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function texturesForAnim(sheet: Spritesheet, anim: PuppyAnim) {
  const prefix = ANIM_PREFIX[anim];
  // Match "eat-1.png" but not "eating-1.png" when prefix is "eat-"
  const re = new RegExp(`^${prefix.replace(/-$/, "")}-\\d`);
  return Object.entries(sheet.textures)
    .filter(([key]) => re.test(key))
    .sort(([a], [b]) => frameNumber(a) - frameNumber(b))
    .map(([, texture]) => texture);
}

export type PuppyController = {
  root: AnimatedSprite;
  setAnim: (anim: PuppyAnim) => void;
  getMouthBounds: () => Rectangle;
  destroy: () => void;
};

export function createPuppyController(stage: Container): PuppyController {
  const sheet = Assets.get(HUNGRY_DOG_SHEET_ALIAS) as Spritesheet;
  const idleFrames = texturesForAnim(sheet, "idle");
  const fallback = Object.values(sheet.textures)[0]!;
  const sprite = new AnimatedSprite(idleFrames.length > 0 ? idleFrames : [fallback]);
  sprite.anchor.set(0.5);
  sprite.animationSpeed = 0.12;
  sprite.loop = true;
  sprite.play();
  stage.addChild(sprite);

  const setAnim = (anim: PuppyAnim) => {
    const frames = texturesForAnim(sheet, anim);
    if (frames.length === 0) return;
    sprite.textures = frames;
    sprite.loop = LOOPING[anim];
    sprite.gotoAndPlay(0);
  };

  const getMouthBounds = () => {
    const bounds = sprite.getBounds();
    return new Rectangle(
      bounds.x + bounds.width / 2 + MOUTH_HIT.x,
      bounds.y + bounds.height / 2 + MOUTH_HIT.y,
      MOUTH_HIT.width,
      MOUTH_HIT.height,
    );
  };

  return {
    root: sprite,
    setAnim,
    getMouthBounds,
    destroy: () => {
      sprite.destroy();
    },
  };
}
