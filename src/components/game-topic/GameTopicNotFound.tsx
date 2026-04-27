import { Link } from "react-router-dom";

export function GameTopicNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Topic not found</h1>
      <p className="text-slate-600 mb-6">That game topic does not exist.</p>
      <Link
        to="/games"
        className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
      >
        Back to games
      </Link>
    </div>
  );
}
