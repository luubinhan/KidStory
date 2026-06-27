import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type UnitLearnVideoModalProps = {
  videoId: string;
  title: string;
  onClose: () => void;
};

export function UnitLearnVideoModal({ videoId, title, onClose }: UnitLearnVideoModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-2 ring-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="font-bold text-slate-800">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Close video"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
