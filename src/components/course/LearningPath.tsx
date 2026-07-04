import { useLayoutEffect, useRef } from "react";
import type { CourseUnit, CourseUnitStatus } from "../../types/course";
import { cn } from "../../lib/utils";
import { LearningPathConnector } from "./LearningPathConnector";
import { UnitCard } from "./UnitCard";

type LearningPathProps = {
  units: readonly CourseUnit[];
};

const UNIT_SEGMENT_HEIGHT_PX = 116;

function DecorativeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute left-4 top-24 size-16 rounded-full bg-white/40 blur-sm" aria-hidden />
      <div className="pointer-events-none absolute right-6 top-48 size-10 rounded-full bg-white/50 blur-sm" aria-hidden />
      <div className="pointer-events-none absolute left-8 top-[28rem] text-lg text-amber-200/80" aria-hidden>
        ✦
      </div>
      <div className="pointer-events-none absolute right-10 top-[18rem] text-sm text-amber-200/70" aria-hidden>
        ✦
      </div>
      <div className="pointer-events-none absolute right-16 top-[36rem] text-xs text-amber-200/60" aria-hidden>
        ✦
      </div>
    </>
  );
}

function UnitPathCounter({
  unitNumber,
  status,
}: {
  unitNumber: number;
  status: CourseUnitStatus;
}) {
  const isCurrent = status === "current";
  const isCompleted = status === "completed";

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 z-10 bg-white border-sky-200 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm",
        isCompleted && "border-emerald-400 bg-emerald-500 text-white",
        isCurrent && "animate-pulse border-sky-400 bg-sky-500 text-white ring-2 ring-sky-200",
      )}
      aria-hidden
    >
      {unitNumber}
    </div>
  );
}

export function LearningPath({ units }: LearningPathProps) {
  const currentUnitRef = useRef<HTMLDivElement>(null);
  const currentIndex = units.findIndex((unit) => unit.status === "current");

  useLayoutEffect(() => {
    if (currentIndex === -1) return;
    currentUnitRef.current?.scrollIntoView({ block: "start" });
  }, [currentIndex]);

  return (
    <section className="relative px-2 pb-8 pt-8">
      <DecorativeBackground />
      <LearningPathConnector
        unitCount={units.length}
        segmentHeight={UNIT_SEGMENT_HEIGHT_PX}
      />

      <div className="relative flex flex-col">
        {units.map((unit, index) => (
          <div
            key={unit.id}
            ref={index === currentIndex ? currentUnitRef : undefined}
            className={cn(
              "relative",
              index === currentIndex ? "scroll-mt-4" : undefined,
            )}
            style={{ minHeight: UNIT_SEGMENT_HEIGHT_PX }}
          >
            <UnitPathCounter unitNumber={unit.unitNumber} status={unit.status} />
            <UnitCard
              unit={unit}
              index={index}
              side={index % 2 === 0 ? "left" : "right"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
