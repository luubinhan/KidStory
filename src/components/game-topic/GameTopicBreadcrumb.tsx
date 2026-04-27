import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type GameTopicBreadcrumbProps = {
  topicTitle: string;
  questionIndex: number;
  questionCount: number;
};

export function GameTopicBreadcrumb({
  topicTitle,
  questionIndex,
  questionCount,
}: GameTopicBreadcrumbProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <Link
        to="/games"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-lg px-1"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        All topics
      </Link>
      <span className="text-slate-300" aria-hidden>
        /
      </span>
      <span className="text-sm font-semibold text-slate-900">{topicTitle}</span>
      <span className="text-slate-300" aria-hidden>
        /
      </span>
      <span className="text-sm font-semibold text-slate-900">
        Question {questionIndex + 1} of {questionCount}
      </span>
    </div>
  );
}
