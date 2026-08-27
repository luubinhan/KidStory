import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CourseBottomNav } from "../components/course";
import { PicturePuzzlePlayfield } from "../components/games-v2/picture-puzzle/PicturePuzzlePlayfield";
import { IconVolumeButton } from "../components/game-topic/IconVolumeButton";
import { ActivityEndShell } from "../components/progress/ActivityEndShell";
import { IMAGES_ACTIVITIES } from "../constants/images";
import { usePicturePuzzleSession } from "../hooks/usePicturePuzzleSession";

export default function PicturePuzzleGamePage() {
  const {
    canPlay,
    item,
    board,
    tray,
    isComplete,
    reward,
    playWord,
    onDrag,
    restart,
  } = usePicturePuzzleSession();

  const [sessionPhase, setSessionPhase] = useState<"playing" | "summary">("playing");
  const completionHandledRef = useRef(false);

  useEffect(() => {
    if (!isComplete) {
      completionHandledRef.current = false;
      return;
    }
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;
    const id = window.setTimeout(() => setSessionPhase("summary"), 400);
    return () => window.clearTimeout(id);
  }, [isComplete]);

  const handleReplay = () => {
    restart();
    setSessionPhase("playing");
  };

  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24"
      style={{ backgroundImage: `url(${IMAGES_ACTIVITIES.flashcards})` }}
    >
      {!canPlay || !item ? (
        <p className="mx-auto mt-12 max-w-lg rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
          No puzzle words yet.
        </p>
      ) : sessionPhase === "summary" ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-sky-100/20 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-xl backdrop-blur-xs inset-shadow-white/80">
            <ActivityEndShell reward={reward}>
              <h2 className="text-2xl font-bold text-white">Great job!</h2>
              <p className="mt-2 text-sm font-semibold text-white/90">
                You built the picture for {item.word}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex cursor-pointer items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800 transition-colors hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
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
      ) : (
        <div className="mx-auto flex max-w-full flex-col px-4 py-6">
          <div className="mb-4 flex items-center justify-center gap-3">
            <p className="text-3xl font-bold capitalize text-slate-900">{item.word}</p>
            <IconVolumeButton aria-label={`Play ${item.word}`} onClick={playWord} />
          </div>
          <PicturePuzzlePlayfield
            imageSrc={item.image}
            board={board}
            tray={tray}
            disabled={isComplete}
            onDrag={onDrag}
          />
        </div>
      )}
      <CourseBottomNav />
    </div>
  );
}
