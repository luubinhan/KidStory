import {
  HUNGRY_DOG_ROUND,
  type DropResult,
  type HungryDogVocabItem,
  type LessonState,
  type RoundState,
} from "../../types/hungryDog";

function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function pickNextTarget(
  pool: readonly HungryDogVocabItem[],
  previousId: string,
): HungryDogVocabItem {
  const others = pool.filter((p) => p.id !== previousId);
  if (others.length === 0) return pool[0]!;
  return pickRandom(others);
}

export function pickRoundChoices(
  pool: readonly HungryDogVocabItem[],
  target: HungryDogVocabItem,
): RoundState["choices"] {
  const distractors = pool.filter((p) => p.id !== target.id);
  const picked: HungryDogVocabItem[] = [target];
  const shuffled = shuffle([...distractors]);
  for (const item of shuffled) {
    if (picked.length >= HUNGRY_DOG_ROUND.choicesCount) break;
    if (!picked.some((p) => p.id === item.id)) picked.push(item);
  }
  while (picked.length < HUNGRY_DOG_ROUND.choicesCount) {
    picked.push(pickRandom(pool));
  }
  const choices = shuffle(picked.slice(0, HUNGRY_DOG_ROUND.choicesCount));
  return choices as RoundState["choices"];
}

export function createInitialLesson(
  pool: readonly HungryDogVocabItem[],
): LessonState {
  if (pool.length === 0) {
    throw new Error("createInitialLesson requires a non-empty pool");
  }
  const target = pickRandom(pool);
  return {
    status: "playing",
    correctCount: 0,
    sessionCoins: 0,
    round: {
      target,
      choices: pickRoundChoices(pool, target),
    },
  };
}

export function applyDrop(
  lesson: LessonState,
  pool: readonly HungryDogVocabItem[],
  droppedWord: string,
): DropResult {
  if (lesson.status !== "playing") {
    return { kind: "wrong", lesson };
  }
  const isCorrect =
    normalizeWord(droppedWord) === normalizeWord(lesson.round.target.word);
  if (!isCorrect) {
    return { kind: "wrong", lesson };
  }

  const correctCount = lesson.correctCount + 1;
  const sessionCoins = lesson.sessionCoins + HUNGRY_DOG_ROUND.coinPerCorrect;

  if (correctCount >= HUNGRY_DOG_ROUND.targetsNeeded) {
    return {
      kind: "correct",
      lesson: {
        ...lesson,
        status: "complete",
        correctCount,
        sessionCoins,
      },
    };
  }

  const nextTarget = pickNextTarget(pool, lesson.round.target.id);
  return {
    kind: "correct",
    lesson: {
      status: "playing",
      correctCount,
      sessionCoins,
      round: {
        target: nextTarget,
        choices: pickRoundChoices(pool, nextTarget),
      },
    },
  };
}
