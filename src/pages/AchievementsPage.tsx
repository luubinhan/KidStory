import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import { CourseBottomNav } from "../components/course";
import { CoinDisplay } from "../components/progress/CoinDisplay";
import { useUserProgress } from "../contexts/UserProgressContext";
import { getUnitsAtLeastHalfComplete } from "../lib/userProgressLogic";
import { COIN_TREASURE_MIRROR_REWARD, TREASURE_MIRROR_UNITS_REQUIRED } from "../types/userProgress";
import { cn } from "../lib/utils";

export default function AchievementsPage() {
  const { progress } = useUserProgress();
  const treasureMirror = progress.achievements.treasure_mirror;
  const unitsAtHalf = getUnitsAtLeastHalfComplete(progress);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Study
          </Link>
          <CoinDisplay />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-800">Achievements</h1>
        <p className="mt-1 text-sm text-slate-600">Collect rewards as you learn!</p>

        <div className="mt-8 grid gap-4">
          <article
            className={cn(
              "rounded-2xl border-2 bg-white p-5 shadow-sm",
              treasureMirror ? "border-amber-300" : "border-slate-200",
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl",
                  treasureMirror ? "bg-amber-100" : "bg-slate-100",
                )}
                aria-hidden
              >
                {treasureMirror ? "🪞" : <Lock className="size-6 text-slate-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-slate-800">Gương kho báu</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Complete at least 50% of activities in {TREASURE_MIRROR_UNITS_REQUIRED} units.
                </p>
                {treasureMirror ? (
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    <Sparkles className="size-3.5" aria-hidden />
                    Unlocked · +{COIN_TREASURE_MIRROR_REWARD} coin
                  </p>
                ) : (
                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    Progress: {unitsAtHalf}/{TREASURE_MIRROR_UNITS_REQUIRED} units
                  </p>
                )}
              </div>
            </div>
          </article>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">More achievements coming soon!</p>
      </div>
      <CourseBottomNav />
    </div>
  );
}
