import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";

export type PageNavSlotProps = {
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  canFirst: boolean;
  canPrev: boolean;
  canNext: boolean;
};

/** Prev / Next controls fixed to the vertical center of the left and right edges of the viewport. */
export function PageNavButtons({ onFirst, onPrev, onNext, canFirst, canPrev, canNext }: PageNavSlotProps) {
  const btnClass =
    "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-yellow-200/90 bg-yellow-500 text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-35 sm:h-11 sm:w-11";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex h-[100dvh] items-center justify-between"
      style={{
        paddingLeft: "max(0.75rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(0.75rem, env(safe-area-inset-right, 0px))",
      }}
      role="navigation"
      aria-label="Turn pages"
    >
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className={btnClass}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </button>
      </div>
      <div className="pointer-events-auto fixed inset-x-0 top-20 flex justify-center sm:top-24">
        <button
          type="button"
          onClick={onFirst}
          disabled={!canFirst}
          className={btnClass}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </button>
      </div>
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={btnClass}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
