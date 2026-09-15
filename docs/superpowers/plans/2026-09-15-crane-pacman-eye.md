# Letter Crane Pac-Man Eye Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Draw one white-sclera + black-pupil eye on the Letter Crane Pac-Man `Graphics` pie.

**Architecture:** Extend `drawPacman` in `CranePixiStage.tsx` with two `circle` fills after the yellow pie. Local coordinates (mouth +X) so existing `hook.rotation` aims the eye. No new files, no `cut()`, no blink.

**Tech Stack:** React 19, PixiJS v8 `Graphics.circle` + `fill`

**Spec:** `docs/superpowers/specs/2026-09-15-crane-pacman-eye-design.md`

## Global Constraints

- Change `src/components/games-v2/crane/CranePixiStage.tsx` only
- One eye: sclera `0xffffff` at `(-r*0.18, -r*0.42)` radius `r*0.18`; pupil `0x1e293b` at `(r*0.04, -r*0.42)` radius `r*0.09`
- Draw after the pie fill/stroke; do not use `cut()`
- No blink; redraw happens because `drawPacman` already `clear()`s
- Do not change grab, grid, slots, facing, chomp, or rewards
- Tests: `npx tsx src/lib/crane/craneSession.test.ts` + `npm run lint`
- Do not run Snyk

---

## File map

| File | Responsibility |
|------|----------------|
| `src/components/games-v2/crane/CranePixiStage.tsx` | `drawPacman` eye circles |

---

### Task 1: Draw sclera + pupil

**Files:**
- Modify: `src/components/games-v2/crane/CranePixiStage.tsx`

**Interfaces:**
- Consumes: existing `drawPacman(g: Graphics, radius: number, mouthHalf: number): void`
- Produces: same signature; extra two circles after the pie

- [ ] **Step 1: Add eye circles to `drawPacman`**

Replace `drawPacman` with:

```ts
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
```

Do not add a second `Graphics` child. Do not change `step`, `tick`, or `snapHook`.

- [ ] **Step 2: Session test + lint**

Run:

```bash
npx tsx src/lib/crane/craneSession.test.ts
npm run lint
```

Expected: `craneSession.test.ts: ok` and `tsc --noEmit` exit 0.

- [ ] **Step 3: Browser check**

Open `/games-v2/crane`. Confirm one white eye with a dark pupil on the Pac-Man body (upper side when facing right). Arrow steps: eye rotates with the body. Grab still works. No console errors from this change.

- [ ] **Step 4: Commit**

```bash
git add src/components/games-v2/crane/CranePixiStage.tsx
git commit -m "feat: draw Pac-Man eye for Letter Crane"
```

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| White sclera + black pupil | 1 |
| One eye, local coords | 1 |
| Circles after pie, no `cut()` | 1 |
| No blink | 1 (omitted) |
| Grab/grid unchanged | 1 |
| Session test + lint | 1 |
