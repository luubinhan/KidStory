/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { books } from "../data/books";
import type { Book } from "../types/book";
import type { FlipBookHandle, FlipEvent } from "../types/pageflip";
import {
  BookFlipBook,
  BookLoadingOverlay,
  BookNotFound,
  BookReaderHeader,
  EndPage,
  PageCover,
  PageNavButtons,
  StoryLeftPage,
  StoryRightPage,
} from "../components/book-detail";
import { useBookFlipDimensions } from "../hooks/useBookFlipDimensions";
import { useFlipBookKeyboardNav } from "../hooks/useFlipBookKeyboardNav";
import { useFullscreenFlag } from "../hooks/useFullscreenFlag";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const book = useMemo((): Book | undefined => books.find((b) => b.id === id), [id]);

  const flipRef = useRef<FlipBookHandle | null>(null);
  const { bookAreaRef, dims } = useBookFlipDimensions(book);
  const { isFullscreen, toggleFullscreen } = useFullscreenFlag();

  const pageCount = book ? 2 + book.pages.length * 2 : 0;
  const lastIndex = pageCount - 1;

  const [pageIndex, setPageIndex] = useState(0);
  const [readyBookId, setReadyBookId] = useState<string | null>(null);
  const flipReady = readyBookId === book?.id;

  useFlipBookKeyboardNav(flipReady, flipRef);

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
    return <BookNotFound />;
  }

  const canPrev = flipReady && pageIndex > 0;
  const canNext = flipReady && pageIndex < lastIndex;
  const canFirst = flipReady && pageIndex > 0;

  const handleInit = useCallback(
    (e: { data?: { page?: number } }) => {
      setReadyBookId(book.id);
      if (typeof e.data?.page === "number") setPageIndex(e.data.page);
    },
    [book.id],
  );

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
      <BookReaderHeader
        book={book}
        indicatorLabel={indicatorLabel}
        canPrev={canPrev}
        canNext={canNext}
        isFullscreen={isFullscreen}
        onPrev={goPrev}
        onNext={goNext}
        onToggleFullscreen={() => void toggleFullscreen()}
        onShareFacebook={shareFacebook}
      />

      <div
        ref={bookAreaRef}
        className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-2 py-6 md:px-4"
      >
        <BookLoadingOverlay visible={!flipReady} />
        <BookFlipBook
          ref={flipRef}
          bookId={book.id}
          width={dims.width}
          height={dims.height}
          onFlip={handleFlip}
          onInit={handleInit}
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
        </BookFlipBook>
      </div>
    </div>
  );
}
