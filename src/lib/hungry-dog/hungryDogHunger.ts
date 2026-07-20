export const LAST_EAT_AT_KEY = "kidstory.hungryDog.lastEatAt";

export function getLastEatAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LAST_EAT_AT_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setLastEatAt(timestampMs: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_EAT_AT_KEY, String(timestampMs));
}

export function isHungry(
  nowMs: number,
  lastEatAt: number | null,
  hungerMs: number,
): boolean {
  if (lastEatAt === null) return true;
  return nowMs - lastEatAt >= hungerMs;
}
