import { useEffect, useRef } from "react";
import { Confetti } from "../Confetti";
import {
  GameQuestionFooter,
  GameSentenceWordStrip,
  IconVolumeButton,
  McProgressHeader,
} from "../game-topic";
import { useCoursePracticeSentenceQuestion } from "../../hooks/useCoursePracticeSentenceQuestion";
import { useActivityCompletion } from "../../hooks/useActivityCompletion";
import { useQuestionHint } from "../../hooks/useQuestionHint";
import { playCelebrationSound } from "../../lib/gameCelebrationSound";
import type { CoursePracticeSentence } from "../../types/course";

type Props = {
  sentences: readonly CoursePracticeSentence[];
  sessionKey: string;
  unitId: string;
};

export function CoursePracticeSentenceSession({ sentences, sessionKey, unitId }: Props) {
  const celebratedRef = useRef(false);
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
  } = useCoursePracticeSentenceQuestion(sentences, sessionKey);

  const isSessionComplete = isLast && isSolved;
  const { rewardToast } = useActivityCompletion(unitId, "sentence", isSessionComplete);
  const { hintRevealed, hintControl } = useQuestionHint(sentence?.id ?? `sentence-${sentenceIndex}`);

  useEffect(() => {
    celebratedRef.current = false;
  }, [sentence?.id]);

  useEffect(() => {
    if (!isSolved || celebratedRef.current) return;
    celebratedRef.current = true;
    playCelebrationSound();
  }, [isSolved]);

  if (sentences.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No sentences to practice for this unit yet.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2">
      {rewardToast}
      {isSolved ? <Confetti /> : null}
      <McProgressHeader
        current={sentenceIndex + 1}
        total={allSentences.length}
        trailing={hintControl}
      />
      {sentence ? (
        <div className="rounded-2xl min-h-[65vh] flex flex-col justify-center border-2 border-slate-100 bg-white px-4 py-20 md:p-8 shadow-md">
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
            sentenceKey={`${sessionKey}:${sentence.id}`}
            isSolved={isSolved}
            onPlaySentence={playSentence}
          />
          {isSolved ? (
            <div className="mt-6 space-y-4">
              <GameQuestionFooter isLast={isLast} onNext={goNext} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
