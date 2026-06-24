import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { SiteBrandHomeLink } from "./SiteBrandHomeLink";

type SiteHeaderPrimaryNavProps = {
  /** When true, the logo uses the discover-page entrance motion */
  animatedBrand?: boolean;
  className?: string;
};

export function SiteHeaderPrimaryNav({ animatedBrand = true, className }: SiteHeaderPrimaryNavProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 sm:gap-4 min-w-0", className)}>
      <SiteBrandHomeLink animatedIcon={animatedBrand} className="gap-3 sm:gap-4" />
      <Link
        to="/games"
        className="shrink-0 inline-flex items-center rounded-xl border-2 border-slate-100 bg-[#f4f4f4] px-3 py-2 text-sm font-semibold text-slate-700 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
      >
        Games
      </Link>
      <Link
        to="/course"
        className="shrink-0 inline-flex items-center rounded-xl border-2 border-slate-100 bg-[#f4f4f4] px-3 py-2 text-sm font-semibold text-slate-700 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
      >
        Course
      </Link>
    </div>
  );
}
