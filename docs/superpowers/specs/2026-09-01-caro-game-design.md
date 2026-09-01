# Caro (Games V2) — Design Spec

**Date:** 2026-09-01  
**Status:** Approved (brainstorming session)

## Summary

Add a **Caro** mini-game to Games V2. It is **not** an English-learning activity: two players share one device (hot-seat), take turns as X and O on a **50×50** board, and play Vietnamese caro rules (five-in-a-row with blocked-ends). Rendering is a **Canvas 2D** viewport with pan and pinch-zoom. **No coins, no diamonds, no `completeGameV2`.**

## Decisions

| Topic | Choice |
|-------|--------|
| Route | `/games-v2/caro` |
| Hub card | `id: "caro"`, name **Caro**, rewards **0 / 0** |
| Players | Same device, alternate X then O. X always starts. No bot, no online |
| Board | 50×50 cells |
| Win | Five or more consecutive same-player stones (horizontal, vertical, either diagonal). Six-or-longer still wins |
| Blocked ends | A run of **exactly five** does **not** win if **both** ends are blocked (opponent stone or off-board). A run of **six or more** wins even if both ends are blocked |
| Draw | Board full and no winning run |
| Viewport | Start centered; one-finger pan; pinch zoom; short tap on empty cell places a stone |
| Undo | One last move, only while the game is still in `playing`. Disabled after win/draw |
| New game | Confirm with existing Radix `AlertDialog` |
| Rewards | `coinReward: 0`, `diamondReward: 0`. Hook must **not** call `completeGameV2` |
| Thumbnail | Omit `thumbnailSrc` so the hub card uses the existing pond-gradient placeholder, unless a cover image already exists in repo |
| Out of scope | Pixi, vocabulary/audio, network play, AI, unlimited undo, `ActivityEndShell` rewards, new cover art |

## Approach

**Chosen: Canvas 2D viewport (Approach 1)**

- React owns chrome (header, undo, new game, win overlay, `CourseBottomNav`).
- One `<canvas>` draws grid + stones; pointer math maps screen → cell.
- Pure lib owns board, place, undo, win/draw. Hook owns React state.

Rejected alternatives:

- **2500 DOM cells** — pan/zoom on 2500 nodes is janky on phones.
- **PixiJS** — already used for arcade games; extra weight for a grid.

## Architecture

```
src/App.tsx                                 Route /games-v2/caro
src/data/gamesV2.ts                         Catalog entry caro (0/0)
src/lib/caro.ts                             Board, place, undo, win/draw
src/lib/caro.test.ts                        assert() script
src/hooks/useCaroSession.ts                 Playing state, no rewards
src/pages/CaroGamePage.tsx                  Shell + overlay + nav
src/components/games-v2/caro/CaroBoardCanvas.tsx
```

`GamesV2Page` already maps `gamesV2`; hub layout unchanged beyond the new card.

`onGameV2Complete` / `gameV2Reward.test.ts`: **no** caro reward case required. Optional assert that catalog `caro` has 0/0 if a test already iterates all games; do not teach the reward helper to special-case caro.

### Boundaries

- **Pure lib:** 50×50 grid, moves, win-line, draw. No React, no canvas, no progress context.
- **Hook:** session only (`board`, `turn`, `status`, `winLine`, `place`, `undo`, `restart`).
- **Canvas:** camera (pan/zoom), hit-test, draw. Calls `onPlace(row, col)` for taps; does not mutate rules.
- **Page:** labels, buttons, dialog, overlay.

### Data flow

```text
empty 50×50, turn = X, status = playing
  → canvas tap empty cell → place(row, col)
  → if occupied / not playing: ignore
  → after place: win check around that cell only
  → win → status = won, store winLine, freeze place/undo
  → no win and board full → status = draw
  → else flip turn
  → undo (playing only): remove last stone, restore previous turn
  → restart after confirm: empty board, X to move
```

## Data structures

```ts
export const CARO_SIZE = 50;

export type CaroPlayer = "X" | "O";
export type CaroCell = CaroPlayer | null;

export type CaroStatus = "playing" | "won" | "draw";

export type CaroPoint = { row: number; col: number };

export type CaroState = {
  /** row-major, length CARO_SIZE; each row length CARO_SIZE */
  board: CaroCell[][];
  turn: CaroPlayer;
  status: CaroStatus;
  /** Consecutive stones of the winning run; empty unless status === "won" */
  winLine: CaroPoint[];
  /** At most one entry while playing; used by undo */
  lastMove: CaroPoint | null;
};
```

