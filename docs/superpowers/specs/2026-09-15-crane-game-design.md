# Letter Crane (Games V2) — Design Spec

**Date:** 2026-09-15  
**Status:** Approved (brainstorming session)

## Summary

Add a PixiJS v8 vocabulary mini-game **Letter Crane** (`con gắn`) to Games V2. The child moves an L-shaped hook with **arrow keys** and **auto-grabs** the next correct letter on contact. Wrong letters pass through. One course word per round; finishing the word awards **10 diamonds** and shows the existing end shell. Play again starts a new word.

## Decisions

| Topic | Choice |
|-------|--------|
| Route | `/games-v2/crane` |
| Hub card | `id: "crane"`, name **Letter Crane**, `coinReward: 0`, `diamondReward: 10` |
| Control | Arrow keys (←↑→↓) move the hook in 2D. No on-screen D-pad in v1 |
| Grab | Auto-grab on AABB contact with the **next** needed letter only |
| Wrong letter | Pass through; no grab, no shake, no place |
| After grab | Lock input; letter tweens into the next empty slot; then unlock |
| Vocabulary | Reuse `buildFishingVocabPool(gameUnits)`, then filter to 3–8 letters `a–z` only |
| Round length | **1 word** then `complete` |
| Reward | `completeGameV2("crane")` once per completed word (replay awards again) |
| Hints | Word length 3: fill first 1 slot. Length ≥ 4: fill first 2 slots (prefix, like sketch `g a ____`) |
| Field letters | Remaining letters only, shuffled positions, no extra decoys |
| Prompt | Target image overlay; tap replays audio; auto-play audio on new word |
| Thumbnail | Omit `thumbnailSrc` (pond-gradient placeholder) |
| Out of scope | On-screen arrows, carry-to-slot, pendulum physics, extra decoy letters, new cover art, `addDiamonds` API |

## Approach

**Chosen: 2D Pixi hook + auto-snap (Approach A)**

- React: page shell, target image, diamond HUD, empty state, `ActivityEndShell`, `CourseBottomNav`
- PixiJS v8: hook, scattered letters, slot row, ticker movement, contact grab, fly-to-slot tween
- Pure lib: word pick, hint slots, `nextLetter`, `applyGrab`, complete

Rejected alternatives:

- **Carry letter to slots** — extra steps after every grab; easy to stall
- **Rail crane (left/right only)** — weaker match for “move the hook” in 2D; contact grab is awkward

## Architecture

```
src/App.tsx                                      Route /games-v2/crane
src/data/gamesV2.ts                              Catalog entry crane (0 / 10)
src/types/crane.ts                               Round constants, session types
src/lib/crane/craneSession.ts                    Pure: filter, round, grab, complete
src/lib/crane/craneSession.test.ts               assert() script
src/hooks/useCraneSession.ts                     State, audio, completeGameV2, restart
src/components/games-v2/crane/CranePixiStage.tsx Application, hook, letters, slots
src/pages/CraneGamePage.tsx                      Shell + HUD + end screen
```

`GamesV2Page` already maps `gamesV2`; hub layout unchanged beyond the new card.

`gameV2Reward.test.ts`: assert `crane` awards 0 coins and 10 diamonds.

### Boundaries

- **Pure lib:** pool filter, create round, next letter, apply grab. No React, no Pixi, no progress context.
- **Hook:** `playing` / `complete`, target vocab, filled slots, audio, `completeGameV2`, `restart`.
- **Pixi:** render + input + collision + tween. Calls `onGrab(letter)` only when contact matches `nextLetter`. Does not award diamonds.
- **Page:** HUD, end shell, nav, remount stage via `stageKey` on replay.

### Data flow

```text
buildFishingVocabPool(gameUnits)
  → filterCraneWords (3–8 chars, /^[a-z]+$/i)
  → createRound(pool, previousId?)
      pick word ≠ previousId when pool size > 1
      slots = word letters; first hintCount filled
      fieldLetters = remaining chars (multiset)
  → CranePixiStage draws field + slots + hook
  → keydown/keyup on window while playing
  → ticker moves hook (deltaTime), clamp above slot row
  → AABB hook tip vs field letter
      if letter !== nextLetter: ignore
      if letter === nextLetter and not busy:
        busy = true
        tween letter to slot
        onGrab(letter) → applyGrab
        busy = false
  → all slots filled → status complete
  → awardedRef → completeGameV2("crane")
  → ActivityEndShell (Play again / Back to games)
  → restart → new round, stageKey++, awardedRef = false
```

## Data structures

```ts
export const CRANE_ROUND = {
  minLetters: 3,
  maxLetters: 8,
  speedPxPerSec: 280,
  flyToSlotMs: 280,
  minPoolSize: 1,
} as const;

export type CraneStatus = "playing" | "complete";

export type CraneSlot = {
  letter: string;
  filled: boolean;
};

export type CraneRound = {
  target: FishingVocabItem;
  word: string;
  slots: CraneSlot[];
  fieldLetters: string[];
};

export type CraneState = {
  status: CraneStatus;
  round: CraneRound;
};

export function hintCountForWord(word: string): number {
  return word.length >= 4 ? 2 : 1;
}

export function nextLetter(slots: readonly CraneSlot[]): string | null {
  const slot = slots.find((s) => !s.filled);
  return slot ? slot.letter : null;
}

export function applyGrab(state: CraneState, letter: string): CraneState;
```

