# Picture Puzzle (Games V2) — Design Spec

**Date:** 2026-08-26  
**Status:** Approved (brainstorming session)

## Summary

Add a **Picture Puzzle** mini-game to Games V2. The child hears and sees one English word, then rebuilds that word’s picture from **9 tiles** (3×3). Vocabulary is a **fixed standalone list** (image + word + optional audio) — not read from `courseUnits` at runtime. One play is one puzzle. Completing the board awards **5 coins and 1 diamond** via `completeGameV2`. Drag-and-drop uses `@dnd-kit`. No Pixi.

## Decisions

| Topic | Choice |
|-------|--------|
| Route | `/games-v2/picture-puzzle` |
| Hub card | `id: "picture-puzzle"`, name **Picture Puzzle**, rewards **5 / 1** |
| Architecture | New V2 page + session hook + DOM tiles; `@dnd-kit` like spell/sentence strips |
| Vocabulary | Fixed list in `src/data/picturePuzzleGame.ts` (`id`, `word`, `image`, optional `audio`) |
| Seed | A few sample rows using existing repo image/MP3 URLs, copied into the file (no `courseUnits` import) |
| Round length | **One** random item, one 9-tile puzzle, then reward |
| Start layout | Empty 3×3 board; shuffled tiles in a tray |
| Placement | Free rearrange; swap occupied cells; return to tray; **no** snap-lock on correct tile |
| Win | Auto when all 9 slots hold the correct tile index (identity). No Check button |
| Hint | English word + `IconVolumeButton`; **auto-play** audio on puzzle start |
| Rewards | **5 coins / 1 diamond** from `gamesV2`; `onGameV2Complete` already reads catalog |
| Replay awards | Allowed (same as fishing / matching-pairs) |
| Thumbnail | Existing art (`IMAGES_ACTIVITIES.flashcards`) |
| Out of scope | Pixi, course runtime data, multi-puzzle lessons, Check button, lock-correct tiles, full-image preview before win, new cover art |

## Approach

**Chosen: HTML + `@dnd-kit` (Approach 1)**

- React page mirrors matching-pairs chrome (sky gradient, `CourseBottomNav`, `ActivityEndShell`).
- One image URL, nine tiles via CSS `background-size: 300%` and `background-position` from row/col.
- Pure lib owns shuffle, move/swap, and win check. Hook owns item pick, audio, and `completeGameV2`.

Rejected alternatives:

- **Pixi stage** — matches fishing/hungry-dog but heavy for a static 3×3 crop.
- **Custom pointer drag** — extra touch edge cases; repo already has `@dnd-kit` on spell/sentence.

## Architecture

```
src/App.tsx                                    Route /games-v2/picture-puzzle
src/data/gamesV2.ts                            Catalog entry picture-puzzle (5/1)
src/data/picturePuzzleGame.ts                  Standalone word list
src/lib/picturePuzzle.ts                       Shuffle, board/tray moves, isSolved
src/lib/picturePuzzle.test.ts                  assert() script
src/hooks/usePicturePuzzleSession.ts           Item, board, tray, audio, reward
src/pages/PicturePuzzleGamePage.tsx            Prompt + board + tray + empty + end
src/components/games-v2/picture-puzzle/        Tile, board, tray (dnd-kit)
src/lib/gameV2Reward.test.ts                   Extra assert for picture-puzzle rewards
```

Reuse without changing:

```
src/lib/playCourseAudio.ts
src/lib/userProgressLogic.ts                   onGameV2Complete / getGameV2
src/components/game-topic/IconVolumeButton.tsx
src/components/progress/ActivityEndShell.tsx
src/components/course/CourseBottomNav.tsx
```

### Boundaries

- **Data file:** static items only. Implementers may copy URL strings from course/public assets; must not import `courseUnits` or call course builders.
- **Pure lib:** permutation of tile ids `0..8`, tray as an ordered list of ids, board as `(number | null)[9]`. No React, no audio, no rewards.
- **Hook:** pick item, hold board/tray, play audio, award once per solved board.
- **Components:** render tiles and wire `DndContext`; call hook move helpers on drag end.

### Data flow

```text
picturePuzzleItems
  → pick one at random (empty list → empty state)
  → tiles 0..8 from item.image (row-major)
  → shuffle into tray; board = nine nulls
  → auto playCourseAudio(item.audio, item.word)
  → drag: tray↔slot, slot↔slot (swap), slot→tray
  → isSolved(board) → completeGameV2("picture-puzzle") once
  → delay ~400ms → ActivityEndShell (Play again / Back to games)
```

