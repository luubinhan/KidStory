import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCourseActivity, isCourseActivityId } from "../data/course-activities";
import { getDictionaryEntriesByUnitId } from "../data/course-dictionary";
import { getCourseUnitById } from "../data/course";
import { useUserProgress } from "../contexts/UserProgressContext";
import { CourseBottomNav } from "../components/course";
import {
  CourseFlashcardsSession,
  CourseMatchingSession,
  CoursePracticeHeader,
  CoursePracticeSentenceSession,
  CourseTypedAnswerSession,
  CourseWriteSession,
} from "../components/course-practice";
import { GameTopicPracticeSession } from "../components/game-topic/GameTopicPracticeSession";
import { buildMcTopic, buildSpellTopic } from "../lib/courseUnitTopic";

export default function CourseUnitPracticePage() {
  const { unitId, activityId } = useParams<{ unitId: string; activityId: string }>();
  const { isUnitAccessible, isLoading } = useUserProgress();
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

  if (!isLoading && !isUnitAccessible(unit)) {
    return <Navigate to="/course" replace />;
  }

  const dictionaryEntries = getDictionaryEntriesByUnitId(unit.id);
  const isMatching = activity.id === "matching";
  const isMultipleChoice = activity.id === "multiple-choice";

  const contentClassName = isMatching
    ? "flex w-full flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6"
    : isMultipleChoice
      ? "mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6"
      : "mx-auto w-full max-w-lg flex-1 px-4 py-6";

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className={contentClassName}>
        <CoursePracticeHeader unit={unit} activity={activity} />

        {activity.id === "flashcards" ? (
          <CourseFlashcardsSession words={unit.words} sessionKey={unit.id} unitId={unit.id} />
        ) : null}

        {isMatching ? <CourseMatchingSession entries={dictionaryEntries} unitId={unit.id} /> : null}

        {activity.id === "sentence" ? (
          <CoursePracticeSentenceSession
            sentences={unit.practiceSentences}
            sessionKey={unit.id}
            unitId={unit.id}
          />
        ) : null}

        {activity.id === "multiple-choice" ? (
          <GameTopicPracticeSession
            topic={buildMcTopic(unit)}
            topicId={unit.id}
            mode="multiple-choice"
            unitId={unit.id}
            activityId="multiple-choice"
          />
        ) : null}

        {activity.id === "spell" ? (
          <GameTopicPracticeSession
            topic={buildSpellTopic(unit)}
            topicId={unit.id}
            mode="spell"
            unitId={unit.id}
            activityId="spell"
          />
        ) : null}

        {activity.id === "write" ? (
          <CourseWriteSession words={unit.words} sessionKey={unit.id} unitId={unit.id} />
        ) : null}

        {activity.id === "complete-sentence" ? (
          <CourseTypedAnswerSession
            questions={unit.typedAnswerQuestions}
            sessionKey={unit.id}
            unitId={unit.id}
          />
        ) : null}
      </div>
      <CourseBottomNav />
    </div>
  );
}
