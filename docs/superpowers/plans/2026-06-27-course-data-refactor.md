# Course Data Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 5-unit course with 2 colocated unit modules (words, practice sentences, MC questions), remove `gameTopicId`, and wire all five practice activities to unit-native data.

**Architecture:** Each unit lives in `src/data/course/units/*.ts` as a single `CourseUnit` export. Dictionary entries are derived at runtime. MC and spell reuse `GameTopicPracticeSession` via thin `GameTopic` adapters; sentence ordering gets a dedicated hook + session reading `practiceSentences` directly. Word visuals use `imageUrl` with a shared fallback component.

**Tech Stack:** React 19, TypeScript, Vite, react-router-dom, existing game-topic UI components (`GameSentenceWordStrip`, `GameSpellLetterStrip`, etc.)

**Spec:** `docs/superpowers/specs/2026-06-27-course-data-refactor-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `src/types/course.ts` | `CourseWord`, `CoursePracticeSentence`, updated `CourseUnit`, `CourseDictionaryEntry.imageUrl` |
| `src/lib/courseSentenceDisplay.ts` | `formatPracticeSentence()` |
| `src/lib/courseSentenceDisplay.test.ts` | Runnable assertions via `tsx` |
| `src/lib/courseSpellQuestions.ts` | `buildSpellQuestionsFromWords()` |
| `src/lib/courseUnitTopic.ts` | `buildMcTopic()`, `buildSpellTopic()` adapters |
| `src/components/course/CourseWordImage.tsx` | Shared `<img>` with empty-URL fallback |
| `src/data/course/units/unit-1-greetings.ts` | Unit 1 content |
| `src/data/course/units/unit-2-hello.ts` | Unit 2 content |
| `src/data/course/index.ts` | `courseUnits`, profile, dictionary getters |
| `src/data/course-dictionary.ts` | Thin re-export of dictionary helpers |
| `src/hooks/useCoursePracticeSentenceQuestion.ts` | Sentence ordering state for practice sentences |
| `src/components/course-practice/CoursePracticeSentenceSession.tsx` | Sentence UI (mirrors game sentence mode) |
| `src/pages/CourseUnitPracticePage.tsx` | Wire unit data to sessions; drop `getGameTopic` |
| UI files using `emoji` | Switch to `CourseWordImage` / `imageUrl` |

**Delete:** `src/data/course.ts`, `src/data/games/units/unit-*.ts` (all 5)

---

### Task 1: Update course types

**Files:**
- Modify: `src/types/course.ts`

- [ ] **Step 1: Replace types**

```typescript
import type { LucideIcon } from "lucide-react";
import type { GameQuestion } from "./game";

export type CourseUnitStatus = "completed" | "current" | "locked";

export type CourseActivityId =
  | "flashcards"
  | "multiple-choice"
  | "spell"
  | "sentence"
  | "matching";

export interface CourseWord {
  id: string;
  word: string;
  translation: string;
  imageUrl: string;
}

export interface CoursePracticeSentence {
  id: string;
  text: string;
}

export interface CourseUnit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  status: CourseUnitStatus;
  stars?: number;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  words: readonly CourseWord[];
  practiceSentences: readonly CoursePracticeSentence[];
  multipleChoiceQuestions: readonly GameQuestion[];
}

// CourseActivity, CourseProfile unchanged ...

export interface CourseDictionaryEntry {
  id: string;
  word: string;
  translation: string;
  imageUrl: string;
  unitId: string;
  unitNumber: number;
}
```

- [ ] **Step 2: Verify types compile**

Run: `npm run lint`  
Expected: FAIL on files still referencing `emoji` / `gameTopicId` — that is OK for this step; note errors for Task 8–10.

- [ ] **Step 3: Commit**

```bash
git add src/types/course.ts
git commit -m "refactor: extend course types for unit-native content"
```

---

### Task 2: Sentence display helper (TDD)

**Files:**
- Create: `src/lib/courseSentenceDisplay.ts`
- Create: `src/lib/courseSentenceDisplay.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// src/lib/courseSentenceDisplay.test.ts
import { formatPracticeSentence } from "./courseSentenceDisplay";

