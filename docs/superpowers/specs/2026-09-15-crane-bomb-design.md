# Letter Crane Bomb Hazard — Design Spec

**Date:** 2026-09-15  
**Status:** Approved (brainstorming session)

## Summary

Add a **visible bomb hazard** to Letter Crane. Three `bom.png` sprites sit on random free grid cells. If Pac-Man **lands** on a bomb cell, the round **fails immediately**: overlay **Boom!**, Play again / Back to games, **no diamonds**. Grab, win reward, and Pac-Man motion stay as they are.

## Decisions

| Topic | Choice |
|-------|--------|
| Count | Fixed **3** bombs per round (`CRANE_ROUND.bombCount`) |
| Art | `src/assets/games/bom.png` via Vite import + Pixi `Assets.load` |
| Placement | Random free cells; never spawn `0,0`; never share a cell with a letter |
| Hit | After `MOVE_MS` tween ends, if `hookCol,hookRow` is a bomb cell |
| Session | New status `"failed"` via `applyBoom` / `onBoom` |
| Fail UI | Same overlay chrome as win; `ActivityEndShell` with `reward={null}`; title **Boom!** |
| Reward | `completeGameV2` only on `"complete"` |
| Play again | New word (`createRound` + `stageKey++`), same as win |
| Approach | **A**: Pixi spawns bombs (knows grid); session only stores fail status |

Rejected:

- **B** — Boom text inside Pixi: diverges from the React win shell
- **C** — Bomb cells on `CraneState.round`: lib does not know `cols/rows` (`makeGrid` uses the window)

## Approach

**Chosen: `failed` status + `onBoom` (Approach A)**

- Pure lib: `applyBoom(playing) → failed`; no-op otherwise. No grid math.
- Hook: `onBoom` → `applyBoom`. Award path unchanged (complete only).
- Pixi: load texture, place 3 sprites, check cell after move tween, call `onBoom`, skip `tryGrab`.
- Page: fail overlay; `enabled={playing}` already locks input when not playing.

## Architecture

```
src/assets/games/bom.png                         Bomb sprite (already in repo)
src/types/crane.ts                               CraneStatus + "failed"; bombCount: 3
src/lib/crane/craneSession.ts                    applyBoom
src/lib/crane/craneSession.test.ts               fail / no-op cases
src/hooks/useCraneSession.ts                     onBoom
src/components/games-v2/crane/CranePixiStage.tsx Load, place, hit, onBoom
src/pages/CraneGamePage.tsx                      Boom overlay
```

### Boundaries

- **Pure lib:** status transition only. Does not pick cells or load textures.
- **Hook:** session state. Does not award on fail. Does not know bomb positions.
- **Pixi:** spawn, draw, hit. Calls `onBoom()` once per round when Pac-Man lands on a bomb.
- **Page:** overlay copy and restart remount.

### Data flow

```text
placeLettersOnGrid
  occupied = spawn 0,0 + letter cells
  shuffle remaining cells → first bombCount (3)
  Sprite per bomb: Assets-loaded bom.png, anchor 0.5, size ~ CELL * 0.7, zIndex 2

arrow → step() moveTween MOVE_MS

ticker t >= 1:
  (hookCol, hookRow) in bombs?
    yes → busy = true; onBoom(); return
    no  → tryGrab() (unchanged)

enabled=false (status !== playing) → keys ignored
restart → createRound (new word) + stageKey++ → new letters, new bombs
```

Hit runs **after** the walk tween so Pac-Man is visibly on the bomb cell. Do not fail on keydown.

Resize: clamp bomb `col/row` like letters; **do not** re-roll positions.

A 4×4 grid with spawn + at most 8 letters always has ≥ 7 free cells, so 3 bombs always fit. If free cells were ever fewer than 3, place `min(bombCount, free.length)`.

## Asset load (PixiJS v8)

```ts
import bombUrl from "../../../assets/games/bom.png";

const texture = await Assets.load(bombUrl);
const sprite = new Sprite(texture);
sprite.anchor.set(0.5);
sprite.width = CELL * 0.7;
sprite.height = CELL * 0.7;
```

- Use `Assets.load`, not `Texture.from(url)` (v8 cache-only; does not fetch).
- URL has `.png`; do not set `parser`.
- Do **not** `Assets.unload` the bomb on stage destroy: `Assets` is a process singleton; remount hits cache.
- Load failure: retry once via `LoadOptions` (`strategy: "retry"`, `retryCount: 1`). If it still fails, place **zero** bombs this round (no invisible instadeath).

## Fail overlay

Reuse the win overlay wrapper (`absolute inset-0 z-20` + `ActivityEndShell`). Pass `reward={null}` so there is no confetti, celebration SFX, or diamond row.

Copy: heading **Boom!** Buttons: **Play again**, **Back to games** (`/games-v2`). Same `handleRestart` as win.

Diamond HUD stays behind `playing` and therefore hides on fail.

## Error handling

- `onBoom` while `busy` or already not `playing`: stage still sets `busy` and returns; `applyBoom` is a no-op if status is not `playing`.
- Mid-tween resize: existing `snapHook()` cancels `moveTween`; if the snapped cell is a bomb, the next completed step still hits. Do not fail inside `layout()`.
- `applyGrab` / `applyBoom` ignore non-`playing` state.

## Testing

`npx tsx src/lib/crane/craneSession.test.ts`:

- `applyBoom(playing)` → `status === "failed"`, slots unchanged
- `applyBoom(complete)` and `applyBoom(failed)` → no-op
- `applyGrab` while `failed` → no-op

`src/lib/gameV2Reward.test.ts` unchanged: complete still awards 0 coins / 10 diamonds.

`npm run lint` after implementation. No Pixi unit tests.

## Out of scope

- Explosion SFX, particle burst, screen shake
- Moving, hidden, or collectible bombs
- Lives / second chances
- On-screen D-pad, WASD
- Changing diamond reward or win path
- Putting bomb coordinates on `CraneState`
