import { Map } from "lucide-react";
import { cn } from "../../lib/utils";

type CoursePageTitleProps = {
  curriculumLabel: string;
  className?: string;
};

export function CoursePageTitle({ curriculumLabel, className }: CoursePageTitleProps) {
  return (
    <div className={cn("sticky top-0 z-20 bg-sky-50/95 px-4 pb-4 pt-4 backdrop-blur-sm", className)}>
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-sky-600 shadow-sm">
          <Map className="size-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sky-900">Hành trình học tập</h1>
          <p className="mt-0.5 text-sm font-medium text-sky-600/80">{curriculumLabel}</p>
        </div>
      </div>
    </div>
  );
}
