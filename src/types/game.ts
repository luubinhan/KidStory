/**
 * Static quiz content for vocabulary games by topic.
 */

export interface GameQuestion {
  id: string;
  /** Illustration URL (e.g. picsum seed or `/games/...` in public) */
  image: string;
  textBefore: string;
  textAfter: string;
  options: readonly string[];
  correctIndex: number;
  /** Optional narration under `public/` — use absolute path from site root */
  audioUrl?: string;
}

export interface GameTopic {
  id: string;
  title: string;
  description?: string;
  questions: readonly GameQuestion[];
}
