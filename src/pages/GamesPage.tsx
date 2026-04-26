import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { gameTopics } from "../data/games";

export default function GamesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Games</h1>
        <p className="text-slate-600 max-w-2xl">
          Pick a topic and fill in the missing word. Tap the speaker to hear the sentence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {gameTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            className="h-full"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.06 }}
          >
            <Link
              to={`/games/${topic.id}`}
              className="group flex h-full flex-col rounded-2xl bg-white border-2 border-slate-100 p-6 shadow-md hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-100/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-yellow-700 transition-colors">
                {topic.title}
              </h2>
              {topic.description ? (
                <p className="text-slate-600 text-sm flex-1 mb-4">{topic.description}</p>
              ) : (
                <p className="text-slate-500 text-sm flex-1 mb-4">
                  {topic.questions.length} question{topic.questions.length === 1 ? "" : "s"}
                </p>
              )}
              <span className="text-sm font-semibold text-yellow-800">
                Play →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <Link
        to="/"
        className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
      >
        Back to stories
      </Link>
    </div>
  );
}
