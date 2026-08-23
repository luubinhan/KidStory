function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function sampleMatchingPairs<T>(
  words: readonly T[],
  count: number,
): T[] {
  if (count <= 0 || words.length < count) return [];
  return shuffle([...words]).slice(0, count);
}
