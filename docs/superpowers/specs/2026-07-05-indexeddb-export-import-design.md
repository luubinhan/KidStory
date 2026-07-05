# IndexedDB Export/Import — Design Spec

**Date:** 2026-07-05  
**Status:** Approved (brainstorming session)

## Summary

Allow any user to export and import the full `kidstory-user-progress` IndexedDB database to/from a file. Migrate persistence from `idb` to Dexie and use `dexie-export-import` for full-database dump/restore. Import fully overwrites existing data after confirmation.

## Requirements (from user)

| Decision | Choice |
|----------|--------|
| Audience | Everyone — no dev/user split |
| Import behavior | Full overwrite with confirm dialog |
| Data scope | Entire IndexedDB database (future-proof for new stores) |
| UI | Settings modal (gear button) + `/settings` page linked from modal |
| Tech | Dexie + `dexie-export-import` |

## Architecture

```
CoursePage / CoursePageHeader
        │
        ▼
  SettingsTrigger ──► SettingsModal (quick actions + link to /settings)
        │
        ▼
  DataBackupPanel ──► dbExportImport.ts ──► Dexie db (kidstory-user-progress)
        │                      │
        │                      ├── exportDB(db) → Blob → download
        │                      └── db.import(blob, { clearTablesBeforeImport: true })
        ▼
  UserProgressContext.reloadProgress()
```

## Data layer

### Dexie schema

- DB name: `kidstory-user-progress` (unchanged — existing browser data remains readable)
- Version 1 store: `progress` with schema `""` (out-of-line keys)
- Key `main` holds `UserProgressV1`

### Public APIs (unchanged consumers)

- `loadUserProgress()` / `saveUserProgress()` in `userProgressDb.ts` — same signatures
- New: `exportDatabase(): Promise<Blob>`, `importDatabase(file: Blob): Promise<void>` in `dbExportImport.ts`
- New: `reloadProgress()` on `UserProgressContext`

### Import options

```typescript
await db.import(blob, {
  clearTablesBeforeImport: true,
  overwriteValues: true,
});
```

Validate with `peakImportFile()` that `databaseName === "kidstory-user-progress"` before import.

### Export filename

`kidstory-backup-YYYY-MM-DD.json`

## UI

### Settings modal

- Opened from gear button on `CoursePageHeader` and `CoursePage` header row
- Contains `DataBackupPanel`: Export button, Import button (hidden file input), status message
- Footer link: "Cài đặt đầy đủ →" navigates to `/settings`

### Settings page (`/settings`)

- Back link to `/course`
- Same `DataBackupPanel` with short Vietnamese description of backup purpose
- Uses `CourseBottomNav`

### Confirm dialog (import)

Native `window.confirm`:

> Import sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc muốn tiếp tục?

### Error handling

- Wrong DB name in file → inline error: "File không hợp lệ."
- Import/export failure → inline error with generic message; log detail to console

## Testing

- Unit tests with `fake-indexeddb/auto`: round-trip export → import preserves progress data
- `peakImportFile` validation rejects wrong database name
- `npm run lint` passes

## Out of scope

- Merge/partial import
- Encryption or cloud sync
- Dev-only gating
- Settings items beyond data backup (profile edit, etc.)
