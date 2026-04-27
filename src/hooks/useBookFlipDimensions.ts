import { useEffect, useRef, useState } from "react";
import type { Book } from "../types/book";

export function useBookFlipDimensions(book: Book | undefined) {
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 400, height: 540 });

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

  return { bookAreaRef, dims };
}
