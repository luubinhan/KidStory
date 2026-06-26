import { useCallback, useMemo, useState } from "react";
import type { CourseDictionaryEntry } from "../types/course";

type MatchSide = "word" | "emoji";

type SelectedItem = {
  side: MatchSide;
  entryId: string;
};

function shuffleIds(ids: string[]): string[] {
  const copy = [...ids];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function useCourseMatching(entries: readonly CourseDictionaryEntry[]) {
  const entryMap = useMemo(
    () => new Map(entries.map((entry) => [entry.id, entry])),
    [entries],
  );

  const wordOrder = useMemo(() => shuffleIds(entries.map((entry) => entry.id)), [entries]);
  const emojiOrder = useMemo(() => shuffleIds(entries.map((entry) => entry.id)), [entries]);

  const [matchedIds, setMatchedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [wrongPair, setWrongPair] = useState<readonly [string, string] | null>(null);

  const isComplete = matchedIds.size === entries.length;

  const selectItem = useCallback(
    (side: MatchSide, entryId: string) => {
      if (matchedIds.has(entryId)) return;

      if (!selected) {
        setSelected({ side, entryId });
        return;
      }

      if (selected.side === side) {
        setSelected({ side, entryId });
        return;
      }

      if (selected.entryId === entryId) {
        setMatchedIds((prev) => new Set([...prev, entryId]));
        setSelected(null);
        setWrongPair(null);
        return;
      }

      const wrongWordId = selected.side === "word" ? selected.entryId : entryId;
      const wrongEmojiId = selected.side === "emoji" ? selected.entryId : entryId;
      setWrongPair([wrongWordId, wrongEmojiId]);
      setSelected(null);

      window.setTimeout(() => {
        setWrongPair(null);
      }, 600);
    },
    [matchedIds, selected],
  );

  const isSelected = useCallback(
    (side: MatchSide, entryId: string) =>
      selected?.side === side && selected.entryId === entryId,
    [selected],
  );

  const isWrong = useCallback(
    (side: MatchSide, entryId: string) => {
      if (!wrongPair) return false;
      const [wordId, emojiId] = wrongPair;
      return side === "word" ? entryId === wordId : entryId === emojiId;
    },
    [wrongPair],
  );

  return {
    entryMap,
    wordOrder,
    emojiOrder,
    matchedIds,
    isComplete,
    selectItem,
    isSelected,
    isWrong,
  };
}
