import { AppPageHeader } from "../components/layout";
import { GameV2Card } from "../components/games-v2";
import { gamesV2 } from "../data/gamesV2";

export default function GamesV2Page() {
  return (
    <div>
      <AppPageHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
            Games
          </h1>
          <p className="max-w-2xl text-slate-600">
            Play mini-games to earn coins and diamonds. Tap a game to start.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gamesV2.map((game, index) => (
            <GameV2Card key={game.id} game={game} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
