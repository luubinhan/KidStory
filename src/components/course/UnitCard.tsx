import { Check, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { CourseUnit } from "../../types/course";
import { cn } from "../../lib/utils";

type UnitCardProps = {
  unit: CourseUnit;
  index: number;
  side: "left" | "right";
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} sao`}>
      {Array.from({ length: 3 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < count ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function UnitCard({ unit, index, side }: UnitCardProps) {
  const Icon = unit.icon;
  const isCurrent = unit.status === "current";
  const isCompleted = unit.status === "completed";

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "relative w-[11.5rem] rounded-2xl border-2 bg-white p-3.5 shadow-md",
        isCurrent && "border-sky-400 ring-2 ring-sky-200",
        isCompleted && "border-white",
      )}
    >
      {isCompleted ? (
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
        </span>
      ) : null}

      {isCurrent ? (
        <span className="absolute -right-1 -top-3 text-xl" aria-hidden>
          👦
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
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Unit {unit.unitNumber}
          </p>
          <p className="truncate text-sm font-bold text-slate-800">{unit.title}</p>
        </div>
      </div>

      <div className="mt-3">
        {isCurrent ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
            <Play className="size-3 fill-white" aria-hidden />
            Current
          </span>
        ) : null}
      </div>
    </motion.div>
  );

  return (
    <div
      className={cn(
        "relative flex w-full",
        side === "left" ? "justify-start pl-2" : "justify-end pr-2",
      )}
    >
      <Link
        to={`/course/${unit.id}`}
        className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
      >
        {cardContent}
      </Link>
    </div>
  );
}
