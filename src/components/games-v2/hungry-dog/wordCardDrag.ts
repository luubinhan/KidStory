import {
  Assets,
  Container,
  FederatedPointerEvent,
  Rectangle,
  Sprite,
  Text,
  TextStyle,
  type Application,
} from "pixi.js";
import type { HungryDogVocabItem } from "../../../types/hungryDog";
import { HUNGRY_DOG_TRAY_ALIAS } from "./preload";
import { HUNGRY_DOG_TIMINGS } from "./timings";

/** Tray target width; height follows texture aspect. */
export const WORD_CARD_WIDTH = 100;
const TRAY_NATIVE_W = 117;
const TRAY_NATIVE_H = 91;
const TRAY_SCALE = WORD_CARD_WIDTH / TRAY_NATIVE_W;
const TRAY_H = TRAY_NATIVE_H * TRAY_SCALE;
const LABEL_GAP = 6;
const LABEL_H = 22;
/** Tray + word label stacked; used for row Y layout. */
export const WORD_CARD_HEIGHT = TRAY_H + LABEL_GAP + LABEL_H;
export const WORD_CARD_GAP = 20;
/** Clear fixed CourseBottomNav (~80px) so cards stay clickable. */
export const WORD_CARD_BOTTOM_SAFE_PX = 110;

const CARD_STYLE = new TextStyle({
  fontFamily: "Arial, sans-serif",
  fontSize: 26,
  fontWeight: "800",
  fill: "#1e293b",
  stroke: { color: "#ffffff", width: 4 },
});

type CardSlot = {
  root: Container;
  label: Text;
  homeX: number;
  homeY: number;
  item: HungryDogVocabItem | null;
  dragging: boolean;
};

export type WordCardDragSystem = {
  setEnabled: (enabled: boolean) => void;
  updateChoices: (choices: readonly HungryDogVocabItem[]) => void;
  layout: (width: number, height: number) => void;
  destroy: () => void;
};

type DropKind = "correct" | "wrong" | "ignored";

type CreateWordCardsOpts = {
  app: Application;
  stage: Container;
  getMouthBounds: () => Rectangle;
  onCardDrop: (word: string) => Promise<DropKind>;
  /** Fired when the child starts dragging any card. */
  onDragStart?: () => void;
  /** Fired when drag ends without a mouth drop (snap back). */
  onDragCancel?: () => void;
};

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function tweenPosition(
  app: Application,
  target: Container,
  toX: number,
  toY: number,
  durationMs: number,
): Promise<void> {
  const fromX = target.x;
  const fromY = target.y;
  return new Promise((resolve) => {
    let elapsed = 0;
    const tick = () => {
      elapsed += app.ticker.deltaMS;
      const t = Math.min(1, elapsed / durationMs);
      const e = easeOutQuad(t);
      target.x = fromX + (toX - fromX) * e;
      target.y = fromY + (toY - fromY) * e;
      if (t >= 1) {
        app.ticker.remove(tick);
        resolve();
      }
    };
    app.ticker.add(tick);
  });
}

/** Fly into mouth: move + shrink + fade to alpha 0.2. */
function tweenIntoMouth(
  app: Application,
  target: Container,
  toX: number,
  toY: number,
): Promise<void> {
  const fromX = target.x;
  const fromY = target.y;
  const fromScale = target.scale.x;
  const fromAlpha = target.alpha;
  const toScale = HUNGRY_DOG_TIMINGS.cardEatScale;
  const toAlpha = HUNGRY_DOG_TIMINGS.cardEatAlpha;
  const durationMs = HUNGRY_DOG_TIMINGS.cardEatMs;

  return new Promise((resolve) => {
    let elapsed = 0;
    const tick = () => {
      elapsed += app.ticker.deltaMS;
      const t = Math.min(1, elapsed / durationMs);
      const e = easeOutQuad(t);
      target.x = fromX + (toX - fromX) * e;
      target.y = fromY + (toY - fromY) * e;
      const scale = fromScale + (toScale - fromScale) * e;
      target.scale.set(scale);
      target.alpha = fromAlpha + (toAlpha - fromAlpha) * e;
      if (t >= 1) {
        app.ticker.remove(tick);
        resolve();
      }
    };
    app.ticker.add(tick);
  });
}

function resetCardTransform(target: Container): void {
  target.scale.set(1);
  target.alpha = 1;
  target.visible = true;
}