Use a dense `CaroCell[][]`. 2500 cells is cheap; skip a sparse `Map` so tests and win scans stay simple.

`place(state, row, col): CaroState` is a pure function (or equivalent helpers that return a new state). Invalid inputs return the same state.

`GameV2` catalog entry:

```ts
{
  id: "caro",
  name: "Caro",
  path: "/games-v2/caro",
  coinReward: 0,
  diamondReward: 0,
}
```

## Win rule (normative)

After placing a stone at `P` for player `S`, for each of four axes (horizontal, vertical, two diagonals):

1. Count the contiguous run of `S` through `P` on that axis. Let `run` be those cells in order, length `n`.
2. Let `before` / `after` be the two cells immediately outside `run` (or “off-board” if the neighbor is outside `0..49`).
3. A cell is **blocked** if it is off-board or occupied by the opponent.
4. If `n >= 6`: this axis wins. `winLine = run`.
5. If `n === 5` and **not** (before blocked **and** after blocked): this axis wins. `winLine = run`.
6. If `n === 5` and both ends blocked: this axis does not win.
7. If `n < 5`: this axis does not win.

First winning axis found is enough. `winLine` is that `run` (highlight those stones). Do not scan the whole board; only axes through `P`.

Draw: every cell non-null and `status` still `playing` after the win check.

## UI

- Full-height page, same sky-gradient + optional map background pattern as other Games V2 pages, `CourseBottomNav`.
- Header: current turn (`X` / `O`) while playing; “X wins” / “O wins” / “Draw” when finished.
- **Undo:** enabled only if `status === "playing"` and `lastMove !== null`.
- **New game:** always available; `AlertDialog` confirm before `restart`.
- **Back to games:** link to `/games-v2`.
- Win/draw: lightweight overlay (not `ActivityEndShell`). Primary action: New game. Secondary: Back to games. Winning stones highlighted on canvas.
- No English word prompts, no volume button, no reward toast.

### Canvas camera

- Default camera: board center; zoom so roughly 12–16 cells fit the shorter viewport side (tap targets usable). Exact default zoom may be tuned in implementation.
- One finger / mouse drag: pan. Clamp so some board always stays in view (do not pan into empty void).
- Pinch (two touches) and ctrl/trackpad wheel: zoom. Clamp min (whole board roughly visible) and max (about 4–6 cells across).
- Pointer down + little movement + up = **tap**. Movement beyond a small pixel threshold = **pan**, not a place.
- `devicePixelRatio` for crisp lines.
- Occupied cell tap: no-op (do not steal pan).

## Session

`useCaroSession`:

- Holds `CaroState`.
- `place` / `undo` / `restart` wrap the lib.
- Does **not** import `useUserProgress` or call `completeGameV2`.
- `restart` is synchronous after the page confirms the dialog.

## Error handling

- Tap outside the grid: ignore.
- `place` on occupied cell or when `status !== "playing"`: ignore.
- Undo when no `lastMove` or not playing: ignore.
- Zoom/pan past clamps: snap to clamp.
- New game without confirm: do not reset.
- Resize / rotate: canvas CSS size follows container; camera stays valid (recompute canvas buffer, keep logical pan/zoom).

## Testing

`npx tsx src/lib/caro.test.ts`:

- Five in a row wins: horizontal, vertical, both diagonals.
- Six-or-more wins, including both ends blocked.
- Exactly five with opponent stones on **both** sides: **not** a win.
- Exactly five on the board edge (one end off-board) and the other end opponent: **not** a win (both ends blocked).
- Exactly five with **at least one** end empty: win (including five on the edge with the inner neighbor empty).
- `place` on occupied cell leaves state unchanged.
- Undo restores empty cell and previous turn.
- After win, `place` and `undo` leave state unchanged.
- Fill board without a legal five: draw.

`npm run lint` after implementation.

No Jest/Vitest. No canvas/pointer test scripts.

## Out of scope

- PixiJS
- English vocabulary, images, or audio
- Online / two-device play
- Bot / AI
- Unlimited undo or redo stack
- Rewards, `completeGameV2`, `ActivityEndShell`
- Dedicated cover illustration (unless already in repo)
- Extra forbidden-move rules (renju, three-three, etc.) beyond blocked-ends as specified
