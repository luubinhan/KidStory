import { useEffect, useRef } from "react";
import { Application, Container, Graphics, Text, type Ticker } from "pixi.js";
import { nextLetter, normalizeCraneWord } from "../../../lib/crane/craneSession";
import { CRANE_ROUND, type CraneSlot } from "../../../types/crane";

const HUD_TOP = 180;
const SLOT_AREA = 200;
const CELL = 72;
const MOVE_MS = 180;
const PAC_RADIUS = CELL * 0.38;
const MOUTH_IDLE = 0.25;

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
  col: number;
  row: number;
};

type Tween = {
  letter: FieldLetter;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  elapsed: number;
};

type MoveTween = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  dirX: number;
  dirY: number;
  elapsed: number;
};

type Grid = {
  cols: number;
  rows: number;
  originX: number;
  originY: number;
  cell: number;
};

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function facingFromKey(key: string): number | null {
  if (key === "ArrowRight") return 0;
  if (key === "ArrowDown") return Math.PI / 2;
  if (key === "ArrowLeft") return Math.PI;
  if (key === "ArrowUp") return -Math.PI / 2;
  return null;
}

function drawPacman(g: Graphics, radius: number, mouthHalf: number): void {
  g.clear();
  g.moveTo(0, 0)
    .arc(0, 0, radius, mouthHalf, Math.PI * 2 - mouthHalf)
    .closePath()
    .fill({ color: 0xffcc00 })
    .stroke({ width: 2, color: 0xeab308, alignment: 1 });
  g.circle(-radius * 0.18, -radius * 0.42, radius * 0.18).fill({ color: 0xffffff });
  g.circle(radius * 0.04, -radius * 0.42, radius * 0.09).fill({ color: 0x1e293b });
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

function playfield(width: number, height: number) {
  return {
    minX: 24,
    maxX: width - 24,
    minY: HUD_TOP,
    maxY: height - SLOT_AREA - 16,
  };
}

function makeGrid(width: number, height: number): Grid {
  const area = playfield(width, height);
  const cols = Math.max(4, Math.floor((area.maxX - area.minX) / CELL));
  const rows = Math.max(4, Math.floor((area.maxY - area.minY) / CELL));
  const gridW = cols * CELL;
  const gridH = rows * CELL;
  return {
    cols,
    rows,
    originX: area.minX + (area.maxX - area.minX - gridW) / 2,
    originY: area.minY + (area.maxY - area.minY - gridH) / 2,
    cell: CELL,
  };
}

function cellCenter(grid: Grid, col: number, row: number): { x: number; y: number } {
  return {
    x: grid.originX + (col + 0.5) * grid.cell,
    y: grid.originY + (row + 0.5) * grid.cell,
  };
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
    const held = new Set<string>();
    let busy = false;
    let tween: Tween | null = null;
    let moveTween: MoveTween | null = null;
    const letters: FieldLetter[] = [];
    const slotGfx: Graphics[] = [];
    const slotTexts: Text[] = [];
    const gridGfx = new Graphics();
    const hook = new Container();
    const body = new Graphics();
    let grid = makeGrid(800, 600);
    let hookCol = 0;
    let hookRow = 0;
    let facing = 0;
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

    function drawGrid(): void {
      gridGfx.clear();
      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
          gridGfx
            .rect(
              grid.originX + col * grid.cell,
              grid.originY + row * grid.cell,
              grid.cell,
              grid.cell,
            )
            .stroke({ width: 1, color: 0x94a3b8, alpha: 0.45 });
        }
      }
    }

    function snapHook(): void {
      hookCol = Math.min(grid.cols - 1, Math.max(0, hookCol));
      hookRow = Math.min(grid.rows - 1, Math.max(0, hookRow));
      const pos = cellCenter(grid, hookCol, hookRow);
      hook.position.set(pos.x, pos.y);
      hook.scale.set(1);
      hook.rotation = facing;
      drawPacman(body, PAC_RADIUS, MOUTH_IDLE);
      moveTween = null;
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

    function placeLettersOnGrid(): void {
      const occupied = new Set<string>(["0,0"]);
      const free: { col: number; row: number }[] = [];
      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
          const key = `${col},${row}`;
          if (!occupied.has(key)) free.push({ col, row });
        }
      }
      for (let i = free.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [free[i], free[j]] = [free[j]!, free[i]!];
      }
      letters.forEach((item, index) => {
        const cell = free[index] ?? { col: 0, row: 0 };
        item.col = cell.col;
        item.row = cell.row;
        const pos = cellCenter(grid, item.col, item.row);
        item.text.position.set(pos.x, pos.y);
      });
    }

    function syncLetterPositions(): void {
      for (const item of letters) {
        item.col = Math.min(grid.cols - 1, Math.max(0, item.col));
        item.row = Math.min(grid.rows - 1, Math.max(0, item.row));
        const pos = cellCenter(grid, item.col, item.row);
        item.text.position.set(pos.x, pos.y);
      }
    }

    function firstEmptyCenter(width: number, height: number) {
      const index = slotsRef.current.findIndex((s) => !s.filled);
      return slotCenters(width, height, slotsRef.current.length)[index] ?? null;
    }

    function tryGrab(): void {
      if (busy || moveTween || !enabledRef.current) return;
      const expected = nextLetter(slotsRef.current);
      if (!expected) return;
      const item = letters.find(
        (letter) =>
          letter.col === hookCol &&
          letter.row === hookRow &&
          normalizeCraneWord(letter.char) === expected,
      );
      if (!item) return;
      const dest = firstEmptyCenter(app.screen.width, app.screen.height);
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
    }

    function step(key: string): void {
      if (!enabledRef.current || busy || moveTween) return;
      let nextCol = hookCol;
      let nextRow = hookRow;
      if (key === "ArrowLeft") nextCol -= 1;
      else if (key === "ArrowRight") nextCol += 1;
      else if (key === "ArrowUp") nextRow -= 1;
      else if (key === "ArrowDown") nextRow += 1;
      else return;
      const nextFacing = facingFromKey(key);
      if (nextFacing !== null) facing = nextFacing;
      hook.rotation = facing;
      nextCol = Math.min(grid.cols - 1, Math.max(0, nextCol));
      nextRow = Math.min(grid.rows - 1, Math.max(0, nextRow));
      if (nextCol === hookCol && nextRow === hookRow) return;
      const from = cellCenter(grid, hookCol, hookRow);
      const to = cellCenter(grid, nextCol, nextRow);
      moveTween = {
        startX: hook.x || from.x,
        startY: hook.y || from.y,
        endX: to.x,
        endY: to.y,
        dirX: nextCol - hookCol,
        dirY: nextRow - hookRow,
        elapsed: 0,
      };
      hookCol = nextCol;
      hookRow = nextRow;
    }

    function tick(ticker: Ticker): void {
      for (let i = 0; i < slotTexts.length; i++) {
        const slot = slotsRef.current[i];
        const label = slotTexts[i];
        if (slot && label) label.text = slot.filled ? slot.letter : "";
      }

      if (moveTween) {
        moveTween.elapsed += ticker.deltaMS;
        const t = Math.min(1, moveTween.elapsed / MOVE_MS);
        const e = easeOutQuad(t);
        hook.x = moveTween.startX + (moveTween.endX - moveTween.startX) * e;
        hook.y = moveTween.startY + (moveTween.endY - moveTween.startY) * e;
        hook.rotation = facing;
        drawPacman(body, PAC_RADIUS, 0.1 + 0.6 * Math.sin(t * Math.PI));
        if (t >= 1) {
          hook.position.set(moveTween.endX, moveTween.endY);
          hook.scale.set(1);
          hook.rotation = facing;
          drawPacman(body, PAC_RADIUS, MOUTH_IDLE);
          moveTween = null;
          tryGrab();
        }
        return;
      }

      if (!tween) return;
      tween.elapsed += ticker.deltaMS;
      const t = Math.min(1, tween.elapsed / CRANE_ROUND.flyToSlotMs);
      tween.letter.text.x = tween.startX + (tween.endX - tween.startX) * t;
      tween.letter.text.y = tween.startY + (tween.endY - tween.startY) * t;
      if (t < 1) return;
      const char = tween.letter.char;
      app.stage.removeChild(tween.letter.text);
      tween.letter.text.destroy();
      const idx = letters.indexOf(tween.letter);
      if (idx !== -1) letters.splice(idx, 1);
      tween = null;
      busy = false;
      onGrabRef.current(char);
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
      if (enabledRef.current) event.preventDefault();
      if (event.repeat || held.has(event.key)) return;
      held.add(event.key);
      step(event.key);
    }

    function onKeyUp(event: KeyboardEvent): void {
      held.delete(event.key);
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
      app.stage.sortableChildren = true;

      gridGfx.zIndex = 0;
      app.stage.addChild(gridGfx);

      drawPacman(body, PAC_RADIUS, MOUTH_IDLE);
      hook.addChild(body);
      hook.zIndex = 3;
      hook.rotation = facing;
      app.stage.addChild(hook);

      for (const slot of slotsRef.current) {
        const g = new Graphics();
        g.zIndex = 1;
        const t = new Text({
          text: slot.filled ? slot.letter : "",
          style: letterStyle,
        });
        t.anchor.set(0.5);
        t.zIndex = 1;
        slotGfx.push(g);
        slotTexts.push(t);
        app.stage.addChild(g);
        app.stage.addChild(t);
      }

      for (const char of fieldLetters) {
        const text = new Text({ text: char, style: letterStyle });
        text.anchor.set(0.5);
        text.zIndex = 2;
        app.stage.addChild(text);
        letters.push({ char, text, col: 0, row: 0 });
      }

      function layout(): void {
        grid = makeGrid(app.screen.width, app.screen.height);
        drawGrid();
        layoutSlots(app.screen.width, app.screen.height);
        snapHook();
        syncLetterPositions();
      }

      grid = makeGrid(app.screen.width, app.screen.height);
      drawGrid();
      layoutSlots(app.screen.width, app.screen.height);
      placeLettersOnGrid();
      snapHook();

      app.ticker.add(tick);
      app.renderer.on("resize", layout);

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
