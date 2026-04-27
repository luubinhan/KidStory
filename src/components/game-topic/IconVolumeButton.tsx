import { Volume2 } from "lucide-react";

type IconVolumeButtonProps = {
  onClick: () => void;
  "aria-label": string;
  className?: string;
};

export function IconVolumeButton({
  onClick,
  "aria-label": ariaLabel,
  className,
}: IconVolumeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ??
        "shrink-0 cursor-pointer inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-[#f4f4f4] p-3 text-slate-700 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
      }
      aria-label={ariaLabel}
    >
      <Volume2 className="h-5 w-5" aria-hidden />
    </button>
  );
}
