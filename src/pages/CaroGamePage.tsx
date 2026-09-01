import { useState } from "react";
import { Link } from "react-router-dom";
import { CaroBoardCanvas } from "../components/games-v2/caro/CaroBoardCanvas";
import { CourseBottomNav } from "../components/course";
import { AlertDialog } from "../components/ui";
import { IMAGES_ACTIVITIES } from "../constants/images";
import { useCaroSession } from "../hooks/useCaroSession";
import { CRYSTAL_SRC } from "../components/games-v2/caro/CaroBoardCanvas";

export default function CaroGamePage() {
  const { state, place, undo, restart, canUndo } = useCaroSession();
  const [confirmNew, setConfirmNew] = useState(false);
  const playing = state.status === "playing";
  const turnSrc = CRYSTAL_SRC[state.turn];

  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24 bg-center bg-top bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${IMAGES_ACTIVITIES["complete-sentence"]})` }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {state.status === "draw" ? (
            <p className="text-2xl font-bold text-white drop-shadow">Draw</p>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={turnSrc}
                alt={state.status === "won" ? `${state.turn} wins` : `${state.turn} to play`}
                className="size-12 drop-shadow"
              />
              {state.status === "won" ? (
                <p className="text-2xl font-bold text-white drop-shadow">wins</p>
              ) : null}
            </div>
          )}
        </div>
        <CaroBoardCanvas
          board={state.board}
          winLine={state.winLine}
          lastMove={state.lastMove}
          disabled={!playing}
          onPlace={place}
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="inline-flex cursor-pointer items-center rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => setConfirmNew(true)}
            className="inline-flex cursor-pointer items-center rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            New game
          </button>
        </div>
      </div>
      {state.status !== "playing" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border-2 border-white bg-white p-6 text-center shadow-xl">
            {state.status === "draw" ? (
              <h2 className="text-2xl font-bold text-slate-900">Draw</h2>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <img src={turnSrc} alt={`${state.turn} wins`} className="size-16" />
                <h2 className="text-2xl font-bold text-slate-900">wins</h2>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="inline-flex cursor-pointer items-center rounded-xl border-2 border-yellow-400 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-yellow-800"
              >
                New game
              </button>
              <Link
                to="/games-v2"
                className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800"
              >
                Back to games
              </Link>
            </div>
          </div>
        </div>
      )}
      <AlertDialog
        open={confirmNew}
        onOpenChange={setConfirmNew}
        title="New game?"
        description="This board will be cleared."
        cancelLabel="Cancel"
        actionLabel="New game"
        onAction={() => {
          restart();
          setConfirmNew(false);
        }}
      />
      <CourseBottomNav />
    </div>
  );
}
