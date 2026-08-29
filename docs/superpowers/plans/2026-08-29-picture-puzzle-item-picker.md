# Picture Puzzle Item Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the child pick a picture from `picturePuzzleItems` via a sticky right rail (desktop) or horizontal strip (mobile), with confirm when the board already has tiles.

**Architecture:** Pure helpers decide whether a switch needs confirm. The session hook owns `selectItem` / pending id / board reset. A presentational picker renders image-only thumbs. The page owns layout and a Radix alert dialog. Play again stays random. Rewards stay `completeGameV2` on solve only.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, `@radix-ui/react-alert-dialog`, `lucide-react`, existing `usePicturePuzzleSession` / `picturePuzzleItems`

**Spec:** `docs/superpowers/specs/2026-08-29-picture-puzzle-item-picker-design.md`

## Global Constraints

- Catalog stays `src/data/picturePuzzleGame.ts`; do not import `courseUnits`
- Thumbnails: image only; selected ring/check; word only in the playfield header and `aria-label`
- Empty board (all `null`): switch immediately; ≥1 tile: confirm
- Same id tap and unknown id: no-op
- Confirm copy exact: title `Switch picture?` body `You will lose this puzzle.` buttons `Cancel` / `Switch`
- Picker disabled while `sessionPhase === "summary"`
- `restart` (Play again) still picks a random item
- Switching does not call `completeGameV2`
- Tests: `npx tsx src/lib/picturePuzzle.test.ts` with `assert()` — no Jest/Vitest
- Two-space indent; `cn()` for Tailwind merges; no `@luckyluu/wonder-ui`
- Do not run Snyk
- After UI work: `npm run lint`; verify desktop rail + mobile strip in the browser

---

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/picturePuzzle.ts` | `hasBoardProgress`, `shouldConfirmSwitch` |
| `src/lib/picturePuzzle.test.ts` | asserts for those helpers |
| `package.json` | add `@radix-ui/react-alert-dialog` |
| `src/components/ui/AlertDialog.tsx` | Radix alert dialog wrapper |
| `src/components/ui/index.ts` | export `AlertDialog` |
| `src/hooks/usePicturePuzzleSession.ts` | `items`, `pendingSelectId`, `selectItem`, `confirmPendingSelect`, `cancelPendingSelect` |
| `src/components/games-v2/picture-puzzle/PicturePuzzleItemPicker.tsx` | thumbnail buttons |
| `src/pages/PicturePuzzleGamePage.tsx` | rail / strip layout + dialog |

Do not change `picturePuzzleGame.ts` schema, playfield drag, or `gamesV2` rewards.

---

### Task 1: Pure switch helpers (TDD)

**Files:**
- Modify: `src/lib/picturePuzzle.test.ts`
- Modify: `src/lib/picturePuzzle.ts`

**Interfaces:**
- Consumes: existing `PicturePuzzleBoard`
- Produces:

```ts
export function hasBoardProgress(board: PicturePuzzleBoard): boolean;
export function shouldConfirmSwitch(
  board: PicturePuzzleBoard,
  fromId: string,
  toId: string,
): boolean;
```

- [ ] **Step 1: Append failing asserts** at the end of `src/lib/picturePuzzle.test.ts` (before `console.log`), adding the new imports:

```ts
import {
  applyDrag,
  createPuzzle,
  hasBoardProgress,
  isSolved,
  pickPicturePuzzleItem,
  shouldConfirmSwitch,
  tileBackgroundPosition,
} from "./picturePuzzle";
```

```ts
assert.equal(hasBoardProgress(emptyBoard), false);
assert.equal(
  hasBoardProgress([0, null, null, null, null, null, null, null, null]),
  true,
);

assert.equal(shouldConfirmSwitch(emptyBoard, "a", "b"), false);
assert.equal(shouldConfirmSwitch(emptyBoard, "a", "a"), false);
assert.equal(
  shouldConfirmSwitch([0, null, null, null, null, null, null, null, null], "a", "a"),
  false,
);
assert.equal(
  shouldConfirmSwitch([0, null, null, null, null, null, null, null, null], "a", "b"),
  true,
);
```

- [ ] **Step 2: Run test — expect FAIL** (exports missing)

Run: `npx tsx src/lib/picturePuzzle.test.ts`

Expected: error like `SyntaxError` / `does not provide an export named 'hasBoardProgress'`

- [ ] **Step 3: Implement helpers** at the end of `src/lib/picturePuzzle.ts`:

```ts
export function hasBoardProgress(board: PicturePuzzleBoard): boolean {
  return board.some((cell) => cell !== null);
}