export function createWordCards(opts: CreateWordCardsOpts): WordCardDragSystem {
  const { app, stage, getMouthBounds, onCardDrop, onDragStart, onDragCancel } = opts;
  const slots: CardSlot[] = [];
  let enabled = true;
  let stageWidth = app.screen.width;
  let stageHeight = app.screen.height;
  let dropInFlight = false;

  function setCardVisual(slot: CardSlot, item: HungryDogVocabItem) {
    slot.item = item;
    slot.label.text = item.word.toUpperCase();
  }

  function createSlot(): CardSlot {
    const root = new Container();
    root.eventMode = "static";
    root.cursor = "pointer";
    // Origin at tray center; label sits above tray.
    root.hitArea = new Rectangle(
      -WORD_CARD_WIDTH / 2,
      -TRAY_H / 2 - LABEL_GAP - LABEL_H,
      WORD_CARD_WIDTH,
      WORD_CARD_HEIGHT,
    );

    const tray = new Sprite(Assets.get(HUNGRY_DOG_TRAY_ALIAS));
    tray.label = "word-tray";
    tray.anchor.set(0.5);
    tray.scale.set(TRAY_SCALE);
    tray.eventMode = "none";

    const label = new Text({ text: "", style: CARD_STYLE });
    label.anchor.set(0.5);
    // label.y = -TRAY_H / 2 - LABEL_GAP - LABEL_H / 2;
    label.y = TRAY_H / 3;
    label.eventMode = "none";

    root.addChild(tray, label);
    stage.addChild(root);

    const slot: CardSlot = {
      root,
      label,
      homeX: 0,
      homeY: 0,
      item: null,
      dragging: false,
    };

    let dragOffsetX = 0;
    let dragOffsetY = 0;

    root.on("pointerdown", (event: FederatedPointerEvent) => {
      if (!enabled || !slot.item || dropInFlight) return;
      event.stopPropagation();
      slot.dragging = true;
      root.zIndex = 10;
      root.scale.set(0.4);
      root.alpha = 0.7;
      const pos = event.global;
      dragOffsetX = root.x - pos.x;
      dragOffsetY = root.y - pos.y;
      onDragStart?.();
    });

    // globalpointermove fires even when pointer leaves the card (required for drag)
    root.on("globalpointermove", (event: FederatedPointerEvent) => {
      if (!slot.dragging) return;
      root.x = event.global.x + dragOffsetX;
      root.y = event.global.y + dragOffsetY;
    });

    const endDrag = async () => {
      if (!slot.dragging || !slot.item || dropInFlight) return;
      slot.dragging = false;
      root.zIndex = 0;

      const mouth = getMouthBounds();
      const cx = root.x;
      const cy = root.y;
      const overMouth =
        cx >= mouth.x &&
        cx <= mouth.x + mouth.width &&
        cy >= mouth.y &&
        cy <= mouth.y + mouth.height;

      if (!overMouth || !enabled) {
        onDragCancel?.();
        resetCardTransform(root);
        await tweenPosition(app, root, slot.homeX, slot.homeY, HUNGRY_DOG_TIMINGS.cardSnapBackMs);
        return;
      }

      dropInFlight = true;
      const word = slot.item.word;
      try {
        // Eat motion: shrink + fade into mouth, then resolve round.
        await tweenIntoMouth(
          app,
          root,
          mouth.x + mouth.width / 2,
          mouth.y + mouth.height / 2,
        );
        root.visible = false;

        const result = await onCardDrop(word);

        if (result === "ignored" || result === "wrong") {
          resetCardTransform(root);
          await tweenPosition(app, root, slot.homeX, slot.homeY, HUNGRY_DOG_TIMINGS.cardSnapBackMs);
        }
        // correct: onCardDrop already called updateChoices with the next round
      } finally {
        dropInFlight = false;
      }
    };

    root.on("pointerup", () => {
      void endDrag();
    });
    root.on("pointerupoutside", () => {
      void endDrag();
    });
    root.on("globalpointerup", () => {
      void endDrag();
    });

    slots.push(slot);
    return slot;
  }

  for (let i = 0; i < 4; i++) {
    createSlot();
  }

  function layoutSlots(width: number, height: number) {
    stageWidth = width;
    stageHeight = height;
    const totalWidth = 4 * WORD_CARD_WIDTH + 3 * WORD_CARD_GAP;
    const startX = width / 2 - totalWidth / 2 + WORD_CARD_WIDTH / 2;
    // Root origin = tray center; clear bottom nav from tray bottom.
    const y = height - TRAY_H / 2 - WORD_CARD_BOTTOM_SAFE_PX;

    slots.forEach((slot, index) => {
      slot.homeX = startX + index * (WORD_CARD_WIDTH + WORD_CARD_GAP);
      slot.homeY = y;
      if (!slot.dragging) {
        slot.root.x = slot.homeX;
        slot.root.y = slot.homeY;
      }
    });
  }

  layoutSlots(stageWidth, stageHeight);

  return {
    setEnabled(next: boolean) {
      enabled = next;
      for (const slot of slots) {
        slot.root.eventMode = next ? "static" : "none";
        slot.root.cursor = next ? "pointer" : "default";
      }
    },
    updateChoices(choices: readonly HungryDogVocabItem[]) {
      const shuffled = [...choices].sort(() => Math.random() - 0.5);
      slots.forEach((slot, index) => {
        const item = shuffled[index];
        if (!item) return;
        setCardVisual(slot, item);
        resetCardTransform(slot.root);
        if (!slot.dragging) {
          slot.root.x = slot.homeX;
          slot.root.y = slot.homeY;
        }
      });
      layoutSlots(stageWidth, stageHeight);
    },
    layout(width: number, height: number) {
      layoutSlots(width, height);
    },
    destroy() {
      for (const slot of slots) {
        slot.root.destroy({ children: true });
      }
      slots.length = 0;
    },
  };
}
