import { Search, X } from "lucide-react";

type DictionarySearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DictionarySearchField({ value, onChange }: DictionarySearchFieldProps) {
  return (
    <div className="px-4 pb-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-4 text-slate-400" aria-hidden />
        </div>
        <input
          type="text"
          placeholder="Tìm từ vựng..."
          className={`block w-full rounded-2xl border-2 border-white bg-white py-2.5 pl-10 text-base shadow-sm transition-all focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100 ${value ? "pr-10" : "pr-3"}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Tìm từ vựng"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded-r-2xl"
            aria-label="Xóa tìm kiếm"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
