import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getCourseUnitById } from "../data/course";
import { CourseBottomNav, UnitActivityList } from "../components/course";
import { cn } from "../lib/utils";

const statusLabels = {
  completed: "Completed",
  current: "Current",
  locked: "Locked",
} as const;

export default function CourseUnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const unit = unitId ? getCourseUnitById(unitId) : undefined;

  if (!unit) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
        <div className="mx-auto max-w-lg px-4 py-8">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
          <h1 className="mt-6 text-xl font-bold text-slate-800">No lesson found.</h1>
          <p className="mt-2 text-slate-600">This lesson wasn't included in the journey.</p>
        </div>
        <CourseBottomNav />
      </div>
    );
  }

  const Icon = unit.icon;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <Link
          to="/course"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded-lg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>

        <div className="mt-6 rounded-2xl border-2 border-white bg-white p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-full",
                unit.iconBgClass,
              )}
            >
              <Icon className={cn("size-7", unit.iconColorClass)} aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Unit {unit.unitNumber}
              </p>
              <h1 className="text-2xl font-bold text-slate-800">{unit.title}</h1>
            </div>
          </div>

          <span
            className={cn(
              "mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold",
              unit.status === "completed" && "bg-emerald-100 text-emerald-700",
              unit.status === "current" && "bg-sky-100 text-sky-700",
              unit.status === "locked" && "bg-slate-100 text-slate-500",
            )}
          >
            {statusLabels[unit.status]}
          </span>

          <UnitActivityList unit={unit} />
        </div>
      </div>
      <CourseBottomNav />
    </div>
  );
}
