import React, { forwardRef, useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { StoryPage } from "../../types/book";
import { speak } from "../../lib/utils";

type StoryRightPageProps = { page: StoryPage };

/** Right-hand flip page: sentence + vocabulary */
export const StoryRightPage = forwardRef<HTMLDivElement, StoryRightPageProps>(
  (props: StoryRightPageProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { page } = props;
    const lightboxTitleId = useId();

    const [imageLightbox, setImageLightbox] = useState<{
      word: string;
      image: string;
    } | null>(null);

    const readAloud = useCallback(() => {
      speak(page.sentence, 0.78);
    }, [page.sentence]);

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
      <div className="page bg-white shadow-2xl rounded-r-3xl" ref={ref}>
        <section
          aria-label="Story text and vocabulary"
          className="page-content flex min-h-0 flex-col justify-center gap-6 overflow-y-auto bg-[#FFFBF0] p-6 shadow-[inset_6px_0_14px_-8px_rgba(15,23,42,0.06)] md:p-10"
        >
          <p className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-4xl lg:text-5xl">
            {page.sentence}
          </p>

          <button
            type="button"
            onClick={readAloud}
            className="inline-flex w-fit cursor-pointer items-center gap-3 rounded-2xl bg-yellow-400 px-6 py-3 font-bold text-slate-900 shadow-lg shadow-yellow-200/80 transition-colors hover:bg-yellow-500"
          >
            <span className="text-2xl" aria-hidden>
              🔊
            </span>
            Read Aloud
          </button>

          <div className="grid max-w-md grid-cols-3 gap-3">
            {page.vocabulary.map((vocab, idx) => (
              <div
                key={idx}
                className="rounded-2xl border-2 border-slate-100 bg-white p-3 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setImageLightbox({ word: vocab.word, image: vocab.image ?? "" })
                  }
                  className="w-full h-full cursor-pointer gap-3 flex flex-col items-center justify-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  aria-label={`View larger picture for ${vocab.word}`}
                >
                  {vocab.image && <img
                    src={vocab.image}
                    alt=""
                    className="h-16 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />}
                  <span className="text-xl font-bold text-slate-700">{vocab.word}</span>
                </button>
              </div>
            ))}
          </div>
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
                  {imageLightbox.image && <img
                    src={imageLightbox.image}
                    alt=""
                    className="max-h-[min(70vh,640px)] w-full max-w-full object-contain rounded-2xl"
                    referrerPolicy="no-referrer"
                  />}
                  <p
                    id={lightboxTitleId}
                    className="text-8xl font-bold text-slate-80 pb-4"
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

StoryRightPage.displayName = "StoryRightPage";
