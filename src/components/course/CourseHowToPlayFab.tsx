import { Link } from "react-router-dom";
import { CircleHelp } from "lucide-react";
import { cn } from "../../lib/utils";

export function CourseHowToPlayFab() {
  return (
    <Link
      to="/how-to-play"
      className={cn(
        "fixed left-4 z-40 bottom-[calc(5.5rem+env(safe-area-inset-bottom))]",
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
      )}
      aria-label="How to play"
    >
      <CircleHelp className="size-5" aria-hidden />
    </Link>
  );
}
