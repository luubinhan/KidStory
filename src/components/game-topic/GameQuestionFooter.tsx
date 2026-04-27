type GameQuestionFooterProps = {
  isLast: boolean;
  onNext: () => void;
};

export function GameQuestionFooter({ isLast, onNext }: GameQuestionFooterProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex cursor-pointer items-center rounded-xl border-2 border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
        >
          Next question
        </button>
      ) : (
        <p className="text-sm font-medium text-slate-600">You finished this topic!</p>
      )}
    </div>
  );
}
