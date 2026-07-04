import { courseProfile, courseUnits } from "../data/course";
import mountainsBg from "../a.jpg";
import {
  CourseBottomNav,
  CoursePageTitle,
  LearningPath,
} from "../components/course";

export default function CoursePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 bg-center bg-top bg-[url(/map/grade1.png)] bg-size-[1600px_auto] pb-24">
      <div className="mx-auto max-w-lg">
        <div style={{ marginBottom: '345px' }}>
        <CoursePageTitle curriculumLabel={courseProfile.curriculumLabel} />
        </div>
        <LearningPath units={courseUnits} />
      </div>
      <CourseBottomNav />
    </div>
  );
}
