export const TILE_COUNT = 9;

export type PicturePuzzleBoard = (number | null)[];

export type PicturePuzzleState = {
  board: PicturePuzzleBoard;
  tray: number[];
};

export type DragSource =
  | { kind: "tray"; tileId: number }
  | { kind: "slot"; index: number };

export type DragTarget =
  | { kind: "tray" }
  | { kind: "slot"; index: number };

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const current = next[i];
    const swap = next[j];
    if (current === undefined || swap === undefined) continue;
    next[i] = swap;
    next[j] = current;
  }
  return next;
}

export function createPuzzle(random: () => number = Math.random): PicturePuzzleState {
  return {
    board: Array.from({ length: TILE_COUNT }, () => null),
    tray: shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], random),
  };
}

export function isSolved(board: PicturePuzzleBoard): boolean {
  if (board.length !== TILE_COUNT) return false;
  return board.every((tileId, index) => tileId === index);
}

export function applyDrag(
  state: PicturePuzzleState,
  source: DragSource,
  target: DragTarget,
): PicturePuzzleState {
  const board = [...state.board];
  const tray = [...state.tray];

  if (source.kind === "tray") {
    const fromIdx = tray.indexOf(source.tileId);
    if (fromIdx === -1) return state;
    if (target.kind === "tray") return state;
    const dest = target.index;
    if (dest < 0 || dest >= TILE_COUNT) return state;
    const occupant = board[dest] ?? null;
    tray.splice(fromIdx, 1);
    board[dest] = source.tileId;
    if (occupant !== null) tray.push(occupant);
    return { board, tray };
  }

  const from = source.index;
  if (from < 0 || from >= TILE_COUNT) return state;
  const tileId = board[from];
  if (tileId === null || tileId === undefined) return state;

  if (target.kind === "tray") {
    board[from] = null;
    tray.push(tileId);
    return { board, tray };
  }

  const dest = target.index;
  if (dest < 0 || dest >= TILE_COUNT || dest === from) return state;
  const occupant = board[dest] ?? null;
  board[from] = occupant;
  board[dest] = tileId;
  return { board, tray };
}

export function tileBackgroundPosition(tileId: number): { xPercent: number; yPercent: number } {
  const row = Math.floor(tileId / 3);
  const col = tileId % 3;
  return { xPercent: col * 50, yPercent: row * 50 };
}

export function pickPicturePuzzleItem<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T | undefined {
  if (items.length === 0) return undefined;
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));
  return items[index];
}

export function hasBoardProgress(board: PicturePuzzleBoard): boolean {
  return board.some((cell) => cell !== null);
}

export function shouldConfirmSwitch(
  board: PicturePuzzleBoard,
  fromId: string,
  toId: string,
): boolean {
  if (fromId === toId) return false;
  return hasBoardProgress(board);
}
