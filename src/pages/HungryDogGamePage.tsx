import { useFishingSession } from "../hooks/useFishingSession";
import { CourseBottomNav } from "../components/course";

export default function HungryDogGamePage() {
  const { pool, canPlay, session, reward, onFishTap, restart } =
    useFishingSession();

  const poolWords = pool.map((item) => item.word.toUpperCase());

  return (
    <div className="relative min-h-screen bg-center bg-top bg-no-repeat bg-cover bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80"
    >
      
      <CourseBottomNav />
    </div>
  );
}
