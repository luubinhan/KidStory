import assert from "node:assert/strict";
import {
  CARO_SIZE,
  createEmptyCaroState,
  place,
  undo,
  type CaroCell,
  type CaroPlayer,
  type CaroState,
} from "./caro";

function emptyBoard(): CaroCell[][] {
  return Array.from({ length: CARO_SIZE }, () => Array<CaroCell>(CARO_SIZE).fill(null));
}

function withCells(
  cells: readonly [number, number, CaroPlayer][],
  turn: CaroPlayer = "X",
): CaroState {
  const board = emptyBoard();
  for (const [row, col, player] of cells) {
    board[row][col] = player;
  }
  return {
    board,
    turn,
    status: "playing",
    winLine: [],
    lastMove: null,
  };
}

const start = createEmptyCaroState();
assert.equal(start.board.length, 50);
assert.equal(start.board[0].length, 50);
assert.equal(start.turn, "X");
assert.equal(start.status, "playing");
assert.equal(start.lastMove, null);
assert.equal(start.winLine.length, 0);
assert.equal(start.board[0][0], null);

const afterX = place(start, 10, 10);
assert.equal(afterX.board[10][10], "X");
assert.equal(afterX.turn, "O");
assert.deepEqual(afterX.lastMove, { row: 10, col: 10 });

const occupied = place(afterX, 10, 10);
assert.equal(occupied.board[10][10], "X");
assert.equal(occupied.turn, "O");

const oob = place(start, -1, 0);
assert.equal(oob.board[0][0], null);
assert.equal(oob.turn, "X");

function assertWin(
  label: string,
  setup: readonly [number, number, CaroPlayer][],
  row: number,
  col: number,
  turn: CaroPlayer,
) {
  const won = place(withCells(setup, turn), row, col);
  assert.equal(won.status, "won", label);
  assert.ok(won.winLine.length >= 5, `${label} winLine`);
  assert.ok(
    won.winLine.some((p) => p.row === row && p.col === col),
    `${label} includes placed stone`,
  );
}

assertWin(
  "horizontal",
  [
    [5, 1, "X"],
    [5, 2, "X"],
    [5, 3, "X"],
    [5, 4, "X"],
  ],
  5,
  5,
  "X",
);

assertWin(
  "vertical",
  [
    [1, 8, "X"],
    [2, 8, "X"],
    [3, 8, "X"],
    [4, 8, "X"],
  ],
  5,
  8,
  "X",
);

assertWin(
  "diag down-right",
  [
    [1, 1, "X"],
    [2, 2, "X"],
    [3, 3, "X"],
    [4, 4, "X"],
  ],
  5,
  5,
  "X",
);

assertWin(
  "diag down-left",
  [
    [1, 9, "X"],
    [2, 8, "X"],
    [3, 7, "X"],
    [4, 6, "X"],
  ],
  5,
  5,
  "X",
);

const sixBlocked = place(
  withCells(
    [
      [20, 10, "O"],
      [20, 17, "O"],
      [20, 11, "X"],
      [20, 12, "X"],
      [20, 13, "X"],
      [20, 14, "X"],
      [20, 15, "X"],
    ],
    "X",
  ),
  20,
  16,
);
assert.equal(sixBlocked.status, "won", "six with both ends blocked still wins");
assert.equal(sixBlocked.winLine.length, 6);

const fiveBothO = place(
  withCells(
    [
      [20, 10, "O"],
      [20, 16, "O"],
      [20, 11, "X"],
      [20, 12, "X"],
      [20, 13, "X"],
      [20, 14, "X"],
    ],
    "X",
  ),
  20,
  15,
);
assert.equal(fiveBothO.status, "won", "five blocked by opponent both sides still wins");
assert.equal(fiveBothO.winLine.length, 5);

const fiveEdgeBlocked = place(
  withCells(
    [
      [0, 5, "O"],
      [0, 1, "X"],
      [0, 2, "X"],
      [0, 3, "X"],
      [0, 4, "X"],
    ],
    "X",
  ),
  0,
  0,
);
assert.equal(fiveEdgeBlocked.status, "won", "five on edge + opponent inner end still wins");
assert.equal(fiveEdgeBlocked.winLine.length, 5);

const fiveEdgeOpen = place(
  withCells(
    [
      [0, 1, "X"],
      [0, 2, "X"],
      [0, 3, "X"],
      [0, 4, "X"],
    ],
    "X",
  ),
  0,
  0,
);
assert.equal(fiveEdgeOpen.status, "won", "five on edge with inner end empty");

const fiveOneOpen = place(
  withCells(
    [
      [8, 10, "O"],
      [8, 11, "X"],
      [8, 12, "X"],
      [8, 13, "X"],
      [8, 14, "X"],
    ],
    "X",
  ),
  8,
  15,
);
assert.equal(fiveOneOpen.status, "won", "five with one end empty");

const undone = undo(afterX);
assert.equal(undone.board[10][10], null);
assert.equal(undone.turn, "X");
assert.equal(undone.lastMove, null);

const noUndo = undo(start);
assert.equal(noUndo.turn, "X");

const wonState = place(
  withCells(
    [
      [5, 1, "X"],
      [5, 2, "X"],
      [5, 3, "X"],
      [5, 4, "X"],
    ],
    "X",
  ),
  5,
  5,
);
assert.equal(wonState.status, "won");
const noPlaceAfterWin = place(wonState, 0, 0);
assert.equal(noPlaceAfterWin.board[0][0], null);
const noUndoAfterWin = undo(wonState);
assert.equal(noUndoAfterWin.status, "won");
assert.equal(noUndoAfterWin.board[5][5], "X");

function patternPlayer(r: number, c: number): CaroPlayer {
  const inFours = c % 5 < 4;
  if (r % 2 === 0) return inFours ? "X" : "O";
  return inFours ? "O" : "X";
}

const lastRow = CARO_SIZE - 1;
const lastCol = CARO_SIZE - 1;
const board = emptyBoard();
for (let r = 0; r < CARO_SIZE; r++) {
  for (let c = 0; c < CARO_SIZE; c++) {
    if (r === lastRow && c === lastCol) continue;
    board[r][c] = patternPlayer(r, c);
  }
}
const lastPlayer = patternPlayer(lastRow, lastCol);
const almostFull: CaroState = {
  board,
  turn: lastPlayer,
  status: "playing",
  winLine: [],
  lastMove: null,
};
const drawn = place(almostFull, lastRow, lastCol);
assert.equal(drawn.status, "draw");
assert.equal(drawn.board[lastRow][lastCol], lastPlayer);

console.log("caro.test.ts: ok");
