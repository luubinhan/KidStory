# Course How-to-Play Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static English parent/helper guide at `/course/how-to-play` covering course unlock flow, all seven activities, and coins/diamonds/hints/shop rewards.

**Architecture:** Register a dedicated route before `/course/:unitId`. One page component renders a long scroll of sections from `src/data/howToPlay.ts` plus `courseActivities` and reward constants from `src/types/userProgress.ts`. No progress context, no bottom nav, CTA links to `/course`.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, react-router-dom

**Spec:** `docs/superpowers/specs/2026-07-12-course-how-to-play-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `src/data/howToPlay.ts` | Hero copy, flow steps, per-activity tips, section titles (no hardcoded reward numbers) |
| `src/pages/CourseHowToPlayPage.tsx` | Page shell, sections, activity cards, rewards list, CTA |
| `src/App.tsx` | Add `/course/how-to-play` route before `/course/:unitId` |
| `src/components/course/index.ts` | No change unless optional extracts are added (YAGNI: keep in page) |

---

### Task 1: Guide copy module

**Files:**
- Create: `src/data/howToPlay.ts`

- [ ] **Step 1: Add `howToPlay.ts`**

```typescript
import type { CourseActivityId } from "../types/course";

export const howToPlayHero = {
  title: "How to play",
  subtitle:
    "Wonder Farm teaches English words through units and practice games. This page explains the learning path, each activity, and how rewards work.",
} as const;

export const howToPlaySections = {
  flow: "How the course works",
  activities: "Practice activities",
  rewards: "Coins, diamonds, and the shop",
} as const;

export const howToPlayFlowSteps: readonly string[] = [
  "Open the course map and pick an unlocked unit.",
  "Complete the activities listed on the unit page.",
  "The next unit unlocks when the previous unit has at least half of its activities completed.",
  "Unit 1 is always unlocked.",
];

/** Short parent-facing tips; labels/descriptions come from `courseActivities`. */
export const howToPlayActivityTips: Record<CourseActivityId, string> = {
  flashcards: "Tap a card to flip it and learn the word.",
  "multiple-choice": "Read the sentence and pick the correct word from four choices.",
  sentence: "Drag the word tiles into the correct order to build the sentence.",
  spell: "Drag letters into place to spell the target word.",
  write: "Type the word you see or hear, then check your answer.",
  matching: "Match each word to its picture until every pair is connected.",
  "complete-sentence": "Look at the picture and type the missing word in the sentence.",
};

export const howToPlayCtaLabel = "Start learning" as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/data/howToPlay.ts
git commit -m "feat: add how-to-play guide copy data"
```

---

### Task 2: How-to-play page

**Files:**
- Create: `src/pages/CourseHowToPlayPage.tsx`

- [ ] **Step 1: Create the page**

Match course page shell (`max-w-lg`, sky gradient). No `CourseBottomNav`. Top bar back link to `/course` (same pattern as `CourseUnitPage`). Interpolate reward amounts from constants / `getActivityRewardAmounts` — never hardcode numbers in JSX strings.

```tsx
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { courseActivities } from "../data/course-activities";
import {
  howToPlayActivityTips,
  howToPlayCtaLabel,
  howToPlayFlowSteps,
  howToPlayHero,
  howToPlaySections,
} from "../data/howToPlay";
import {
  COIN_HINT_COST,
  COIN_PER_ACTIVITY,
  COIN_UNIT_BONUS,
  getActivityRewardAmounts,
} from "../types/userProgress";

export default function CourseHowToPlayPage() {
  const writeRewards = getActivityRewardAmounts("write");
  const matchingRewards = getActivityRewardAmounts("matching");
  const completeSentenceRewards = getActivityRewardAmounts("complete-sentence");

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-12">
      <div className="mx-auto max-w-lg px-4 py-6">
        <Link
          to="/course"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to course
        </Link>

        <header className="mt-6">
          <h1 className="text-2xl font-bold text-sky-900">{howToPlayHero.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {howToPlayHero.subtitle}
          </p>
        </header>

        <section className="mt-8" aria-labelledby="how-to-flow">
          <h2 id="how-to-flow" className="text-lg font-bold text-slate-800">
            {howToPlaySections.flow}
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            {howToPlayFlowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-8" aria-labelledby="how-to-activities">
          <h2 id="how-to-activities" className="text-lg font-bold text-slate-800">
            {howToPlaySections.activities}
          </h2>
          <ul className="mt-3 space-y-3">
            {courseActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <li
                  key={activity.id}
                  className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${activity.iconBgClass}`}
                    >
                      <Icon
                        className={`size-5 ${activity.iconColorClass}`}
                        aria-hidden
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800">{activity.label}</h3>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {activity.description}
                      </p>
                      <p className="mt-2 text-sm font-medium text-sky-800">
                        {howToPlayActivityTips[activity.id]}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="how-to-rewards">
          <h2 id="how-to-rewards" className="text-lg font-bold text-slate-800">
            {howToPlaySections.rewards}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            <li>
              Finishing an activity usually awards {COIN_PER_ACTIVITY} coins.
              Write awards {writeRewards.coins} coins, Matching awards{" "}
              {matchingRewards.coins} coins, and Complete the sentence awards{" "}
              {completeSentenceRewards.coins} coins.
            </li>
            <li>
              Diamonds come only from Write ({writeRewards.diamonds}) and Complete
              the sentence ({completeSentenceRewards.diamonds}).
            </li>
            <li>Hints cost {COIN_HINT_COST} coin each.</li>
            <li>
              Completing every activity in a unit awards a {COIN_UNIT_BONUS}-coin
              unit bonus.
            </li>
            <li>
              Spend coins in Assets to decorate the farm. Some premium items also
              need diamonds.
            </li>
          </ul>
        </section>

        <div className="mt-10">
          <Link
            to="/course"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-center text-base font-bold text-white shadow-sm hover:bg-sky-700"
          >
            {howToPlayCtaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/CourseHowToPlayPage.tsx
git commit -m "feat: add CourseHowToPlayPage guide UI"
```

---

### Task 3: Wire the route

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import the page and register the route before `:unitId`**

In `src/App.tsx`, add the import next to the other course pages:

```tsx
import CourseHowToPlayPage from "./pages/CourseHowToPlayPage";
```

Inside `<Routes>`, place this route **immediately after** `/course` and **before** `/course/:unitId`:

```tsx
<Route path="/course" element={<CoursePage />} />
<Route path="/course/how-to-play" element={<CourseHowToPlayPage />} />
<Route path="/course/:unitId" element={<CourseUnitPage />} />
```

Do not add a bottom-nav or course-map link (out of scope for v1).

- [ ] **Step 2: Typecheck**

Run: `npm run lint`  
Expected: exit 0, no errors.

- [ ] **Step 3: Manual smoke (dev server if available)**

- Open `/course/how-to-play` — page renders hero, flow, 7 activities, rewards, CTA
- Confirm it is **not** the unit “not found” page
- Click “Start learning” / “Back to course” → `/course`

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: route /course/how-to-play to how-to guide"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Route before `:unitId` | Task 3 |
| Long scroll: hero → flow → activities → rewards → CTA | Task 2 |
| Activity labels from `courseActivities` | Task 2 |
| Tips in data module | Task 1 |
| Reward numbers from constants | Task 2 |
| English only, no bottom nav, no in-app entry | Tasks 2–3 |
| `npm run lint` | Task 3 |

## Out of scope (do not implement)

- Header / nav link into the guide
- Vietnamese copy
- Interactive demos
- Optional `HowToSection` / `ActivityRuleCard` extracts (keep inline unless page becomes unwieldy)
