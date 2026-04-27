import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import appIcon from "../../assets/app-icon.png";
import { cn } from "../../lib/utils";

type SiteBrandHomeLinkProps = {
  /** When true, the logo is wrapped in a short entrance motion */
  animatedIcon?: boolean;
  subtitle?: ReactNode;
  className?: string;
};

export function SiteBrandHomeLink({
  animatedIcon = false,
  subtitle,
  className,
}: SiteBrandHomeLinkProps) {
  const icon = <img src={appIcon} alt="KidStory - By Luu Binh An" className="w-14 h-14" />;

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex min-w-0 items-center gap-1 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        className,
      )}
    >
      {animatedIcon ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="shrink-0 flex items-center justify-center"
        >
          {icon}
        </motion.div>
      ) : (
        <div className="shrink-0 flex items-center justify-center">{icon}</div>
      )}
      <div className="min-w-0 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">KidStory</h1>
        {subtitle ?? null}
      </div>
    </Link>
  );
}
