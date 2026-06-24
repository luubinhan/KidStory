import type { CourseUnit } from "../../types/course";
import { LearningPathConnector } from "./LearningPathConnector";
import { UnitCard } from "./UnitCard";

type LearningPathProps = {
  units: readonly CourseUnit[];
};

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
  return (
    <section className="relative px-2 pb-8">
      <DecorativeBackground />
      <LearningPathConnector unitCount={units.length} />

      <div className="relative flex flex-col gap-6">
        {units.map((unit, index) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            index={index}
            side={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
    </section>
  );
}
