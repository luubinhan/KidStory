import { Link } from "react-router-dom";
import { FishingPixiStage } from "../components/games-v2/fishing/FishingPixiStage";
import { ActivityEndShell } from "../components/progress/ActivityEndShell";
import { useFishingSession } from "../hooks/useFishingSession";
import { CourseBottomNav } from "../components/course";

export default function FishingGamePage() {
  const { pool, canPlay, session, reward, onFishTap, targetsNeeded, restart } =
    useFishingSession();

  const poolWords = pool.map((item) => item.word.toUpperCase());

  return (
    <div className="relative min-h-screen bg-center bg-top bg-no-repeat bg-cover bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80"
    >
        {!canPlay ? (
          <div className="mt-8 rounded-2xl border-2 border-slate-100 bg-white p-8 text-center">
            <p className="text-slate-600">Unlock more course units to play.</p>
            <Link
              to="/course"
              className="mt-4 inline-flex items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800 transition-colors hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
            >
              Go to course
            </Link>
          </div>
        ) : null}

        {canPlay && session ? (
          <div className="relative h-screen overflow-hidden">
            <div className="absolute right-0 top-10 left-0 flex flex-col items-center gap-2">
              <div className="flex size-32 items-center justify-center overflow-hidden rounded-full shadow-sm">
                <img
                  src={session.currentTarget.imageSrc}
                  alt={session.currentTarget.word}
                  className="size-full object-cover"
                />
              </div>
              <p className="text-lg font-bold text-slate-900">
                {session.correctCount} / {targetsNeeded}
              </p>
            </div>
            <FishingPixiStage
              targetWord={session.currentTarget.word}
              poolWords={poolWords}
              enabled={session.status === "playing"}
              onFishTap={onFishTap}
            />

            {session.status === "won" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-sky-900/40 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                  <ActivityEndShell reward={reward}>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Great fishing!
                    </h2>
                    <p className="mt-1 text-slate-600">
                      You caught all {targetsNeeded} target fish.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={restart}
                        className="inline-flex items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800 transition-colors hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
                      >
                        Play again
                      </button>
                      <Link
                        to="/games-v2"
                        className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
                      >
                        Back to games
                      </Link>
                    </div>
                  </ActivityEndShell>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      <CourseBottomNav />
    </div>
  );
}
