import { courseProfile, courseUnits } from "../data/course";
import {
  CourseBottomNav,
  CoursePageTitle,
  LearningPath,
} from "../components/course";
import { CoinDisplay } from "../components/progress/CoinDisplay";

export default function CoursePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 bg-center bg-top bg-[url(/map/grade1.png)] bg-size-[1600px_auto] pb-24">
      <div className="mx-auto max-w-lg">
        <div style={{ marginBottom: '345px' }}>
          <div className="flex items-start justify-between gap-4 px-4">
            <CoursePageTitle curriculumLabel={courseProfile.curriculumLabel} />
            <CoinDisplay className="mt-2 shrink-0" />
          </div>
        </div>
        <LearningPath units={courseUnits} />
      </div>
      <CourseBottomNav />
    </div>
  );
}
