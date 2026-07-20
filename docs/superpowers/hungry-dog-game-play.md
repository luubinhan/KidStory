# Hungry Puppy — Implementation Prompt (React + PixiJS + TypeScript)

## Game play
a dog eats the correct English
vocabulary word dragged into its mouth.

Distractor selection: pick 3 random items from pool excluding the current target
(no repeats within a round)

Each round, user need to correct 5 words

The dog will 'hungry' after every 1 hour from the last time it eat

Implement as an explicit state enum — do not rely on ad-hoc booleans.

Wrong answers must NOT remove the tried word from the 4 choices and must NOT advance the
round. Retry is unlimited.

## Suggested Component Architecture

```
<HungryPuppyGame>            // React shell: lesson lifecycle, PixiJS canvas mount
  <PixiStage>                  // PixiJS app instance
    <QuestionDisplay />        // image or audio-play button
    <Puppy />           // sprite + animation state controller
    <WordCard /> x4            // draggable, individually keyed by VocabItem.id
    <CoinCounter />
    <ParticleLayer />          // sparkles / hearts / coin-fly, decoupled from puppy logic
  </PixiStage>
  <LessonSummaryScreen />      // shown on LESSON_COMPLETE, outside Pixi (can be DOM/React)
</HungryPuppyGame>
```

Keep `ParticleLayer` and reward VFX as a separate emitter-driven module (e.g.
`triggerEffect('correct' | 'wrong', position)`), not hardcoded inside `Puppy`, so
effects are reusable/testable independently of puppy animation state.


## Puppy Animation States

| State | spritesheet key | When |
|---|---|---|
| `idle` | idle | Waiting for drag; after happy/wrong feedback |
| `hungry` | hungry | Reserved (visual hunger, not used mid-drag) |
| `ready` | ready | Reserved |
| `eating` | eat | While user is dragging a card |
| `happy` | ate | Correct drop, then return to idle |
| `wrong` | sad | Wrong drop, then return to idle |

Each state = one animation clip/spritesheet reference.

**Interaction flow:** `idle` → (drag) `eating` → correct: `happy` → `idle` / wrong: `wrong` → `idle`. Miss mouth → back to `idle`.

---

## Feedback & Rewards

**Correct:**
- +1 coin, animate coin flying 
- SFX: chime/success sound, add a comment TODO, I will provide it later
- Label: random pick from `["Yummy!", "Delicious!", "Great!", "Thank you!"]`
- Auto-advance to next round after animation completes — no manual "next" tap

**Wrong:**
- No score/life penalty, no game-over state
- SFX: soft negative cue (not harsh/scary)
- Label: random pick from `["Oops!", "Try again!", "Not this one!"]`
- Card returns; same 4 choices remain


## Layout

```
┌─────────────────────────────┐
│  Question (image/audio)     │  top
│                              │
│        Puppy (center)       │  center
│                              │
│  [Card][Card][Card][Card]    │  bottom, positions randomized each round
│                     [Coins]  │  bottom-right corner, persistent
└─────────────────────────────┘
```


## Non-Negotiable Rules

- Always exactly 4 choices, never fewer.
- Never remove a wrong choice from the board.
- No lives, no game-over, no score penalty for mistakes.
- No loading screen between rounds 
- All animation timings should be named constants (not inline magic numbers) so a
  designer can tune pacing later without touching logic.


## out of scope

- add sound effect (just a play holder function, we will do it later)