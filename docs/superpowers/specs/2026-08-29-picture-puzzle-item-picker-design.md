# Picture Puzzle — Item Picker (Right Rail)

**Date:** 2026-08-29  
**Status:** Approved (brainstorming session)

## Summary

On `/games-v2/picture-puzzle`, show the full `picturePuzzleItems` list so the child can pick which picture to assemble. Desktop: a **sticky column on the right**. Mobile: a **horizontal scroll strip** under the word header and above the board. Switching mid-puzzle with tiles on the board requires **confirm**; an empty board switches immediately. Thumbnails are **image-only** with a selected ring/check; the English word stays on the playfield header, not on the list.

This extends the existing Picture Puzzle game. It does not change rewards, tile drag rules, or the standalone vocabulary file schema.

## Decisions

| Topic | Choice |
|-------|--------|
| Architecture | `selectItem` on `usePicturePuzzleSession` + `PicturePuzzleItemPicker` component |
| Catalog | Existing `picturePuzzleItems` (no schema change, no `courseUnits`) |
| Desktop | Sticky right rail (~7–8rem), vertical scroll if the list is long |
| Mobile (`md` and below) | Horizontal scroll strip below word + volume, above the 3×3 board |
| Thumbnail | Image only; ring/check on the active item; `aria-label` = word |
| Same item tap | No-op |
| Empty board | Switch immediately (reset puzzle, new audio, no reward) |
| Board has ≥1 tile | Confirm dialog, then same reset path |
| Confirm copy | Title **Switch picture?** Body **You will lose this puzzle.** **Cancel** / **Switch** |
| Summary overlay | Picker **disabled** while `sessionPhase === "summary"` |
| Play again | Unchanged: still **random** `nextItem()` |
| Rewards | Unchanged: `completeGameV2` only on solve; abandoning a puzzle awards nothing |
| Dialog | New Radix Dialog wrapper under `src/components/ui/` (none exists yet besides `Progress`) |
| Out of scope | Pixi, word labels on the list, mobile sheet, `?item=` URLs, reward changes, course runtime data |

## Approach

**Chosen: Hook `selectItem` + picker component (Approach 1)**

- Session hook owns item identity, pending confirm id, and board reset.
- Presentational picker only renders buttons and selected state.
- Page owns layout (rail vs strip) and wires confirm dialog.

Rejected:

- **Page-only pending state** — switch rules live in UI, harder to test.
- **Query `?item=`** — shareable URLs are unused here and fight overlay/confirm.

## Architecture

```
src/lib/picturePuzzle.ts                       + hasBoardProgress (pure)
src/lib/picturePuzzle.test.ts                  asserts for progress + switch rules
src/hooks/usePicturePuzzleSession.ts           items, selectItem, pendingSelectId, confirm/cancel
src/components/games-v2/picture-puzzle/        PicturePuzzleItemPicker
src/components/ui/Dialog.tsx                   Radix AlertDialog or Dialog wrapper
src/pages/PicturePuzzleGamePage.tsx            layout + dialog + disable picker on summary
```

Reuse without changing:

```
src/data/picturePuzzleGame.ts                  same items
src/lib/picturePuzzle.ts                       createPuzzle / applyDrag / isSolved (existing)
src/components/games-v2/picture-puzzle/PicturePuzzlePlayfield.tsx
```

### Boundaries

- **Pure lib:** `hasBoardProgress(board)` is `board.some((cell) => cell !== null)`. Optional `shouldConfirmSwitch({ board, fromId, toId })`: false if `fromId === toId` or no progress; true if progress and different id.
- **Hook:** `selectItem(id)` looks up `picturePuzzleItems`. Unknown id → no-op. Applies confirm vs immediate switch. Confirm path does **not** call `completeGameV2`. Applying a switch always `createPuzzle()`, resets `awardedRef` / `reward` / `runIdRef` like a new run, stops audio, bumps `runCounter` so auto-play runs.
- **Picker:** no session logic. Props: `items`, `selectedId`, `disabled`, `onSelect(id)`.
- **Page:** `md+` flex row (playfield left, sticky picker right); below `md` column with strip then playfield. Dialog open when `pendingSelectId` is set.

### Data flow

```text
picturePuzzleItems (all)
  → picker thumbnails
tap id
  → same as item.id → no-op
  → no board progress → applySwitch(id)
  → has progress → pendingSelectId = id → dialog
       Cancel → pendingSelectId = null
       Switch → applySwitch(pendingSelectId)
applySwitch
  → setItem, createPuzzle(), clear pending, reset award flags, stop audio, runCounter++
  → auto playCourseAudio for new item
```

Empty catalog: existing “No puzzle words yet.” — no picker.

## Layout

- Header (word + `IconVolumeButton`) stays centered above the playfield column.
- Desktop: playfield + tray keep current stacking; picker `sticky` in the right column so it stays on screen while the tray is in view.
- Mobile: picker is a single row, `overflow-x-auto`, square thumbs, no right column.
- Selected thumb: visible ring (and optional check overlay). Unselected: no word text.
- Broken image: `object-cover` on a slate background; playfield tiles unchanged.

## Confirm dialog

- English copy as in Decisions.
- Focus trap, Escape = Cancel.
- Open only for a pending different item while the board has progress (including a solved board if the summary overlay is not up — if summary is up, picker is disabled so this path does not run).

## Accessibility

- Each thumb is a `button` with `aria-label` equal to `item.word`.
- Active item: `aria-pressed` or `aria-current="true"`.
- Picker `disabled` (no pointer, `aria-disabled`) during summary overlay so clicks do not go through the end screen.
- Keyboard: Tab through thumbs, Enter/Space to select.

## Error handling

- Unknown `selectItem` id: no-op.
- Empty `picturePuzzleItems`: empty state, no picker.
- Failed thumbnail load: decorative fallback background; game still playable from the playfield.

## Testing

Standalone `npx tsx src/lib/picturePuzzle.test.ts`:

- `hasBoardProgress`: empty board false; one placed tile true.
- `shouldConfirmSwitch` (if extracted): same id false; empty board different id false; occupied board different id true.

No Jest/Vitest. Typecheck via `npm run lint`. Manual: desktop rail, mobile strip, empty-board switch, confirm-then-switch, cancel, summary disables picker, Play again still random.

## Out of scope

Pixi, labels on the picker, bottom sheet on mobile, URL-selected items, changing coin/diamond amounts, importing course units, lock-correct tiles, full-image preview.
