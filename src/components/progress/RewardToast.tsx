import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type RewardToastProps = {
  message: string | null;
  onDone?: () => void;
};

export function RewardToast({ message, onDone }: RewardToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, onDone]);

  return (
    <AnimatePresence>
      {visible && message ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4"
        >
          <div className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg ring-2 ring-amber-200">
            {message}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function formatActivityReward(
  coinsEarned: number,
  unitBonusEarned: number,
  achievementUnlocked: string | null,
  achievementReward: number,
  diamondsEarned: number,
): string {
  const parts: string[] = [`+${coinsEarned - unitBonusEarned - achievementReward} coin`];

  if (diamondsEarned > 0) {
    parts.push(`+${diamondsEarned} diamond`);
  }

  if (unitBonusEarned > 0) {
    parts.push(`+${unitBonusEarned} unit bonus`);
  }

  if (achievementUnlocked && achievementReward > 0) {
    parts.push(`+${achievementReward} treasure reward`);
  }

  return parts.join(" · ");
}
