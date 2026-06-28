---
name: add-course-unit
description: "Add a new KidStory course unit. Use when: creating a new unit in src/data/course/units, generating words/practice sentences/multiple-choice questions, and registering the unit in src/data/course/index.ts."
argument-hint: "title, words, sentences, youtubeVideoId"
---

# Add a New KidStory Course Unit

## When to Use

- Adding a new unit to the Course feature
- Creating unit data from user-provided vocabulary words and practice sentences
- Generating `multipleChoiceQuestions` in the same shape as existing units

## Input

The user must provide:
1. **Title** - unit title (for example: `Fruits`)
2. **Words** - comma-separated list (for example: `cherry, orange, pineapple, banana`)
3. **Practice sentences** - comma-separated list or numbered lines (for example: `is it an orange, yes it is, it's a cherry, it is pineapple, is it a melon, no it isn't`)
4. **youtubeVideoId** - YouTube video ID string (for example: `by1QAoRcc-U`)

Optional input:
- **Vietnamese translations** for words (if missing, generate simple learner-friendly translations)

## Procedure

### Step 1: Determine new unit number and IDs

1. Read `src/data/course/index.ts` and all existing files in `src/data/course/units/`.
2. Find the highest existing unit number.
3. Set:
   - `unitNumber` = highest + 1
   - `id` = `unit-<unitNumber>`
   - `const export name` = `unit<unitNumber><PascalCaseTitleWithoutSpaces>`

Example for unit 3 with title `Fruits`:
- file name: `unit-3-fruits.ts`
- export name: `unit3Fruits`
- id: `unit-3`

### Step 2: Create the unit file

Create a new file at:

`src/data/course/units/unit-<unitNumber>-<kebab-case-title>.ts`

Use this exact structure and satisfy the `CourseUnit` type:

```typescript
import { Apple } from "lucide-react";
import type { CourseUnit } from "../../../types/course";

export const unit3Fruits = {
  id: "unit-3",
  unitNumber: 3,
  title: "Fruits",
  subtitle: "",
  status: "current",
  icon: Apple,
  youtubeVideoId: "<provided-youtubeVideoId>",
  iconBgClass: "bg-rose-100",
  iconColorClass: "text-rose-600",
  words: [
    { id: "cherry", word: "cherry", translation: "quả anh đào", imageUrl: "" },
    { id: "orange", word: "orange", translation: "quả cam", imageUrl: "" },
    { id: "pineapple", word: "pineapple", translation: "quả dứa", imageUrl: "" },
    { id: "banana", word: "banana", translation: "quả chuối", imageUrl: "" },
  ],
  practiceSentences: [
    { id: "unit-3-s-1", text: "is it an orange" },
    { id: "unit-3-s-2", text: "yes it is" },
    { id: "unit-3-s-3", text: "it's a cherry" },
    { id: "unit-3-s-4", text: "it is pineapple" },
    { id: "unit-3-s-5", text: "is it a melon" },
    { id: "unit-3-s-6", text: "no it isn't" },
  ],
  multipleChoiceQuestions: [
    {
      id: "unit-3-mc-1",
      textBefore: "Is it an ",
      textAfter: "?",
      options: ["orange", "banana", "desk", "book"],
      correctIndex: 0,
    },
    {
      id: "unit-3-mc-2",
      textBefore: "It's a ",
      textAfter: ".",
      options: ["cherry", "pencil", "window", "chair"],
      correctIndex: 0,
    },
    {
      id: "unit-3-mc-3",
      textBefore: "It is ",
      textAfter: ".",
      options: ["pineapple", "teacher", "student", "school"],
      correctIndex: 0,
    },
    {
      id: "unit-3-mc-4",
      textBefore: "No it ",
      textAfter: ".",
      options: ["isn't", "is", "am", "are"],
      correctIndex: 0,
    },
    {
      id: "unit-3-mc-5",
      textBefore: "Is it a ",
      textAfter: "?",
      options: ["melon", "orange", "banana", "pineapple"],
      correctIndex: 0,
    },
  ],
} satisfies CourseUnit;
```

### Step 3: Build data consistently

- Keep all `practiceSentences.text` lowercase to match existing units.
- Use sentence ids in this pattern: `unit-<n>-s-<index>`.
- Use multiple-choice ids in this pattern: `unit-<n>-mc-<index>`.
- Create 4-6 multiple-choice questions unless user requests otherwise.
- Prefer distractors that are simple and age-appropriate words.
- Ensure each question has exactly one correct answer and `correctIndex` points to it.

### Step 4: Register in course index

Edit `src/data/course/index.ts`:

1. Add import:
   ```typescript
   import { unit3Fruits } from "./units/unit-3-fruits";
   ```
2. Add the new unit to `courseUnits` array, keeping units in numeric order:
   ```typescript
   export const courseUnits: readonly CourseUnit[] = [unit1Greetings, unit2Hello, unit3Fruits];
   ```

### Step 5: Validate

- Confirm no TypeScript errors in the new unit file.
- Confirm import path and export name in `src/data/course/index.ts` are correct.

## Example Input -> Output Mapping

Input:
- Title: `Fruits`
- Words: `cherry, orange, pineapple, banana`
- Practice sentences: `is it an orange, yes it is, it's a cherry, it is pineapple, is it a melon, no it isn't`
- youtubeVideoId: `by1QAoRcc-U`

Output:
- New unit file in `src/data/course/units/`
- New export object with:
  - `words` generated from the list above
  - `practiceSentences` generated from the sentence list
  - `multipleChoiceQuestions` generated from those words and sentence patterns
- Unit registered in `src/data/course/index.ts`