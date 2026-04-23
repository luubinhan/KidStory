import React, { forwardRef } from "react";
import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";

export const EndPage = forwardRef<HTMLDivElement, { onReset: () => void }>((props, ref) => {
  return (
    <div className="page" ref={ref} data-density="hard">
      <div className="page-content flex flex-col bg-yellow-100 items-center justify-center p-12 text-center">
        <motion.h2
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-4xl font-black text-slate-900 sm:text-5xl"
        >
          <span className="mr-2" aria-hidden>
            🎉
          </span>
          The End
        </motion.h2>
        <p className="mt-4 mb-10 text-lg text-slate-800 sm:text-xl">You did a great job reading!</p>

        <button
          type="button"
          onClick={props.onReset}
          className="inline-flex cursor-pointer items-center gap-3 px-8 py-4 bg-yellow-400 text-black font-bold rounded-3xl hover:bg-slate-800 transition-all shadow-xl"
        >
          <RotateCcw className="w-6 h-6" />
          Read Again
        </button>
      </div>
    </div>
  );
});

EndPage.displayName = "EndPage";
