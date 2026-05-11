import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CaseSensitiveIcon, ListOrdered, SquareCheckIcon } from "lucide-react";
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
        <div className="mt-auto grid grid-cols-3 gap-2">
          <Link
            to={`/games/${topic.id}`}
            title="Multiple choice"
            aria-label="Open multiple choice game"
            className="rounded-xl flex h-20 items-center justify-center border-2 border-sky-500 bg-sky-500 px-2 text-white hover:bg-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
          >
            <SquareCheckIcon className="size-8 shrink-0" aria-hidden />
          </Link>
          <Link
            to={`/games/${topic.id}?mode=spell`}
            title="Spell the word"
            aria-label="Open spell the letters game"
            className="rounded-xl flex h-20 items-center justify-center border-2 border-yellow-500 bg-yellow-400 px-2 text-yellow-900 hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
          >
            <CaseSensitiveIcon className="size-8 shrink-0" aria-hidden />
          </Link>
          <Link
            to={`/games/${topic.id}?mode=sentence`}
            title="Order the sentence"
            aria-label="Open order the words game"
            className="rounded-xl flex h-20 items-center justify-center border-2 border-emerald-600 bg-emerald-500 px-2 text-white hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
          >
            <ListOrdered className="size-8 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
