# IndexedDB Export/Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let any user export and import the full `kidstory-user-progress` IndexedDB database via file download/upload, with import overwriting all existing data after confirmation.

**Architecture:** Migrate `userProgressDb.ts` from `idb` to Dexie (same DB name). Add `dbExportImport.ts` using `dexie-export-import` for full-database dump/restore. Expose backup UI via a shared `DataBackupPanel` in a Settings modal (gear button) and a `/settings` page.

**Tech Stack:** React 19, TypeScript, Vite, Dexie 4, dexie-export-import, fake-indexeddb (tests), tsx for runnable test scripts

**Spec:** `docs/superpowers/specs/2026-07-05-indexeddb-export-import-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `package.json` | Add `dexie`, `dexie-export-import`; devDep `fake-indexeddb` |
| `src/lib/db.ts` | Singleton Dexie instance (`kidstory-user-progress`) |
| `src/lib/userProgressDb.ts` | Refactor load/save to Dexie; keep public API |
| `src/lib/dbExportImport.ts` | `exportDatabase`, `importDatabase`, validation helpers |
| `src/lib/dbExportImport.test.ts` | Round-trip + validation tests |
| `src/lib/downloadBlob.ts` | Trigger browser file download from Blob |
| `src/contexts/UserProgressContext.tsx` | Add `reloadProgress()` after import |
| `src/components/settings/DataBackupPanel.tsx` | Export/Import buttons + status messages |
| `src/components/settings/SettingsModal.tsx` | Modal shell with panel + link to `/settings` |
| `src/components/settings/SettingsTrigger.tsx` | Gear button opening modal |
| `src/components/course/CoursePageHeader.tsx` | Use `SettingsTrigger` instead of inert button |
| `src/pages/CoursePage.tsx` | Add `SettingsTrigger` in header row |
| `src/pages/SettingsPage.tsx` | Full settings page at `/settings` |
| `src/App.tsx` | Register `/settings` route |

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime and dev dependencies**

Run:
```bash
npm install dexie dexie-export-import
npm install -D fake-indexeddb
```

Expected: `package.json` lists `dexie`, `dexie-export-import` under `dependencies` and `fake-indexeddb` under `devDependencies`.

- [ ] **Step 2: Verify install**

Run: `npm run lint`  
Expected: PASS (no new type errors yet)

---

### Task 2: Dexie database singleton

**Files:**
- Create: `src/lib/db.ts`

- [ ] **Step 1: Create Dexie instance**

Create `src/lib/db.ts`:

```typescript
import Dexie, { type Table } from "dexie";
import type { UserProgressV1 } from "../types/userProgress";

export const DB_NAME = "kidstory-user-progress";
export const DB_VERSION = 1;
export const PROGRESS_STORE = "progress";
export const PROGRESS_KEY = "main";

export class KidStoryDB extends Dexie {
  progress!: Table<UserProgressV1, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      [PROGRESS_STORE]: "",
    });
  }
}

export const db = new KidStoryDB();
```

- [ ] **Step 2: Verify types compile**

Run: `npm run lint`  
Expected: PASS

---

### Task 3: Migrate userProgressDb to Dexie

**Files:**
- Modify: `src/lib/userProgressDb.ts`

- [ ] **Step 1: Replace idb with Dexie**

Replace entire contents of `src/lib/userProgressDb.ts`:

```typescript
import type { UserProgressV1 } from "../types/userProgress";
import { getDefaultProgress, normalizeInventory } from "./userProgressLogic";
import { db, PROGRESS_KEY, PROGRESS_STORE } from "./db";

export async function loadUserProgress(): Promise<UserProgressV1> {
  const stored = await db.table(PROGRESS_STORE).get(PROGRESS_KEY);
  if (!stored) return getDefaultProgress();

  const inventory = normalizeInventory(
    stored.inventory as string[] | Record<string, number>,
  );

  return {
    ...stored,
    diamonds: stored.diamonds ?? 0,
    inventory,
  };
}

export async function saveUserProgress(progress: UserProgressV1): Promise<void> {
  await db.table(PROGRESS_STORE).put(progress, PROGRESS_KEY);
}

export { getDefaultProgress };
```

- [ ] **Step 2: Remove unused idb import from package (optional cleanup)**

Run: `npm uninstall idb`  
Expected: `idb` removed from `package.json` (no remaining imports).

- [ ] **Step 3: Verify types compile**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 4: Smoke-test in browser**

Run: `npm start`  
Open `/course`, complete an activity, refresh — progress should persist.

---

### Task 4: Export/import logic (TDD)

**Files:**
- Create: `src/lib/dbExportImport.test.ts`
- Create: `src/lib/dbExportImport.ts`

- [ ] **Step 1: Write failing round-trip test**

Create `src/lib/dbExportImport.test.ts`:

```typescript
import "fake-indexeddb/auto";
import { db, PROGRESS_KEY, PROGRESS_STORE } from "./db";
import { exportDatabase, importDatabase, validateBackupBlob } from "./dbExportImport";
import type { UserProgressV1 } from "../types/userProgress";

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