## Data structures

```ts
type PicturePuzzleItem = {
  id: string;
  word: string;
  image: string;
  audio?: string;
};

export const picturePuzzleItems: readonly PicturePuzzleItem[];
```

Tile index `i` (`0..8`): `row = Math.floor(i / 3)`, `col = i % 3`.  
CSS: `background-image: url(image)`, `background-size: 300% 300%`,  
`background-position: ${col * 50}% ${row * 50}%`.

`GameV2` catalog entry:

```ts
{
  id: "picture-puzzle",
  name: "Picture Puzzle",
  path: "/games-v2/picture-puzzle",
  coinReward: 5,
  diamondReward: 1,
  thumbnailSrc: IMAGES_ACTIVITIES.flashcards,
}
```

`GamesV2Page` already maps `gamesV2`; hub layout unchanged beyond the new card.

Seed **at least 3** items with non-empty `image`. Prefer words that already have `public/sounds/<word>.mp3` so `audio` can be set; if no file, omit `audio` and rely on TTS.

## UI

- Full-height page, sky gradient (flashcards / matching map art optional as background), `CourseBottomNav`.
- Prompt: large English `word` + `IconVolumeButton` (replay). No Vietnamese translation on this pass.
- Board: 3×3 square grid. Empty slots: dashed border. No assembled-image preview until the puzzle is solved (solved state is the filled board itself).
- Tray: wrapping row of remaining tiles under the board.
- Drag: `@dnd-kit` `PointerSensor` + `TouchSensor`; snap to slot/tray, not free-pixel drop.
- Win: ~400ms, then overlay with `ActivityEndShell`. **Play again** picks a new random item (may repeat), resets board/tray, auto-plays audio, clears award-once flag. **Back to games** → `/games-v2`.
- Empty: if `picturePuzzleItems.length === 0`, friendly message. Do not start a session.

## Drag rules

| From | To | Result |
|------|----|--------|
| Tray | Empty slot | Tile leaves tray, fills slot |
| Tray | Occupied slot | Incoming tile takes slot; previous tile returns to tray |
| Slot | Empty slot | Tile moves |
| Slot | Occupied slot | Tiles swap |
| Slot | Tray | Tile returns to tray; slot becomes empty |

Same tile id stays on the piece for the whole puzzle. Win only when `board[i] === i` for all `i` and no `null`.

## Session + audio + rewards

`usePicturePuzzleSession` follows matching-pairs:

- `awardedRef` + run id so `completeGameV2("picture-puzzle")` fires once per solved board.
- On mount / new item: `stopAudio` then `void playCourseAudio(audio, word, audioRef, stopAudio)`.
- Volume button repeats the same call.
- Cleanup `stopAudio` on unmount and when changing item.
- Replay increments run id, clears reward, picks next item.

`onGameV2Complete` needs no logic change. Add an assert in `gameV2Reward.test.ts` that `picture-puzzle` yields 5 coins and 1 diamond.

## Error handling

- Empty item list → empty state, no drag session.
- Missing catalog id → `completeGameV2` returns `null` (existing); end screen still shows.
- Image load error → tile shows a solid fallback color; play continues.
- Audio fetch / play fail → TTS via `playCourseAudio` fallback.
- Shuffle that is irrelevant for start (tiles start in tray): if a future variant places tiles on the board, reshuffle when the board is already solved. V1 start is always unsolved (empty board).

## Testing

- `npx tsx src/lib/picturePuzzle.test.ts`:
  - `isSolved`: identity true; any `null` or wrong index false.
  - Move tray → empty slot; swap two slots; slot → tray.
  - Tray → occupied slot returns the previous tile to the tray.
- `npx tsx src/lib/gameV2Reward.test.ts` after catalog entry exists (include picture-puzzle case).
- `npm run lint` after implementation.
- No Jest/Vitest. No UI/hook test scripts.

## Out of scope

- Pixi / new illustrations / dedicated cover
- Importing or sampling `courseUnits` at runtime
- Multiple puzzles per reward
- Check button or locking correct tiles
- Showing the full uncut image as a hint
- Vietnamese prompt text
- Difficulty (4 tiles, 16 tiles)
