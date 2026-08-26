import assert from "node:assert/strict";
import {
  applyDrag,
  createPuzzle,
  isSolved,
  pickPicturePuzzleItem,
  tileBackgroundPosition,
} from "./picturePuzzle";

const emptyBoard = [null, null, null, null, null, null, null, null, null];

assert.equal(isSolved(emptyBoard), false);
assert.equal(isSolved([0, 1, 2, 3, 4, 5, 6, 7, null]), false);
assert.equal(isSolved([0, 1, 2, 3, 4, 5, 6, 7, 8]), true);
assert.equal(isSolved([1, 0, 2, 3, 4, 5, 6, 7, 8]), false);

const puzzle = createPuzzle(() => 0);
assert.deepEqual(puzzle.board, emptyBoard);
assert.equal(puzzle.tray.length, 9);
assert.deepEqual([...puzzle.tray].sort((a, b) => a - b), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
assert.equal(isSolved(puzzle.board), false);

const afterTrayToEmpty = applyDrag(
  { board: [...emptyBoard], tray: [4, 1, 0] },
  { kind: "tray", tileId: 4 },
  { kind: "slot", index: 4 },
);
assert.equal(afterTrayToEmpty.board[4], 4);
assert.deepEqual(afterTrayToEmpty.tray, [1, 0]);

const afterSwapSlots = applyDrag(
  { board: [0, 1, null, null, null, null, null, null, null], tray: [] },
  { kind: "slot", index: 0 },
  { kind: "slot", index: 1 },
);
assert.deepEqual(afterSwapSlots.board.slice(0, 2), [1, 0]);

const afterSlotToTray = applyDrag(
  { board: [0, null, null, null, null, null, null, null, null], tray: [2] },
  { kind: "slot", index: 0 },
  { kind: "tray" },
);
assert.equal(afterSlotToTray.board[0], null);
assert.deepEqual(afterSlotToTray.tray, [2, 0]);

const afterDisplace = applyDrag(
  { board: [5, null, null, null, null, null, null, null, null], tray: [3] },
  { kind: "tray", tileId: 3 },
  { kind: "slot", index: 0 },
);
assert.equal(afterDisplace.board[0], 3);
assert.deepEqual(afterDisplace.tray, [5]);

const noopMissing = applyDrag(
  { board: [...emptyBoard], tray: [1] },
  { kind: "tray", tileId: 8 },
  { kind: "slot", index: 0 },
);
assert.deepEqual(noopMissing.tray, [1]);
assert.equal(noopMissing.board[0], null);

assert.deepEqual(tileBackgroundPosition(0), { xPercent: 0, yPercent: 0 });
assert.deepEqual(tileBackgroundPosition(1), { xPercent: 50, yPercent: 0 });
assert.deepEqual(tileBackgroundPosition(3), { xPercent: 0, yPercent: 50 });
assert.deepEqual(tileBackgroundPosition(8), { xPercent: 100, yPercent: 100 });

assert.equal(pickPicturePuzzleItem([], () => 0), undefined);
assert.equal(pickPicturePuzzleItem(["a", "b", "c"], () => 0), "a");
assert.equal(pickPicturePuzzleItem(["a", "b", "c"], () => 0.99), "c");

console.log("picturePuzzle.test.ts: ok");
