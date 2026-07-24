import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FishingPixiStage } from "../components/games-v2/fishing/FishingPixiStage";
import { ActivityEndShell } from "../components/progress/ActivityEndShell";
import { useFishingSession } from "../hooks/useFishingSession";
import { CourseBottomNav } from "../components/course";
import BucketIcon from "../assets/games/bucket-svgrepo-com.svg?react";

export default function FishingGamePage() {
  const { pool, session, reward, onFishTap, restart } = useFishingSession();

  const poolWords = pool.map((item) => item.word.toUpperCase());

  return (
    <div className="relative min-h-screen bg-center bg-top bg-no-repeat bg-cover bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80"
    >
        {session ? (
          <div className="relative h-screen overflow-hidden">
            <div className="absolute w-[200px] h-[230px] ml-auto mr-auto right-0 top-10 left-0 flex flex-col items-center gap-2">
              <div className="liquidGlass brightness-120 p-1 flex items-center rounded-full  shadow-sm backdrop-blur-md inset-shadow-sm inset-shadow-white/80 bg-white/30 border border-emerald-200/30 backdrop-saturate-150">
                <div className="flex items-center overflow-hidden justify-center size-32 rounded-full">                
                    <img
                      src={session.currentTarget.imageSrc}
                      alt={session.currentTarget.word}
                      className="size-full object-cover"
                    />
                </div>
              </div>
            </div>
            <div className="absolute top-10 right-10">
              <div className="liquidGlass brightness-120 p-1 flex items-center rounded-full shadow-sm backdrop-blur-md inset-shadow-sm inset-shadow-white/80 bg-white/30 border border-emerald-200/30 backdrop-saturate-150">
                <div className="relative size-10 rounded-full flex items-center justify-center gap-1">
                  <motion.div
                    key={session.correctCount}
                    initial={false}
                    animate={
                      session.correctCount > 0
                        ? {
                            rotate: [0, -14, 12, -10, 8, -4, 0],
                            scale: [1, 1.12, 1],
                          }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <>
                    <BucketIcon className="size-8" aria-hidden />
                    
                    <div className="absolute -top-1 -right-1 
                    rounded-full bg-green-900 size-5 flex items-center justify-center text-lg 
                    font-bold text-white">
                      {session.correctCount}
                    </div>
                    </>
                  </motion.div>
                </div>
              </div>
            </div>
            <FishingPixiStage
              targetWord={session.currentTarget.word}
              poolWords={poolWords}
              enabled={session.status === "playing"}
              onFishTap={onFishTap}
            />

            {session.status === "won" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-sky-900/40 p-4">
                <div className="w-full max-w-md rounded-2xl backdrop-blur-xs shadow-xl bg-sky-100/20 inset-shadow-white/80 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] inset-shadow-xs inset-shadow-white/8">
                  <ActivityEndShell reward={reward}>
                    <h2 className="text-2xl font-bold text-white">
                      Great fishing!
                    </h2>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={restart}
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
