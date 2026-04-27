import { Loader2 } from "lucide-react";

type BookLoadingOverlayProps = {
  visible: boolean;
};

export function BookLoadingOverlay({ visible }: BookLoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white backdrop-blur-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2 className="h-10 w-10 animate-spin text-amber-500" aria-hidden />
      <span className="text-sm font-medium text-slate-600">Loading book…</span>
    </div>
  );
}
