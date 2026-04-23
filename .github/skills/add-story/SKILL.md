---
name: add-story
description: "Add a new KidStory book to the project. Use when: creating a new story, adding book data, adding pages and sentences to src/data. Takes a title and sentences as input, creates the TypeScript data file and registers it in books.ts."
argument-hint: "Story title and list of sentences (one per page)"
---

# Add a New KidStory Book

## When to Use

- Adding a new children's story to the KidStory app
- Creating book data from a title and list of sentences

## Input

The user provides:
1. **Title** — the story title (e.g. "Pando and Lucie Learn at School")
2. **Sentences** — one sentence per page, separated by newlines or numbered list

## Procedure

### Step 1: Derive identifiers from the title

- **slug**: kebab-case of the title (e.g. `pando-and-lucie-learn-at-school`)
- **exportName**: camelCase of the title (e.g. `pandoAndLucieLearnAtSchool`)
- **id**: Read `src/data/books.ts`, count existing books, and use the next number as a string
- **folderName**: `id` + `-` + `slug` (e.g. `1-pando-and-lucie-learn-at-school`)

### Step 2: Determine image URLs

Use the GitHub raw URL pattern from the repository:

```
https://raw.githubusercontent.com/luubinhan/KidStory/refs/heads/main/src/data/<folderName>/<index>.jpg
```

- Cover image: index `0`
- Page images: index `1` through `N` (one per sentence)

### Step 3: Auto-extract vocabulary

For each sentence, pick 1–3 simple, important words that a young English learner would benefit from. Prefer:
- Adjectives (big, happy, sad)
- Action verbs (run, help, play)
- Nouns that name key objects or characters
- Words that are concrete and easy to illustrate

Avoid articles (a, the), pronouns (he, she, it), conjunctions (and, but), and very common verbs (is, are, has, go).

### Step 4: Create the data file

Create the file at:

```
src/data/<folderName>/<slug>.ts
```

Use this template — follow the exact structure from the existing stories:

```typescript
import type { Book } from "../../types/book";

export const <exportName> = {
    id: "<id>",
    title: "<title>",
    cover: "<cover_url>",
    description: "",
    pages: [
        {
          image: "<page_url>",
          sentence: "<sentence>",
          vocabulary: [
            { word: "<word>" },
          ]
        },
        // ... one object per sentence
    ]
} satisfies Book;
```

Refer to [book type](../../src/types/book.ts) for the `Book` interface.

### Step 5: Register in books.ts

Edit `src/data/books.ts`:

1. Add an import at the end of the existing imports:
   ```typescript
  import { <exportName> } from "./<folderName>/<slug>";
   ```
2. Add the export name to the `books` array, before the closing `]`:
   ```typescript
   <exportName>,
   ```
3. Make sure the new book appears in top above existing books

### Step 6: Validate

- Run the TypeScript compiler or check for errors to ensure the new file satisfies the `Book` type
- Confirm the import in `books.ts` resolves correctly

## Example

**User input:**
> Title: Bao Visits the Zoo
> Sentences:
> 1. Bao goes to the zoo with his mom.
> 2. He sees a tall giraffe eating leaves.
> 3. The monkey jumps from tree to tree.

**Result:**
- Creates `src/data/1-bao-visits-the-zoo/bao-visits-the-zoo.ts`
- Registers in `src/data/books.ts`
- Auto-extracted vocabulary: zoo, tall, giraffe, monkey, jumps, tree
