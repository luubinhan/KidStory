# Course How-to-Play Page — Design Spec

**Date:** 2026-07-12  
**Status:** Approved (brainstorming session)

## Summary

Add a standalone parent/helper guide at `/how-to-play` that explains how the Wonder Farm course works: learning-path flow, rules for each practice activity, and the coins/diamonds/hints/shop reward system. English copy only. No in-app entry point in v1 (URL-only).

## Decisions

| Topic | Choice |
|-------|--------|
| Audience | Parents / helpers (clearer rules, unlock + rewards explained) |
| Content scope | Course flow + all 7 activities + rewards (coins, diamonds, hints, Assets shop) |
| Entry | Standalone URL only — no header/nav link in v1 |
| Language | English only |
| Layout | Long single-page scroll (Approach A) |
| Bottom nav | Omit on this page (standalone help; avoid Home/Explore confusion) |
| Progress data | None — static help page |

## Approach

**Recommended: long scroll guide (Approach A)**

One page with intro → course flow → activities → rewards → CTA to `/course`. Reuse course visual language (`max-w-lg`, soft sky/farm vibe). Static copy in a small data module; activity labels/descriptions from `courseActivities`; reward numbers from existing constants.

Rejected alternatives:

- **Tabbed / accordion sections** — less scroll, but parents miss content behind tabs; more UI for little gain.
- **Interactive walkthrough / fake demos** — better teaching, but overkill for a parent help URL and much larger build.

## Architecture

```
src/App.tsx                              Route /how-to-play (top-level)
src/pages/CourseHowToPlayPage.tsx        Page layout, sections, CTA
src/data/howToPlay.ts                    Flow steps, reward bullets, per-activity tips
src/components/course/HowToSection.tsx   Optional: titled section wrapper
src/components/course/ActivityRuleCard.tsx Optional: icon + label + tip row
```

Top-level `/how-to-play` route — no collision with `/course/:unitId`.

### Data flow

- Page imports `courseActivities` for `label`, `description`, and `icon` (single source of truth for activity names).
- Page imports reward constants from `src/types/userProgress.ts`:
  - `COIN_PER_ACTIVITY` (default 10)
  - `COIN_REWARD_BY_ACTIVITY` (write 50, matching 20, complete-sentence 50)
  - `DIAMOND_REWARD_BY_ACTIVITY` (write 50, complete-sentence 50)
  - `COIN_HINT_COST` (1)
  - `COIN_UNIT_BONUS` (100) — mention finish-unit bonus in rewards copy
- `src/data/howToPlay.ts` holds only guide-specific strings (hero, flow steps, activity tip lines, section titles). Do not hardcode reward amounts in copy strings; interpolate from constants at render time.

No IndexedDB, no `useUserProgress`, no network.

## Page content (scroll order)

1. **Hero** — Title “How to play”. One or two sentences: the course teaches English words through units and practice games; this page explains the path, each game, and rewards.
2. **Course flow** — Numbered steps:
   - Open the course map and pick an unlocked unit.
   - Complete activities listed on the unit page.
   - The next unit unlocks when the previous unit has at least half of its activities completed.
   - Unit 1 is always unlocked.
3. **Activities** — One block per activity id in `courseActivities` order: Flashcards, Multiple choice, Order the sentence, Spell the word, Write, Matching, Complete the sentence. Show label + existing description + a short “how to play” tip (tap/flip, pick answer, drag order, drag letters, type word, match pairs, type missing word).
4. **Rewards** — Explain:
   - Coins awarded on activity finish (default and higher amounts for write / matching / complete-sentence via constants).
   - Diamonds only from write and complete-sentence.
   - Hints cost coins (`COIN_HINT_COST`).
   - Assets shop spends coins; some premium items also need diamonds.
   - Completing all activities in a unit awards the unit bonus (`COIN_UNIT_BONUS`).
5. **Footer CTA** — Primary button “Start learning” linking to `/course`. Top bar also provides back / go-to-course to `/course`.

## Components

| Piece | Role |
|-------|------|
| `CourseHowToPlayPage` | Shell: top bar, scroll sections, CTA |
| `HowToSection` (optional) | Consistent section heading + body spacing |
| `ActivityRuleCard` (optional) | Icon badge + title + description + tip |
| `howToPlay.ts` | Static guide copy not owned by `courseActivities` |

Keep extracts thin; if the page stays readable as one file with inline section markup, skip extra components until needed.

## Visual / UX

- Match existing course pages: soft sky gradient / farm-adjacent feel, `max-w-lg` centered column, readable parent typography (not kid-game oversized).
- Not a marketing landing: no hero marketing collage, no stats strip. One job per section.
- No `CourseBottomNav` on this route for v1.
- Top bar: clear control to leave the guide (`/course`).

## Error handling

None beyond normal React render. Static content only.

## Testing / verification

- `npm run lint`
- Manual: open `/how-to-play`, scroll all sections, CTA navigates to `/course`
- Manual: confirm `/how-to-play` renders the guide page
- No new `npx tsx` test scripts (no pure logic beyond constant interpolation)

## Out of scope (v1)

- In-app link from course map header or bottom nav
- Vietnamese / bilingual copy
- Interactive activity demos
- Deep links into a specific activity
- Onboarding modal / first-visit gate

## Success criteria

- Parents can open the shareable URL and understand unlock rules, each activity, and how coins/diamonds/hints/shop work.
- Activity names stay aligned with the unit activity list via `courseActivities`.
- Reward numbers stay aligned with gameplay via shared constants.
- Implementation is a small focused diff: route + page + copy module (+ optional thin components).
