import { Link } from "react-router-dom";
import { AppPageHeader } from "../components/layout";

export default function FishingGamePage() {
  return (
    <div>
      <AppPageHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <Link
          to="/games-v2"
          className="mb-6 inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
        >
          Back to games
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Fishing Game
        </h1>
        <p className="mt-2 text-slate-600">Loading…</p>
      </div>
    </div>
  );
}
