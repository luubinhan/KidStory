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

  return (
    <>
      <AppPageHeader />
      <GameTopicPracticeSession
        topic={topic}
        topicId={topicId}
        mode={mode}
        showGameBreadcrumb
      />
    </>
  );
}
