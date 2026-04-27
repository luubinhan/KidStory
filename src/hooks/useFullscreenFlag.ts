import { useCallback, useEffect, useState } from "react";

export function useFullscreenFlag() {
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== "undefined" && !!document.fullscreenElement,
  );

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
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

  return { isFullscreen, toggleFullscreen };
}
