---
name: kidstory-game-question-data
description: Adds KidStory vocabulary game questions from a user-supplied focus word (blank answer). Generates id, image URL, textBefore, textAfter, four options, and correctIndex; keeps sentences short and simple. Use when extending src/data/games, adding quiz items, prepositions, directions, or similar game topics.
---

# KidStory game question data

## When this applies

The user names a **focus word** (the correct answer for the dashed blank). Append a new question object to an existing `GameTopic` in `src/data/games/` (or create a topic and register it in `src/data/games.ts` if they ask for a new topic).

## Data shape

Follow `GameQuestion` in `src/types/game.ts`:

- `id` — string, unique within the topic file
- `image` — full URL string (see Image URLs)
- `textBefore` / `textAfter` — sentence split around the blank; include trailing/leading spaces so the line reads naturally with a space before and after the blank
- `options` — exactly **four** strings; one equals the focus word
- `correctIndex` — **0-based** index of the focus word in `options`
- `audioUrl` — optional; omit unless the user asks for audio

The UI renders: `textBefore` + [blank] + `textAfter`; the learner picks one of `options` to fill the blank.

## Focus word workflow

1. **Confirm topic file** — e.g. `preposition.ts`, `directions.ts`, or `games/<folder>/<name>.ts`. If unclear, ask once.
2. **Next `id`** — pattern `{topicId}-{n}` where `topicId` matches sibling questions (e.g. `preposition-4` after `preposition-3`). Increment `n` from the highest existing number.
3. **Sentence** — **Short and simple**: common words, one clear idea, appropriate for young learners. The focus word must be the **only** grammatically correct choice in context.
4. **Options** — Include the focus word once. Pick three distractors from the **same class** when possible (e.g. other prepositions for a preposition blank). Avoid duplicates; shuffle order and vary `correctIndex` across questions in the file.
5. **`image`** — Must match the scene (under table -> "under" image). Use an **existing** asset and the same base URL style as neighboring questions:

   `https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/<path-under-repo-root>`

   Path is usually under `src/data/games/...` (e.g. `directions/on.jpeg`). If no matching asset exists, ask the user to provide/add one before merging.

6. **Edit** — Append the new object to `questions` in the topic export; preserve `satisfies GameTopic` and existing formatting (trailing commas, two-space indent) to match the file.

## New topic only

If creating a new topic: add `src/data/games/<file>.ts` with `id`, `title`, `description`, `questions`, then import and append to `gameTopics` in `src/data/games.ts`.

## Quick checklist

- [ ] Focus word appears exactly in `options[correctIndex]`
- [ ] `textBefore` + focus + `textAfter` is one short, natural sentence
- [ ] Four options, same rough difficulty / word class where it matters
- [ ] `id` unique in file; `correctIndex` 0–3
- [ ] Image URL path matches a real existing file

## Example (focus word: `under`)

```ts
{
  id: "preposition-4",
  image: "https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/games/directions/under.jpeg",
  textBefore: "The ball rolled ",
  textAfter: " the chair.",
  options: ["on", "under", "in", "at"],
  correctIndex: 1,
},
```

(Replace `image` path with an existing asset, such as `under.jpeg` beside other game images.)
