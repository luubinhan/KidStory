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
