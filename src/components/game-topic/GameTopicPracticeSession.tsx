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
  McProgressHeader,
} from "./index";
import { useGameTopicQuestion } from "../../hooks/useGameTopicQuestion";
import { useGameTopicSentenceQuestion } from "../../hooks/useGameTopicSentenceQuestion";
import { useGameTopicSpellQuestion } from "../../hooks/useGameTopicSpellQuestion";
import { useActivityCompletion } from "../../hooks/useActivityCompletion";
import { useQuestionHint } from "../../hooks/useQuestionHint";
import { playCelebrationSound } from "../../lib/gameCelebrationSound";
import type { CourseActivityId } from "../../types/course";
import type { GameTopic } from "../../types/game";

export type GameTopicPracticeMode = "multiple-choice" | "spell" | "sentence";

type GameTopicPracticeSessionProps = {
  topic: GameTopic;
  topicId: string;
  mode: GameTopicPracticeMode;
  showGameBreadcrumb?: boolean;
  unitId?: string;
  activityId?: CourseActivityId;
};

export function GameTopicPracticeSession({
  topic,
  topicId,
  mode,
  showGameBreadcrumb = false,
  unitId,
  activityId,
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

  const mcIsComplete =
    mcActive &&
    Boolean(unitId && activityId && mc.isLast && mc.pickedDisplayIndex !== null);
  const spellIsComplete =
    spellMode && Boolean(unitId && activityId && spell.isLast && spell.isSolved);

  const completionActivityId = mcIsComplete || spellIsComplete ? activityId : undefined;
  const isSessionComplete = mcIsComplete || spellIsComplete;

  const { rewardToast } = useActivityCompletion(unitId, completionActivityId, isSessionComplete);

  const hintQuestionKey = mcActive
    ? (mc.q?.id ?? `mc-${mc.questionIndex}`)
    : spellMode
      ? (spell.q?.id ?? `spell-${spell.questionIndex}`)
      : "no-hint";

  const hintEnabled = Boolean(unitId && (mcActive || spellMode));
  const { hintRevealed, hintControl } = useQuestionHint(
    hintEnabled ? hintQuestionKey : "hint-disabled",
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
      <div className="max-w-3xl mx-auto py-2">
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
    const targetWord = q ? q.options[q.correctIndex]! : "";

    return (
      <div className="max-w-3xl mx-auto py-2">
        {rewardToast}
        {showGameBreadcrumb ? (
          <GameTopicBreadcrumb
            topicTitle={topic.title}
            questionIndex={questionIndex}
            questionCount={questions.length}
          />
        ) : null}
        <McProgressHeader
          current={questionIndex + 1}
          total={questions.length}
          trailing={hintEnabled ? hintControl : undefined}
        />
        {isSolved ? <Confetti /> : null}

        {q ? (
          <div className="rounded-2xl border-2 min-h-[65vh] flex flex-col justify-center border-slate-100 bg-white px-4 py-4 md:p-4 shadow-md">
            {q.image?.trim() ? (
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
              <div className="mb-12 space-y-4 text-center">
                {q.translation ? (
                  <p className="text-3xl font-bold text-slate-800">{q.translation}</p>
                ) : null}
                <div className="flex justify-center">
                  <div className="bg-green-500 text-white border-green-700 scale-105 z-10 h-20 w-20 text-6xl font-kids rounded-3xl transition-all border-b-8 hover:-translate-y-1 active:scale-95">
                    <IconVolumeButton
                      className="h-full w-full cursor-pointer flex items-center justify-center"
                      onClick={() => void playWord()}
                      aria-label="Hear the word"
                    />
                  </div>
                </div>
              </div>
            )}

            {hintRevealed ? (
              <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-center text-sm font-bold text-amber-800">
                Hint: {targetWord}
              </p>
            ) : null}

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

  const correctAnswer = q ? q.options[q.correctIndex]! : "";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {rewardToast}
      {showGameBreadcrumb ? (
        <GameTopicBreadcrumb
          topicTitle={topic.title}
          questionIndex={questionIndex}
          questionCount={questions.length}
        />
      ) : null}

      <McProgressHeader
        current={questionIndex + 1}
        total={questions.length}
        trailing={hintEnabled ? hintControl : undefined}
      />
      {q ? (
        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-md md:p-6">
          <div className="shrink-0 space-y-4">
            {q.image ? <GameQuestionImage src={q.image} /> : null}
            <GameQuestionStem
              q={q}
              blankLabel={blankLabel}
              answerCorrect={answerCorrect}
              onPlaySentence={playAudio}
            />
            {hintRevealed ? (
              <p className="rounded-xl bg-amber-50 px-4 py-2 text-center text-sm font-bold text-amber-800">
                Hint: {correctAnswer}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
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
                hintRevealed={hintRevealed}
              />
            ))}
          </div>

          {pickedDisplayIndex !== null ? (
            <div className="mt-4 shrink-0">
              <GameQuestionFooter isLast={isLast} onNext={goNext} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
