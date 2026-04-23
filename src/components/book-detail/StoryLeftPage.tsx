import { forwardRef, useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { StoryPage } from "../../types/book";
import { speak } from "../../lib/utils";
import { Pulse } from "./Pulse";

type StoryLeftPageProps = { page: StoryPage };

/** Left-hand flip page: story illustration only */
export const StoryLeftPage = forwardRef<HTMLDivElement, StoryLeftPageProps>(
  (props: StoryLeftPageProps, ref) => {
    const { page } = props;
    const lightboxTitleId = useId();

    const [imageLightbox, setImageLightbox] = useState<{
      word: string;
      image: string;
    } | null>(null);

    const openLightbox = useCallback((word: string, image: string) => {
      speak(word, 0.72);
      setImageLightbox({ word, image });
    }, []);

    const playWord = useCallback((word: string) => {
      speak(word, 0.72);
    }, []);

    useEffect(() => {
      if (!imageLightbox) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setImageLightbox(null);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [imageLightbox]);

    return (
      <div className="page bg-slate-50 shadow-2xl rounded-l-3xl" ref={ref}>
        <section
          aria-label="Story illustration"
          className="page-content isolate overflow-hidden shadow-[inset_-6px_0_14px_-8px_rgba(15,23,42,0.12)]"
        >
          {page.vocabulary.map((vocab, index) => {
            return vocab.position && vocab.position.top !== undefined && vocab.position.left !== undefined ? (
              <button
                key={index + vocab.word}
                type="button"
                className="z-10 absolute cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-full"
                style={{ top: vocab.position.top, left: vocab.position.left }}
                aria-label={`View word: ${vocab.word}`}
                onClick={() => openLightbox(vocab.word, vocab.image ?? "")}
              >
                <Pulse />
              </button>
            ) : null;
          })}
          <img
            src={page.image}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
            draggable={false}
            referrerPolicy="no-referrer"
          />
        </section>

        {imageLightbox &&
          createPortal(
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4"
              role="presentation"
              onClick={() => setImageLightbox(null)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={lightboxTitleId}
                className="flex max-h-[min(90vh,900px)] max-w-[min(90vw,720px)] flex-col gap-4 rounded-2xl bg-[#FFFBF0] p-4 shadow-2xl ring-2 ring-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-4 min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl">
                  {imageLightbox.image && (
                    <img
                      src={imageLightbox.image}
                      alt=""
                      className="max-h-[min(70vh,640px)] w-full max-w-full object-contain rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <p
                    id={lightboxTitleId}
                    className="text-8xl font-bold text-slate-800 pb-4"
                  >
                    {imageLightbox.word}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => playWord(imageLightbox.word)}
                      className="rounded-xl bg-yellow-400 px-4 py-2 font-bold text-slate-900 shadow-md transition-colors hover:bg-yellow-500"
                    >
                      Listen
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageLightbox(null)}
                      className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  },
);

StoryLeftPage.displayName = "StoryLeftPage";
