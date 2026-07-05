import "./testSetupIndexedDb";
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
