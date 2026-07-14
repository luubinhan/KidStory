import { Assets, Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { FISH_SPRITE_URLS } from "./fishAssets";

export type PooledFish = {
  root: Container;
  sprite: Sprite;
  label: Text;
  word: string;
  vx: number;
  baseY: number;
  bobPhase: number;
  busy: boolean;
};

const FISH_DISPLAY_WIDTH = 96;

const LABEL_STYLE = new TextStyle({
  fontFamily: "Arial, sans-serif",
  fontSize: 24,
  fontWeight: "800",
  fill: "#ffffff",
  stroke: { color: "#1e3a5f", width: 4, join: "round" },
  align: "center",
});

/** Object pool for fish containers so swim/FX systems reuse sprites instead of recreating them. */
export class FishPool {
  private readonly parent: Container;
  private readonly free: PooledFish[] = [];
  private textures: Texture[] = [];

  constructor(parent: Container) {
    this.parent = parent;
  }

  async warmTextures(): Promise<void> {
    this.textures = await Promise.all(
      FISH_SPRITE_URLS.map((url) => Assets.load<Texture>(url)),
    );
  }

  private randomTexture(): Texture {
    if (this.textures.length === 0) return Texture.EMPTY;
    const index = Math.floor(Math.random() * this.textures.length);
    return this.textures[index]!;
  }

  private createFish(): PooledFish {
    const sprite = new Sprite(this.randomTexture());
    sprite.anchor.set(0.5);

    const label = new Text({ text: "", style: LABEL_STYLE });
    label.anchor.set(0.5, -1);

    const root = new Container();
    root.eventMode = "static";
    root.cursor = "pointer";
    root.addChild(sprite, label);

    return {
      root,
      sprite,
      label,
      word: "",
      vx: 0,
      baseY: 0,
      bobPhase: 0,
      busy: false,
    };
  }

  /** Pulls a fish from the free list (or creates one), resets its visual state, and adds it to the parent. */
  acquire(): PooledFish {
    const fish = this.free.pop() ?? this.createFish();
    fish.sprite.texture = this.randomTexture();
    const scale =
      fish.sprite.texture.width > 0
        ? FISH_DISPLAY_WIDTH / fish.sprite.texture.width
        : 1;
    fish.sprite.scale.set(scale);
    fish.root.alpha = 1;
    fish.root.scale.set(1);
    fish.busy = false;
    this.parent.addChild(fish.root);
    return fish;
  }

  /** Removes the fish from the scene and returns it to the free list for reuse. */
  release(fish: PooledFish): void {
    fish.root.removeFromParent();
    fish.busy = false;
    this.free.push(fish);
  }

  setWord(fish: PooledFish, word: string): void {
    fish.word = word;
    fish.label.text = word.toUpperCase();
  }
}
