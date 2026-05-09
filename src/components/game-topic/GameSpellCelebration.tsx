// TODO: Replace `spellCelebrationPlaceholderLottie.json` with the provided Lottie asset when ready.
import Lottie from "lottie-react";
import animationData from "../../data/spellCelebrationPlaceholderLottie.json";

type GameSpellCelebrationProps = {
  className?: string;
};

export function GameSpellCelebration({ className }: GameSpellCelebrationProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-green-200 bg-green-50 px-4 py-3 ${className ?? ""}`}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-green-800">You did it!</p>
      <div className="h-20 w-20">
        <Lottie animationData={animationData} loop className="h-full w-full" />
      </div>
    </div>
  );
}
