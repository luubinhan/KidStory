import { useCallback, useMemo, useState } from "react";
import {
  createEmptyCaroState,
  place as placeStone,
  undo as undoMove,
  type CaroState,
} from "../lib/caro";

export function useCaroSession() {
  const [state, setState] = useState<CaroState>(createEmptyCaroState);

  const place = useCallback((row: number, col: number) => {
    setState((current) => placeStone(current, row, col));
  }, []);

  const undo = useCallback(() => {
    setState((current) => undoMove(current));
  }, []);

  const restart = useCallback(() => {
    setState(createEmptyCaroState());
  }, []);

  const canUndo = useMemo(
    () => state.status === "playing" && state.lastMove !== null,
    [state.lastMove, state.status],
  );

  return { state, place, undo, restart, canUndo };
}
