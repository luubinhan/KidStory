function makeSeededRng(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = Math.imul(h, 1103515245) + 12345;
    return (h >>> 0) / 4294967296;
  };
}

/** Deterministic shuffle of indices from a string seed (Fisher–Yates with LCG). */
export function shuffledOptionOrder(length: number, seed: string): number[] {
  const order = Array.from({ length }, (_, i) => i);
  const next = makeSeededRng(seed);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    const t = order[i];
    order[i] = order[j]!;
    order[j] = t!;
  }
  return order;
}

/** Deterministic permutation of `0..length-1` for spell-mode letter tiles. */
export function shuffledIndices(length: number, seed: string): number[] {
  if (length <= 1) {
    return Array.from({ length }, (_, i) => i);
  }
  const base = `${seed}-letters`;
  let order = shuffledOptionOrder(length, base);
  const identity = order.every((v, i) => v === i);
  if (identity) {
    order = shuffledOptionOrder(length, `${base}-alt`);
  }
  return order;
}
