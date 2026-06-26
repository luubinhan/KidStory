# Course Data Refactor — Design Spec

**Date:** 2026-06-27  
**Status:** Approved for implementation  
**Scope:** Replace the 5-unit course with a 2-unit structure; unify words, practice sentences, and MC questions per unit.

---

## Goal

Refactor KidStory course data so each unit follows a repeatable content shape:

- **Words** — vocabulary for flashcards, matching, and spell activities
- **Practice sentences** — full phrases for order-the-sentence activity
- **Multiple choice questions** — hand-authored fill-in-the-blank questions drawn from both words and sentences

Future units will be added by copying the same file template and filling in content.

---

## Decisions (from brainstorming)

| Topic | Decision |
|-------|----------|
| Course scope | 2 units only; units 3–5 removed |
| Unit 1 title | Greetings |
| Unit 2 title | Hello, How are you? |
| Initial progress | Both units `status: "current"`; no stars |
| Words → activities | Flashcards, Matching, Spell |
| Practice sentences → activities | Order the sentence only |
| Multiple choice | Hand-authored `GameQuestion[]` per unit, mixing word and sentence blanks |
| Sentence storage | Lowercase in data; sentence-case + punctuation in UI/TTS |
| Word visuals | `imageUrl` (not emoji); placeholder URLs until real assets are provided |
| Vietnamese translations | Proposed during implementation; user reviews |

---

## Unit content

### Unit 1 — Greetings (`unit-1`)

**Words**

| word | notes |
|------|-------|
| morning | |
| afternoon | |
| evening | |
| night | |

**Practice sentences** (stored lowercase)

- hello
- good morning
- good afternoon
- good evening
- good night

### Unit 2 — Hello, How are you? (`unit-2`)

**Words**

| word | notes |
|------|-------|
| student | |
| fine | |

**Practice sentences** (stored lowercase)

- are you a student
- yes i am
- how are you
- i am fine

---

## Data model

### Types (`src/types/course.ts`)

```typescript
interface CourseWord {
  id: string;
  word: string;
  translation: string;
  imageUrl: string;
}

interface CoursePracticeSentence {
  id: string;
  text: string; // lowercase, e.g. "good morning"
}

interface CourseUnit {
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
```

**Removed from `CourseUnit`:** `gameTopicId`

**Updated `CourseDictionaryEntry`:** Replace `emoji: string` with `imageUrl: string` (derived from `CourseWord`).

### Display helper

Add `formatPracticeSentence(text: string): string` in `src/lib/` (e.g. `courseSentenceDisplay.ts`):

- Input: lowercase stored text (`"how are you"`)
- Output: display/TTS string (`"How are you?"`)
- Rules: capitalize first word; add `?` for question patterns (`are you`, `how are you`); add `.` for statements; handle `"yes i am"` → `"Yes, I am."`

Storage and matching logic always use lowercase `text`; UI and speech synthesis use the formatted string.

---

## Activity wiring

| Activity | Data source | Implementation notes |
|----------|-------------|----------------------|
| Flashcards | `unit.words` | Back of card shows `<img src={imageUrl} />` + translation |
| Matching | `unit.words` | Pair word card with image card |
| Spell | `unit.words` | One spell round per vocabulary word |
| Order the sentence | `unit.practiceSentences` | Split `text` on whitespace; shuffle for drag-and-drop; validate against lowercase tokens |
| Multiple choice | `unit.multipleChoiceQuestions` | Reuse existing MC UI (`GameTopicPracticeSession` MC mode or equivalent fed by unit questions) |

### Sentence ordering (new path)

Current sentence mode derives words from fill-in-the-blank `GameQuestion` via `sentenceWordsFromQuestion`. Course units will use a dedicated session (or adapter) that:

1. Reads `unit.practiceSentences`
2. Splits each `text` into word tokens
3. Shuffles tokens for the drag-and-drop UI
4. Uses `formatPracticeSentence` for display label and TTS

Do not require fake `GameQuestion` wrappers for practice sentences.

### Multiple choice (hand-authored)

Each unit file includes a `multipleChoiceQuestions` array using the existing `GameQuestion` shape (`textBefore`, `textAfter`, `options`, `correctIndex`).

Example patterns:

**Unit 1 — word blanks**

- `"Good ___"` → morning / afternoon / evening / night
- `"I say good ___."` → morning / night / book / desk

**Unit 1 — sentence/word blanks**