export function shouldConfirmSwitch(
  board: PicturePuzzleBoard,
  fromId: string,
  toId: string,
): boolean {
  if (fromId === toId) return false;
  return hasBoardProgress(board);
}
```

- [ ] **Step 4: Run test — expect PASS**

Run: `npx tsx src/lib/picturePuzzle.test.ts`

Expected: `picturePuzzle.test.ts: ok`

- [ ] **Step 5: Commit**

```bash
git add src/lib/picturePuzzle.ts src/lib/picturePuzzle.test.ts
git commit -m "$(cat <<'EOF'
feat: add picture-puzzle switch confirm helpers

Empty boards switch without a prompt; occupied boards need confirm unless the same item is tapped.
EOF
)"
```

---

### Task 2: Radix AlertDialog wrapper

**Files:**
- Modify: `package.json` / lockfile via npm
- Create: `src/components/ui/AlertDialog.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Consumes: `@radix-ui/react-alert-dialog`
- Produces: `AlertDialog` used by the puzzle page

```ts
type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelLabel: string;
  actionLabel: string;
  onAction: () => void;
};
```

- [ ] **Step 1: Install the primitive**

Run: `npm install @radix-ui/react-alert-dialog`

Expected: dependency listed next to `@radix-ui/react-progress`.

- [ ] **Step 2: Add `src/components/ui/AlertDialog.tsx`**

```tsx
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "../../lib/utils";

type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelLabel: string;
  actionLabel: string;
  onAction: () => void;
};

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel,
  actionLabel,
  onAction,
}: AlertDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <AlertDialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border-2 border-white bg-white p-6 shadow-xl",
          )}
        >
          <AlertDialogPrimitive.Title className="text-lg font-bold text-slate-900">
            {title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="mt-2 text-sm text-slate-600">
            {description}
          </AlertDialogPrimitive.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogPrimitive.Cancel
              className="inline-flex cursor-pointer items-center rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-yellow-400"
            >
              {cancelLabel}
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action
              className="inline-flex cursor-pointer items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-800 hover:bg-yellow-100"
              onClick={onAction}
            >
              {actionLabel}
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
```

- [ ] **Step 3: Export from `src/components/ui/index.ts`**

```ts
export { Progress } from "./Progress";
export { AlertDialog } from "./AlertDialog";
```

- [ ] **Step 4: Typecheck**

Run: `npm run lint`

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/components/ui/AlertDialog.tsx src/components/ui/index.ts
git commit -m "$(cat <<'EOF'
feat: add Radix AlertDialog wrapper

Picture puzzle needs a confirm dialog before abandoning an in-progress board.
EOF
)"
```

---

### Task 3: Session `selectItem`

**Files:**
- Modify: `src/hooks/usePicturePuzzleSession.ts`

**Interfaces:**
- Consumes: `hasBoardProgress` is not required if using `shouldConfirmSwitch`; `picturePuzzleItems`; `createPuzzle`
- Produces: hook return additions:

```ts
items: typeof picturePuzzleItems;
pendingSelectId: string | null;
selectItem: (id: string) => void;
confirmPendingSelect: () => void;
cancelPendingSelect: () => void;
```

`applySwitch` must: bump `runIdRef`, increment `runCounter`, set `awardedRef` to `false`, `setReward(null)`, `setItem(next)`, `setPuzzle(createPuzzle())`, `setPendingSelectId(null)`, `stopAudio()`.

- [ ] **Step 1: Import helpers and add pending state + switch callbacks**

Keep existing `nextItem` / `restart` / drag / reward effects. Add:

```ts
import {
  applyDrag,
  createPuzzle,
  isSolved,
  pickPicturePuzzleItem,
  shouldConfirmSwitch,
  type DragSource,
  type DragTarget,
  type PicturePuzzleState,
} from "../lib/picturePuzzle";
```

Inside the hook, after existing state:

```ts
  const [pendingSelectId, setPendingSelectId] = useState<string | null>(null);

  const applySwitch = useCallback(
    (next: PicturePuzzleItem) => {
      runIdRef.current += 1;
      setRunCounter((c) => c + 1);
      awardedRef.current = false;
      setReward(null);
      setItem(next);
      setPuzzle(createPuzzle());
      setPendingSelectId(null);
      stopAudio();
    },
    [stopAudio],
  );

  const selectItem = useCallback(
    (id: string) => {
      if (!item || id === item.id) return;
      const next = picturePuzzleItems.find((row) => row.id === id);
      if (!next) return;
      if (shouldConfirmSwitch(puzzle.board, item.id, id)) {
        setPendingSelectId(id);
        return;
      }
      applySwitch(next);
    },
    [item, puzzle.board, applySwitch],
  );

  const confirmPendingSelect = useCallback(() => {
    if (!pendingSelectId) return;
    const next = picturePuzzleItems.find((row) => row.id === pendingSelectId);
    if (!next) {
      setPendingSelectId(null);
      return;
    }
    applySwitch(next);
  }, [pendingSelectId, applySwitch]);

  const cancelPendingSelect = useCallback(() => {
    setPendingSelectId(null);
  }, []);
