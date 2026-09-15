# Letter Crane Pac-Man Visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hanging-bar actor in Letter Crane with a yellow Pac-Man `Graphics` pie that chomps and faces each grid step.

**Architecture:** Keep `hook` as a `Container` at the cell center. Swap the `roundRect` child for a `Graphics` pie redrawn each frame during `moveTween`. Set `hook.rotation` from the arrow at `step()`. Do not load a sprite file that does not exist yet.

**Tech Stack:** React 19, PixiJS v8 `Graphics` (`moveTo` / `arc` / `closePath` / `fill`), existing `CranePixiStage` ticker

**Spec:** `docs/superpowers/specs/2026-09-15-crane-pacman-design.md`

## Global Constraints

- Change `src/components/games-v2/crane/CranePixiStage.tsx` only
- Do not use `cut()` for the mouth (rim hole will not render)
- Facing: right `0`, down `π/2`, left `π`, up `-π/2`
- Idle `mouthHalf = 0.25`; during move `0.1 + 0.6 * Math.sin(t * Math.PI)`
- Radius `CELL * 0.38`; fill `0xffcc00`; stroke `0xeab308` width `2`
- Remove bar squash/tilt (`hook.scale` stay `1`)
- Do not `Assets.load` a missing `crane-pacman.png`
- Do not change grab, grid, slots, or rewards
- Tests: `npx tsx src/lib/crane/craneSession.test.ts` + `npm run lint`
- Do not run Snyk

---

## File map

| File | Responsibility |
|------|----------------|
| `src/components/games-v2/crane/CranePixiStage.tsx` | Pac-Man draw, facing, chomp |

---

### Task 1: Pac-Man Graphics + chomp

**Files:**
- Modify: `src/components/games-v2/crane/CranePixiStage.tsx`

**Interfaces:**
- Consumes: existing `MOVE_MS`, `CELL`, `moveTween`, `step`, `tick`, `snapHook`
- Produces:

```ts
function drawPacman(g: Graphics, radius: number, mouthHalf: number): void;
function facingFromKey(key: string): number | null;
```

- [ ] **Step 1: Add draw helpers; drop bar constants**

Remove `BAR_W` and `BAR_H`. Add after `easeOutQuad`:

```ts
const PAC_RADIUS = CELL * 0.38;
const MOUTH_IDLE = 0.25;

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
}
```

- [ ] **Step 2: Track facing; snap without zeroing rotation**

Inside the `useEffect` setup, add `let facing = 0;` next to `hookCol`.

Replace `snapHook` so it does **not** set `hook.rotation = 0`. Keep `hook.scale.set(1)` and `moveTween = null`. After positioning, set `hook.rotation = facing` and `drawPacman(body, PAC_RADIUS, MOUTH_IDLE)` (see Step 3 for `body`).

- [ ] **Step 3: Replace the bar Graphics with Pac-Man**

Replace the `arm` block:

```ts
      const body = new Graphics();
      drawPacman(body, PAC_RADIUS, MOUTH_IDLE);
      hook.addChild(body);
      hook.zIndex = 3;
      hook.rotation = facing;
      app.stage.addChild(hook);
```

`body` must be in the same closure as `tick` / `snapHook`. Declare `const body = new Graphics();` near `const hook = new Container();` so helpers can redraw it, then `hook.addChild(body)` in setup (do not create a second Graphics).

- [ ] **Step 4: Face + chomp in `step` / `tick`**

In `step`, after computing `nextCol` / `nextRow` and **before** the same-cell return:

```ts
      const nextFacing = facingFromKey(key);
      if (nextFacing !== null) facing = nextFacing;
      hook.rotation = facing;
```

If the cell did not change, still keep the new facing and return (wall bump turns Pac-Man).

In the `moveTween` ticker branch, **delete** the `stretch` / `hook.scale` / `hook.rotation = dirX * …` block. Keep lerp. Add:

```ts
        hook.rotation = facing;
        drawPacman(body, PAC_RADIUS, 0.1 + 0.6 * Math.sin(t * Math.PI));
```

When `t >= 1`:

```ts
          hook.position.set(moveTween.endX, moveTween.endY);
          hook.scale.set(1);
          hook.rotation = facing;
          drawPacman(body, PAC_RADIUS, MOUTH_IDLE);
          moveTween = null;
          tryGrab();
```

Do not reset `hook.rotation` to `0`.

- [ ] **Step 5: Session test + lint**

Run:

```bash
npx tsx src/lib/crane/craneSession.test.ts
npm run lint
```

Expected: `craneSession.test.ts: ok` and `tsc --noEmit` exit 0.

- [ ] **Step 6: Browser check**

Open `/games-v2/crane`. Confirm yellow Pac-Man in a cell (not the long bar). Arrow steps: body slides one cell, mouth opens then closes, faces the arrow. Wall bump: faces that way, stays on cell. Land on next letter: still grabs. No console errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/games-v2/crane/CranePixiStage.tsx
git commit -m "feat: draw Pac-Man actor for Letter Crane"
```

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Graphics pie, no `cut()` | 1 |
| Facing map | 1 |
| Chomp `sin(t * π)` | 1 |
| Idle mouth 0.25 | 1 |
| Remove bar stretch | 1 |
| No missing sprite load | 1 (omitted) |
| Grab/grid unchanged | 1 |
| Session test + lint | 1 |
