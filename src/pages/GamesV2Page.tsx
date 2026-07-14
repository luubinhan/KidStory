import { GameV2Card } from "../components/games-v2";
import { IMAGES_ACTIVITIES } from "../constants/images";
import { gamesV2 } from "../data/gamesV2";
import { CourseBottomNav } from "@/src/components/course/CourseBottomNav";

export default function GamesV2Page() {
  return (
    <div className="relative min-h-screen pb-24 bg-center bg-top bg-no-repeat bg-cover bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80"
      style={{ backgroundImage: `url(${IMAGES_ACTIVITIES.spell})` }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gamesV2.map((game, index) => (
            <GameV2Card key={game.id} game={game} index={index} />
          ))}
        </div>
      </div>
      <CourseBottomNav />
    </div>
  );
}
