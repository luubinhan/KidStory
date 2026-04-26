import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Volume2 } from "lucide-react";
import { getGameTopic } from "../data/games";
import type { GameQuestion } from "../types/game";

/** Deterministic shuffle of indices from a string seed (Fisher–Yates with LCG). */
function shuffledOptionOrder(length: number, seed: string): number[] {
  const order = Array.from({ length }, (_, i) => i);
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  const next = () => {
    h = Math.imul(h, 1103515245) + 12345;
    return (h >>> 0) / 4294967296;
  };
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    const t = order[i];
    order[i] = order[j]!;
    order[j] = t!;
  }
  return order;
}

function ttsSentence(q: GameQuestion): string {
  return `${q.textBefore.trimEnd()} … ${q.textAfter.trimStart()}`;
}

/** Per-option candy colors (cycles if there are more than six choices). */
const OPTION_PALETTE = [
  "border-sky-400 bg-sky-100 text-sky-950 hover:border-sky-500 hover:bg-sky-50",
  "border-violet-400 bg-violet-100 text-violet-950 hover:border-violet-500 hover:bg-violet-50",
  "border-amber-400 bg-amber-100 text-amber-950 hover:border-amber-500 hover:bg-amber-50",
  "border-fuchsia-400 bg-fuchsia-100 text-fuchsia-950 hover:border-fuchsia-500 hover:bg-fuchsia-50",
  "border-lime-500 bg-lime-100 text-lime-950 hover:border-lime-600 hover:bg-lime-50",
  "border-orange-400 bg-orange-100 text-orange-950 hover:border-orange-500 hover:bg-orange-50",
] as const;

export default function GameTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? getGameTopic(topicId) : undefined;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [pickedDisplayIndex, setPickedDisplayIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const questions = topic?.questions ?? [];
  const q = questions[questionIndex];
  const isLast = topic ? questionIndex >= questions.length - 1 : false;

  const optionOrder = useMemo(
    () => (q ? shuffledOptionOrder(q.options.length, q.id) : []),
    [q],
  );

  useEffect(() => {
    setQuestionIndex(0);
    setPickedDisplayIndex(null);
  }, [topicId]);

  useEffect(() => {
    setPickedDisplayIndex(null);
  }, [questionIndex]);

  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  const playAudio = useCallback(async () => {
    if (!q) return;
    stopAudio();

    if (q.audioUrl) {
      try {
        const el = new Audio(q.audioUrl);
        audioRef.current = el;
        await el.play();
      } catch {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(ttsSentence(q));
          u.rate = 0.92;
          window.speechSynthesis.speak(u);
        }
      }
      return;
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(ttsSentence(q));
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  }, [q, stopAudio]);

  const playOptionWord = useCallback(
    (word: string) => {
      stopAudio();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(word);
        u.rate = 0.92;
        window.speechSynthesis.speak(u);
      }
    },
    [stopAudio],
  );

  const onPick = (displayIndex: number) => {
    if (!q || pickedDisplayIndex !== null) return;
    setPickedDisplayIndex(displayIndex);
  };

  const goNext = () => {
    if (!topic) return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    }
  };

  if (!topicId || !topic) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Topic not found</h1>
        <p className="text-slate-600 mb-6">That game topic does not exist.</p>
        <Link
          to="/games"
          className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
        >
          Back to games
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          to="/games"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-lg px-1"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          All topics
        </Link>
        <span className="text-slate-300" aria-hidden>
          /
        </span>
        <span className="text-sm font-semibold text-slate-900">{topic.title}</span>
        <span className="text-slate-300" aria-hidden>
          /
        </span>
        <span className="text-sm font-semibold text-slate-900">Question {questionIndex + 1} of {questions.length}</span>
      </div>

      {q ? (
        <div className="rounded-2xl border-2 border-slate-100 bg-white p-4 md:p-6 shadow-md">
          <div className="aspect-[7/4] w-full overflow-hidden rounded-xl bg-slate-100 mb-5">
            <img
              src={q.image}
              alt=""
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex flex-wrap items-start gap-2 gap-y-3 mb-5">
            <p className="text-lg md:text-xl text-slate-900 leading-relaxed flex-1 min-w-0">
              <span>{q.textBefore}</span>
              <span className="inline-block min-w-[5ch] mx-1 border-b-2 border-dashed border-slate-400 align-baseline text-center font-semibold text-yellow-800">
                {pickedDisplayIndex !== null
                  ? q.options[optionOrder[pickedDisplayIndex]!]!
                  : "\u00a0"}
              </span>
              <span>{q.textAfter}</span>
            </p>
            <button
              type="button"
              onClick={() => void playAudio()}
              className="shrink-0 inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-[#f4f4f4] p-3 text-slate-700 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
              aria-label="Play sentence audio"
            >
              <Volume2 className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {optionOrder.map((originalIdx, displayIdx) => {
              const label = q.options[originalIdx]!;
              const picked = pickedDisplayIndex !== null;
              const isThis = pickedDisplayIndex === displayIdx;
              const correct = originalIdx === q.correctIndex;
              const candy =
                OPTION_PALETTE[displayIdx % OPTION_PALETTE.length]!;
              let ring: string = candy;
              if (picked && isThis) {
                ring = correct
                  ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                  : "border-rose-500 bg-rose-100 text-rose-900";
              } else if (picked && correct) {
                ring = "border-emerald-500 bg-emerald-100 text-emerald-900";
              } else if (picked) {
                ring = `${candy} opacity-55 saturate-75`;
              }
              return (
                <div
                  key={`${q.id}-${displayIdx}`}
                  className="flex min-w-0 gap-2 items-stretch"
                >
                  <button
                    type="button"
                    disabled={picked}
                    onClick={() => onPick(displayIdx)}
                    className={`min-w-0 flex-1 rounded-xl cursor-pointer border-2 px-4 py-3 text-left text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 disabled:cursor-default ${ring}`}
                  >
                    {label}
                  </button>
                  <button
                    type="button"
                    onClick={() => playOptionWord(label)}
                    className="shrink-0 inline-flex w-[3.25rem] items-center justify-center self-stretch rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
                    aria-label={`Play “${label}”`}
                  >
                    <Volume2 className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              );
            })}
          </div>

          {pickedDisplayIndex !== null ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {!isLast ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex cursor-pointer items-center rounded-xl border-2 border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
                >
                  Next question
                </button>
              ) : (
                <p className="text-sm font-medium text-slate-600">You finished this topic!</p>
              )}
              <Link
                to="/games"
                className="text-sm font-semibold text-yellow-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
              >
                Choose another topic
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
