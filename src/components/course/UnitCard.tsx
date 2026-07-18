import { Check, Lock } from "lucide-react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import notificationBell from "../../assets/dog.json";
import type { CourseUnit, CourseUnitStatus } from "../../types/course";
import { cn } from "../../lib/utils";

type UnitCardProps = {
  unit: CourseUnit;
  index: number;
  side: "left" | "right";
  status: CourseUnitStatus;
  completedCount: number;
  totalCount: number;
};

function UnitPathCounter({
  unitNumber,
  status,
}: {
  unitNumber: number;
  status: CourseUnitStatus;
}) {
  const isCurrent = status === "current";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-sm font-bold shadow-sm",
        isCompleted && "border-emerald-400 bg-emerald-500 text-white",
        isCurrent && "animate-pulse border-sky-400 bg-sky-500 text-white ring-2 ring-sky-200",
        isLocked && "border-slate-200 bg-slate-100 text-slate-400",
        !isCompleted && !isCurrent && !isLocked && "border-sky-200 text-slate-600",
      )}
      aria-hidden
    >
      {isLocked ? <Lock className="size-3.5" /> : unitNumber}
    </div>
  );
}

export function UnitCard({ unit, index, side, status, completedCount, totalCount }: UnitCardProps) {
  const Icon = unit.icon;
  const isCurrent = status === "current";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isLocked ? 0.55 : 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "relative z-100 w-[11.5rem] rounded-2xl p-3.5 backdrop-blur-lg bg-sky-100/20 shadow-sm inset-shadow-xs inset-shadow-white/80",
        isCurrent && "border-sky-400 ring-2 ring-sky-200 bg-white shadow-md border-2",
        isCompleted && "backdrop-opacity-10 border-none border-2",
        isLocked && "grayscale",
        "transition-all hover:scale-[1.1] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
      )}
    >
      {isCompleted ? (
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
        </span>
      ) : null}

      {isLocked ? (
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-slate-400 text-white shadow">
          <Lock className="size-3" aria-hidden />
        </span>
      ) : null}

      {isCurrent ? (
        <span className="absolute -left-[62px] top-26px] text-xl z-10" aria-hidden>
          <div className="mx-auto h-18 w-18">
            <Lottie animationData={notificationBell} loop={true} className="h-full w-full" />
          </div>
        </span>
      ) : null}

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            unit.iconBgClass,
          )}
        >
          <Icon className={cn("size-5", unit.iconColorClass)} aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-800">
            Unit {unit.unitNumber}
          </p>
          <p className="text-sm font-bold text-slate-800">{unit.title}</p>
          {!isLocked && (
          <p className="mt-2 text-[10px] font-semibold text-slate-800">
            {completedCount}/{totalCount} activities
          </p>)}
        </div>
      </div>

      {isLocked && (
        <p className="mt-2 text-[10px] font-semibold text-white">Locked</p>
      )}
    </motion.div>
  );

  return (
    <div
      className={cn(
        "relative flex w-full",
        side === "left" ? "justify-start pl-2" : "justify-end pr-2",
      )}
    >
      <UnitPathCounter unitNumber={unit.unitNumber} status={status} />

      {isLocked ? (
        <div className="rounded-2xl" aria-disabled="true">
          {cardContent}
        </div>
      ) : (
        <Link
          to={`/course/${unit.id}`}
          className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
        >
          {cardContent}
        </Link>
      )}
    </div>
  );
}
