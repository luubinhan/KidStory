import { Link } from "react-router-dom";

export function GamesBackToStoriesLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
    >
      Back to stories
    </Link>
  );
}
