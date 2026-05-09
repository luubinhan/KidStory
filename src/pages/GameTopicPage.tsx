import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getGameTopic } from "../data/games";
import { Confetti } from "../components/Confetti";
import {
  GameOptionRow,
  GameQuestionFooter,
  GameQuestionImage,
  GameQuestionStem,
  GameSpellCelebration,
  GameSpellLetterStrip,
  GameTopicBreadcrumb,
  GameTopicNotFound,
  IconVolumeButton,
} from "../components/game-topic";
import { useGameTopicQuestion } from "../hooks/useGameTopicQuestion";
import { useGameTopicSpellQuestion } from "../hooks/useGameTopicSpellQuestion";
import { playCelebrationSound } from "../lib/gameCelebrationSound";

function isSpellMode(searchParams: URLSearchParams): boolean {
  return searchParams.get("mode") === "spell";
}

export default function GameTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [searchParams] = useSearchParams();
  const spellMode = isSpellMode(searchParams);
  const topic = topicId ? getGameTopic(topicId) : undefined;

  const mc = useGameTopicQuestion(spellMode ? undefined : topic, spellMode ? undefined : topicId);

  const spell = useGameTopicSpellQuestion(spellMode ? topic : undefined, spellMode ? topicId : undefined);

  const celebratedForQuestionRef = useRef(false);

  useEffect(() => {
    celebratedForQuestionRef.current = false;
  }, [spell.q?.id]);

  useEffect(() => {
    if (!spellMode || !spell.isSolved || celebratedForQuestionRef.current) return;
    celebratedForQuestionRef.current = true;
    playCelebrationSound();
  }, [spellMode, spell.isSolved]);

  if (!topicId || !topic) {
    return <GameTopicNotFound />;
  }

  if (spellMode) {
    const { q, questions, questionIndex, isLast, graphemes, letterOrder, setLetterOrder, isSolved, playWord, goNext } =
      spell;

    return (
      <div className="max-w-3xl mx-auto px-4 py-2">
        {isSolved ? <Confetti /> : null}
        <GameTopicBreadcrumb
          topicTitle={topic.title}
          questionIndex={questionIndex}
          questionCount={questions.length}
        />

        {q ? (
          <div className="rounded-2xl border-2 border-slate-100 bg-white p-4 md:p-6 shadow-md">
            <GameQuestionImage src={q.image} />

            <div className="mb-5 flex flex-wrap items-start gap-2 gap-y-3">
              <p className="text-lg md:text-xl text-slate-900 leading-relaxed flex-1 min-w-0">
                Put the letters in the right order. Tap the speaker to hear the word.
              </p>
              <IconVolumeButton onClick={() => void playWord()} aria-label="Hear the word" />
            </div>

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
      <GameTopicBreadcrumb
        topicTitle={topic.title}
        questionIndex={questionIndex}
        questionCount={questions.length}
      />

      {q ? (
        <div className="rounded-2xl border-2 border-slate-100 bg-white p-4 md:p-6 shadow-md">
          <GameQuestionImage src={q.image} />

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
