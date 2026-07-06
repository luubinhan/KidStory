# KidStory — Cursor agent guide

KidStory is a React SPA for young English learners. It combines interactive storybooks, a structured vocabulary course (Wonder Farm curriculum), standalone vocabulary games, and a progress/rewards system backed by IndexedDB.

## Tech stack

- **React 19** + **TypeScript** + **Vite 6**
- **react-router-dom** for routing
- **Tailwind CSS v4** (`@tailwindcss/vite`) for styling
- **Radix UI** primitives wrapped in `src/components/ui/` (see `.cursor/rules/radix-ui.mdc`)
- **Dexie** (IndexedDB) for user progress persistence
- **motion**, **lottie-react**, **react-pageflip**, **@dnd-kit** for interactions
- **lucide-react** for icons

Path alias: `@/*` maps to the repo root (see `tsconfig.json` and `vite.config.ts`).

## Commands

```bash
npm start          # dev server on :3000
npm run build      # production build
npm run lint       # tsc --noEmit (typecheck only)
npx tsx src/lib/<name>.test.ts   # run a single test script
```

Test files are standalone scripts with `assert()` helpers — not Jest/Vitest. Run relevant tests after changing logic in `src/lib/`.

Dev tip: append `?unblock=all` to any URL to unlock all course units (see `UserProgressContext`).

## App structure

```
src/
  pages/              Route-level screens
  components/         UI by feature (book-detail, course, course-practice, game-topic, …)
  hooks/              Session/state hooks (useCourseWriteSession, useGameTopicSpellQuestion, …)
  contexts/           UserProgressProvider (coins, diamonds, unit unlock, shop)
  data/               Static content (books, course units, game topics)
  lib/                Pure logic, DB access, helpers
  types/              Domain TypeScript types
```

### Routes (`src/App.tsx`)

| Path | Page |
|------|------|
| `/` | Discover (story library) |
| `/book/:id` | Flip-book reader |
| `/course` | Course map / learning path |
| `/course/:unitId` | Unit detail + activity list |
| `/course/:unitId/practice/:activityId` | Practice session |
| `/dictionary` | Cross-unit vocabulary search |
| `/games` | Game topic list |
| `/games/:topicId` | Standalone game session |
| `/assets` | Shop / farm assets (also `/shop`, `/achievements` redirect here) |
| `/settings` | Settings + data backup |

## Domain models

### Books (`src/types/book.ts`, `src/data/books.ts`)

Each book lives in its own folder under `src/data/<slug>/`. Register new books in `src/data/books.ts`. A book has cover metadata and ordered `StoryPage` spreads (image, sentence, vocabulary flashcards).

### Course (`src/types/course.ts`, `src/data/course/`)

- **Units** — `src/data/course/units/unit-N-*.ts`, exported from `src/data/course/index.ts`
- Each unit includes: `words`, `practiceSentences`, `multipleChoiceQuestions`, `typedAnswerQuestions`
- **Activities** — defined in `src/data/course-activities.ts`; IDs: `flashcards`, `multiple-choice`, `spell`, `write`, `sentence`, `matching`, `complete-sentence`
- Practice routing is in `src/pages/CourseUnitPracticePage.tsx`; MC/spell reuse `GameTopicPracticeSession` via `buildMcTopic` / `buildSpellTopic`

When adding course content, use `satisfies CourseUnit` and follow ID patterns like `unit-1-mc-1`, `unit-1-s-1`.

### Games (`src/types/game.ts`, `src/data/games/`)

Standalone quiz topics registered in `src/data/games.ts`. Questions use `GameQuestion` (blank sentence + four options). For adding questions, use the project skill at `.cursor/skills/kidstory-game-question-data/SKILL.md`.

### User progress (`src/types/userProgress.ts`, `src/lib/userProgress*.ts`)

- Persisted in IndexedDB via Dexie (`src/lib/userProgressDb.ts`)
- Context API: `useUserProgress()` from `src/contexts/UserProgressContext.tsx`
- Completing activities awards coins/diamonds; hints cost coins; shop items in `src/data/shopItems.ts`
- Activity completion hooks: `useActivityCompletion` in practice sessions

## Conventions

### Components and hooks

- **Pages** are default exports in `src/pages/`; **feature components** are named exports
- Extract session logic into `src/hooks/use*.ts`; keep components focused on layout and wiring
- Reuse game UI pieces (`GameQuestionImage`, `McProgressHeader`, `GameTopicPracticeSession`) across course and standalone games
- Style with Tailwind; merge classes via `cn()` from `src/lib/utils.ts`
- End screens and reward UI: `ActivityEndShell`, `WriteEndScreen`, `RewardToast` in `src/components/progress/`

### Data and assets

- Static images/audio often use external URLs or paths under `public/`
- Game images in repo use GitHub raw URLs: `https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/...`
- Vietnamese translations appear in course `translation` fields; UI copy is English unless the task says otherwise

### UI library

- Use Radix wrappers from `src/components/ui/` — **do not** add `@luckyluu/wonder-ui`
- New interactive primitives → wrap Radix in `src/components/ui/` and export from `index.ts`

### Scope and quality

- Minimize diff scope; match existing file patterns (indent, trailing commas, `satisfies` on data exports)
- Avoid over-abstracting; no unnecessary comments
- Typecheck with `npm run lint`; run targeted `npx tsx …test.ts` when touching `src/lib/`

## Cursor resources in this repo

| Resource | Purpose |
|----------|---------|
| `AGENTS.md` (this file) | Project overview for agents |
| `.cursor/rules/kidstory-project.mdc` | Always-on project rules |
| `.cursor/rules/radix-ui.mdc` | Radix UI component patterns |
| `.cursor/rules/course-data.mdc` | Course unit / activity data |
| `.cursor/rules/practice-sessions.mdc` | Practice hooks and session components |
| `.cursor/skills/kidstory-game-question-data/` | Adding game quiz questions |
| `docs/superpowers/` | Design specs and implementation plans (historical reference) |
