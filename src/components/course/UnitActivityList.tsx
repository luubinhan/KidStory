import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, Lock } from "lucide-react";
import { courseActivities } from "../../data/course-activities";
import type { CourseUnit } from "../../types/course";
import { cn } from "../../lib/utils";

type UnitActivityListProps = {
  unit: CourseUnit;
};

function ActivityCardContent({
  activity,
  isLocked,
}: {
  activity: (typeof courseActivities)[number];
  isLocked: boolean;
}) {
  const Icon = activity.icon;

  return (
    <>
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          activity.iconBgClass,
        )}
      >
        {isLocked ? (
          <Lock className="size-5 text-slate-400" aria-hidden />
        ) : (
          <Icon className={cn("size-6", activity.iconColorClass)} aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-800">{activity.label}</p>
        <p className="text-sm text-slate-500">{activity.description}</p>
      </div>
      {!isLocked ? <ChevronRight className="size-5 shrink-0 text-slate-300" aria-hidden /> : null}
    </>
  );
}

export function UnitActivityList({ unit }: UnitActivityListProps) {
  const isLocked = unit.status === "locked";

  return (
    <div className="mt-6 space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Practice activities</h2>
      <ul className="space-y-3">
        {courseActivities.map((activity, index) => {
          const href = `/course/${unit.id}/practice/${activity.id}`;
          const cardClassName = cn(
            "flex items-center gap-4 rounded-2xl border-2 bg-white p-4 shadow-sm transition-all",
            isLocked
              ? "cursor-not-allowed border-slate-100 opacity-50"
              : cn("border-white", activity.borderClass, "hover:shadow-md"),
          );

          return (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {isLocked ? (
                <div className={cardClassName} aria-disabled="true">
                  <ActivityCardContent activity={activity} isLocked={isLocked} />
                </div>
              ) : (
                <Link
                  to={href}
                  className={cn(
                    cardClassName,
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
                  )}
                >
                  <ActivityCardContent activity={activity} isLocked={isLocked} />
                </Link>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
