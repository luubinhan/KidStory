import { BookOpen } from "lucide-react";
import { cn } from "../../lib/utils";

type DictionaryPageTitleProps = {
  className?: string;
};

export function DictionaryPageTitle({ className }: DictionaryPageTitleProps) {
  return (
    <div className={cn("px-4 pb-3", className)}>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-sky-600 shadow-sm">
          <BookOpen className="size-5" aria-hidden />
        </div>
        <h1 className="text-xl font-bold text-sky-900">Từ điển hình ảnh</h1>
      </div>
    </div>
  );
}
