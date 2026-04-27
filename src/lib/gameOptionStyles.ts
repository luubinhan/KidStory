import { OPTION_PALETTE } from "../constants/gameOptionPalette";

export function getOptionButtonRingClasses(params: {
  displayIdx: number;
  originalIdx: number;
  correctIndex: number;
  pickedDisplayIndex: number | null;
}): string {
  const { displayIdx, originalIdx, correctIndex, pickedDisplayIndex } = params;
  const picked = pickedDisplayIndex !== null;
  const isThis = pickedDisplayIndex === displayIdx;
  const correct = originalIdx === correctIndex;
  const candy = OPTION_PALETTE[displayIdx % OPTION_PALETTE.length]!;
  let ring: string = candy;
  if (picked && isThis) {
    ring = correct
      ? "border-emerald-500 bg-emerald-100 text-emerald-900"
      : "border-rose-500 bg-rose-100 text-rose-900";
  } else if (picked && correct) {
    ring = "border-emerald-500 bg-emerald-100 text-emerald-900";
  } else if (picked) {
    ring = `${candy} opacity-55 saturate-75`;
  }
  return ring;
}