```

Return object: spread existing fields plus `items: picturePuzzleItems`, `pendingSelectId`, `selectItem`, `confirmPendingSelect`, `cancelPendingSelect`.

Do not change `restart` (still `nextItem()` random).

- [ ] **Step 2: Typecheck**

Run: `npm run lint`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/usePicturePuzzleSession.ts
git commit -m "$(cat <<'EOF'
feat: let picture-puzzle session switch items

Hook applies an immediate reset on an empty board and holds a pending id when the child would lose placed tiles.
EOF
)"
```

---

### Task 4: Item picker UI

**Files:**
- Create: `src/components/games-v2/picture-puzzle/PicturePuzzleItemPicker.tsx`

**Interfaces:**
- Consumes: `PicturePuzzleItem` from `src/data/picturePuzzleGame.ts`
- Produces:

```ts
type PicturePuzzleItemPickerProps = {
  items: readonly PicturePuzzleItem[];
  selectedId: string;
  disabled?: boolean;
  orientation: "horizontal" | "vertical";
  onSelect: (id: string) => void;
};
```

- [ ] **Step 1: Create the picker**

```tsx
import { Check } from "lucide-react";
import type { PicturePuzzleItem } from "../../../data/picturePuzzleGame";
import { cn } from "../../../lib/utils";

type PicturePuzzleItemPickerProps = {
  items: readonly PicturePuzzleItem[];
  selectedId: string;
  disabled?: boolean;
  orientation: "horizontal" | "vertical";
  onSelect: (id: string) => void;
};

export function PicturePuzzleItemPicker({
  items,
  selectedId,
  disabled = false,
  orientation,
  onSelect,
}: PicturePuzzleItemPickerProps) {
  return (
    <ul
      className={cn(
        orientation === "horizontal"
          ? "flex gap-2 overflow-x-auto pb-1"
          : "flex max-h-[70vh] flex-col gap-2 overflow-y-auto",
      )}
    >
      {items.map((row) => {
        const selected = row.id === selectedId;
        return (
          <li key={row.id} className="shrink-0">
            <button
              type="button"
              disabled={disabled}
              aria-label={row.word}
              aria-pressed={selected}
              onClick={() => onSelect(row.id)}
              className={cn(
                "relative size-16 overflow-hidden rounded-xl border-2 bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400",
                selected ? "border-yellow-400" : "border-white",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <img
                src={row.image}
                alt=""
                className="size-full object-cover"
              />
              {selected ? (
                <span className="absolute right-0.5 bottom-0.5 flex size-5 items-center justify-center rounded-full bg-yellow-400 text-yellow-950">
                  <Check className="size-3.5" aria-hidden />
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
```

No visible word text on thumbs (`alt=""`; name is `aria-label`).

- [ ] **Step 2: Typecheck**

Run: `npm run lint`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/games-v2/picture-puzzle/PicturePuzzleItemPicker.tsx
git commit -m "$(cat <<'EOF'
feat: add picture-puzzle item thumbnail picker

