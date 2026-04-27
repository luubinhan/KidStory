import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { GameTopic } from "../../types/game";

type GameTopicCardProps = {
  topic: GameTopic;
  index: number;
};

export function GameTopicCard({ topic, index }: GameTopicCardProps) {
  return (
    <motion.div className="h-full" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.06 }}>
      <Link
        to={`/games/${topic.id}`}
        className="group flex h-full flex-col rounded-2xl bg-white border-2 border-slate-100 p-6 shadow-md hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-100/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-yellow-700 transition-colors">{topic.title}</h2>
        {topic.description ? (
          <p className="text-slate-600 text-sm flex-1 mb-4">{topic.description}</p>
        ) : (
          <p className="text-slate-500 text-sm flex-1 mb-4">
            {topic.questions.length} question{topic.questions.length === 1 ? "" : "s"}
          </p>
        )}
        <span className="text-sm font-semibold text-yellow-800">Play →</span>
      </Link>
    </motion.div>
  );
}
