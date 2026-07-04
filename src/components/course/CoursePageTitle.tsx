import { Map } from "lucide-react";
import { cn } from "../../lib/utils";

type CoursePageTitleProps = {
  curriculumLabel: string;
  className?: string;
};

export function CoursePageTitle({ curriculumLabel, className }: CoursePageTitleProps) {
  return (
    <div className={cn("sticky top-0 z-20 px-4 pb-4 pt-4", className)}>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-sky-600 shadow-sm">
          <Map className="size-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sky-900">{curriculumLabel}</h1>
        </div>
      </div>
    </div>
  );
}
