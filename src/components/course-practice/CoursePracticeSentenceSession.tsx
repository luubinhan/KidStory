import { useCallback, useEffect, useState } from "react";
import type { CoursePracticeSentence } from "../../types/course";
import { useCoursePracticeSentenceQuestion } from "../../hooks/useCoursePracticeSentenceQuestion";
import { useActivityCompletion } from "../../hooks/useActivityCompletion";
import { useQuestionHint } from "../../hooks/useQuestionHint";
import {
  GameQuestionFooter,
  GameSentenceWordStrip,
  IconVolumeButton,
  McProgressHeader,
} from "../game-topic";
import { PracticeSummaryEndScreen } from "./PracticeSummaryEndScreen";

type Props = {
  sentences: readonly CoursePracticeSentence[];
  sessionKey: string;
  unitId: string;
};

export function CoursePracticeSentenceSession({ sentences, sessionKey, unitId }: Props) {
  const [sessionCounter, setSessionCounter] = useState(0);
  const [phase, setPhase] = useState<"playing" | "summary">("playing");
  const activeSessionKey = `${sessionKey}-sentence-${sessionCounter}`;

  const {
    sentenceIndex,
    sentence,
    sentences: allSentences,
    isLast,
    words,
    wordOrder,
    setWordOrder,
    isSolved,
    playSentence,
    goNext,
  } = useCoursePracticeSentenceQuestion(sentences, activeSessionKey);

  const { reward, onReplay } = useActivityCompletion(unitId, "sentence", phase === "summary");
  const { hintRevealed, hintControl } = useQuestionHint(sentence?.id ?? `sentence-${sentenceIndex}`);

  useEffect(() => {
    setPhase("playing");
  }, [activeSessionKey]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setPhase("summary");
      return;
    }
    goNext();
  }, [isLast, goNext]);

  const handleReplay = useCallback(() => {
    onReplay();
    setSessionCounter((c) => c + 1);
    setPhase("playing");
  }, [onReplay]);

  if (sentences.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No sentences to practice for this unit yet.
      </p>
    );
  }

  if (phase === "summary") {
    return (
      <PracticeSummaryEndScreen
        reward={reward}
        subtitle={`You completed ${allSentences.length} sentences`}
        onReplay={handleReplay}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-2">
      <McProgressHeader
        current={sentenceIndex + 1}
        total={allSentences.length}
        trailing={hintControl}
      />
      {sentence ? (
        <div className="rounded-2xl min-h-[65vh] flex flex-col justify-center bg-[url('/images/bg-card.webp')] bg-cover bg-no-repeat px-4 py-20 md:p-8 rounded-2xl shadow-lg border-2 border-amber-600/40">
          <div className="flex flex-wrap items-start gap-2 gap-y-3 justify-center mb-12">
            <div className="bg-green-500 text-white border-green-700 scale-105 z-10 h-20 w-20 text-6xl font-kids rounded-3xl transition-all border-b-8 hover:-translate-y-1 active:scale-95">
              <IconVolumeButton
                className="h-full w-full cursor-pointer flex items-center justify-center"
                onClick={() => void playSentence()}
                aria-label="Hear the sentence"
              />
            </div>
          </div>

          {hintRevealed ? (
            <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-800">
              Hint: {sentence.text}
            </p>
          ) : null}

          <GameSentenceWordStrip
            words={words}
            wordOrder={wordOrder}
            onWordOrderChange={setWordOrder}
            disabled={isSolved}
            sentenceKey={`${activeSessionKey}:${sentence.id}`}
            isSolved={isSolved}
            onPlaySentence={playSentence}
          />
          {isSolved ? (
            <div className="mt-6 space-y-4">
              <GameQuestionFooter isLast={isLast} onNext={handleNext} lastAction="next" />
            </div>
          ) : <div className="h-[76px]" />}
        </div>
      ) : null}
    </div>
  );
}