async function resetDb() {
  await db.delete();
  await db.open();
}

const sampleProgress: UserProgressV1 = {
  version: 1,
  coins: 42,
  diamonds: 7,
  unitActivityCompletions: { "unit-1-greetings": ["write"] },
  unitBonusClaimed: {},
  achievements: {},
  inventory: { chicken: 2 },
};

async function runTests() {
  await resetDb();
  await db.table(PROGRESS_STORE).put(sampleProgress, PROGRESS_KEY);

  const blob = await exportDatabase();
  assert(blob.size > 0, "export produces non-empty blob");

  await validateBackupBlob(blob);

  await db.table(PROGRESS_STORE).put(
    { ...sampleProgress, coins: 0, diamonds: 0 },
    PROGRESS_KEY,
  );

  await importDatabase(blob);

  const restored = await db.table(PROGRESS_STORE).get(PROGRESS_KEY);
  assert(restored?.coins === 42, "coins restored after import");
  assert(restored?.diamonds === 7, "diamonds restored after import");
  assert(restored?.inventory.chicken === 2, "inventory restored after import");

  const badBlob = new Blob([JSON.stringify({ databaseName: "wrong-db" })], {
    type: "application/json",
  });

  let rejected = false;
  try {
    await validateBackupBlob(badBlob);
  } catch {
    rejected = true;
  }
  assert(rejected, "validateBackupBlob rejects wrong database name");

  console.log("dbExportImport.test.ts: all passed");
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/dbExportImport.test.ts`  
Expected: FAIL — cannot find module `./dbExportImport`

- [ ] **Step 3: Implement export/import module**

Create `src/lib/dbExportImport.ts`:

```typescript
import "dexie-export-import";
import { exportDB, peakImportFile } from "dexie-export-import";
import { db, DB_NAME } from "./db";

export function formatBackupFilename(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `kidstory-backup-${yyyy}-${mm}-${dd}.json`;
}

export async function validateBackupBlob(blob: Blob): Promise<void> {
  const meta = await peakImportFile(blob);
  if (meta.data.databaseName !== DB_NAME) {
    throw new Error(`Expected database "${DB_NAME}", got "${meta.data.databaseName}"`);
  }
}

export async function exportDatabase(): Promise<Blob> {
  return exportDB(db);
}

export async function importDatabase(blob: Blob): Promise<void> {
  await validateBackupBlob(blob);
  await db.import(blob, {
    clearTablesBeforeImport: true,
    overwriteValues: true,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/dbExportImport.test.ts`  
Expected: `dbExportImport.test.ts: all passed`

---

### Task 5: Download helper

**Files:**
- Create: `src/lib/downloadBlob.ts`

- [ ] **Step 1: Create download helper**

Create `src/lib/downloadBlob.ts`:

```typescript
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 2: Verify types compile**

Run: `npm run lint`  
Expected: PASS

---

### Task 6: reloadProgress in context

**Files:**
- Modify: `src/contexts/UserProgressContext.tsx`

- [ ] **Step 1: Add reloadProgress to context type**

In `UserProgressContext.tsx`, extend `UserProgressContextValue`:

```typescript
type UserProgressContextValue = {
  progress: UserProgressV1;
  isLoading: boolean;
  coins: number;
  diamonds: number;
  reloadProgress: () => Promise<void>;
  // ... existing fields unchanged
};
```

- [ ] **Step 2: Implement reloadProgress**

Add inside `UserProgressProvider`, after the initial load `useEffect`:

```typescript
const reloadProgress = useCallback(async () => {
  const loaded = await loadUserProgress();
  setProgress(loaded);
}, []);
```

Add `reloadProgress` to the `useMemo` value object:

```typescript
const value = useMemo<UserProgressContextValue>(
  () => ({
    progress,
    isLoading,
    coins: progress.coins,
    diamonds: progress.diamonds,
    reloadProgress,
    completeActivity,
    useHint,
    canUseHint: canAffordHint(progress),
    buyShopItem,
    getItemQuantity: (itemId: ShopItemId) => getItemQuantity(progress, itemId),
    getUnitStatus: (unit) => getUnitStatus(unit, progress, progressOptions),
    isUnitAccessible: (unit) => isUnitUnlocked(unit, progress, progressOptions),
    getUnitProgress: (unit) => getUnitProgressInfo(unit, progress),
  }),
  [progress, isLoading, reloadProgress, completeActivity, useHint, buyShopItem, progressOptions],
);
```

- [ ] **Step 3: Verify types compile**

Run: `npm run lint`  
Expected: PASS

---

### Task 7: DataBackupPanel component

**Files:**
- Create: `src/components/settings/DataBackupPanel.tsx`

- [ ] **Step 1: Create backup panel with export/import**

Create `src/components/settings/DataBackupPanel.tsx`:

```tsx
import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useUserProgress } from "../../contexts/UserProgressContext";
import {
  exportDatabase,
  formatBackupFilename,
  importDatabase,
} from "../../lib/dbExportImport";
import { downloadBlob } from "../../lib/downloadBlob";

const IMPORT_CONFIRM_MESSAGE =
  "Import sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc muốn tiếp tục?";

type DataBackupPanelProps = {
  compact?: boolean;
};

export function DataBackupPanel({ compact = false }: DataBackupPanelProps) {
  const { reloadProgress } = useUserProgress();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setStatus(null);
    setBusy(true);
    try {
      const blob = await exportDatabase();
      downloadBlob(blob, formatBackupFilename());
      setStatus({ type: "success", message: "Đã xuất file backup." });
    } catch {
      setStatus({ type: "error", message: "Xuất file thất bại. Thử lại." });
    } finally {
      setBusy(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!window.confirm(IMPORT_CONFIRM_MESSAGE)) return;

    setStatus(null);
    setBusy(true);
    try {
      await importDatabase(file);
      await reloadProgress();
      setStatus({ type: "success", message: "Đã import dữ liệu thành công." });
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("Expected database")
          ? "File không hợp lệ."
          : "Import thất bại. Thử lại.";
      setStatus({ type: "error", message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <p className="text-sm text-slate-600">
          Sao lưu tiến độ học (coins, diamonds, unit, inventory) ra file để chuyển sang thiết bị
          hoặc trình duyệt khác.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleExport()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
        >
          <Download className="size-4" aria-hidden />
          Xuất backup
        </button>
        <button
          type="button"
          onClick={handleImportClick}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50 disabled:opacity-50"
        >
          <Upload className="size-4" aria-hidden />
          Import backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => void handleFileChange(e)}
        />
      </div>

      {status && (
        <p
          className={
            status.type === "success"
              ? "text-sm font-medium text-emerald-600"
              : "text-sm font-medium text-red-600"
          }
          role="status"
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify types compile**

Run: `npm run lint`  
Expected: PASS

---

### Task 8: Settings modal and trigger

**Files:**
- Create: `src/components/settings/SettingsModal.tsx`
- Create: `src/components/settings/SettingsTrigger.tsx`
- Modify: `src/components/course/CoursePageHeader.tsx`

- [ ] **Step 1: Create SettingsModal**

Create `src/components/settings/SettingsModal.tsx`:

```tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { DataBackupPanel } from "./DataBackupPanel";

type SettingsModalProps = {
  onClose: () => void;
};

export function SettingsModal({ onClose }: SettingsModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cài đặt"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="font-bold text-slate-800">Cài đặt</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Đóng"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-700">Sao lưu dữ liệu</h2>
            <div className="mt-2">
              <DataBackupPanel compact />
            </div>
          </div>

          <Link
            to="/settings"
            onClick={onClose}
            className="block text-sm font-semibold text-sky-600 hover:text-sky-800"
          >
            Cài đặt đầy đủ →
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 2: Create SettingsTrigger**

Create `src/components/settings/SettingsTrigger.tsx`:

```tsx
import { useState } from "react";
import { Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import { SettingsModal } from "./SettingsModal";

type SettingsTriggerProps = {
  className?: string;
};

export function SettingsTrigger({ className }: SettingsTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
          className,
        )}
        aria-label="Cài đặt"
      >
        <Settings className="size-5" aria-hidden />
      </button>
      {open && <SettingsModal onClose={() => setOpen(false)} />}
    </>
  );
}
```

- [ ] **Step 3: Wire CoursePageHeader to SettingsTrigger**

In `src/components/course/CoursePageHeader.tsx`:

Replace the Settings import and button block:

```tsx
import { SettingsTrigger } from "../settings/SettingsTrigger";
```

Remove `Settings` from lucide import (keep `Zap`).

Replace the `<button>...</button>` settings block with:

```tsx
<SettingsTrigger />
```

- [ ] **Step 4: Verify types compile**

Run: `npm run lint`  
Expected: PASS

---

### Task 9: Settings page and CoursePage trigger

**Files:**
- Create: `src/pages/SettingsPage.tsx`
- Modify: `src/pages/CoursePage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create SettingsPage**

Create `src/pages/SettingsPage.tsx`:

```tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CourseBottomNav } from "../components/course";
import { DataBackupPanel } from "../components/settings/DataBackupPanel";

export default function SettingsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <Link
          to="/course"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Explore
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-sky-900">Cài đặt</h1>

        <section className="mt-8 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100">
          <h2 className="text-base font-bold text-slate-800">Sao lưu dữ liệu</h2>
          <div className="mt-3">
            <DataBackupPanel />
          </div>
        </section>
      </div>
      <CourseBottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Add SettingsTrigger to CoursePage header**

In `src/pages/CoursePage.tsx`, add import:

```tsx
import { SettingsTrigger } from "../components/settings/SettingsTrigger";
```

Change the header row from:

```tsx
<div className="flex items-center justify-between gap-4 px-4">
  <CoursePageTitle curriculumLabel={courseProfile.curriculumLabel} />
  <CurrencyDisplay className="mt-2 shrink-0" />
</div>
```

To:

```tsx
<div className="flex items-center justify-between gap-4 px-4">
  <CoursePageTitle curriculumLabel={courseProfile.curriculumLabel} />
  <div className="mt-2 flex shrink-0 items-center gap-2">
    <CurrencyDisplay />
    <SettingsTrigger />
  </div>
</div>
```

- [ ] **Step 3: Register /settings route**

In `src/App.tsx`, add import:

```tsx
import SettingsPage from "./pages/SettingsPage";
```

Add route inside `<Routes>`:

```tsx
<Route path="/settings" element={<SettingsPage />} />
```

- [ ] **Step 4: Verify types compile**

Run: `npm run lint`  
Expected: PASS

---

### Task 10: Final verification

**Files:** (none — verification only)

- [ ] **Step 1: Run unit tests**

Run: `npx tsx src/lib/dbExportImport.test.ts`  
Expected: `dbExportImport.test.ts: all passed`

- [ ] **Step 2: Run lint**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 3: Manual browser test — export**

Run: `npm start`  
1. Open `/course`, earn some coins/diamonds  
2. Click gear → "Xuất backup"  
3. Verify a `.json` file downloads

- [ ] **Step 4: Manual browser test — import overwrite**

1. Clear site data or use a fresh profile  
2. Gear → Import → select backup file → confirm  
3. Verify coins/diamonds/inventory match backup

- [ ] **Step 5: Manual browser test — settings page**

1. Navigate to `/settings` (or via "Cài đặt đầy đủ →" in modal)  
2. Verify same export/import controls work

- [ ] **Step 6: Manual browser test — invalid file**

1. Try importing a random JSON file  
2. Verify "File không hợp lệ." error appears

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json \
  docs/superpowers/specs/2026-07-05-indexeddb-export-import-design.md \
  docs/superpowers/plans/2026-07-05-indexeddb-export-import.md \
  src/lib/db.ts src/lib/userProgressDb.ts src/lib/dbExportImport.ts \
  src/lib/dbExportImport.test.ts src/lib/downloadBlob.ts \
  src/contexts/UserProgressContext.tsx \
  src/components/settings/DataBackupPanel.tsx \
  src/components/settings/SettingsModal.tsx \
  src/components/settings/SettingsTrigger.tsx \
  src/components/course/CoursePageHeader.tsx \
  src/pages/CoursePage.tsx src/pages/SettingsPage.tsx src/App.tsx
git commit -m "$(cat <<'EOF'
feat: add IndexedDB export/import for user progress backup

Migrate persistence to Dexie and let users download/upload full database backups from settings.
EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Dexie migration, same DB name | Task 2, 3 |
| Full IndexedDB export/import | Task 4 |
| Import overwrite + confirm | Task 7 (`DataBackupPanel`) |
| Validate backup file name | Task 4 (`validateBackupBlob`) |
| Settings modal + /settings page | Task 8, 9 |
| reloadProgress after import | Task 6 |
| Everyone can access (no dev gate) | Task 8, 9 (no env checks) |
| Vietnamese UI strings | Task 7, 8, 9 |

## Placeholder scan

No TBD/TODO/implement-later steps. All code blocks are complete.

## Type consistency

- `db.ts` exports `DB_NAME`, `PROGRESS_STORE`, `PROGRESS_KEY` — used consistently in `userProgressDb.ts`, `dbExportImport.ts`, tests
- `reloadProgress` added to context type and value in same task
- `DataBackupPanel` uses `useUserProgress().reloadProgress` after import
