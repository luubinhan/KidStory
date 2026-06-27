const QUESTION_STARTERS = ["are you", "how are you", "what is", "where is"];

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function capitalizeSentence(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return "";
  words[0] = capitalizeWord(words[0]!);
  return words.join(" ");
}

/** Display/TTS form for lowercase stored practice sentence text. */
export function formatPracticeSentence(text: string): string {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return "";

  if (normalized === "yes i am") {
    return "Yes, I am.";
  }

  const capitalized = capitalizeSentence(normalized);
  const isQuestion =
    normalized.endsWith("?") ||
    QUESTION_STARTERS.some((starter) => normalized.startsWith(starter));

  if (isQuestion) {
    return capitalized.endsWith("?") ? capitalized : `${capitalized}?`;
  }

  return capitalized.endsWith(".") ? capitalized : `${capitalized}.`;
}
