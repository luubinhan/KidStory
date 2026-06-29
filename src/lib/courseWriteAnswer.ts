export function normalizeWriteAnswer(value: string): string {
  return value.trim().toLowerCase();
}

export function isWriteAnswerCorrect(input: string, expected: string): boolean {
  return normalizeWriteAnswer(input) === normalizeWriteAnswer(expected);
}
