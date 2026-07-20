# Hungry Dog Progress Bar — Replace @pixi/ui with Tailwind

**Date:** 2026-07-20  
**Status:** Approved (brainstorming session)

## Summary

Remove `@pixi/ui` from Hungry Dog by moving lesson progress out of the Pixi canvas into a React HUD that reuses `McProgressHeader` (Radix `Progress` + Tailwind). Pixi keeps puppy, word cards, and FX only.

## Decisions

| Topic | Choice |
|-------|--------|
| UI library | Reuse `McProgressHeader` / Radix `Progress` (Approach C + 1) |
| Placement | React overlay on `HungryDogGamePage` (top-left), not inside Pixi stage |
| Pixi progress | Delete `progressBar.ts`; strip progress from `HungryDogPixiStage` |
| Dependency | Uninstall `@pixi/ui` (sole consumer was Hungry Dog) |
| Out of scope | Fishing, redesigning `McProgressHeader`, new shared HUD component |

## Approach

**Recommended: Page overlay with `McProgressHeader`**

- `HungryDogGamePage` renders progress next to existing coin/prompt HUD
- Stage props no longer include `correctCount` / `targetsNeeded`
- Progress updates via normal React re-render when the session advances

Rejected alternatives:

- **Hungry Dog–only wrapper around `Progress`** — game-specific styling, but duplicates the practice header pattern
- **DOM sibling inside `HungryDogPixiStage` host** — keeps progress near stage code but mixes HUD into the Pixi mount

## Architecture

```
HungryDogGamePage (playing)
  ├── McProgressHeader (top-left)     ← correctCount / targetsNeeded
  ├── word prompt button (center)
  ├── coin HUD (top-right)
  └── HungryDogPixiStage             ← puppy + cards + FX only
```

### Boundaries

- **React:** lesson progress label/bar, coins, prompt image, end screen
- **Pixi:** puppy animation, word-card drag/drop, VFX
- **No @pixi/ui:** canvas UI widgets removed for this game

### Data flow

```text
useHungryDogSession
  → lesson.correctCount, targetsNeeded
  → HungryDogGamePage → McProgressHeader(current, total)
  → HungryDogPixiStage (no progress props)
```

## File changes

| File | Change |
|------|--------|
| `src/pages/HungryDogGamePage.tsx` | Import `McProgressHeader`; absolute top-left overlay while `lesson.status === "playing"` |
| `src/components/games-v2/hungry-dog/HungryDogPixiStage.tsx` | Remove progress import, refs, props, create/layout/setProgress |
| `src/components/games-v2/hungry-dog/progressBar.ts` | Delete |
| `package.json` (+ lockfile) | Remove `@pixi/ui` |

## Placement details

- Container: `absolute top-10 left-10 z-10` with width ~`w-44`–`w-52`
- Avoid overlap with centered word prompt (`w-[200px]` at `top-10`)
- Use `McProgressHeader` as-is (emerald bar + `current/total`); no `trailing` slot
- Visible only during `lesson.status === "playing"`

## Testing

- Manual: start Hungry Dog, confirm bar shows `0/5` (or current targets), advances on correct drops, disappears on end screen
- `npm run lint` after edits
- Grep confirms no remaining `@pixi/ui` imports
