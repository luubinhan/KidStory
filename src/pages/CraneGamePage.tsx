import { useState } from "react";
import { Link } from "react-router-dom";
import { CranePixiStage } from "../components/games-v2/crane/CranePixiStage";
import { CourseBottomNav } from "../components/course";
import { ActivityEndShell } from "../components/progress/ActivityEndShell";
import { useCraneSession } from "../hooks/useCraneSession";
import { getGameV2 } from "../data/gamesV2";
import { ASSETS } from "../constants/images";

export default function CraneGamePage() {
  const { canPlay, state, reward, onGrab, restart, playWord } = useCraneSession();
  const [stageKey, setStageKey] = useState(0);
  const game = getGameV2("crane");
  const diamondReward = game?.diamondReward ?? 10;
  const playing = state?.status === "playing";

  const handleRestart = () => {
    restart();
    setStageKey((k) => k + 1);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80">
      {!canPlay || !state ? (
        <p className="mx-auto mt-12 max-w-lg rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
          Not enough words to play Letter Crane yet.
        </p>
      ) : (
        <div className="relative h-screen overflow-hidden">
          <CranePixiStage
            key={stageKey}
            word={state.round.word}
            slots={state.round.slots}
            fieldLetters={state.round.fieldLetters}
            enabled={playing}
            onGrab={onGrab}
          />

          {playing ? (
            <>
              <button
                type="button"
                onClick={playWord}
                className="absolute top-10 right-0 left-0 z-10 mx-auto flex h-[230px] w-[200px] flex-col items-center gap-2"
                aria-label={`Play word ${state.round.target.word}`}
              >
                <div className="liquidGlass flex items-center rounded-full border border-emerald-200/30 bg-white/30 p-1 shadow-sm brightness-120 inset-shadow-sm inset-shadow-white/80 backdrop-blur-md backdrop-saturate-150">
                  <div className="flex size-32 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={state.round.target.imageSrc}
                      alt={state.round.target.word}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              </button>
              <div className="absolute top-10 right-10 z-10 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <img src={ASSETS.diamond} alt="" className="h-6" aria-hidden />
                  {diamondReward} diamonds
                </span>
              </div>
            </>
          ) : null}

          {state.status === "complete" ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-900/40 p-4">
              <div className="w-full max-w-md rounded-2xl bg-sky-100/20 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xl backdrop-blur-xs inset-shadow-white/80">
                <ActivityEndShell reward={reward}>
                  <h2 className="text-2xl font-bold text-white">Great job!</h2>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex cursor-pointer items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800"
                    >
                      Play again
                    </button>
                    <Link
                      to="/games-v2"
                      className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800"
                    >
                      Back to games
                    </Link>
                  </div>
                </ActivityEndShell>
              </div>
            </div>
          ) : null}
        </div>
      )}
      <CourseBottomNav />
    </div>
  );
}
