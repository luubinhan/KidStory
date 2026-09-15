# Letter Crane Pac-Man Eye — Design Spec

**Date:** 2026-09-15  
**Status:** Approved (brainstorming session)

## Summary

Add **one eye** to the Letter Crane Pac-Man `Graphics` pie: white sclera + black pupil. The eye is drawn in local space (mouth faces +X) so `hook.rotation` already aims it with the body. Gameplay is unchanged.

## Decisions

| Topic | Choice |
|-------|--------|
| Look | Approach B: white sclera + black pupil (not a single black dot) |
| Count | One eye |
| Draw | Approach A: extra `circle`s inside `drawPacman` after the pie |
| Blink | No |
| Scope | `CranePixiStage.tsx` only (`drawPacman`) |
| Out of scope | Second eye, blink, `cut()` pupil, grab/grid/reward changes |

## Drawing (normative)

`r` = Pac-Man radius (`PAC_RADIUS`). After the yellow pie fill/stroke:

```ts
g.circle(-r * 0.18, -r * 0.42, r * 0.18).fill({ color: 0xffffff });
g.circle(r * 0.04, -r * 0.42, r * 0.09).fill({ color: 0x1e293b });
```

- Sclera: `0xffffff`, center `(-r*0.18, -r*0.42)`, radius `r*0.18`
- Pupil: `0x1e293b`, center `(+r*0.04, -r*0.42)`, radius `r*0.09` (offset toward the mouth)

Redraw on every `drawPacman` call (idle + chomp). `clear()` already wipes the previous eye.

Do not use `cut()` for the pupil.

## Architecture

No new files. `drawPacman` stays the only draw helper. `facingFromKey`, `MOVE_MS`, grab, and grid stay as they are.

## Testing

`npx tsx src/lib/crane/craneSession.test.ts` + `npm run lint`. No new Pixi tests. Browser: eye visible, stays on the upper side of the body as facing changes.

## Out of scope

- Two eyes
- Blink
- Sprite swap (still later, when art exists)
- Session / reward changes
