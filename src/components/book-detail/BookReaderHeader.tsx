import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { Book } from "../../types/book";
import { SiteBrandHomeLink } from "../layout/SiteBrandHomeLink";

type BookReaderHeaderProps = {
  book: Book;
  indicatorLabel: string;
  canPrev: boolean;
  canNext: boolean;
  isFullscreen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleFullscreen: () => void;
  onShareFacebook: () => void;
};

export function BookReaderHeader({
  book,
  indicatorLabel,
  canPrev,
  canNext,
  isFullscreen,
  onPrev,
  onNext,
  onToggleFullscreen,
  onShareFacebook,
}: BookReaderHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-[#ffffff]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-3 py-3 md:gap-4 md:px-4">
        <SiteBrandHomeLink className="shrink-0" />

        <h1 className="min-w-0 flex-1 truncate text-center text-base font-bold text-slate-900 md:text-lg">
          {book.title}
        </h1>

        <p className="w-full shrink-0 text-center text-sm font-medium text-slate-500 md:w-auto md:text-left">
          {indicatorLabel}
        </p>

        <div className="flex w-full flex-wrap items-center justify-center gap-2 md:ml-auto md:w-auto">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canPrev}
            className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            aria-pressed={isFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>

          <button
            type="button"
            onClick={onShareFacebook}
            className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-[#1877F2] px-3 py-2 text-sm font-semibold text-white hover:bg-[#166FE5]"
          >
            <Facebook className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </header>
  );
}
