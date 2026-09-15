import { useEffect, useRef } from "react";
import { Application, Container, Graphics, Text, type Ticker } from "pixi.js";
import { nextLetter, normalizeCraneWord } from "../../../lib/crane/craneSession";
import { CRANE_ROUND, type CraneSlot } from "../../../types/crane";

const HUD_TOP = 180;
const SLOT_AREA = 200;
const TIP_SIZE = 28;
const LETTER_GAP = 48;

type CranePixiStageProps = {
  word: string;
  slots: readonly CraneSlot[];
  fieldLetters: readonly string[];
  enabled: boolean;
  onGrab: (letter: string) => void;
};

type FieldLetter = {
  char: string;
  text: Text;
};

type Tween = {
  letter: FieldLetter;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  elapsed: number;
};

function aabbOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function slotCenters(
  width: number,
  height: number,
  count: number,
): { x: number; y: number }[] {
  const slotW = 52;
  const gap = 10;
  const total = count * slotW + (count - 1) * gap;
  const startX = (width - total) / 2 + slotW / 2;
  const y = height - 130;
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * (slotW + gap),
    y,
  }));
}

export function CranePixiStage({
  word,
  slots,
  fieldLetters,
  enabled,
  onGrab,
}: CranePixiStageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const slotsRef = useRef(slots);
  const enabledRef = useRef(enabled);
  const onGrabRef = useRef(onGrab);
  slotsRef.current = slots;
  enabledRef.current = enabled;
  onGrabRef.current = onGrab;

  useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl) return;

    let disposed = false;
    const app = new Application();
    const keys = new Set<string>();
    let busy = false;
    let tween: Tween | null = null;
    const letters: FieldLetter[] = [];
    const slotGfx: Graphics[] = [];
    const slotTexts: Text[] = [];
    const hook = new Container();
    const letterStyle = {
      fontFamily: "Arial, sans-serif",
      fontSize: 36,
      fill: 0x1e293b,
      fontWeight: "700",
    } as const;

    function destroyApp(): void {
      if (!app.renderer) return;
      app.destroy(true, { children: true });
    }

    function playfield(width: number, height: number) {
      return {
        minX: 24,
        maxX: width - 24,
        minY: HUD_TOP,
        maxY: height - SLOT_AREA - 16,
      };
    }

    function layoutSlots(width: number, height: number): void {
      const centers = slotCenters(width, height, slotsRef.current.length);
      const slotW = 52;
      const slotH = 56;
      for (let i = 0; i < slotsRef.current.length; i++) {
        const g = slotGfx[i];
        const t = slotTexts[i];
        const c = centers[i];
        if (!g || !t || !c) continue;
        g.clear();
        g.roundRect(c.x - slotW / 2, c.y - slotH / 2, slotW, slotH, 8).fill(0xd6d3d1);
        const slot = slotsRef.current[i];
        t.text = slot?.filled ? slot.letter : "";
        t.position.set(c.x, c.y);
      }
    }

    function scatterLetters(width: number, height: number): void {
      const area = playfield(width, height);
      const placed: { x: number; y: number }[] = [];
      for (const item of letters) {
        let x = (area.minX + area.maxX) / 2;
        let y = (area.minY + area.maxY) / 2;
        let found = false;
        for (let attempt = 0; attempt < 20; attempt++) {
          const tx = area.minX + Math.random() * (area.maxX - area.minX);
          const ty = area.minY + Math.random() * (area.maxY - area.minY);
          const ok = placed.every(
            (p) => Math.hypot(p.x - tx, p.y - ty) >= LETTER_GAP,
          );
          if (!ok) continue;
          x = tx;
          y = ty;
          found = true;
          break;
        }
        if (!found && placed.length > 0) {
          const col = placed.length % 4;
          const row = Math.floor(placed.length / 4);
          x = area.minX + 40 + col * LETTER_GAP;
          y = area.minY + 40 + row * LETTER_GAP;
        }
        item.text.position.set(x, y);
        placed.push({ x, y });
      }
    }

    function firstEmptyCenter(width: number, height: number) {
      const index = slotsRef.current.findIndex((s) => !s.filled);
      return slotCenters(width, height, slotsRef.current.length)[index] ?? null;
    }

    function tick(ticker: Ticker): void {
      const width = app.screen.width;
      const height = app.screen.height;
      const dt = ticker.deltaMS / 1000;

      for (let i = 0; i < slotTexts.length; i++) {
        const slot = slotsRef.current[i];
        const label = slotTexts[i];
        if (slot && label) label.text = slot.filled ? slot.letter : "";
      }

      if (tween) {
        tween.elapsed += ticker.deltaMS;
        const t = Math.min(1, tween.elapsed / CRANE_ROUND.flyToSlotMs);
        tween.letter.text.x = tween.startX + (tween.endX - tween.startX) * t;
        tween.letter.text.y = tween.startY + (tween.endY - tween.startY) * t;
        if (t >= 1) {
          const char = tween.letter.char;
          app.stage.removeChild(tween.letter.text);
          tween.letter.text.destroy();
          const idx = letters.indexOf(tween.letter);
          if (idx !== -1) letters.splice(idx, 1);
          tween = null;
          busy = false;
          onGrabRef.current(char);
        }
        return;
      }

      if (!enabledRef.current || busy) return;

      let vx = 0;
      let vy = 0;
      if (keys.has("ArrowLeft")) vx -= 1;
      if (keys.has("ArrowRight")) vx += 1;
      if (keys.has("ArrowUp")) vy -= 1;
      if (keys.has("ArrowDown")) vy += 1;
      if (vx !== 0 && vy !== 0) {
        vx *= Math.SQRT1_2;
        vy *= Math.SQRT1_2;
      }
      const speed = CRANE_ROUND.speedPxPerSec;
      hook.x += vx * speed * dt;
      hook.y += vy * speed * dt;
      const area = playfield(width, height);
      hook.x = Math.min(area.maxX, Math.max(area.minX, hook.x));
      hook.y = Math.min(area.maxY, Math.max(area.minY, hook.y));

      const expected = nextLetter(slotsRef.current);
      if (!expected) return;
      const tipX = hook.x - TIP_SIZE / 2;
      const tipY = hook.y - TIP_SIZE / 2;
      for (const item of letters) {
        if (normalizeCraneWord(item.char) !== expected) continue;
        const b = item.text.getBounds();
        if (
          !aabbOverlap(tipX, tipY, TIP_SIZE, TIP_SIZE, b.x, b.y, b.width, b.height)
        ) {
          continue;
        }
        const dest = firstEmptyCenter(width, height);
        if (!dest) return;
        busy = true;
        tween = {
          letter: item,
          startX: item.text.x,
          startY: item.text.y,
          endX: dest.x,
          endY: dest.y,
          elapsed: 0,
        };
        return;
      }
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight" &&
        event.key !== "ArrowUp" &&
        event.key !== "ArrowDown"
      ) {
        return;
      }
      if (enabledRef.current && !busy) event.preventDefault();
      keys.add(event.key);
    }

    function onKeyUp(event: KeyboardEvent): void {
      keys.delete(event.key);
    }

    void (async () => {
      await app.init({
        backgroundAlpha: 0,
        resizeTo: window,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });
      if (disposed) {
        destroyApp();
        return;
      }

      hostEl.appendChild(app.canvas);
      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";

      const arm = new Graphics();
      arm
        .rect(-48, -6, 48, 12)
        .fill(0x111111)
        .rect(-48, -54, 12, 48)
        .fill(0x111111)
        .circle(-42, -62, 10)
        .fill(0xc4c4c4);
      hook.addChild(arm);
      hook.position.set(app.screen.width * 0.25, app.screen.height * 0.4);
      app.stage.addChild(hook);

      for (const slot of slotsRef.current) {
        const g = new Graphics();
        const t = new Text({
          text: slot.filled ? slot.letter : "",
          style: letterStyle,
        });
        t.anchor.set(0.5);
        slotGfx.push(g);
        slotTexts.push(t);
        app.stage.addChild(g);
        app.stage.addChild(t);
      }

      for (const char of fieldLetters) {
        const text = new Text({ text: char, style: letterStyle });
        text.anchor.set(0.5);
        app.stage.addChild(text);
        letters.push({ char, text });
      }

      layoutSlots(app.screen.width, app.screen.height);
      scatterLetters(app.screen.width, app.screen.height);

      app.ticker.add(tick);
      app.renderer.on("resize", () => {
        layoutSlots(app.screen.width, app.screen.height);
        const area = playfield(app.screen.width, app.screen.height);
        hook.x = Math.min(area.maxX, Math.max(area.minX, hook.x));
        hook.y = Math.min(area.maxY, Math.max(area.minY, hook.y));
      });

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
    })();

    return () => {
      disposed = true;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      destroyApp();
    };
  }, [fieldLetters, word]);

  return <div ref={hostRef} className="absolute inset-0 z-0" aria-hidden />;
}
