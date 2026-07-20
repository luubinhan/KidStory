import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { HungryDogPixiStage } from "../components/games-v2/hungry-dog/HungryDogPixiStage";
import { McProgressHeader } from "../components/game-topic";
import { ActivityEndShell } from "../components/progress/ActivityEndShell";
import { useHungryDogSession } from "../hooks/useHungryDogSession";
import { useUserProgress } from "../contexts/UserProgressContext";
import { CourseBottomNav } from "../components/course";
import { ASSETS } from "../constants/images";

export default function HungryDogGamePage() {
  const { coins } = useUserProgress();
  const { canPlay, lesson, reward, puppyBaseAnim, onDrop, restart, playWord, targetsNeeded } =
    useHungryDogSession();
  const [busy, setBusy] = useState(false);
  const [stageKey, setStageKey] = useState(0);
  const coinRef = useRef<HTMLDivElement | null>(null);

  const handleRestart = () => {
    restart();
    setBusy(false);
    setStageKey((k) => k + 1);
  };

  const coinTarget =
    typeof window !== "undefined" && coinRef.current
      ? {
          x: coinRef.current.getBoundingClientRect().left + 20,
          y: coinRef.current.getBoundingClientRect().top + 20,
        }
      : undefined;

  return (
    <div className="relative min-h-screen bg-center bg-top bg-no-repeat bg-cover bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80">
      {!canPlay ? (
        <div className="p-8 text-center min-h-[90vh] flex flex-col items-center justify-center gap-4">
          <p className="text-slate-600">Unlock more course units to play.</p>
          <Link
            to="/games-v2/hungry-dog?unblock=all"
            className="mt-4 inline-flex items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800 transition-colors hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
          >
            or Unblock all units
          </Link>
        </div>
      ) : null}

      {canPlay && lesson ? (
        <div className="relative h-screen overflow-hidden">
          <HungryDogPixiStage
            key={stageKey}
            choices={lesson.round.choices}
            puppyBaseAnim={puppyBaseAnim}
            enabled={lesson.status === "playing" && !busy}
            onDrop={onDrop}
            onBusyChange={setBusy}
            coinTarget={coinTarget}
          />

          {lesson.status === "playing" ? (
            <>
              <div className="absolute top-10 left-10 z-10 w-48">
                <McProgressHeader
                  current={lesson.correctCount}
                  total={targetsNeeded}
                />
              </div>

              <button
                type="button"
                onClick={playWord}
                className="absolute w-[200px] h-[230px] ml-auto mr-auto right-0 top-10 left-0 flex flex-col items-center gap-2 z-10"
                aria-label={`Play word ${lesson.round.target.word}`}
              >
                <div className="liquidGlass brightness-120 p-1 flex items-center rounded-full shadow-sm backdrop-blur-md inset-shadow-sm inset-shadow-white/80 bg-white/30 border border-emerald-200/30 backdrop-saturate-150">
                  <div className="flex items-center overflow-hidden justify-center size-32 rounded-full">
                    <img
                      src={lesson.round.target.imageSrc}
                      alt={lesson.round.target.word}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              </button>

              <div
                ref={coinRef}
                className="absolute top-10 right-10 z-10"
              >
                <div className="liquidGlass brightness-120 p-1 flex items-center rounded-full shadow-sm backdrop-blur-md inset-shadow-sm inset-shadow-white/80 bg-white/30 border border-emerald-200/30 backdrop-saturate-150">
                  <div className="relative flex items-center gap-2 px-3 py-1.5">
                    <motion.img
                      key={coins}
                      src={ASSETS.coin}
                      alt=""
                      className="w-10"
                      initial={false}
                      animate={
                        coins > 0
                          ? { rotate: [0, -14, 12, -10, 8, -4, 0], scale: [1, 1.12, 1] }
                          : { rotate: 0, scale: 1 }
                      }
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                    <span className="text-lg font-bold text-slate-800 text-shadow-2xs text-shadow-white">{coins}</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {lesson.status === "complete" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-sky-900/40 p-4 z-20">
              <div className="w-full max-w-md rounded-2xl backdrop-blur-xs shadow-xl bg-sky-100/20 inset-shadow-white/80 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] inset-shadow-xs inset-shadow-white/8">
                <ActivityEndShell reward={reward}>
                  <h2 className="text-2xl font-bold text-white">Great job!</h2>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="cursor-pointer inline-flex items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800 transition-colors hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
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
