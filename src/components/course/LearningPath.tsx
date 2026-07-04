import { useLayoutEffect, useRef } from "react";
import type { CourseUnit } from "../../types/course";
import { useUserProgress } from "../../contexts/UserProgressContext";
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

export function LearningPath({ units }: LearningPathProps) {
  const { getUnitStatus, getUnitProgress, isLoading } = useUserProgress();
  const currentUnitRef = useRef<HTMLDivElement>(null);
  const currentIndex = units.findIndex((unit) => getUnitStatus(unit) === "current");

  useLayoutEffect(() => {
    if (isLoading || currentIndex === -1) return;
    currentUnitRef.current?.scrollIntoView({ block: "start" });
  }, [currentIndex, isLoading]);

  return (
    <section className="relative px-2 pb-8 pt-8">
      <DecorativeBackground />
      <LearningPathConnector
        unitCount={units.length}
        segmentHeight={UNIT_SEGMENT_HEIGHT_PX}
      />

      <div className="relative flex flex-col">
        {units.map((unit, index) => {
          const status = getUnitStatus(unit);
          const progress = getUnitProgress(unit);

          return (
            <div
              key={unit.id}
              ref={index === currentIndex ? currentUnitRef : undefined}
              className={cn(
                "relative",
                index === currentIndex ? "scroll-mt-4" : undefined,
              )}
              style={{ minHeight: UNIT_SEGMENT_HEIGHT_PX }}
            >
              <UnitCard
                unit={unit}
                index={index}
                side={index % 2 === 0 ? "left" : "right"}
                status={status}
                completedCount={progress.completedCount}
                totalCount={progress.totalCount}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
