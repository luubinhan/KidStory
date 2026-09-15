# Letter Crane Pac-Man Visual — Design Spec

**Date:** 2026-09-15  
**Status:** Approved (brainstorming session)

## Summary

Replace the Letter Crane hanging-bar graphic with a **yellow Pac-Man circle**. Mouth **chomps** on each grid step and the body **rotates** to face the move direction. Gameplay (grid, grab-next-letter, empty slots, 10 diamonds) is unchanged. A later sprite from the author can replace the `Graphics` body without changing session logic.

## Decisions

| Topic | Choice |
|-------|--------|
| Placeholder | Approach A: Pixi `Graphics` Pac-Man (yellow, mouth to the right) |
| Facing | Rotate `hook` Container: right `0`, down `π/2`, left `π`, up `-π/2` |
| Mouth | Chomp each step: open ↔ close over `MOVE_MS` via `sin(t * π)` |
| Idle | Slight open mouth (`~0.25` rad), last facing kept |
| Stretch/tilt | Remove the old bar squash/rotation |
| Sprite later | Optional `src/assets/games/crane-pacman.png` (or sheet). If present, `Sprite` + `anchor 0.5` + same `rotation`. If absent, Graphics |
| Scope | `CranePixiStage.tsx` only |
| Out of scope | New session rules, new rewards, on-screen D-pad, 4-direction sprite sheet (until provided) |

## Approach

**Chosen: Graphics Pac-Man (Approach A)**

- Draw a pie (arc from `+mouth` to `2π - mouth`, close at origin) filled `#ffcc00` / `0xffcc00`.
- Do **not** use `cut()` for the mouth: `cut()` holes must sit fully inside the fill; a mouth that opens to the rim will render wrong.
- Redraw `Graphics` each chomp frame (or `clear()` + redraw). Cheap for one actor.

Rejected:

- Two-frame swap — choppy
- `AnimatedSprite` now — no art yet

## Architecture

No new files required for the placeholder. Optional later:

```
src/assets/games/crane-pacman.png   Author-supplied; Vite import when added
src/components/games-v2/crane/CranePixiStage.tsx   Only file that changes now
```

`hook` Container stays the actor: position = cell center, `zIndex` 3. Child is either `Graphics` or `Sprite`.

### Data flow

```text
arrow key → step() sets next cell + moveTween + facing
ticker:
  lerp hook x/y (easeOutQuad, MOVE_MS)
  mouthHalf = 0.1 + 0.6 * sin(t * π)
  redraw Pac-Man pie
  hook.rotation = facing
  t >= 1 → tryGrab (unchanged)
```

Facing updates at `step()` start from the arrow, not from lerp.

## Drawing (normative)

Radius ≈ `CELL * 0.38` so the body sits inside one cell.

```ts
function drawPacman(g: Graphics, radius: number, mouthHalf: number): void {
  g.clear();
  g.moveTo(0, 0)
    .arc(0, 0, radius, mouthHalf, Math.PI * 2 - mouthHalf)
    .closePath()
    .fill({ color: 0xffcc00 })
    .stroke({ width: 2, color: 0xeab308, alignment: 1 });
}
```

`mouthHalf` idle `0.25`. During move: `0.1 + 0.6 * Math.sin(t * Math.PI)` so it opens then closes once per step.

## Sprite swap (later)

When the author adds an image:

1. Vite-import `src/assets/games/crane-pacman.png`
2. `Assets.load` in stage setup
3. `Sprite` with `anchor.set(0.5)`, size ≈ `CELL * 0.85`
4. Hide or destroy the Graphics child
5. Keep Container `rotation` and move tween

Until that file exists, do not add a broken `Assets.load` of a missing URL.

Single image faces **right**. Four-direction sheet is out of scope until provided.

## Error handling

- Resize mid-move: existing `snapHook()` still cancels `moveTween` and snaps cell
- `clear()` before redraw so mouth does not stack
- Missing sprite file: Graphics path only

## Testing

Existing `npx tsx src/lib/crane/craneSession.test.ts` still passes. No new Pixi tests.

`npm run lint` after implementation.

## Out of scope

- Changing grab, hints, grid, rewards
- Ghosts, pellets, maze
- Author art in this change
- WASD / touch
