import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PlayCircle } from "lucide-react";
import { ASSETS } from "../../constants/images";
import { courseActivities } from "../../data/course-activities";
import type { CourseUnit } from "../../types/course";
import { getActivityRewardAmounts } from "../../types/userProgress";
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

function ActivityRewardPreview({
  activity,
}: {
  activity: (typeof courseActivities)[number];
}) {
  const { coins, diamonds } = getActivityRewardAmounts(activity.id);
  const rewardLabel =
    diamonds > 0 ? `${coins} coin + ${diamonds} diamond` : `${coins} coin`;

  return (
    <p
      className="flex items-center justify-center gap-1 text-md font-semibold text-white mt-auto"
      aria-label={`Earn ${rewardLabel} on completion`}
    >
      <img src={ASSETS.coin} alt="" className="h-4" aria-hidden />
      <span>{coins}</span>
      {diamonds > 0 ? (
        <>
          <span aria-hidden>+</span>
          <img src={ASSETS.diamond} alt="" className="h-4" aria-hidden />
          <span>{diamonds}</span>
        </>
      ) : null}
    </p>
  );
}

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
      <ActivityRewardPreview activity={activity} />
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
      "flex h-full backdrop-brightness-120 inset-ring-2 inset-ring-amber-500/20 hover:scale-110 w-full flex-col items-center justify-center gap-2 rounded-2xl backdrop-blur-xs p-4 text-center shadow-sm transition-all cursor-pointer",
      cn("border-white", borderClass, "hover:shadow-lg hover:inset-shadow-sm hover:inset-shadow-sky-700/50"),
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
