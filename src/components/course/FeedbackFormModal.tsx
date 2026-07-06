import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FEEDBACK_FORM_EMBED_URL } from "../../lib/courseFeedbackForm";

type FeedbackFormModalProps = {
  onClose: () => void;
};

export function FeedbackFormModal({ onClose }: FeedbackFormModalProps) {
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
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Feedback"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="font-bold text-slate-800">Feedback</p>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Close feedback form"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <iframe
          src={FEEDBACK_FORM_EMBED_URL}
          title="Feedback form"
          className="h-[min(70vh,640px)] w-full border-0"
          loading="lazy"
        />
      </div>
    </div>,
    document.body,
  );
}
