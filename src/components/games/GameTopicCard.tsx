import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CaseSensitiveIcon, SquareCheckIcon } from "lucide-react";
import type { GameTopic } from "../../types/game";

type GameTopicCardProps = {
  topic: GameTopic;
  index: number;
};

export function GameTopicCard({ topic, index }: GameTopicCardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.06 }}
    >
      <div className="flex h-full flex-col rounded-2xl bg-white border-2 border-slate-100 p-6 shadow-md transition-all duration-300 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-100/50">
        <h2 className="text-xl font-bold text-slate-900 mb-2">{topic.title}</h2>
        {topic.description ? (
          <p className="text-slate-600 text-sm flex-1 mb-4">{topic.description}</p>
        ) : (
          <p className="text-slate-500 text-sm flex-1 mb-4">
            {topic.questions.length} question{topic.questions.length === 1 ? "" : "s"}
          </p>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            to={`/games/${topic.id}`}
            className="rounded-xl w-40 h-20 flex items-center justify-center border-2 border-sky-500 bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
          >
            <SquareCheckIcon />
          </Link>
          <Link
            to={`/games/${topic.id}?mode=spell`}
            className="rounded-xl w-40 h-20 flex items-center justify-center border-2 border-yellow-500 bg-yellow-400 px-4 py-2.5 text-center text-sm font-semibold text-yellow-900 hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
          >
            <CaseSensitiveIcon />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