function assertEqual(actual: string, expected: string, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected "${expected}", got "${actual}"`);
  }
}

assertEqual(formatPracticeSentence("hello"), "Hello.", "hello");
assertEqual(formatPracticeSentence("good morning"), "Good morning.", "good morning");
assertEqual(formatPracticeSentence("how are you"), "How are you?", "how are you");
assertEqual(formatPracticeSentence("are you a student"), "Are you a student?", "are you a student");
assertEqual(formatPracticeSentence("yes i am"), "Yes, I am.", "yes i am");
assertEqual(formatPracticeSentence("i am fine"), "I am fine.", "i am fine");

console.log("courseSentenceDisplay.test.ts: all passed");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/courseSentenceDisplay.test.ts`  
Expected: FAIL — cannot find module `./courseSentenceDisplay`

- [ ] **Step 3: Implement**

```typescript
// src/lib/courseSentenceDisplay.ts
const QUESTION_STARTERS = ["are you", "how are you", "what is", "where is"];

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function capitalizeSentence(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return "";
  words[0] = capitalizeWord(words[0]!);
  return words.join(" ");
}

/** Display/TTS form for lowercase stored practice sentence text. */
export function formatPracticeSentence(text: string): string {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return "";

  if (normalized === "yes i am") {
    return "Yes, I am.";
  }

  const capitalized = capitalizeSentence(normalized);
  const isQuestion =
    normalized.endsWith("?") ||
    QUESTION_STARTERS.some((starter) => normalized.startsWith(starter));

  if (isQuestion) {
    return capitalized.endsWith("?") ? capitalized : `${capitalized}?`;
  }

  return capitalized.endsWith(".") ? capitalized : `${capitalized}.`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/courseSentenceDisplay.test.ts`  
Expected: `courseSentenceDisplay.test.ts: all passed`

- [ ] **Step 5: Commit**

```bash
git add src/lib/courseSentenceDisplay.ts src/lib/courseSentenceDisplay.test.ts
git commit -m "feat: add formatPracticeSentence for course sentence display"
```

---

### Task 3: Course unit adapters and dictionary helpers

**Files:**
- Create: `src/lib/courseSpellQuestions.ts`
- Create: `src/lib/courseUnitTopic.ts`
- Create: `src/data/course/index.ts` (partial — helpers only first)

- [ ] **Step 1: Spell question builder**

```typescript
// src/lib/courseSpellQuestions.ts
import type { CourseWord } from "../types/course";
import type { GameQuestion } from "../types/game";

export function buildSpellQuestionsFromWords(
  words: readonly CourseWord[],
): GameQuestion[] {
  return words.map((entry) => ({
    id: `spell-${entry.id}`,
    image: entry.imageUrl || undefined,
    textBefore: "",
    textAfter: "",
    options: [entry.word] as readonly string[],
    correctIndex: 0,
  }));
}
```

- [ ] **Step 2: GameTopic adapters**

```typescript
// src/lib/courseUnitTopic.ts
import type { CourseUnit } from "../types/course";
import type { GameTopic } from "../types/game";
import { buildSpellQuestionsFromWords } from "./courseSpellQuestions";

export function buildMcTopic(unit: CourseUnit): GameTopic {
  return {
    id: unit.id,
    title: unit.title,
    questions: unit.multipleChoiceQuestions,
  };
}

export function buildSpellTopic(unit: CourseUnit): GameTopic {
  return {
    id: unit.id,
    title: unit.title,
    questions: buildSpellQuestionsFromWords(unit.words),
  };
}
```

- [ ] **Step 3: Dictionary derivation (add to course/index.ts once units exist)**

```typescript
import type { CourseDictionaryEntry, CourseUnit } from "../../types/course";

export function getDictionaryEntries(
  units: readonly CourseUnit[],
): CourseDictionaryEntry[] {
  return units.flatMap((unit) =>
    unit.words.map((word) => ({
      id: word.id,
      word: word.word,
      translation: word.translation,
      imageUrl: word.imageUrl,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
    })),
  );
}

export function getDictionaryEntriesByUnitId(
  units: readonly CourseUnit[],
  unitId: string,
): CourseDictionaryEntry[] {
  return getDictionaryEntries(units).filter((entry) => entry.unitId === unitId);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/courseSpellQuestions.ts src/lib/courseUnitTopic.ts
git commit -m "feat: add course spell and MC topic adapters"
```

---

### Task 4: Unit 1 — Greetings content

**Files:**
- Create: `src/data/course/units/unit-1-greetings.ts`

- [ ] **Step 1: Add unit module**

```typescript
import { Sun } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit1Greetings = {
  id: "unit-1",
  unitNumber: 1,
  title: "Greetings",
  subtitle: "",
  status: "current",
  icon: Sun,
  iconBgClass: "bg-amber-100",
  iconColorClass: "text-amber-600",
  words: [
    { id: "morning", word: "morning", translation: "buổi sáng", imageUrl: "" },
    { id: "afternoon", word: "afternoon", translation: "buổi chiều", imageUrl: "" },
    { id: "evening", word: "evening", translation: "buổi tối", imageUrl: "" },
    { id: "night", word: "night", translation: "ban đêm", imageUrl: "" },
  ],
  practiceSentences: [
    { id: "unit-1-s-1", text: "hello" },
    { id: "unit-1-s-2", text: "good morning" },
    { id: "unit-1-s-3", text: "good afternoon" },
    { id: "unit-1-s-4", text: "good evening" },
    { id: "unit-1-s-5", text: "good night" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-1-mc-1",
      textBefore: "Good ",
      textAfter: ".",
      options: ["morning", "afternoon", "book", "desk"],
      correctIndex: 0,
    },
    {
      id: "unit-1-mc-2",
      textBefore: "Good ",
      textAfter: ".",
      options: ["night", "morning", "pencil", "tree"],
      correctIndex: 0,
    },
    {
      id: "unit-1-mc-3",
      textBefore: "We say good ",
      textAfter: " in the afternoon.",
      options: ["afternoon", "morning", "night", "school"],
      correctIndex: 0,
    },
    {
      id: "unit-1-mc-4",
      textBefore: "",
      textAfter: " morning.",
      options: ["Good", "Bad", "Big", "Red"],
      correctIndex: 0,
    },
    {
      id: "unit-1-mc-5",
      textBefore: "I say ",
      textAfter: ".",
      options: ["hello", "goodbye", "sorry", "please"],
      correctIndex: 0,
    },
  ],
} satisfies CourseUnit;
```

- [ ] **Step 2: Commit**

```bash
git add src/data/course/units/unit-1-greetings.ts
git commit -m "feat: add unit 1 Greetings course content"
```

---

### Task 5: Unit 2 — Hello, How are you? content

**Files:**
- Create: `src/data/course/units/unit-2-hello.ts`

- [ ] **Step 1: Add unit module**

```typescript
import { MessageCircle } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit2Hello = {
  id: "unit-2",
  unitNumber: 2,
  title: "Hello, How are you?",
  subtitle: "",
  status: "current",
  icon: MessageCircle,
  iconBgClass: "bg-sky-100",
  iconColorClass: "text-sky-600",
  words: [
    { id: "student", word: "student", translation: "học sinh", imageUrl: "" },
    { id: "fine", word: "fine", translation: "khỏe", imageUrl: "" },
  ],
  practiceSentences: [
    { id: "unit-2-s-1", text: "are you a student" },
    { id: "unit-2-s-2", text: "yes i am" },
    { id: "unit-2-s-3", text: "how are you" },
    { id: "unit-2-s-4", text: "i am fine" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-2-mc-1",
      textBefore: "Are you a ",
      textAfter: "?",
      options: ["student", "teacher", "doctor", "driver"],
      correctIndex: 0,
    },
    {
      id: "unit-2-mc-2",
      textBefore: "I am ",
      textAfter: ".",
      options: ["fine", "sad", "big", "red"],
      correctIndex: 0,
    },
    {
      id: "unit-2-mc-3",
      textBefore: "",
      textAfter: " you a student?",
      options: ["Are", "Is", "Am", "Do"],
      correctIndex: 0,
    },
    {
      id: "unit-2-mc-4",
      textBefore: "How are ",
      textAfter: "?",
      options: ["you", "I", "we", "they"],
      correctIndex: 0,
    },
  ],
} satisfies CourseUnit;
```

- [ ] **Step 2: Commit**

```bash
git add src/data/course/units/unit-2-hello.ts
git commit -m "feat: add unit 2 Hello course content"
```

---

### Task 6: Course aggregator and migration

**Files:**
- Create: `src/data/course/index.ts`
- Modify: `src/data/course-dictionary.ts`
- Delete: `src/data/course.ts`

- [ ] **Step 1: Create aggregator**

```typescript
// src/data/course/index.ts
import type { CourseProfile, CourseUnit } from "../../types/course";
import { unit1Greetings } from "./units/unit-1-greetings";
import { unit2Hello } from "./units/unit-2-hello";

export const courseProfile: CourseProfile = {
  name: "Khả Như",
  avatarEmoji: "👦",
  level: 1,
  xpCurrent: 340,
  xpMax: 500,
  curriculumLabel: "Grade 1",
};

export const courseUnits: readonly CourseUnit[] = [unit1Greetings, unit2Hello];

export function getCourseUnitById(unitId: string): CourseUnit | undefined {
  return courseUnits.find((unit) => unit.id === unitId);
}

export {
  getDictionaryEntries,
  getDictionaryEntriesByUnitId,
} from "./dictionary";
```

- [ ] **Step 2: Create dictionary module**

```typescript
// src/data/course/dictionary.ts
import type { CourseDictionaryEntry, CourseUnit } from "../../types/course";
import { courseUnits } from "./index";

export function getDictionaryEntries(
  units: readonly CourseUnit[] = courseUnits,
): CourseDictionaryEntry[] {
  return units.flatMap((unit) =>
    unit.words.map((word) => ({
      id: word.id,
      word: word.word,
      translation: word.translation,
      imageUrl: word.imageUrl,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
    })),
  );
}

export function getDictionaryEntriesByUnitId(unitId: string): CourseDictionaryEntry[] {
  return getDictionaryEntries().filter((entry) => entry.unitId === unitId);
}

export function filterCourseDictionary(
  query: string,
  entries: readonly CourseDictionaryEntry[],
): CourseDictionaryEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...entries];

  return entries.filter(
    (entry) =>
      entry.word.toLowerCase().includes(normalized) ||
      entry.translation.toLowerCase().includes(normalized),
  );
}
```

Fix circular import: `dictionary.ts` should import `courseUnits` from `./index` — if circular, inline `courseUnits` import from unit files directly in `dictionary.ts`:

```typescript
import { unit1Greetings } from "./units/unit-1-greetings";
import { unit2Hello } from "./units/unit-2-hello";
const courseUnits = [unit1Greetings, unit2Hello] as const;
```

- [ ] **Step 3: Replace course-dictionary.ts**

```typescript
// src/data/course-dictionary.ts
export {
  getDictionaryEntries as courseDictionarySource,
  getDictionaryEntries,
  getDictionaryEntriesByUnitId,
  filterCourseDictionary,
} from "./course/dictionary";

import { getDictionaryEntries } from "./course/dictionary";

/** Flat dictionary list for DictionaryPage */
export const courseDictionary = getDictionaryEntries();
```

- [ ] **Step 4: Delete `src/data/course.ts`**

Imports `from "../data/course"` resolve to `src/data/course/index.ts` automatically.

- [ ] **Step 5: Run lint**

Run: `npm run lint`  
Expected: errors only in files still using `emoji` / `gameTopicId`

- [ ] **Step 6: Commit**

```bash
git add src/data/course/ src/data/course-dictionary.ts
git rm src/data/course.ts
git commit -m "refactor: migrate course data to colocated unit modules"
```

---

### Task 7: Remove obsolete game unit topics

**Files:**
- Delete: `src/data/games/units/unit-1-school.ts` through `unit-5-nature.ts`
- Modify: `src/data/games.ts`

- [ ] **Step 1: Update games.ts**

Remove imports/exports for `Unit1School`, `Unit2Friends`, `Unit3Colours`, `Unit4Body`, `Unit5Nature`. Keep standalone topics only:

```typescript
export const gameTopics: readonly GameTopic[] = [
  Actions,
  TalentShow,
  pronouns,
  directions,
  preposition,
];
```

- [ ] **Step 2: Delete unit game files**

```bash
git rm src/data/games/units/unit-1-school.ts \
       src/data/games/units/unit-2-friends.ts \
       src/data/games/units/unit-3-colours.ts \
       src/data/games/units/unit-4-body.ts \
       src/data/games/units/unit-5-nature.ts
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`  
Expected: PASS except remaining `emoji`/`gameTopicId` references

- [ ] **Step 4: Commit**

```bash
git add src/data/games.ts
git commit -m "chore: remove course-linked game unit topics"
```

---

### Task 8: Word image UI (`imageUrl` replaces `emoji`)

**Files:**
- Create: `src/components/course/CourseWordImage.tsx`
- Modify: `src/types/matchingPairs.ts`
- Modify: `src/components/course/DictionaryWordCard.tsx`
- Modify: `src/components/course-practice/CourseFlashcardsSession.tsx`
- Modify: `src/components/course-practice/MatchingCard.tsx`
- Modify: `src/hooks/useCourseMatching.ts` (if label uses emoji — check)

- [ ] **Step 1: Shared image component**

```tsx
// src/components/course/CourseWordImage.tsx
import { cn } from "../../lib/utils";

type CourseWordImageProps = {
  imageUrl: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
};

export function CourseWordImage({
  imageUrl,
  alt = "",
  className,
  fallbackClassName,
}: CourseWordImageProps) {
  if (!imageUrl) {
    return (
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-400",
          fallbackClassName,
        )}
        aria-hidden
      >
        ?
      </span>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn("size-16 rounded-xl object-cover", className)}
    />
  );
}
```

- [ ] **Step 2: Update matchingPairs.ts line 33**

Change `content: entry.emoji` → `content: entry.imageUrl`

- [ ] **Step 3: Update DictionaryWordCard** — replace emoji span with `<CourseWordImage imageUrl={entry.imageUrl} />`

- [ ] **Step 4: Update CourseFlashcardsSession card back** — replace `{entry.emoji}` with `<CourseWordImage imageUrl={entry.imageUrl} fallbackClassName="size-24" />`

- [ ] **Step 5: Update MatchingCard** — for `card.type === "image"`, render:

```tsx
<CourseWordImage imageUrl={card.content} fallbackClassName="size-14" />
```

- [ ] **Step 6: Run lint**

Run: `npm run lint`  
Expected: PASS (except `gameTopicId` in CourseUnitPracticePage if not yet updated)

- [ ] **Step 7: Commit**

```bash
git add src/components/course/CourseWordImage.tsx src/types/matchingPairs.ts \
  src/components/course/DictionaryWordCard.tsx \
  src/components/course-practice/CourseFlashcardsSession.tsx \
  src/components/course-practice/MatchingCard.tsx
git commit -m "refactor: render course word images via imageUrl"
```

---

### Task 9: Practice sentence session

**Files:**
- Create: `src/hooks/useCoursePracticeSentenceQuestion.ts`
- Create: `src/components/course-practice/CoursePracticeSentenceSession.tsx`
- Modify: `src/components/course-practice/index.ts`

- [ ] **Step 1: Hook**

```typescript
// src/hooks/useCoursePracticeSentenceQuestion.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatPracticeSentence } from "../lib/courseSentenceDisplay";
import { shuffledIndices } from "../lib/gameTopicShuffle";
import type { CoursePracticeSentence } from "../types/course";

export function useCoursePracticeSentenceQuestion(
  sentences: readonly CoursePracticeSentence[],
  sessionKey: string,
) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [wordOrder, setWordOrder] = useState<number[]>([]);

  const sentence = sentences[sentenceIndex];
  const isLast = sentenceIndex >= sentences.length - 1;

  const words = useMemo(() => {
    if (!sentence) return [];
    return sentence.text.trim().split(/\s+/).filter(Boolean);
  }, [sentence]);

  useEffect(() => {
    setSentenceIndex(0);
  }, [sessionKey]);

  useEffect(() => {
    if (!sentence) {
      setWordOrder([]);
      return;
    }
    const n = words.length;
    setWordOrder(n > 0 ? shuffledIndices(n, `${sentence.id}-words`) : []);
  }, [sentence?.id, sessionKey, words.length]);

  const isSolved = useMemo(() => {
    if (!sentence || wordOrder.length !== words.length || words.length === 0) {
      return false;
    }
    return wordOrder.every((wIdx, slot) => words[wIdx] === words[slot]);
  }, [wordOrder, words, sentence]);

  const displayText = sentence ? formatPracticeSentence(sentence.text) : "";

  const playSentence = useCallback(() => {
    if (!displayText) return;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(displayText);
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  }, [displayText]);

  const goNext = useCallback(() => {
    if (sentenceIndex < sentences.length - 1) {
      setSentenceIndex((i) => i + 1);
    }
  }, [sentenceIndex, sentences.length]);

  return {
    sentenceIndex,
    sentence,
    sentences,
    isLast,
    words,
    wordOrder,
    setWordOrder,
    isSolved,
    displayText,
    playSentence,
    goNext,
  };
}
```

- [ ] **Step 2: Session component** (mirror sentence branch of `GameTopicPracticeSession`)

```tsx
// src/components/course-practice/CoursePracticeSentenceSession.tsx
import { useEffect, useRef } from "react";
import { Confetti } from "../Confetti";
import {
  GameQuestionFooter,
  GameSentenceWordStrip,
  IconVolumeButton,
} from "../game-topic";
import { useCoursePracticeSentenceQuestion } from "../../hooks/useCoursePracticeSentenceQuestion";
import { playCelebrationSound } from "../../lib/gameCelebrationSound";
import type { CoursePracticeSentence } from "../../types/course";

type Props = {
  sentences: readonly CoursePracticeSentence[];
  sessionKey: string;
};

export function CoursePracticeSentenceSession({ sentences, sessionKey }: Props) {
  const celebratedRef = useRef(false);
  const {
    sentenceIndex,
    sentence,
    sentences: allSentences,
    isLast,
    words,
    wordOrder,
    setWordOrder,
    isSolved,
    playSentence,
    goNext,
  } = useCoursePracticeSentenceQuestion(sentences, sessionKey);

  useEffect(() => {
    celebratedRef.current = false;
  }, [sentence?.id]);

  useEffect(() => {
    if (!isSolved || celebratedRef.current) return;
    celebratedRef.current = true;
    playCelebrationSound();
  }, [isSolved]);

  if (sentences.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-white bg-white p-6 text-center text-slate-500 shadow-md">
        No sentences to practice for this unit yet.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-2">
      {isSolved ? <Confetti /> : null}
      {sentence ? (
        <div className="rounded-2xl border-2 border-slate-100 bg-white px-4 py-20 md:p-8 shadow-md">
          <p className="mb-6 text-center text-sm font-semibold text-slate-400">
            Sentence {sentenceIndex + 1} of {allSentences.length}
          </p>
          <div className="flex flex-wrap items-start gap-2 gap-y-3 justify-center mb-12">
            <div className="bg-green-500 text-white border-green-700 scale-105 z-10 h-20 w-20 text-6xl font-kids rounded-3xl transition-all border-b-8 hover:-translate-y-1 active:scale-95">
              <IconVolumeButton
                className="h-full w-full cursor-pointer flex items-center justify-center"
                onClick={() => void playSentence()}
                aria-label="Hear the sentence"
              />
            </div>
          </div>
          <GameSentenceWordStrip
            words={words}
            wordOrder={wordOrder}
            onWordOrderChange={setWordOrder}
            disabled={isSolved}
            sentenceKey={`${sessionKey}:${sentence.id}`}
            isSolved={isSolved}
            onPlaySentence={playSentence}
          />
          {isSolved ? (
            <div className="mt-6 space-y-4">
              <GameQuestionFooter isLast={isLast} onNext={goNext} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 3: Export from course-practice index**

- [ ] **Step 4: Run lint**

Run: `npm run lint`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCoursePracticeSentenceQuestion.ts \
  src/components/course-practice/CoursePracticeSentenceSession.tsx \
  src/components/course-practice/index.ts
git commit -m "feat: add course practice sentence ordering session"
```

---

### Task 10: Wire CourseUnitPracticePage

**Files:**
- Modify: `src/pages/CourseUnitPracticePage.tsx`

- [ ] **Step 1: Replace game topic wiring**

Remove:
```typescript
import { getGameTopic } from "../data/games";
```

Add:
```typescript
import { buildMcTopic, buildSpellTopic } from "../lib/courseUnitTopic";
import { CoursePracticeSentenceSession } from "../components/course-practice";
```

Replace quiz section logic:

```typescript
const dictionaryEntries = getDictionaryEntriesByUnitId(unit.id);

// Remove: const gameTopic = getGameTopic(unit.gameTopicId);

if (activity.id === "flashcards") {
  return (/* ... CourseFlashcardsSession ... */);
}
if (activity.id === "matching") {
  return (/* ... CourseMatchingSession ... */);
}
if (activity.id === "sentence") {
  return (
    <>
      <CoursePracticeHeader unit={unit} activity={activity} />
      <CoursePracticeSentenceSession
        sentences={unit.practiceSentences}
        sessionKey={unit.id}
      />
    </>
  );
}
if (activity.id === "multiple-choice") {
  const topic = buildMcTopic(unit);
  return (
    <>
      <CoursePracticeHeader unit={unit} activity={activity} />
      <GameTopicPracticeSession topic={topic} topicId={unit.id} mode="multiple-choice" />
    </>
  );
}
if (activity.id === "spell") {
  const topic = buildSpellTopic(unit);
  return (
    <>
      <CoursePracticeHeader unit={unit} activity={activity} />
      <GameTopicPracticeSession topic={topic} topicId={unit.id} mode="spell" />
    </>
  );
}
```

Remove the `quizMode && !gameTopic` empty-state branch entirely.

- [ ] **Step 2: Run lint and build**

Run: `npm run lint && npm run build`  
Expected: both PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/CourseUnitPracticePage.tsx
git commit -m "refactor: wire course practice to unit-native data"
```

---

### Task 11: Final verification

- [ ] **Step 1: Run sentence display test**

Run: `npx tsx src/lib/courseSentenceDisplay.test.ts`  
Expected: all passed

- [ ] **Step 2: Run typecheck and production build**

Run: `npm run lint && npm run build`  
Expected: PASS with no errors

- [ ] **Step 3: Manual smoke test** (dev server: `npm start`)

Checklist from spec:
- [ ] `/course` shows 2 units, both current
- [ ] Unit 1 flashcards/matching show placeholder for empty `imageUrl`
- [ ] Unit 1 spell spells morning/afternoon/evening/night
- [ ] Unit 1 sentence orders all 5 practice sentences; TTS uses capitalized form
- [ ] Unit 1 MC shows 5 hand-authored questions
- [ ] Unit 2 activities work with 2 words / 4 sentences / 4 MC questions
- [ ] `/dictionary` lists 6 words total
- [ ] Standalone `/games` topics still work

- [ ] **Step 4: Commit any fixes from smoke test**

```bash
git commit -m "fix: address course refactor smoke test issues"
```

---

## Spec coverage self-review

| Spec requirement | Task |
|------------------|------|
| 2 units only | Task 4, 5, 6 |
| Words → flashcards/matching/spell | Task 6, 8, 10 |
| Practice sentences → order sentence | Task 2, 9, 10 |
| Hand-authored MC | Task 4, 5, 10 |
| Lowercase storage, formatted display | Task 2, 9 |
| `imageUrl` not emoji | Task 1, 8 |
| Remove `gameTopicId` | Task 1, 6, 10 |
| Delete units 3–5 + game files | Task 7 |
| Dictionary derived from units | Task 6 |
| Both units `current` | Task 4, 5 |
| Vietnamese translations proposed | Task 4, 5 |

No placeholders remain. Type names consistent across tasks.