Image-only buttons with a selected ring so the child can browse puzzles without reading the list.
EOF
)"
```

---

### Task 5: Page layout + confirm dialog

**Files:**
- Modify: `src/pages/PicturePuzzleGamePage.tsx`

**Interfaces:**
- Consumes: hook fields from Task 3; `PicturePuzzleItemPicker`; `AlertDialog` from `../components/ui`
- Produces: desktop sticky right rail (`md+`); mobile horizontal strip under the word header; dialog bound to `pendingSelectId`

- [ ] **Step 1: Wire session fields and layout**

Replace the playfield column (`mx-auto flex max-w-full flex-col …`) with:

```tsx
          const pickerDisabled = sessionPhase === "summary";

          // inside the fragment, after the summary overlay:
          <div className="mx-auto flex max-w-full flex-col px-4 py-6 md:flex-row md:items-start md:gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex items-center justify-center gap-3">
                <p className="text-3xl font-bold capitalize text-white">{item.word}</p>
                <IconVolumeButton aria-label={`Play ${item.word}`} onClick={playWord} />
              </div>
              <div className="mb-4 md:hidden">
                <PicturePuzzleItemPicker
                  items={items}
                  selectedId={item.id}
                  disabled={pickerDisabled}
                  orientation="horizontal"
                  onSelect={selectItem}
                />
              </div>
              <PicturePuzzlePlayfield
                imageSrc={item.image}
                board={board}
                tray={tray}
                disabled={isComplete}
                onDrag={onDrag}
              />
            </div>
            <aside className="sticky top-4 hidden w-32 shrink-0 md:block">
              <PicturePuzzleItemPicker
                items={items}
                selectedId={item.id}
                disabled={pickerDisabled}
                orientation="vertical"
                onSelect={selectItem}
              />
            </aside>
          </div>
          <AlertDialog
            open={pendingSelectId !== null}
            onOpenChange={(open) => {
              if (!open) cancelPendingSelect();
            }}
            title="Switch picture?"
            description="You will lose this puzzle."
            cancelLabel="Cancel"
            actionLabel="Switch"
            onAction={confirmPendingSelect}
          />
```

Destructure from the hook: `items`, `pendingSelectId`, `selectItem`, `confirmPendingSelect`, `cancelPendingSelect` plus existing fields.

Imports:

```tsx
import { PicturePuzzleItemPicker } from "../components/games-v2/picture-puzzle/PicturePuzzleItemPicker";
import { AlertDialog } from "../components/ui";
```

Empty catalog branch stays as today (no picker).

Remove stray trailing whitespace in that file if still present.

- [ ] **Step 2: Typecheck**

Run: `npm run lint`

Expected: no errors.

- [ ] **Step 3: Re-run lib tests**

Run: `npx tsx src/lib/picturePuzzle.test.ts`

Expected: `picturePuzzle.test.ts: ok`

- [ ] **Step 4: Browser verify** (dev server `npm start`, `/games-v2/picture-puzzle`)

- Desktop (`md+`): thumbs sticky on the right; word header unchanged; selected ring + check; no word on thumbs.
- Narrow viewport: horizontal strip under the word, above the board; no right column.
- Empty board: tap another thumb switches immediately (new word, new shuffle, audio).
- Place one tile, tap another thumb: dialog; Cancel keeps board; Switch resets.
- Solve until Great job overlay: thumbs not clickable.
- Play again: random item (not necessarily the last picked).

- [ ] **Step 5: Commit**

```bash
git add src/pages/PicturePuzzleGamePage.tsx
git commit -m "$(cat <<'EOF'
feat: show picture-puzzle catalog on a sticky rail

Desktop keeps the list on the right; mobile uses a strip above the board so the child can pick a picture without losing an in-progress puzzle by accident.
EOF
)"
```

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| `hasBoardProgress` / `shouldConfirmSwitch` | 1 |
| Radix confirm dialog | 2, 5 |
| `selectItem` immediate vs pending | 3 |
| Unknown / same id no-op | 3 |
| applySwitch resets award flags, no extra `completeGameV2` | 3 |
| Image-only picker + ring/check + `aria-label` | 4 |
| Desktop sticky right / mobile strip | 5 |
| Picker disabled on summary | 5 |
| Exact confirm copy | 5 |
| Play again random | 3 (`restart` unchanged) |
| Empty list: no picker | 5 (existing empty branch) |
