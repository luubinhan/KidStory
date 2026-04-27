import { gameTopics } from "../data/games";
import { GameTopicCard, GamesBackToStoriesLink, GamesPageIntro } from "../components/games";

export default function GamesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <GamesPageIntro />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {gameTopics.map((topic, index) => (
          <GameTopicCard key={topic.id} topic={topic} index={index} />
        ))}
      </div>

      <GamesBackToStoriesLink />
    </div>
  );
}
