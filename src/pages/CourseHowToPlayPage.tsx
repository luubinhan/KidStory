import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { courseActivities } from "../data/course-activities";
import {
  howToPlayActivityTips,
  howToPlayCtaLabel,
  howToPlayFlowSteps,
  howToPlayHero,
  howToPlaySections,
} from "../data/howToPlay";
import {
  COIN_HINT_COST,
  COIN_PER_ACTIVITY,
  COIN_UNIT_BONUS,
  getActivityRewardAmounts,
} from "../types/userProgress";

export default function CourseHowToPlayPage() {
  const writeRewards = getActivityRewardAmounts("write");
  const matchingRewards = getActivityRewardAmounts("matching");
  const completeSentenceRewards = getActivityRewardAmounts("complete-sentence");

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-12">
      <div className="mx-auto max-w-lg px-4 py-6">
        <Link
          to="/course"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to course
        </Link>

        <header className="mt-6">
          <h1 className="text-2xl font-bold text-sky-900">{howToPlayHero.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {howToPlayHero.subtitle}
          </p>
        </header>

        <section className="mt-8" aria-labelledby="how-to-flow">
          <h2 id="how-to-flow" className="text-lg font-bold text-slate-800">
            {howToPlaySections.flow}
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            {howToPlayFlowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-8" aria-labelledby="how-to-activities">
          <h2 id="how-to-activities" className="text-lg font-bold text-slate-800">
            {howToPlaySections.activities}
          </h2>
          <ul className="mt-3 space-y-3">
            {courseActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <li
                  key={activity.id}
                  className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${activity.iconBgClass}`}
                    >
                      <Icon
                        className={`size-5 ${activity.iconColorClass}`}
                        aria-hidden
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800">{activity.label}</h3>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {activity.description}
                      </p>
                      <p className="mt-2 text-sm font-medium text-sky-800">
                        {howToPlayActivityTips[activity.id]}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="how-to-rewards">
          <h2 id="how-to-rewards" className="text-lg font-bold text-slate-800">
            {howToPlaySections.rewards}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            <li>
              Finishing an activity usually awards {COIN_PER_ACTIVITY} coins.
              Write awards {writeRewards.coins} coins, Matching awards{" "}
              {matchingRewards.coins} coins, and Complete the sentence awards{" "}
              {completeSentenceRewards.coins} coins.
            </li>
            <li>
              Diamonds come only from Write ({writeRewards.diamonds}) and Complete
              the sentence ({completeSentenceRewards.diamonds}).
            </li>
            <li>Hints cost {COIN_HINT_COST} coin each.</li>
            <li>
              Completing every activity in a unit awards a {COIN_UNIT_BONUS}-coin
              unit bonus.
            </li>
            <li>
              Spend coins in Assets to decorate the farm. Some premium items also
              need diamonds.
            </li>
          </ul>
        </section>

        <div className="mt-10">
          <Link
            to="/course"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-center text-base font-bold text-white shadow-sm hover:bg-sky-700"
          >
            {howToPlayCtaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
