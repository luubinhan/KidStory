export const UNBLOCK_ALL_SESSION_KEY = "kidstory-unblock-all";

export function isUnblockAllActive(): boolean {
  try {
    return sessionStorage.getItem(UNBLOCK_ALL_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function activateUnblockAll(): void {
  try {
    sessionStorage.setItem(UNBLOCK_ALL_SESSION_KEY, "1");
  } catch {
    // ignore storage failures (private mode, etc.)
  }
}
