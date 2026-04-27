import { Link } from "react-router-dom";
import { SiteBrandHomeLink } from "../layout/SiteBrandHomeLink";

export function DiscoverPageHeader() {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
      <SiteBrandHomeLink
        animatedIcon
        className="gap-3 sm:gap-4"
        subtitle={
          <p className="text-sm text-slate-600 line-clamp-2 sm:line-clamp-1">
            Learn English with fun stories and interactive pictures!
          </p>
        }
      />
      <Link
        to="/games"
        className="shrink-0 inline-flex items-center rounded-xl border-2 border-slate-100 bg-[#f4f4f4] px-3 py-2 text-sm font-semibold text-slate-700 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
      >
        Games
      </Link>
    </div>
  );
}
