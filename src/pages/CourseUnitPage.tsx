import { Navigate, useParams } from "react-router-dom";
import { getCourseUnitById } from "../data/course";
import { useUserProgress } from "../contexts/UserProgressContext";
import { CourseBottomNav, UnitActivityList } from "../components/course";
import { CurrencyDisplay } from "../components/progress/CurrencyDisplay";
import { cn } from "../lib/utils";
import { ArrowLeft, Map } from "lucide-react";
import { Link } from "react-router-dom";

const pageShellClass = "relative min-h-screen pb-24";
const fallbackBgClass = "bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80";
const imageBgClass = "bg-center bg-top bg-no-repeat bg-cover";

export default function CourseUnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const unit = unitId ? getCourseUnitById(unitId) : undefined;
  const { isUnitAccessible, isLoading } = useUserProgress();

  if (!unit) {
    return (
      <div className={cn(pageShellClass, fallbackBgClass)}>
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

  if (!isLoading && !isUnitAccessible(unit)) {
    return <Navigate to="/course" replace />;
  }

  const Icon = unit.icon;

  return (
    <div
      className={cn(
        pageShellClass,
        unit.backgroundUrl ? imageBgClass : fallbackBgClass,
      )}
      style={
        unit.backgroundUrl
          ? { backgroundImage: `url(${unit.backgroundUrl})` }
          : undefined
      }
    >
      <div className="mx-auto px-4 py-6">
        <div className="mx-auto max-w-lg flex items-center justify-between gap-4">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded-lg"
          >
            <Map className="size-5" aria-hidden />
          </Link>
          <CurrencyDisplay />
        </div>

        <div className="mx-auto max-w-lg mt-24 flex items-center justify-center flex-col text-center gap-4">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-full",
              unit.iconBgClass,
            )}
          >
            <Icon className={cn("size-7", unit.iconColorClass)} aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">#{unit.unitNumber} {unit.title}</h1>
          </div>
        </div>

        <UnitActivityList unit={unit} />
      </div>
      <CourseBottomNav />
    </div>
  );
}
