import { Progress } from "../ui";

type McProgressHeaderProps = {
  current: number;
  total: number;
};

export function McProgressHeader({ current, total }: McProgressHeaderProps) {
  return (
    <div className="mb-4 shrink-0 space-y-2">
      <Progress
        value={current}
        max={total}
        className="h-2.5 bg-amber-100"
        indicatorClassName="bg-emerald-500"
        aria-label={`Question ${current} of ${total}`}
      />
      <p className="text-sm font-bold text-emerald-600" aria-live="polite">
        {current}/{total}
      </p>
    </div>
  );
}
