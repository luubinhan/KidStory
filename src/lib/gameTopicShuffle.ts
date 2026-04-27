/** Deterministic shuffle of indices from a string seed (Fisher–Yates with LCG). */
export function shuffledOptionOrder(length: number, seed: string): number[] {
  const order = Array.from({ length }, (_, i) => i);
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  const next = () => {
    h = Math.imul(h, 1103515245) + 12345;
    return (h >>> 0) / 4294967296;
  };
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    const t = order[i];
    order[i] = order[j]!;
    order[j] = t!;
  }
  return order;
}
