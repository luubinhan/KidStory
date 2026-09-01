import { useCallback, useEffect, useRef } from "react";
import { CARO_SIZE, type CaroCell, type CaroPoint } from "../../../lib/caro";
import { cn } from "../../../lib/utils";

const CELL = 32;
const BOARD_PX = CARO_SIZE * CELL;
const TAP_SLOP = 10;

type CaroBoardCanvasProps = {
  board: CaroCell[][];
  winLine: CaroPoint[];
  lastMove: CaroPoint | null;
  disabled: boolean;
  onPlace: (row: number, col: number) => void;
};

type Camera = { panX: number; panY: number; scale: number };

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function winKey(line: CaroPoint[]): Set<string> {
  return new Set(line.map((p) => `${p.row},${p.col}`));
}

export function CaroBoardCanvas({
  board,
  winLine,
  lastMove,
  disabled,
  onPlace,
}: CaroBoardCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera>({ panX: 0, panY: 0, scale: 1 });
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number; moved: boolean } | null>(
    null,
  );
  const onPlaceRef = useRef(onPlace);
  onPlaceRef.current = onPlace;

  const drawRef = useRef<() => void>(() => {});

  const clampCamera = useCallback((cam: Camera, cssW: number, cssH: number): Camera => {
    const minScale = Math.min(cssW / BOARD_PX, cssH / BOARD_PX) * 0.95;
    const maxScale = Math.min(cssW, cssH) / (5 * CELL);
    const scale = clamp(cam.scale, minScale, Math.max(maxScale, minScale));
    const drawnW = BOARD_PX * scale;
    const drawnH = BOARD_PX * scale;
    const panX = drawnW <= cssW ? (cssW - drawnW) / 2 : clamp(cam.panX, cssW - drawnW, 0);
    const panY = drawnH <= cssH ? (cssH - drawnH) / 2 : clamp(cam.panY, cssH - drawnH, 0);
    return { panX, panY, scale };
  }, []);

  drawRef.current = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const cssW = wrap.clientWidth;
    const cssH = wrap.clientHeight;
    if (cssW < 1 || cssH < 1) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    cameraRef.current = clampCamera(cameraRef.current, cssW, cssH);
    const { panX, panY, scale } = cameraRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#fff7ed";
    ctx.fillRect(0, 0, BOARD_PX, BOARD_PX);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 1 / scale;
    ctx.beginPath();
    for (let i = 0; i <= CARO_SIZE; i++) {
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, BOARD_PX);
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(BOARD_PX, i * CELL);
    }
    ctx.stroke();
    const wins = winKey(winLine);
    for (let row = 0; row < CARO_SIZE; row++) {
      for (let col = 0; col < CARO_SIZE; col++) {
        const cell = board[row][col];
        if (!cell) continue;
        const cx = col * CELL + CELL / 2;
        const cy = row * CELL + CELL / 2;
        const highlight = wins.has(`${row},${col}`);
        ctx.beginPath();
        ctx.arc(cx, cy, CELL * 0.36, 0, Math.PI * 2);
        ctx.fillStyle = cell === "X" ? "#0f172a" : "#dc2626";
        if (highlight) ctx.fillStyle = cell === "X" ? "#1d4ed8" : "#f59e0b";
        ctx.fill();
      }
    }
    if (lastMove) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2 / scale;
      ctx.strokeRect(lastMove.col * CELL + 2, lastMove.row * CELL + 2, CELL - 4, CELL - 4);
    }
    ctx.restore();
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cssW = wrap.clientWidth;
    const cssH = wrap.clientHeight;
    const scale = Math.min(cssW, cssH) / (14 * CELL);
    cameraRef.current = clampCamera(
      {
        scale,
        panX: cssW / 2 - (BOARD_PX * scale) / 2,
        panY: cssH / 2 - (BOARD_PX * scale) / 2,
      },
      cssW,
      cssH,
    );
    drawRef.current();
    const ro = new ResizeObserver(() => drawRef.current());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [clampCamera]);

  useEffect(() => {
    drawRef.current();
  }, [board, winLine, lastMove]);

  const eventPoint = (e: PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const screenToCell = (x: number, y: number): CaroPoint | null => {
    const { panX, panY, scale } = cameraRef.current;
    const col = Math.floor((x - panX) / (CELL * scale));
    const row = Math.floor((y - panY) / (CELL * scale));
    if (row < 0 || row >= CARO_SIZE || col < 0 || col >= CARO_SIZE) return null;
    return { row, col };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      const p = eventPoint(e, canvas);
      pointersRef.current.set(e.pointerId, p);
      if (pointersRef.current.size === 2) {
        const pts = [...pointersRef.current.values()];
        const a = pts[0];
        const b = pts[1];
        if (!a || !b) return;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        pinchRef.current = { dist, scale: cameraRef.current.scale };
        dragRef.current = null;
        return;
      }
      dragRef.current = {
        x: p.x,
        y: p.y,
        panX: cameraRef.current.panX,
        panY: cameraRef.current.panY,
        moved: false,
      };
    };

    const onMove = (e: PointerEvent) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      const p = eventPoint(e, canvas);
      pointersRef.current.set(e.pointerId, p);
      const wrap = wrapRef.current;
      if (!wrap) return;
      if (pointersRef.current.size === 2 && pinchRef.current) {
        const pts = [...pointersRef.current.values()];
        const a = pts[0];
        const b = pts[1];
        if (!a || !b) return;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchRef.current.dist < 1) return;
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const nextScale = pinchRef.current.scale * (dist / pinchRef.current.dist);
        const wx = (midX - cameraRef.current.panX) / cameraRef.current.scale;
        const wy = (midY - cameraRef.current.panY) / cameraRef.current.scale;
        cameraRef.current = clampCamera(
          {
            scale: nextScale,
            panX: midX - wx * nextScale,
            panY: midY - wy * nextScale,
          },
          wrap.clientWidth,
          wrap.clientHeight,
        );
        drawRef.current();
        return;
      }
      const drag = dragRef.current;
      if (!drag) return;
      const dx = p.x - drag.x;
      const dy = p.y - drag.y;
      if (Math.hypot(dx, dy) > TAP_SLOP) drag.moved = true;
      if (drag.moved) {
        cameraRef.current = clampCamera(
          { ...cameraRef.current, panX: drag.panX + dx, panY: drag.panY + dy },
          wrap.clientWidth,
          wrap.clientHeight,
        );
        drawRef.current();
      }
    };

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      const wasTap = drag && !drag.moved && pointersRef.current.size <= 1;
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current = null;
      if (wasTap && !disabled) {
        const p = eventPoint(e, canvas);
        const cell = screenToCell(p.x, p.y);
        if (cell) onPlaceRef.current(cell.row, cell.col);
      }
      if (pointersRef.current.size === 0) dragRef.current = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      const nextScale = cameraRef.current.scale * factor;
      const wx = (x - cameraRef.current.panX) / cameraRef.current.scale;
      const wy = (y - cameraRef.current.panY) / cameraRef.current.scale;
      cameraRef.current = clampCamera(
        { scale: nextScale, panX: x - wx * nextScale, panY: y - wy * nextScale },
        wrap.clientWidth,
        wrap.clientHeight,
      );
      drawRef.current();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [clampCamera, disabled]);

  return (
    <div ref={wrapRef} className={cn("h-[min(70vh,36rem)] w-full overflow-hidden rounded-2xl border-2 border-white shadow-md")}>
      <canvas ref={canvasRef} className="block size-full touch-none" />
    </div>
  );
}
