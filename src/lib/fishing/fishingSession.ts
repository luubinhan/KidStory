import {
  FISHING_ROUND,
  type FishingSessionState,
  type FishingVocabItem,
} from "../../types/fishing";

function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function createInitialSession(
  pool: readonly FishingVocabItem[],
): FishingSessionState {
  if (pool.length === 0) {
    throw new Error("createInitialSession requires a non-empty pool");
  }
  return {
    status: "playing",
    correctCount: 0,
    currentTarget: pickRandom(pool),
  };
}

export function pickNextTarget(
  pool: readonly FishingVocabItem[],
  previousId: string,
): FishingVocabItem {
  const others = pool.filter((p) => p.id !== previousId);
  if (others.length === 0) return pool[0]!;
  return pickRandom(others);
}

export function pickDistractorWords(
  pool: readonly FishingVocabItem[],
  targetWord: string,
  count: number,
): string[] {
  const target = normalizeWord(targetWord);
  const distractors = pool
    .filter((p) => normalizeWord(p.word) !== target)
    .map((p) => p.word.toUpperCase());
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    if (distractors.length === 0) break;
    out.push(pickRandom(distractors));
  }
  return out;
}

/** Returns `liveCount` labels with exactly one matching targetWord (case-insensitive). */
export function ensureExactlyOneTargetLabel(
  otherLabels: readonly string[],
  targetWord: string,
  pool: readonly FishingVocabItem[],
): string[] {
  const targetUpper = targetWord.toUpperCase();
  const targetNorm = normalizeWord(targetWord);
  const cleaned = otherLabels.filter((w) => normalizeWord(w) !== targetNorm);
  const need = Math.max(0, cleaned.length);
  const distractors = pickDistractorWords(pool, targetWord, need);
  const labels = [targetUpper, ...distractors.slice(0, cleaned.length)];
  // shuffle
  for (let i = labels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [labels[i], labels[j]] = [labels[j]!, labels[i]!];
  }
  return labels;
}

export type FishTapResult =
  | { kind: "wrong"; session: FishingSessionState }
  | { kind: "correct"; session: FishingSessionState };

export function applyFishTap(
  session: FishingSessionState,
  pool: readonly FishingVocabItem[],
  tappedWord: string,
): FishTapResult {
  if (session.status !== "playing") {
    return { kind: "wrong", session };
  }
  const isCorrect =
    normalizeWord(tappedWord) === normalizeWord(session.currentTarget.word);
  if (!isCorrect) {
    return { kind: "wrong", session };
  }
  const correctCount = session.correctCount + 1;
  if (correctCount >= FISHING_ROUND.targetsNeeded) {
    return {
      kind: "correct",
      session: {
        ...session,
        correctCount,
        status: "won",
      },
    };
  }
  return {
    kind: "correct",
    session: {
      status: "playing",
      correctCount,
      currentTarget: pickNextTarget(pool, session.currentTarget.id),
    },
  };
}
