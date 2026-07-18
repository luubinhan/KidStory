import { BookOpen, Map, Search, Boxes, Gamepad2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: typeof BookOpen;
  to?: string;
  disabled?: boolean;
};

const navItems: NavItem[] = [
  { id: "course", label: "Home", icon: Map, to: "/course" },
  { id: "games-v2", label: "Games", icon: Gamepad2, to: "/games-v2" },
  { id: "dictionary", label: "Dictionary", icon: Search, to: "/dictionary" },
  // { id: "games", label: "Games", icon: Gamepad2, to: "/games" },
  { id: "assets", label: "Assets", icon: Boxes, to: "/assets" },
];

export function CourseBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed z-1000 inset-x-0 bottom-0 z-30 backdrop-blur-lg bg-sky-100/20 shadow-sm inset-shadow-xs inset-shadow-white/80 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto flex gap-4 justify-center w-full max-w-lg ">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.includes(item.to || "");

          const content = (
            <>
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="text-center text-[11px] font-semibold leading-tight">
                {item.label}
              </span>
            </>
          );

          const className = cn(
            "mx-auto flex w-full max-w-[5.5rem] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition-colors",
            isActive && "candy-glass-btn",
            !isActive && "candy-glass-btn--idle",
            item.disabled && "cursor-not-allowed text-slate-300",
          );

          if (item.disabled || !item.to) {
            return (
              <span key={item.id} className={className} aria-disabled="true">
                {content}
              </span>
            );
          }

          return (
            <Link key={item.id} to={item.to} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
