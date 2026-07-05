import { Zap } from "lucide-react";
import type { CourseProfile } from "../../types/course";
import { cn } from "../../lib/utils";
import { SettingsTrigger } from "../settings/SettingsTrigger";

type CoursePageHeaderProps = {
  profile: CourseProfile;
  className?: string;
};

export function CoursePageHeader({ profile, className }: CoursePageHeaderProps) {
  const xpPercent = Math.min(100, Math.round((profile.xpCurrent / profile.xpMax) * 100));

  return (
    <header
      className={cn(
        "sticky top-0 z-20 bg-sky-50/95 px-4 pb-3 pt-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 shrink items-center gap-2">
          <div className="relative shrink-0">
            <div className="flex size-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-2 ring-white">
              {profile.avatarEmoji}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
              Lv{profile.level}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-sky-600/80">Xin chào!</p>
            <p className="truncate text-sm font-bold text-sky-900">
              {profile.name} 👋
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1">
          <Zap className="size-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="h-2.5 overflow-hidden rounded-full bg-sky-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="mt-0.5 truncate text-center text-[10px] font-semibold text-sky-700">
              {profile.xpCurrent} / {profile.xpMax} XP
            </p>
          </div>
        </div>

        <SettingsTrigger />
      </div>
    </header>
  );
}
