import { ArrowLeft, Lock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getCourseActivity, isCourseActivityId } from "../data/course-activities";
import { getDictionaryEntriesByUnitId } from "../data/course-dictionary";
import { getCourseUnitById } from "../data/course";
import { getGameTopic } from "../data/games";
import { CourseBottomNav } from "../components/course";
import {
  CourseFlashcardsSession,
  CourseMatchingSession,
  CoursePracticeHeader,
} from "../components/course-practice";
import {
  GameTopicPracticeSession,
  type GameTopicPracticeMode,
} from "../components/game-topic/GameTopicPracticeSession";

export default function CourseUnitPracticePage() {
  const { unitId, activityId } = useParams<{ unitId: string; activityId: string }>();
  const unit = unitId ? getCourseUnitById(unitId) : undefined;
  const activity =
    activityId && isCourseActivityId(activityId) ? getCourseActivity(activityId) : undefined;

  if (!unit || !activity) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
        <div className="mx-auto max-w-lg px-4 py-8">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
          <h1 className="mt-6 text-xl font-bold text-slate-800">Activity not found.</h1>
          <p className="mt-2 text-slate-600">This practice activity is not available.</p>
        </div>
        <CourseBottomNav />
      </div>
    );
  }

  if (unit.status === "locked") {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
        <div className="mx-auto max-w-lg px-4 py-8">
          <Link
            to={`/course/${unit.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to unit
          </Link>
          <div className="mt-6 rounded-2xl border-2 border-white bg-white p-6 text-center shadow-md">
            <Lock className="mx-auto size-10 text-slate-300" aria-hidden />
            <h1 className="mt-4 text-xl font-bold text-slate-800">Unit locked</h1>
            <p className="mt-2 text-slate-600">Complete earlier units to unlock this lesson.</p>
          </div>
        </div>
        <CourseBottomNav />
      </div>
    );
  }

  const dictionaryEntries = getDictionaryEntriesByUnitId(unit.id);
  const gameTopic = getGameTopic(unit.gameTopicId);
  const quizMode: GameTopicPracticeMode | undefined =
    activity.id === "multiple-choice" || activity.id === "spell" || activity.id === "sentence"
      ? activity.id
      : undefined;

  if (quizMode && !gameTopic) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
        <div className="mx-auto max-w-lg px-4 py-6">
          <CoursePracticeHeader unit={unit} activity={activity} />
          <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
            Quiz content for this unit is not available yet.
          </p>
        </div>
        <CourseBottomNav />
      </div>
    );
  }

  const isMatching = activity.id === "matching";

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div
        className={
          isMatching
            ? "flex w-full flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6"
            : "mx-auto w-full max-w-lg flex-1 px-4 py-6"
        }
      >
        <CoursePracticeHeader unit={unit} activity={activity} />

        {activity.id === "flashcards" ? (
          <CourseFlashcardsSession entries={dictionaryEntries} />
        ) : null}

        {isMatching ? <CourseMatchingSession entries={dictionaryEntries} /> : null}

        {quizMode && gameTopic ? (
          <GameTopicPracticeSession
            topic={gameTopic}
            topicId={unit.gameTopicId}
            mode={quizMode}
          />
        ) : null}
      </div>
      <CourseBottomNav />
    </div>
  );
}
