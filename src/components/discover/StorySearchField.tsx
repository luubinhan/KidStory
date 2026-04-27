import { Search, X } from "lucide-react";

type StorySearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function StorySearchField({ value, onChange }: StorySearchFieldProps) {
  return (
    <div className="relative w-full sm:flex-1 sm:min-w-0 sm:max-w-md lg:max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
      </div>
      <input
        type="text"
        placeholder="Search for a story..."
        className={`block w-full pl-10 py-2.5 sm:py-3 bg-[#f4f4f4] border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all text-base ${value ? "pr-10" : "pr-3"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search stories"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 rounded-r-xl sm:rounded-r-2xl"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      ) : null}
    </div>
  );
}
