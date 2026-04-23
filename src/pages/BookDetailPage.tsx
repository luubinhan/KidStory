/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Loader2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import { books } from "../data/books";
import type { Book } from "../types/book";
import { EndPage, PageCover, PageNavButtons, StoryLeftPage, StoryRightPage } from "../components/book-detail";
import appIcon from "../assets/app-icon.png";

type FlipEvent = { data: number };
type FlipBookHandle = { pageFlip: () => PageFlipApi | null };
type PageFlipApi = {
  flipNext: (corner?: string) => void;
  flipPrev: (corner?: string) => void;
  turnToPage: (index: number) => void;
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const book = useMemo((): Book | undefined => books.find((b) => b.id === id), [id]);

  const flipRef = useRef<FlipBookHandle | null>(null);
  const bookAreaRef = useRef<HTMLDivElement>(null);

  /** Cover + (left + right per story spread) + end */
  const pageCount = book ? 2 + book.pages.length * 2 : 0;
  const lastIndex = pageCount - 1;

  const [pageIndex, setPageIndex] = useState(0);
  const [readyBookId, setReadyBookId] = useState<string | null>(null);
  const flipReady = readyBookId === book?.id;
  const [dims, setDims] = useState({ width: 400, height: 540 });
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== "undefined" && !!document.fullscreenElement,
  );

  useEffect(() => {
    const el = bookAreaRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const pageW = Math.max(240, Math.min(520, Math.floor(w / 2)));
      const pageH = Math.max(320, Math.floor(pageW * 1.35));
      setDims({ width: pageW, height: pageH });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [book]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!flipReady) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        flipRef.current?.pageFlip()?.flipPrev("top");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        flipRef.current?.pageFlip()?.flipNext("top");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipReady]);

  const handleFlip = useCallback((e: FlipEvent) => {
    setPageIndex(e.data);
  }, []);

  const goPrev = useCallback(() => {
    flipRef.current?.pageFlip()?.flipPrev("top");
  }, []);

  const goFirst = useCallback(() => {
    flipRef.current?.pageFlip()?.turnToPage(0);
    setPageIndex(0);
  }, []);

  const goNext = useCallback(() => {
    flipRef.current?.pageFlip()?.flipNext("top");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  const shareFacebook = useCallback(() => {
    const u = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, "_blank", "noopener,noreferrer");
  }, []);

  const handleReadAgain = useCallback(() => {
    window.speechSynthesis.cancel();
    flipRef.current?.pageFlip()?.turnToPage(0);
    setPageIndex(0);
  }, []);

  const indicatorLabel = useMemo(() => {
    if (!book) return "";
    const n = book.pages.length;
    if (pageIndex === 0) return "Cover";
    if (pageIndex === lastIndex) return "The End";
    const spread = Math.floor((pageIndex - 1) / 2) + 1;
    return `${spread} / ${n}`;
  }, [book, pageIndex, lastIndex]);

  if (!book) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="mb-6 text-lg text-slate-600">We could not find that story.</p>
        <Link
          to="/"
          className="rounded-2xl bg-yellow-400 px-6 py-3 font-bold text-slate-900 shadow-md hover:bg-yellow-500"
        >
          Back to stories
        </Link>
      </div>
    );
  }

  const canPrev = flipReady && pageIndex > 0;
  const canNext = flipReady && pageIndex < lastIndex;
  const canFirst = flipReady && pageIndex > 0;

  return (
    <div className="flex min-h-screen flex-col">
      {flipReady && (
        <PageNavButtons
          onFirst={goFirst}
          onPrev={goPrev}
          onNext={goNext}
          canFirst={canFirst}
          canPrev={canPrev}
          canNext={canNext}
        />
      )}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-[#ffffff]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-3 py-3 md:gap-4 md:px-4">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-1 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <div
              className="shrink-0 flex items-center justify-center"
            >
              <img src={appIcon} alt="KidStory - By Luu Binh An" className="w-14 h-14" />
            </div>
            <div className="min-w-0 text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                KidStory
              </h1>
            </div>
          </Link>

          <h1 className="min-w-0 flex-1 truncate text-center text-base font-bold text-slate-900 md:text-lg">
            {book.title}
          </h1>

          <p className="w-full shrink-0 text-center text-sm font-medium text-slate-500 md:w-auto md:text-left">
            {indicatorLabel}
          </p>

          <div className="flex w-full flex-wrap items-center justify-center gap-2 md:ml-auto md:w-auto">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              aria-pressed={isFullscreen}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
            </button>

            <button
              type="button"
              onClick={shareFacebook}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-[#1877F2] px-3 py-2 text-sm font-semibold text-white hover:bg-[#166FE5]"
            >
              <Facebook className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </header>

      <div ref={bookAreaRef} className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-2 py-6 md:px-4">
        {!flipReady && (
          <div
            className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white backdrop-blur-sm"
            aria-busy="true"
            aria-live="polite"
          >
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" aria-hidden />
            <span className="text-sm font-medium text-slate-600">Loading book…</span>
          </div>
        )}
        <HTMLFlipBook
          key={book.id}
          ref={flipRef}
          width={dims.width}
          height={dims.height}
          size="stretch"
          minWidth={200}
          maxWidth={1200}
          minHeight={280}
          maxHeight={1600}
          maxShadowOpacity={0.5}
          showCover
          mobileScrollSupport
          className="mx-auto"
          style={{}}
          startPage={0}
          drawShadow
          flippingTime={900}
          usePortrait
          startZIndex={0}
          autoSize
          clickEventForward={false}
          useMouseEvents={false}
          swipeDistance={30}
          showPageCorners={false}
          disableFlipByClick
          onFlip={handleFlip}
          onInit={(e: { data?: { page?: number } }) => {
            setReadyBookId(book.id);
            if (typeof e.data?.page === "number") setPageIndex(e.data.page);
          }}
        >
          <PageCover>
            <img
              src={book.cover}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
              draggable={false}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 pb-6 pt-20">
              <h2 className="text-center text-2xl font-black text-white drop-shadow md:text-3xl">{book.title}</h2>
              <p className="mx-auto mt-3 max-w-md text-center text-sm text-white/95 md:text-base">{book.description}</p>
            </div>
          </PageCover>
          {book.pages.flatMap((page, i) => [
            <StoryLeftPage key={`${i}-left`} page={page} />,
            <StoryRightPage key={`${i}-right`} page={page} />,
          ])}

          <EndPage onReset={handleReadAgain} />
        </HTMLFlipBook>
      </div>
    </div>
  );
}
