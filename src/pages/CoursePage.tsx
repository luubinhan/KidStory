import Lottie from "lottie-react";
import { courseProfile, courseUnits } from "../data/course";
import {
  CourseBottomNav,
  CourseHowToPlayFab,
  CoursePageTitle,
  LearningPath,
} from "../components/course";

import { CurrencyDisplay } from "../components/progress/CurrencyDisplay";
import { SettingsTrigger } from "../components/settings/SettingsTrigger";
import frog from "../assets/frog.json";

export default function CoursePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 bg-center bg-top bg-[url(/map/grade1.webp)] bg-size-[1600px_auto] pb-24">
      <div className="mx-auto max-w-lg">
        <div style={{ marginBottom: '345px' }}>
          <div className="flex items-center justify-between gap-4 px-4">
            <CoursePageTitle curriculumLabel={courseProfile.curriculumLabel} />
            <div className="mt-2 flex shrink-0 items-center gap-2">
              <CurrencyDisplay />
              <SettingsTrigger />
            </div>
          </div>
        </div>
        <LearningPath units={courseUnits} />
        <div className="absolute right-[26vw] top-[61vw]" aria-hidden>
          <div className="mx-auto h-32 w-32">
            <Lottie animationData={frog} loop={true} className="h-full w-full" />
          </div>
        </div>
      </div>
      <CourseHowToPlayFab />
      <CourseBottomNav />
    </div>
  );
}
