import { Settings, Zap } from "lucide-react";
import type { CourseProfile } from "../../types/course";
import { cn } from "../../lib/utils";

type CoursePageHeaderProps = {
  profile: CourseProfile;
  className?: string;
};

export function CoursePageHeader({ profile, className }: CoursePageHeaderProps) {
  const xpPercent = Math.round((profile.xpCurrent / profile.xpMax) * 100);

  return (
    <header className={cn("px-4 pt-4 pb-3", className)}>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="flex size-11 items-center justify-center rounded-full bg-white text-2xl shadow-md ring-2 ring-white">
            {profile.avatarEmoji}
          </div>
          <span className="absolute -bottom-1 -right-1 rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
            Lv{profile.level}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-slate-600">
            Xin chào! <span className="font-bold text-slate-800">{profile.name}</span> 👋
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/80 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-slate-600">
              <Zap className="size-3.5 fill-amber-400 text-amber-500" aria-hidden />
              {profile.xpCurrent} / {profile.xpMax} XP
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Cài đặt"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-200/80 text-sky-700 shadow-sm transition-colors hover:bg-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
        >
          <Settings className="size-5" aria-hidden />
        </button>
      </div>
    </header>
  );
}
