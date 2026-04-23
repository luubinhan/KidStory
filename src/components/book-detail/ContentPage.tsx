import React, { forwardRef } from "react";
import { Volume2 } from "lucide-react";
import { motion } from "motion/react";
import type { StoryPage } from "../../types/book";

export const ContentPage = forwardRef<HTMLDivElement, { page: StoryPage; pageNum: number }>((props, ref) => {
  const { page, pageNum } = props;

  const readAloud = () => {
    const utterance = new SpeechSynthesisUtterance(page.sentence);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const playWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page bg-white shadow-inner border-l border-slate-100" ref={ref}>
      <div className="page-content flex h-full min-h-0 flex-col overflow-y-auto p-8 md:p-12 justify-center bg-yellow-50/30">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
          {page.sentence}
        </h2>

        <button
          onClick={readAloud}
          className="inline-flex cursor-pointer items-center gap-3 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-2xl transition-all w-fit shadow-lg shadow-yellow-200 mb-12"
        >
          <Volume2 className="w-6 h-6" />
          Read Aloud
        </button>

        <div className="grid grid-cols-1 gap-4 max-w-sm">
          {page.vocabulary.map((vocab, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => playWord(vocab.word)}
              className="flex items-center gap-4 p-3 rounded-2xl bg-white hover:bg-yellow-100 transition-colors border-2 border-slate-50 hover:border-yellow-200 shadow-sm"
            >
              <img
                src={vocab.image}
                alt={vocab.word}
                className="w-16 h-16 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-xl text-slate-700">{vocab.word}</span>
            </motion.button>
          ))}
        </div>

        <div className="absolute bottom-4 right-6 text-slate-300 font-mono text-sm">
          {pageNum}
        </div>
      </div>
    </div>
  );
});

ContentPage.displayName = "ContentPage";
