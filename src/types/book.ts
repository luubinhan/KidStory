/**
 * Domain types for KidStory book content (static JSON-shaped data).
 */

/** Flashcard-style vocabulary item with an illustrative image */
export interface Vocabulary {
  word: string;
  /** Image URL for the vocabulary cue */
  image?: string;
  audio?: string;
  position?: Partial<Record<"top" | "left", number>>;
}

/** One story spread: illustration + sentence + related vocabulary */
export interface StoryPage {
  /** Main illustration for this spread */
  image: string;
  sentence: string;
  vocabulary: Vocabulary[];
}

/** A discoverable story with cover metadata and ordered pages */
export interface Book {
  id: string;
  title: string;
  /** Cover image URL */
  cover: string;
  description: string;
  pages: readonly StoryPage[];
}
