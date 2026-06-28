import { useParams, useSearchParams } from "react-router-dom";
import { getGameTopic } from "../data/games";
import { GameTopicNotFound, GameTopicPracticeSession } from "../components/game-topic";
import { AppPageHeader } from "../components/layout";

function isSpellMode(searchParams: URLSearchParams): boolean {
  return searchParams.get("mode") === "spell";
}

function isSentenceMode(searchParams: URLSearchParams): boolean {
  return searchParams.get("mode") === "sentence";
}

export default function GameTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [searchParams] = useSearchParams();
  const topic = topicId ? getGameTopic(topicId) : undefined;

  if (!topicId || !topic) {
    return (
      <>
        <AppPageHeader />
        <GameTopicNotFound />
      </>
    );
  }

  const mode = isSpellMode(searchParams)
    ? "spell"
    : isSentenceMode(searchParams)
      ? "sentence"
      : "multiple-choice";

  const isMultipleChoice = mode === "multiple-choice";

  return (
    <div className={isMultipleChoice ? "flex min-h-screen flex-col" : undefined}>
      <AppPageHeader />
      <div
        className={
          isMultipleChoice
            ? "mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6"
            : undefined
        }
      >
        <GameTopicPracticeSession
          topic={topic}
          topicId={topicId}
          mode={mode}
          showGameBreadcrumb
        />
      </div>
    </div>
  );
}
