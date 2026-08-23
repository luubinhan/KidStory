---
name: kidstory-game-question-data
description: Adds KidStory vocabulary multiple-choice questions from a user-supplied focus word (blank answer). Generates id, image URL, textBefore, textAfter, four options, and correctIndex; keeps sentences short and simple. Use when extending a course unit's multipleChoiceQuestions.
---

# KidStory game question data

## When this applies

The user names a **focus word** (the correct answer for the dashed blank). Append a new `GameQuestion` to `multipleChoiceQuestions` on an existing course unit in `src/data/course/units/`.

## Data shape

Follow `GameQuestion` in `src/types/game.ts`:

- `id` — string, unique within the unit (`unit-N-mc-N`)
- `image` — full URL string (see Image URLs)
- `textBefore` / `textAfter` — sentence split around the blank; include trailing/leading spaces so the line reads naturally with a space before and after the blank
- `options` — exactly **four** strings; one equals the focus word
- `correctIndex` — **0-based** index of the focus word in `options`
- `audioUrl` — optional; omit unless the user asks for audio
- `translation` — optional Vietnamese hint when there is no illustration

The UI renders: `textBefore` + [blank] + `textAfter`; the learner picks one of `options` to fill the blank.

## Focus word workflow

1. **Confirm unit file** — e.g. `src/data/course/units/unit-3-fruits.ts`. If unclear, ask once.
2. **Next `id`** — pattern `unit-N-mc-{n}` matching sibling questions. Increment `n` from the highest existing number.
3. **Sentence** — **Short and simple**: common words, one clear idea, appropriate for young learners. The focus word must be the **only** grammatically correct choice in context.
4. **Options** — Include the focus word once. Pick three distractors from the **same class** when possible. Avoid duplicates; shuffle order and vary `correctIndex` across questions in the file.
5. **`image`** — Must match the scene. Prefer the same URL style as neighboring questions in that unit. If no matching asset exists, ask the user to provide/add one before merging.
6. **Edit** — Append the new object to `multipleChoiceQuestions`; preserve `satisfies CourseUnit` and existing formatting (trailing commas, two-space indent).

## Quick checklist

- [ ] Focus word appears exactly in `options[correctIndex]`
- [ ] `textBefore` + focus + `textAfter` is one short, natural sentence
- [ ] Four options, same rough difficulty / word class where it matters
- [ ] `id` unique in file; `correctIndex` 0–3
- [ ] Image URL path matches a real existing file when a repo asset is used

## Example (focus word: `banana`)

```ts
{
  id: "unit-3-mc-5",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/1280px-Banana-Single.jpg",
  textBefore: "I eat a ",
  textAfter: ".",
  options: ["chair", "banana", "cloud", "shoe"],
  correctIndex: 1,
},
```
