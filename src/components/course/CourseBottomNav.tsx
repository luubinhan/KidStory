import { BookOpen, Gamepad2, Search, Trophy } from "lucide-react";
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
  { id: "study", label: "Study", icon: BookOpen, to: "/course" },
  { id: "dictionary", label: "Dictionary", icon: Search, to: "/dictionary" },
  { id: "games", label: "Games", icon: Gamepad2, to: "/games" },
  { id: "achievements", label: "Trophy", icon: Trophy, disabled: true },
];

export function CourseBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-100 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            (item.id === "study" &&
              (pathname === "/course" || pathname.startsWith("/course/"))) ||
            (item.id === "dictionary" && pathname === "/dictionary") ||
            (item.id === "games" &&
              (pathname === "/games" || pathname.startsWith("/games/")));

          const content = (
            <>
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </>
          );

          const className = cn(
            "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-colors",
            isActive && "bg-sky-500 text-white shadow-md shadow-sky-200",
            !isActive && !item.disabled && "text-slate-500 hover:text-sky-600",
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
