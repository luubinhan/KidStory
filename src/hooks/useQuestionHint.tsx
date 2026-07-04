import { useCallback, useEffect, useState } from "react";
import { useUserProgress } from "../contexts/UserProgressContext";
import { HintButton } from "../components/progress/HintButton";

export function useQuestionHint(questionKey: string) {
  const { useHint } = useUserProgress();
  const [hintRevealed, setHintRevealed] = useState(false);

  useEffect(() => {
    setHintRevealed(false);
  }, [questionKey]);

  const handleHint = useCallback(async () => {
    if (hintRevealed) return;
    const success = await useHint();
    if (success) setHintRevealed(true);
  }, [hintRevealed, useHint]);

  const hintControl = <HintButton onHint={handleHint} disabled={hintRevealed} />;

  return { hintRevealed, hintControl, handleHint };
}
