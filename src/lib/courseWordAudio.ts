import type { CourseWord } from "../types/course";

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/^['"]|['",.!?;:]+$/g, "");
}

function sentenceTokens(sentenceText: string): string[] {
  return sentenceText
    .trim()
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);
}

/** Longest unit vocabulary word with audio that appears in the sentence. */
export function findWordAudioInSentence(
  sentenceText: string,
  words: readonly CourseWord[],
): string | undefined {
  const tokens = sentenceTokens(sentenceText);
  if (tokens.length === 0) return undefined;

  const tokenSet = new Set(tokens);
  const withAudio = words.filter((w) => w.audio);
  const sorted = [...withAudio].sort((a, b) => b.word.length - a.word.length);

  for (const entry of sorted) {
    if (tokenSet.has(entry.word.toLowerCase())) {
      return entry.audio;
    }
  }

  return undefined;
}
