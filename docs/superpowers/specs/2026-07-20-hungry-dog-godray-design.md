# Hungry Dog — Ambient Godray Filter on Background

**Date:** 2026-07-20  
**Status:** Approved

## Summary

Add a subtle, always-on `GodrayFilter` from `pixi-filters` to the Hungry Dog background sprite only. Rays fan from the top-left of the screen so the scene feels sunlit without blurring the puppy or word cards.

## Decisions

| Topic | Choice |
|-------|--------|
| Target | Background sprite only (`dog-bg`) |
| Animation | Always on — advance `filter.time` every ticker frame |
| Light model | Non-parallel (`parallel: false`); focal `center` near top-left |
| Wiring | Inline in `HungryDogPixiStage.tsx` (Approach A) |
| Package | Existing `pixi-filters` (`GodrayFilter` from `pixi-filters/godray`) |
| Out of scope | Filtering puppy/cards, event-triggered rays, new helper module, fishing |

## Approach

**Recommended: Inline on BG in `HungryDogPixiStage`**

- After creating the BG sprite, assign `bg.filters = [godray]`
- Set `bg.filterArea` to the screen rect; update center + filterArea in `layout()`
- Tick `godray.time += 0.01 * ticker.deltaTime` for the session lifetime
- Destroy with the app (filter lives on the sprite; ticker callback removed on teardown)

Rejected alternatives:

- **`godrayAtmosphere.ts` helper** — cleaner reuse later, but overkill for one consumer
- **Fold into `fxSystem.ts`** — that module is event-driven (correct/wrong/coins); ambient atmosphere does not fit

## Visual params (starting defaults)

| Option | Value | Notes |
|--------|-------|-------|
| `parallel` | `false` | Fan from focal point |
| `center` | `{ x: w * 0.05, y: h * 0.02 }` | Top-left of page; refresh on resize |
| `gain` | `0.35` | Soft intensity |
| `alpha` | `0.45` | Keep BG readable |
| `lacunarity` | `2.5` | Default ray density |
| `time` step | `0.01 * deltaTime` | Slow drift |

Tune after visual check if rays are too strong or too faint.

## Architecture

```
HungryDogPixiStage
  └── bg (Sprite, zIndex -1)
        filters: [GodrayFilter]   ← top-left fan, ticker.time
  └── puppy / word cards / FX     ← unfiltered
```

### Resize

On each `layout()`:

1. Size BG to `app.screen`
2. `bg.filterArea = new Rectangle(0, 0, w, h)` (avoid per-frame bounds walk)
3. `godray.center = { x: w * 0.05, y: h * 0.02 }`

### Teardown

- Remove the godray ticker callback before `app.destroy`
- Sprite destroy with stage children clears the filter reference

## File changes

| File | Change |
|------|--------|
| `HungryDogPixiStage.tsx` | Import `GodrayFilter` + `Rectangle`; create filter; ticker; layout updates; cleanup |

No new files. No `package.json` change (`pixi-filters` already present).

## Success criteria

- Godrays visible on BG, originating from top-left, gently animated while playing
- Puppy and word cards remain sharp and interactive
- Resize keeps rays anchored to top-left; no filter thrashing / missing filterArea
- Stage dispose removes ticker without leaks

## Spec self-review

- No placeholders or TBD params left unresolved (defaults listed; tuning allowed post-ship)
- Scope limited to Hungry Dog BG ambient filter
- Consistent with fishing’s `pixi-filters/{name}` import style