`word` is `target.word` trimmed and lowercased. `slots[i].letter` is `word[i]`. `applyGrab` fills the first unfilled slot if and only if `letter` (normalized) equals that slot’s letter; otherwise returns the same state. When every slot is filled, `status` becomes `"complete"`.

`GameV2` catalog entry:

```ts
{
  id: "crane",
  name: "Letter Crane",
  path: "/games-v2/crane",
  coinReward: 0,
  diamondReward: 10,
}
```

## Gameplay rules (normative)

1. Display letters in **lowercase**, matching the sketch.
2. Hook moves while an arrow key is held. Diagonal OK if two keys held. Speed `CRANE_ROUND.speedPxPerSec` scaled by `ticker.deltaMS / 1000`.
3. Grab hitbox is the **tip** of the L-hook (small AABB), not the whole arm.
4. Contact with a field letter whose char ≠ `nextLetter`: no-op (pass through).
5. Contact with a field letter whose char = `nextLetter`: consume **one** matching sprite (duplicates allowed, e.g. remaining `p`s in `happy`), tween it to the first empty slot, fill that slot.
6. During tween (`busy`): ignore new contacts and ignore movement input.
7. `keydown` `Arrow*` while `playing` and not `busy`: `preventDefault()` so the page does not scroll.
8. When `status !== "playing"`: remove or ignore keyboard handlers.

## UI

- Full-height page, same sky-gradient pattern as other Games V2 pages, `CourseBottomNav`.
- Pixi canvas behind; transparent background (`backgroundAlpha: 0`).
- Overlay while playing: target image (top center, tap = audio); top-right label **10 diamonds** from catalog `diamondReward` (round prize, matching the sketch — not the wallet balance). Wallet still updates on complete via `completeGameV2`.
- Slot row at the bottom of the Pixi stage; playfield is the area above it. Clamp the hook inside the playfield.
- End overlay: `ActivityEndShell` with reward, “Great job!”, Play again, Back to games (`/games-v2`).
- Empty pool: friendly message, no Pixi mount, still show `CourseBottomNav`.

### Pixi objects

- Hook: `Graphics` L-shape (black) plus a gray pivot circle at the top of the arm (sketch).
- Field letters: `Text`, scattered with rejection sampling so they do not overlap each other, the slot row, or a top HUD margin. After ~20 failed tries, fall back to a simple grid.
- Slots: rounded rects; filled slots show the letter; empty slots are blank gray fills.

`Application` lifecycle matches Fishing: `new Application()`, `await app.init({ backgroundAlpha: 0, resizeTo: window, antialias: true, autoDensity: true, resolution: min(devicePixelRatio, 2) })`, append `app.canvas` to a host div, `app.destroy(true, { children: true })` on unmount if setup finished.

## Session

`useCraneSession`:

- Builds filtered pool via `useMemo`.
- `canPlay` when `pool.length >= CRANE_ROUND.minPoolSize`.
- Holds `CraneState | null`.
- Auto-plays target audio once per new round (`playCourseAudio`), same cancel-on-unmount pattern as Hungry Dog.
- `onGrab(letter)` wraps `applyGrab`.
- `completeGameV2("crane")` when `status === "complete"`, guarded by `awardedRef`.
- `restart()` picks a new round (avoid previous word id if possible), resets `awardedRef`, increments a page `stageKey` so Pixi remounts.

Does not add coins. Does not introduce `addDiamonds`.

## Error handling

- Filtered pool empty: `canPlay` false; empty state; no Pixi.
- `applyGrab` with wrong letter or when not `playing`: return same state.
- Contact while `busy`: ignore.
- Unmount mid-init: `disposed` flag, destroy app if init completed (Fishing pattern).
- Unmount: remove window key listeners; stop audio.
- Word with repeated letters: grab any matching remaining sprite; do not require a specific instance id from the lib (lib is char-based).
- `completeGameV2` after unmount / after restart: ignore via `runIdRef` (Hungry Dog pattern).

## Testing

`npx tsx src/lib/crane/craneSession.test.ts`:

- Filter drops words with spaces, hyphens, length under 3, length over 8, and non-letters.
- `hintCountForWord("cat") === 1`, `hintCountForWord("garden") === 2`.
- Round for `garden`: slots `g,a` filled, field multiset `{d,e,n,r}`.
- `nextLetter` then `applyGrab` in word order fills slots; wrong grab is no-op.
- Duplicate: `happy` with hint `h,a` — two `applyGrab("p")` then `"y"` completes.
- Last grab sets `status` to `complete`.
- `createRound` with one-item pool does not throw on replay (same word allowed).

`npm run lint` after implementation.

No Jest/Vitest. No Pixi/keyboard test scripts.

## Out of scope

- On-screen arrow pad / touch drag of the hook
- Carrying a letter to the slot row
- Pendulum / rope physics
- Extra decoy letters not in the target word
- New cover illustration
- New `addDiamonds` helper (catalog `diamondReward` is enough)
- WASD, gamepad
- Multi-word sessions without an end screen
