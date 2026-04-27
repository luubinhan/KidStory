/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { forwardRef, type ReactNode } from "react";
import HTMLFlipBook from "react-pageflip";
import type { FlipBookHandle, FlipEvent } from "../../types/pageflip";

type FlipInitEvent = { data?: { page?: number } };

type BookFlipBookProps = {
  bookId: string;
  width: number;
  height: number;
  onFlip: (e: FlipEvent) => void;
  onInit: (e: FlipInitEvent) => void;
  children: ReactNode;
};

export const BookFlipBook = forwardRef<FlipBookHandle | null, BookFlipBookProps>(
  function BookFlipBook({ bookId, width, height, onFlip, onInit, children }, ref) {
    return (
      <HTMLFlipBook
        key={bookId}
        ref={ref}
        width={width}
        height={height}
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
        onFlip={onFlip}
        onInit={onInit}
      >
        {children}
      </HTMLFlipBook>
    );
  },
);
