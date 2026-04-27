import { useEffect, type RefObject } from "react";
import type { FlipBookHandle } from "../types/pageflip";

export function useFlipBookKeyboardNav(
  flipReady: boolean,
  flipRef: RefObject<FlipBookHandle | null>,
) {
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
  }, [flipReady, flipRef]);
}
