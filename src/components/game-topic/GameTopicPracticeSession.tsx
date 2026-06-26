import { useEffect, useRef } from "react";
import { Confetti } from "../Confetti";
import {
  GameOptionRow,
  GameQuestionFooter,
  GameQuestionImage,
  GameQuestionStem,
  GameSentenceWordStrip,
  GameSpellLetterStrip,
  GameTopicBreadcrumb,
  IconVolumeButton,
} from "./index";
import { useGameTopicQuestion } from "../../hooks/useGameTopicQuestion";
import { useGameTopicSentenceQuestion } from "../../hooks/useGameTopicSentenceQuestion";
import { useGameTopicSpellQuestion } from "../../hooks/useGameTopicSpellQuestion";
import { playCelebrationSound } from "../../lib/gameCelebrationSound";
import type { GameTopic } from "../../types/game";

export type GameTopicPracticeMode = "multiple-choice" | "spell" | "sentence";

type GameTopicPracticeSessionProps = {
  topic: GameTopic;
  topicId: string;
  mode: GameTopicPracticeMode;
  showGameBreadcrumb?: boolean;
};

export function GameTopicPracticeSession({
  topic,
  topicId,
  mode,
  showGameBreadcrumb = false,
}: GameTopicPracticeSessionProps) {
  const mcActive = mode === "multiple-choice";
  const spellMode = mode === "spell";
  const sentenceMode = mode === "sentence";

  const mc = useGameTopicQuestion(mcActive ? topic : undefined, mcActive ? topicId : undefined);
  const spell = useGameTopicSpellQuestion(spellMode ? topic : undefined, spellMode ? topicId : undefined);
  const sentence = useGameTopicSentenceQuestion(
    sentenceMode ? topic : undefined,
    sentenceMode ? topicId : undefined,
  );

  const celebratedSpellRef = useRef(false);
  const celebratedSentenceRef = useRef(false);

  useEffect(() => {
    celebratedSpellRef.current = false;
  }, [spell.q?.id]);

  useEffect(() => {
    celebratedSentenceRef.current = false;
  }, [sentence.q?.id]);

  useEffect(() => {
    if (!spellMode || !spell.isSolved || celebratedSpellRef.current) return;
    celebratedSpellRef.current = true;
    playCelebrationSound();
  }, [spellMode, spell.isSolved]);

  useEffect(() => {
    if (!sentenceMode || !sentence.isSolved || celebratedSentenceRef.current) return;
    celebratedSentenceRef.current = true;
    playCelebrationSound();
  }, [sentenceMode, sentence.isSolved]);

  if (sentenceMode) {
    const { q, questions, questionIndex, isLast, words, wordOrder, setWordOrder, isSolved, playSentence, goNext } =
      sentence;

    return (
      <div className="max-w-3xl mx-auto px-4 py-2">
        {showGameBreadcrumb ? (
          <GameTopicBreadcrumb
            topicTitle={topic.title}
            questionIndex={questionIndex}
            questionCount={questions.length}
          />
        ) : null}
        {isSolved ? <Confetti /> : null}

        {q ? (
          <div className="rounded-2xl border-2 border-slate-100 bg-white px-4 py-20 md:p-8 shadow-md">
            {q.image ? (
              <div className="mb-12 relative">
                <GameQuestionImage src={q.image} />
                <div className="absolute bottom-0 left-0 right-4 flex flex-wrap items-start gap-2 gap-y-2 justify-end py-4 bg-linear-to-t from-zinc-40/100 to-olive-0/100">
                  <div className="bg-green-500 text-white border-green-700 scale-105 z-10 h-20 w-20 text-6xl font-kids rounded-3xl transition-all border-b-8 hover:-translate-y-1 active:scale-95">
                    <IconVolumeButton
                      className="h-full w-full cursor-pointer flex items-center justify-center"
                      onClick={() => void playSentence()}
                      aria-label="Hear the sentence"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-start gap-2 gap-y-3 justify-center mb-12">
                <div className="bg-green-500 text-white border-green-700 scale-105 z-10 h-20 w-20 text-6xl font-kids rounded-3xl transition-all border-b-8 hover:-translate-y-1 active:scale-95">
                  <IconVolumeButton
                    className="h-full w-full cursor-pointer flex items-center justify-center"
                    onClick={() => void playSentence()}
                    aria-label="Hear the sentence"
                  />
                </div>
              </div>
            )}

            <GameSentenceWordStrip
              words={words}
              wordOrder={wordOrder}
              onWordOrderChange={setWordOrder}
              disabled={isSolved}
              sentenceKey={`${topicId}:${q.id}`}
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

  if (spellMode) {
    const { q, questions, questionIndex, isLast, graphemes, letterOrder, setLetterOrder, isSolved, playWord, goNext } =
      spell;

    return (
      <div className="max-w-3xl mx-auto px-4 py-2">
        {showGameBreadcrumb ? (
          <GameTopicBreadcrumb
            topicTitle={topic.title}
            questionIndex={questionIndex}
            questionCount={questions.length}
          />
        ) : null}
        {isSolved ? <Confetti /> : null}

        {q ? (
          <div className="rounded-2xl border-2 border-slate-100 bg-white px-4 py-4 md:p-4 shadow-md">
            {q.image ? (
              <div className="mb-12 relative">
                <GameQuestionImage src={q.image} />
                <div className="absolute bottom-0 left-0 right-4 flex flex-wrap items-start gap-2 gap-y-2 justify-end py-4 bg-linear-to-t from-zinc-40/100 to-olive-0/100 ">
                  <div className="bg-green-500 text-white border-green-700 scale-105 z-10 h-20 w-20 text-6xl font-kids rounded-3xl transition-all border-b-8 hover:-translate-y-1 active:scale-95">
                    <IconVolumeButton
                      className="h-full w-full cursor-pointer flex items-center justify-center"
                      onClick={() => void playWord()}
                      aria-label="Hear the word"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-start gap-2 gap-y-3 justify-center mb-12">
                <div className="bg-green-500 text-white border-green-700 scale-105 z-10 h-20 w-20 text-6xl font-kids rounded-3xl transition-all border-b-8 hover:-translate-y-1 active:scale-95">
                  <IconVolumeButton
                    className="h-full w-full cursor-pointer flex items-center justify-center"
                    onClick={() => void playWord()}
                    aria-label="Hear the word"
                  />
                </div>
              </div>
            )}

            <GameSpellLetterStrip
              graphemes={graphemes}
              letterOrder={letterOrder}
              onLetterOrderChange={setLetterOrder}
              disabled={isSolved}
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

  const {
    questionIndex,
    pickedDisplayIndex,
    optionOrder,
    q,
    questions,
    isLast,
    playAudio,
    playOptionWord,
    onPick,
    goNext,
  } = mc;

  const blankLabel =
    pickedDisplayIndex !== null && q ? q.options[optionOrder[pickedDisplayIndex]!]! : null;

  const answerCorrect =
    pickedDisplayIndex !== null && q ? optionOrder[pickedDisplayIndex]! === q.correctIndex : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-2">
      {showGameBreadcrumb ? (
        <GameTopicBreadcrumb
          topicTitle={topic.title}
          questionIndex={questionIndex}
          questionCount={questions.length}
        />
      ) : null}

      {q ? (
        <div className="rounded-2xl border-2 border-slate-100 bg-white p-4 md:p-6 shadow-md">
          {q.image ? <GameQuestionImage src={q.image} /> : null}

          <GameQuestionStem
            q={q}
            blankLabel={blankLabel}
            answerCorrect={answerCorrect}
            onPlaySentence={playAudio}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {optionOrder.map((originalIdx, displayIdx) => (
              <GameOptionRow
                key={`${q.id}-${displayIdx}`}
                displayIdx={displayIdx}
                originalIdx={originalIdx}
                correctIndex={q.correctIndex}
                label={q.options[originalIdx]!}
                pickedDisplayIndex={pickedDisplayIndex}
                onPick={onPick}
                onPlayWord={playOptionWord}
              />
            ))}
          </div>

          {pickedDisplayIndex !== null ? <GameQuestionFooter isLast={isLast} onNext={goNext} /> : null}
        </div>
      ) : null}
    </div>
  );
}
