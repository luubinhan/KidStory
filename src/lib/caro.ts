export const CARO_SIZE = 50;

export type CaroPlayer = "X" | "O";
export type CaroCell = CaroPlayer | null;
export type CaroStatus = "playing" | "won" | "draw";
export type CaroPoint = { row: number; col: number };

export type CaroState = {
  board: CaroCell[][];
  turn: CaroPlayer;
  status: CaroStatus;
  winLine: CaroPoint[];
  lastMove: CaroPoint | null;
};

const AXES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

function opponentOf(player: CaroPlayer): CaroPlayer {
  return player === "X" ? "O" : "X";
}

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < CARO_SIZE && col >= 0 && col < CARO_SIZE;
}

function cloneBoard(board: CaroCell[][]): CaroCell[][] {
  return board.map((row) => row.slice());
}

function isBoardFull(board: CaroCell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (cell === null) return false;
    }
  }
  return true;
}

function isBlocked(board: CaroCell[][], row: number, col: number, opponent: CaroPlayer): boolean {
  if (!inBounds(row, col)) return true;
  return board[row][col] === opponent;
}

function collectRun(
  board: CaroCell[][],
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: CaroPlayer,
): CaroPoint[] {
  const forward: CaroPoint[] = [];
  let r = row + dr;
  let c = col + dc;
  while (inBounds(r, c) && board[r][c] === player) {
    forward.push({ row: r, col: c });
    r += dr;
    c += dc;
  }
  const backward: CaroPoint[] = [];
  r = row - dr;
  c = col - dc;
  while (inBounds(r, c) && board[r][c] === player) {
    backward.push({ row: r, col: c });
    r -= dr;
    c -= dc;
  }
  return [...backward.reverse(), { row, col }, ...forward];
}

function winLineAt(board: CaroCell[][], row: number, col: number, player: CaroPlayer): CaroPoint[] {
  const opponent = opponentOf(player);
  for (const [dr, dc] of AXES) {
    const run = collectRun(board, row, col, dr, dc, player);
    const n = run.length;
    const first = run[0];
    const last = run[n - 1];
    const beforeBlocked = isBlocked(board, first.row - dr, first.col - dc, opponent);
    const afterBlocked = isBlocked(board, last.row + dr, last.col + dc, opponent);
    if (n >= 6) return run;
    if (n === 5 && !(beforeBlocked && afterBlocked)) return run;
  }
  return [];
}

export function createEmptyCaroState(): CaroState {
  return {
    board: Array.from({ length: CARO_SIZE }, () => Array<CaroCell>(CARO_SIZE).fill(null)),
    turn: "X",
    status: "playing",
    winLine: [],
    lastMove: null,
  };
}

export function place(state: CaroState, row: number, col: number): CaroState {
  if (state.status !== "playing") return state;
  if (!inBounds(row, col)) return state;
  if (state.board[row][col] !== null) return state;

  const board = cloneBoard(state.board);
  board[row][col] = state.turn;
  const winLine = winLineAt(board, row, col, state.turn);
  if (winLine.length > 0) {
    return {
      board,
      turn: state.turn,
      status: "won",
      winLine,
      lastMove: { row, col },
    };
  }
  if (isBoardFull(board)) {
    return {
      board,
      turn: state.turn,
      status: "draw",
      winLine: [],
      lastMove: { row, col },
    };
  }
  return {
    board,
    turn: opponentOf(state.turn),
    status: "playing",
    winLine: [],
    lastMove: { row, col },
  };
}

export function undo(state: CaroState): CaroState {
  if (state.status !== "playing") return state;
  if (!state.lastMove) return state;
  const { row, col } = state.lastMove;
  const board = cloneBoard(state.board);
  board[row][col] = null;
  return {
    board,
    turn: opponentOf(state.turn),
    status: "playing",
    winLine: [],
    lastMove: null,
  };
}
