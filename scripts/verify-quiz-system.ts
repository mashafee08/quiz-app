import { parseQuizInput } from "../src/lib/parser";
import { recalculateAnswers } from "../src/lib/storage/storage";
import { SAMPLE_QUIZZES } from "../src/lib/parser/samples";
import assert from "node:assert";

console.log("=== Running MyQuizGPT Test Suite ===\n");

let passed = 0;
let total = 0;

function runTest(name: string, fn: () => void) {
  total++;
  try {
    fn();
    console.log(`✓ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ [FAIL] ${name}`);
    console.error(err);
  }
}

// 1. Test empty input
runTest("Empty input returns error message", () => {
  const res = parseQuizInput("");
  assert.strictEqual(res.success, false);
  assert.ok(res.errors[0].includes("empty"));
});

// 2. Test whitespace-only input
runTest("Whitespace-only input returns error message", () => {
  const res = parseQuizInput("    \n\t  ");
  assert.strictEqual(res.success, false);
  assert.ok(res.errors[0].includes("empty"));
});

// 3. Test malformed JSON syntax
runTest("Malformed JSON syntax returns descriptive error", () => {
  const res = parseQuizInput(`[{ "question": "Unclosed string, "options": [] }`);
  assert.strictEqual(res.success, false);
  assert.ok(res.errors[0].includes("Malformed JSON syntax"));
});

// 4. Test missing questions
runTest("JSON array with 0 items returns error", () => {
  const res = parseQuizInput("[]");
  assert.strictEqual(res.success, false);
  assert.ok(res.errors[0].includes("at least 1 question"));
});

// 5. Test invalid option count (3 options instead of 4)
runTest("Fewer than 4 options rejected", () => {
  const json = JSON.stringify([
    {
      question: "Sample Question?",
      options: ["Choice 1", "Choice 2", "Choice 3"],
      correctIndex: 0,
    },
  ]);
  const res = parseQuizInput(json);
  assert.strictEqual(res.success, false);
  assert.ok(res.errors[0].includes("Exactly 4 answer options are required"));
});

// 6. Test invalid option count (5 options instead of 4)
runTest("More than 4 options rejected", () => {
  const json = JSON.stringify([
    {
      question: "Sample Question?",
      options: ["A", "B", "C", "D", "E"],
      correctIndex: 0,
    },
  ]);
  const res = parseQuizInput(json);
  assert.strictEqual(res.success, false);
  assert.ok(res.errors[0].includes("Exactly 4 answer options are required"));
});

// 7. Test invalid correct answer reference
runTest("Invalid correct answer reference rejected", () => {
  const json = JSON.stringify([
    {
      question: "Valid Question?",
      options: ["A", "B", "C", "D"],
      correctIndex: 9, // Invalid index
    },
  ]);
  const res = parseQuizInput(json);
  assert.strictEqual(res.success, false);
  assert.ok(res.errors[0].includes("Invalid or missing correct answer reference"));
});

// 8. Test standard normalized array with 0-based index
runTest("Valid standard array with 0-based index parsed", () => {
  const json = JSON.stringify([
    {
      id: "q1",
      question: "What is 2 + 2?",
      options: ["1", "2", "3", "4"],
      correctIndex: 3,
    },
  ]);
  const res = parseQuizInput(json);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.quiz?.questions.length, 1);
  assert.strictEqual(res.quiz?.questions[0].correctIndex, 3);
});

// 9. Test letter-based correct answers (A, B, C, D)
runTest("Letter-based correct answers mapped properly", () => {
  const json = JSON.stringify([
    {
      question: "Letter B is correct",
      options: ["Opt 1", "Opt 2", "Opt 3", "Opt 4"],
      correctAnswer: "B",
    },
  ]);
  const res = parseQuizInput(json);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.quiz?.questions[0].correctIndex, 1);
});

// 10. Test matching option text as correct answer
runTest("Matching option text resolved to correctIndex", () => {
  const json = JSON.stringify([
    {
      question: "Which city is in France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
    },
  ]);
  const res = parseQuizInput(json);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.quiz?.questions[0].correctIndex, 2);
});

// 11. Test duplicate question IDs handling
runTest("Duplicate question IDs deduplicated with warning", () => {
  const json = JSON.stringify([
    {
      id: "dup_id",
      question: "Question 1?",
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
    },
    {
      id: "dup_id",
      question: "Question 2?",
      options: ["A", "B", "C", "D"],
      correctIndex: 1,
    },
  ]);
  const res = parseQuizInput(json);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.warnings.length, 1);
  assert.notStrictEqual(res.quiz?.questions[0].id, res.quiz?.questions[1].id);
});

// 12. Test single question quiz edge case
runTest("Single question quiz parsed successfully", () => {
  const sample = SAMPLE_QUIZZES.find((s) => s.id === "single-question")!;
  const res = parseQuizInput(JSON.stringify(sample.data));
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.quiz?.questions.length, 1);
});

// 13. Test all pre-built sample quizzes
runTest("All sample quizzes are 100% valid", () => {
  for (const sample of SAMPLE_QUIZZES) {
    const res = parseQuizInput(JSON.stringify(sample.data));
    assert.strictEqual(res.success, true, `Sample ${sample.id} failed to parse`);
    assert.ok((res.quiz?.questions.length ?? 0) > 0);
  }
});

// 14. Test score recalculation integrity
runTest("Score recalculation computes correct percentages and counts", () => {
  const questions = [
    { id: "q1", correctIndex: 1 as const },
    { id: "q2", correctIndex: 2 as const },
    { id: "q3", correctIndex: 0 as const },
    { id: "q4", correctIndex: 3 as const },
  ];

  const answers = {
    q1: { questionId: "q1", selectedIndex: 1 as const, isCorrect: true, timestamp: 1 },
    q2: { questionId: "q2", selectedIndex: 0 as const, isCorrect: false, timestamp: 2 }, // Wrong
    q3: { questionId: "q3", selectedIndex: 0 as const, isCorrect: true, timestamp: 3 },
  };

  const score = recalculateAnswers(questions, answers);
  assert.strictEqual(score.total, 4);
  assert.strictEqual(score.answered, 3);
  assert.strictEqual(score.correct, 2);
  assert.strictEqual(score.incorrect, 1);
  assert.strictEqual(score.accuracy, 50); // 2 / 4 = 50%
});

console.log(`\nResults: ${passed} / ${total} tests passed.`);
if (passed !== total) {
  process.exit(1);
}
