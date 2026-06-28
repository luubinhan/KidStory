import type { CourseWord } from "../../types/course";
import { CourseWordImage } from "../course/CourseWordImage";

type CourseFlashcardProps = {
  word: CourseWord;
  isFlipped: boolean;
  onFlip: () => void;
};

export function CourseFlashcard({ word, isFlipped, onFlip }: CourseFlashcardProps) {
  const showImage = Boolean(word.imageUrl);

  return (
    <button
      type="button"
      onClick={onFlip}
      className="course-flashcard mx-auto w-full"
      aria-label={isFlipped ? "Flip to front" : "Flip to see the word"}
    >
      <div className={`course-flashcard-inner${isFlipped ? " is-flipped" : ""}`}>
        <div className="course-flashcard-face course-flashcard-front">
          {showImage ? (
            <CourseWordImage
              imageUrl={word.imageUrl}
              alt=""
              translation={word.translation}
              className="size-32"
              fallbackClassName="size-32"
            />
          ) : (
            <span className="text-9xl font-semibold text-slate-700">{word.translation}</span>
          )}
          <span className="mt-24 text-xs text-slate-400">Tap to flip</span>
        </div>
        <div className="course-flashcard-face course-flashcard-back">
          <span className="text-9xl font-bold text-sky-900">{word.word}</span>
          <span className="mt-24 text-xs text-slate-400">Tap to flip back</span>
        </div>
      </div>
    </button>
  );
}
