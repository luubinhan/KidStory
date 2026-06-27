import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, PlayCircle } from "lucide-react";
import { courseActivities } from "../../data/course-activities";
import type { CourseUnit } from "../../types/course";
import { cn } from "../../lib/utils";
import { UnitLearnVideoModal } from "./UnitLearnVideoModal";

type UnitActivityListProps = {
  unit: CourseUnit;
};

function ActivityCardContent({
  activity,
}: {
  activity: (typeof courseActivities)[number];
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
        <Icon className={cn("size-6", activity.iconColorClass)} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-800">{activity.label}</p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-slate-300" aria-hidden />
    </>
  );
}

const learnActivityStyles = {
  label: "Learn",
  icon: PlayCircle,
  iconBgClass: "bg-indigo-100",
  iconColorClass: "text-indigo-600",
  borderClass: "border-indigo-200 hover:border-indigo-400",
} as const;

export function UnitActivityList({ unit }: UnitActivityListProps) {
  const [learnVideoOpen, setLearnVideoOpen] = useState(false);
  const hasLearnVideo = Boolean(unit.youtubeVideoId);
  const LearnIcon = learnActivityStyles.icon;

  const cardClassName = (borderClass: string) =>
    cn(
      "flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 shadow-sm transition-all cursor-pointer",
      cn("border-white", borderClass, "hover:shadow-md"),
    );

  return (
    <>
      <div className="mt-6 space-y-3">
        <ul className="space-y-3">
          {hasLearnVideo ? (
            <motion.li
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <button
                type="button"
                onClick={() => setLearnVideoOpen(true)}
                className={cn(
                  cardClassName(learnActivityStyles.borderClass),
                  "text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
                )}
              >
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl",
                    learnActivityStyles.iconBgClass,
                  )}
                >
                  <LearnIcon
                    className={cn("size-6", learnActivityStyles.iconColorClass)}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">{learnActivityStyles.label}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-slate-300" aria-hidden />
              </button>
            </motion.li>
          ) : null}

          {courseActivities.map((activity, index) => {
            const href = `/course/${unit.id}/practice/${activity.id}`;
            const activityIndex = hasLearnVideo ? index + 1 : index;

            return (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: activityIndex * 0.05 }}
              >
                <Link
                  to={href}
                  className={cn(
                    cardClassName(activity.borderClass),
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
                  )}
                >
                  <ActivityCardContent activity={activity} />
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {learnVideoOpen && unit.youtubeVideoId ? (
        <UnitLearnVideoModal
          videoId={unit.youtubeVideoId}
          title={`Learn — ${unit.title}`}
          onClose={() => setLearnVideoOpen(false)}
        />
      ) : null}
    </>
  );
}