- `"___ morning"` → good / bad / big / red

**Unit 2 — word blanks**

- `"I am ___."` → fine / sad / big / red
- `"Are you a ___?"` → student / teacher / doctor / driver

**Unit 2 — sentence blanks**

- `"___ you a student?"` → Are / Is / Am / Do

Spell activity continues to use `GameTopicPracticeSession` spell mode fed by unit words (not game topics).

---

## File layout

```
src/data/course/
  units/unit-1-greetings.ts
  units/unit-2-hello.ts
  index.ts                 # courseUnits, courseProfile, getters
src/types/course.ts        # updated types
src/lib/courseSentenceDisplay.ts   # formatPracticeSentence()
```

### Unit module template (`units/unit-N-*.ts`)

Each file exports one `CourseUnit` object containing:

- UI metadata (id, unitNumber, title, subtitle, status, icon classes, Lucide icon)
- `words[]`
- `practiceSentences[]`
- `multipleChoiceQuestions[]`

### Aggregator (`course/index.ts`)

- Export `courseProfile`, `courseUnits`
- `getCourseUnitById(unitId)`
- `getDictionaryEntries(): CourseDictionaryEntry[]` — flatten all unit words with `unitId` and `unitNumber`
- `getDictionaryEntriesByUnitId(unitId)` — filter flattened list

### Migration from current files

| Current | Action |
|---------|--------|
| `src/data/course.ts` | Replace with `src/data/course/index.ts` re-export or move content into `course/` folder |
| `src/data/course-dictionary.ts` | Remove static array; replace with derived getter from `courseUnits` (or thin re-export from `course/index.ts`) |
| `src/data/games/units/unit-1-school.ts` | Delete (content moves into `course/units/unit-1-greetings.ts`) |
| `src/data/games/units/unit-2-friends.ts` | Delete |
| `src/data/games/units/unit-3-colours.ts` | Delete |
| `src/data/games/units/unit-4-body.ts` | Delete |
| `src/data/games/units/unit-5-nature.ts` | Delete |
| `src/data/games.ts` | Remove imports/exports for deleted unit game topics |

Standalone game topics (`directions`, `preposition`, `pronouns`, etc.) are unchanged.

---

## UI updates

Components that currently render `entry.emoji` must render an image:

- `DictionaryWordCard.tsx`
- `CourseFlashcardsSession.tsx` (card back)
- `matchingPairs.ts` / `MatchingCard.tsx` (image side of pair)

Use a shared small component or pattern:

```tsx
<img src={entry.imageUrl} alt="" className="..." />
```

Placeholder strategy for initial data: use empty string or a generic placeholder URL; components should tolerate missing images gracefully (e.g. fallback text or muted placeholder block).

---

## `CourseUnitPracticePage` changes

1. Load `unit` from `getCourseUnitById`
2. Flashcards / matching: `getDictionaryEntriesByUnitId(unit.id)`
3. Spell / multiple choice: pass `unit.multipleChoiceQuestions` or `unit.words` to practice sessions — **not** `getGameTopic(unit.gameTopicId)`
4. Sentence: pass `unit.practiceSentences` to new sentence session
5. Remove `gameTopicId` dependency and the "Quiz content not available" branch tied to missing game topics

Update imports across the app from `../data/course` to `../data/course` (same path if `index.ts` is used).

---

## Adding a unit later

1. Copy `units/unit-2-hello.ts` as a template
2. Set id, unitNumber, title, status, icon
3. Fill `words`, `practiceSentences`, `multipleChoiceQuestions`
4. Import and append to `courseUnits` in `index.ts`
5. Provide `imageUrl` values when assets are ready

No changes to types or routing required.

---

## Out of scope

- User progress persistence / XP logic
- Generating MC questions automatically at runtime
- Real illustration assets (placeholders only in this refactor)
- Changes to standalone vocabulary games outside the course path

---

## Testing checklist

- [ ] Course map shows 2 units, both current
- [ ] Unit 1 / Unit 2 detail pages list all 5 activities
- [ ] Flashcards and matching work with `imageUrl` (or placeholder)
- [ ] Spell uses unit vocabulary words only
- [ ] Order the sentence uses practice sentences; display is capitalized/punctuated
- [ ] Multiple choice uses hand-authored questions per unit
- [ ] Dictionary page lists words from both units with correct unit labels
- [ ] No broken imports from removed `games/units/unit-*` files
- [ ] Standalone game topics still load from `/games`
