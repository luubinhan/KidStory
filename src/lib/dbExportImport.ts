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
