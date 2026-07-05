import { useCallback, useEffect, useState } from "react";
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
import { PracticeSummaryEndScreen } from "../course-practice/PracticeSummaryEndScreen";
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

  const [sessionCounter, setSessionCounter] = useState(0);
  const [phase, setPhase] = useState<"playing" | "summary">("playing");
  const activeTopicId = `${topicId}-${sessionCounter}`;
  const tracksCompletion = Boolean(unitId && activityId && (mcActive || spellMode));

  const mc = useGameTopicQuestion(mcActive ? topic : undefined, mcActive ? activeTopicId : undefined);
  const spell = useGameTopicSpellQuestion(
    spellMode ? topic : undefined,
    spellMode ? activeTopicId : undefined,
  );
  const sentence = useGameTopicSentenceQuestion(
    sentenceMode ? topic : undefined,
    sentenceMode ? activeTopicId : undefined,
  );

  const { reward, onReplay } = useActivityCompletion(
    unitId,
    activityId,
    tracksCompletion && phase === "summary",
  );

  useEffect(() => {
    setPhase("playing");
  }, [activeTopicId, mode]);

  const handleReplay = useCallback(() => {
    onReplay();
    setSessionCounter((c) => c + 1);
    setPhase("playing");
  }, [onReplay]);

  const hintQuestionKey = mcActive
    ? (mc.q?.id ?? `mc-${mc.questionIndex}`)
    : spellMode
      ? (spell.q?.id ?? `spell-${spell.questionIndex}`)
      : "no-hint";

  const hintEnabled = Boolean(unitId && (mcActive || spellMode));
  const { hintRevealed, hintControl } = useQuestionHint(
    hintEnabled ? hintQuestionKey : "hint-disabled",
  );

  const finishToSummary = useCallback(() => {
    setPhase("summary");
  }, []);

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

    const handleSpellNext = () => {
      if (isLast && tracksCompletion) {
        finishToSummary();
        return;
      }
      goNext();
    };

    if (phase === "summary" && tracksCompletion) {
      return (
        <PracticeSummaryEndScreen
          reward={reward}
          subtitle={`You completed ${questions.length} questions`}
          onReplay={handleReplay}
        />
      );
    }

    return (
      <div className="max-w-3xl mx-auto py-2">
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
          <div className="min-h-[65vh] flex flex-col justify-center  px-4 py-4 md:p-4 bg-[url('/images/bg-card.png')] bg-contain bg-no-repeat">
            <div className="backdrop-blur-xs">
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
                  <GameQuestionFooter
                    isLast={isLast}
                    onNext={handleSpellNext}
                    lastAction={tracksCompletion ? "next" : "home"}
                  />
                </div>
              ) : null}
            </div>
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

  const handleMcNext = () => {
    if (isLast && tracksCompletion) {
      finishToSummary();
      return;
    }
    goNext();
  };

  if (phase === "summary" && tracksCompletion) {
    return (
      <PracticeSummaryEndScreen
        reward={reward}
        subtitle={`You completed ${questions.length} questions`}
        onReplay={handleReplay}
      />
    );
  }

  const blankLabel =
    pickedDisplayIndex !== null && q ? q.options[optionOrder[pickedDisplayIndex]!]! : null;

  const answerCorrect =
    pickedDisplayIndex !== null && q ? optionOrder[pickedDisplayIndex]! === q.correctIndex : null;

  const correctAnswer = q ? q.options[q.correctIndex]! : "";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
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
              <GameQuestionFooter
                isLast={isLast}
                onNext={handleMcNext}
                lastAction={tracksCompletion ? "next" : "home"}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
