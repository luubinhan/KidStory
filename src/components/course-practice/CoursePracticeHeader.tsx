import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { CourseActivity, CourseUnit } from "../../types/course";

type CoursePracticeHeaderProps = {
  unit: CourseUnit;
  activity: CourseActivity;
  questionLabel?: string;
};

export function CoursePracticeHeader({ unit, activity, questionLabel }: CoursePracticeHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        to={`/course/${unit.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded-lg"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Back to unit {unit.unitNumber} · {unit.title}
      </Link>
      {questionLabel && (
        <p className="mt-1 text-sm font-semibold text-slate-500">{questionLabel}</p>
      )}
    </div>
  );
}
