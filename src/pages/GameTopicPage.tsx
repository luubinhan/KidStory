import { useParams } from "react-router-dom";
import { getGameTopic } from "../data/games";
import {
  GameOptionRow,
  GameQuestionFooter,
  GameQuestionImage,
  GameQuestionStem,
  GameTopicBreadcrumb,
  GameTopicNotFound,
} from "../components/game-topic";
import { useGameTopicQuestion } from "../hooks/useGameTopicQuestion";

export default function GameTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? getGameTopic(topicId) : undefined;

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
  } = useGameTopicQuestion(topic, topicId);

  if (!topicId || !topic) {
    return <GameTopicNotFound />;
  }

  const blankLabel =
    pickedDisplayIndex !== null && q
      ? q.options[optionOrder[pickedDisplayIndex]!]!
      : null;

  const answerCorrect =
    pickedDisplayIndex !== null && q
      ? optionOrder[pickedDisplayIndex]! === q.correctIndex
      : null;

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

          {pickedDisplayIndex !== null ? (
            <GameQuestionFooter isLast={isLast} onNext={goNext} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
