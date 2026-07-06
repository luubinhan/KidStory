import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { isCourseFeedbackPage } from "../../lib/courseFeedbackForm";
import { FeedbackFormModal } from "./FeedbackFormModal";

export function CourseFeedbackFab() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (!isCourseFeedbackPage(pathname)) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed right-4 z-40 bottom-[calc(5.5rem+env(safe-area-inset-bottom))]",
          "cursor-pointer flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
        )}
        aria-label="Send feedback"
      >
        <MessageCircle className="size-5" aria-hidden />
      </button>
      {open && <FeedbackFormModal onClose={() => setOpen(false)} />}
    </>
  );
}
