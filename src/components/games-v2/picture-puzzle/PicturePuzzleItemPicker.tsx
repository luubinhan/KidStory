import { Check } from "lucide-react";
import type { PicturePuzzleItem } from "../../../data/picturePuzzleGame";
import { cn } from "../../../lib/utils";

type PicturePuzzleItemPickerProps = {
  items: readonly PicturePuzzleItem[];
  selectedId: string;
  disabled?: boolean;
  orientation: "horizontal" | "vertical";
  onSelect: (id: string) => void;
};

export function PicturePuzzleItemPicker({
  items,
  selectedId,
  disabled = false,
  orientation,
  onSelect,
}: PicturePuzzleItemPickerProps) {
  return (
    <ul
      className={cn(
        orientation === "horizontal"
          ? "flex gap-2 overflow-x-auto pb-1"
          : "flex max-h-[70vh] flex-col gap-2 overflow-y-auto",
      )}
    >
      {items.map((row) => {
        const selected = row.id === selectedId;
        return (
          <li key={row.id} className="shrink-0">
            <button
              type="button"
              disabled={disabled}
              aria-label={row.word}
              aria-pressed={selected}
              onClick={() => onSelect(row.id)}
              className={cn(
                "relative size-16 overflow-hidden rounded-xl border-2 bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400",
                selected ? "border-yellow-400" : "border-white",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <img
                src={row.image}
                alt=""
                className="size-full object-cover"
              />
              {selected ? (
                <span className="absolute right-0.5 bottom-0.5 flex size-5 items-center justify-center rounded-full bg-yellow-400 text-yellow-950">
                  <Check className="size-3.5" aria-hidden />
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
