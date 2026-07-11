import { Volume2 } from "lucide-react";
import type { CourseDictionaryEntry } from "../../types/course";
import { cn, speak } from "../../lib/utils";
import { CourseWordImage } from "./CourseWordImage";

type DictionaryWordCardProps = {
  entry: CourseDictionaryEntry;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export function DictionaryWordCard({ entry, isSelected, onSelect }: DictionaryWordCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(entry.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(entry.id);
        }
      }}
      className={cn(
        "flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 bg-white p-3 text-center shadow-sm transition-all",
        isSelected
          ? "border-sky-500 ring-2 ring-sky-200"
          : "border-white hover:border-sky-200",
      )}
    >
      <CourseWordImage image={entry.image} translation={entry.translation} />
      <span className="mt-2 text-4xl font-bold text-sky-900">{entry.word}</span>
      <span className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{entry.translation}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          speak(entry.word, 0.9);
        }}
        className="mt-1.5 flex size-7 items-center justify-center rounded-full text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        aria-label={`Nghe phát âm ${entry.word}`}
      >
        <Volume2 className="size-3.5" aria-hidden />
      </button>
      <span className="mt-1 text-[10px] font-medium text-slate-400">Unit {entry.unitNumber}</span>
    </div>
  );
}
