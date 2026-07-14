import { Link } from "react-router-dom";
import { AppPageHeader } from "../components/layout";

export default function FishPondPage() {
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

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
          Fish Pond
        </h1>
        <p className="mb-8 text-slate-600">Coming soon</p>

        {/* Future PixiJS mount point */}
        <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100">
          <p className="text-sm font-medium text-slate-500">Game area</p>
        </div>
      </div>
    </div>
  );
}
