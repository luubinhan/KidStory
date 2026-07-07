import type { CourseDictionaryEntry } from "../../types/course";
import { DictionaryWordCard } from "./DictionaryWordCard";

type DictionaryGridProps = {
  entries: readonly CourseDictionaryEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
};

export function DictionaryGrid({
  entries,
  selectedId,
  onSelect,
  searchQuery,
}: DictionaryGridProps) {
  if (entries.length === 0) {
    return (
      <div className="px-4 pb-8 text-center">
        <p className="text-sm font-medium text-slate-500">
          {searchQuery.trim()
            ? "Không tìm thấy từ vựng phù hợp."
            : "Chưa có từ vựng nào."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-8">
      {entries.map((entry) => (
        <DictionaryWordCard
          key={entry.id}
          entry={entry}
          isSelected={selectedId === entry.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
