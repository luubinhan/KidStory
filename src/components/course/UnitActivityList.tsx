import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PlayCircle } from "lucide-react";
import { courseActivities } from "../../data/course-activities";
import type { CourseUnit } from "../../types/course";
import { cn } from "../../lib/utils";
import { UnitLearnVideoModal } from "./UnitLearnVideoModal";

function getUnitActivities(unit: CourseUnit) {
  return courseActivities.filter(
    (activity) =>
      activity.id !== "complete-sentence" || unit.typedAnswerQuestions.length > 0,
  );
}

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
      <p className="font-bold text-slate-800">{activity.label}</p>
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
  const visibleActivities = getUnitActivities(unit);

  const cardClassName = (borderClass: string) =>
    cn(
      "flex h-full backdrop-brightness-120 hover:scale-110 w-full flex-col items-center justify-center gap-2 rounded-2xl backdrop-blur-xs p-4 text-center shadow-sm transition-all cursor-pointer",
      cn("border-white", borderClass, "hover:shadow-md"),
    );

  return (
    <>
      <div className="mt-8 flex justify-center items-center min-h-[30vh]">
        <ul className="flex max-w-full flex-wrap justify-center gap-3 sm:gap-4">
          {hasLearnVideo ? (
            <motion.li
              className="size-[9rem]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <button
                type="button"
                onClick={() => setLearnVideoOpen(true)}
                className={cn(
                  cardClassName(learnActivityStyles.borderClass),
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
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
                <p className="font-bold text-slate-800">{learnActivityStyles.label}</p>
              </button>
            </motion.li>
          ) : null}

          {visibleActivities.map((activity, index) => {
            const href = `/course/${unit.id}/practice/${activity.id}`;
            const activityIndex = hasLearnVideo ? index + 1 : index;

            return (
              <motion.li
                key={activity.id}
                className="size-[9rem]"
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
