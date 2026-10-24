import { NormalizedQuestion, QuizParseResult } from "./types";

export interface RawCandidateQuestion {
  id?: string | number;
  question?: string;
  questionText?: string;
  title?: string;
  prompt?: string;
  options?: unknown;
  answers?: unknown;
  choices?: unknown;
  correctAnswer?: unknown;
  correct_answer?: unknown;
  correctIndex?: unknown;
  correct_index?: unknown;
  answer?: unknown;
  answerIndex?: unknown;
  explanation?: unknown;
  [key: string]: unknown;
}

/**
 * Normalizes and validates a candidate question into a NormalizedQuestion.
 * Returns either { question: NormalizedQuestion } or { error: string }.
 */
export function validateAndNormalizeQuestion(
  raw: unknown,
  fallbackIndex: number
): { question?: NormalizedQuestion; error?: string; warning?: string } {
  if (!raw || typeof raw !== "object") {
    return { error: `Question ${fallbackIndex + 1}: Item must be a valid JSON object.` };
  }

  const item = raw as RawCandidateQuestion;

  // 1. Resolve question text
  const questionTextRaw =
    item.question ?? item.questionText ?? item.title ?? item.prompt;
  if (typeof questionTextRaw !== "string" || !questionTextRaw.trim()) {
    return {
      error: `Question ${fallbackIndex + 1}: Missing or empty question text.`,
    };
  }
  const cleanQuestion = questionTextRaw.trim();

  // 2. Resolve options
  const optionsRaw = item.options ?? item.answers ?? item.choices;
  if (!Array.isArray(optionsRaw)) {
    return {
      error: `Question ${fallbackIndex + 1}: Options must be an array of 4 choices.`,
    };
  }

  if (optionsRaw.length !== 4) {
    return {
      error: `Question ${fallbackIndex + 1}: Exactly 4 answer options are required (found ${optionsRaw.length}).`,
    };
  }

  const cleanOptions: string[] = [];
  for (let i = 0; i < optionsRaw.length; i++) {
    const opt = optionsRaw[i];
    if (typeof opt === "string") {
      cleanOptions.push(opt.trim());
    } else if (typeof opt === "number" || typeof opt === "boolean") {
      cleanOptions.push(String(opt));
    } else if (opt && typeof opt === "object" && "text" in opt && typeof (opt as { text: unknown }).text === "string") {
      cleanOptions.push((opt as { text: string }).text.trim());
    } else {
      return {
        error: `Question ${fallbackIndex + 1}, Option ${i + 1}: Invalid option format. Expected text.`,
      };
    }
  }

  // 3. Resolve correct answer index
  const correctRaw =
    item.correctIndex ??
    item.correct_index ??
    item.correctAnswer ??
    item.correct_answer ??
    item.answerIndex ??
    item.answer;

  let resolvedCorrectIndex: 0 | 1 | 2 | 3 | null = null;

  if (typeof correctRaw === "number") {
    if (correctRaw >= 0 && correctRaw <= 3 && Number.isInteger(correctRaw)) {
      resolvedCorrectIndex = correctRaw as 0 | 1 | 2 | 3;
    } else if (correctRaw >= 1 && correctRaw <= 4 && Number.isInteger(correctRaw)) {
      // 1-based index (1-4)
      resolvedCorrectIndex = (correctRaw - 1) as 0 | 1 | 2 | 3;
    }
  } else if (typeof correctRaw === "string") {
    const trimmed = correctRaw.trim();
    const upper = trimmed.toUpperCase();

    // Check letter reference: "A", "B", "C", "D"
    if (upper === "A") resolvedCorrectIndex = 0;
    else if (upper === "B") resolvedCorrectIndex = 1;
    else if (upper === "C") resolvedCorrectIndex = 2;
    else if (upper === "D") resolvedCorrectIndex = 3;
    // Check numeric string "0", "1", "2", "3" or "1", "2", "3", "4"
    else if (/^[0-3]$/.test(trimmed)) {
      resolvedCorrectIndex = parseInt(trimmed, 10) as 0 | 1 | 2 | 3;
    } else if (/^[1-4]$/.test(trimmed)) {
      resolvedCorrectIndex = (parseInt(trimmed, 10) - 1) as 0 | 1 | 2 | 3;
    } else {
      // Check if it matches option text directly
      const matchingIdx = cleanOptions.findIndex(
        (opt) => opt.toLowerCase() === trimmed.toLowerCase()
      );
      if (matchingIdx >= 0 && matchingIdx <= 3) {
        resolvedCorrectIndex = matchingIdx as 0 | 1 | 2 | 3;
      }
    }
  }

  if (resolvedCorrectIndex === null) {
    return {
      error: `Question ${fallbackIndex + 1}: Invalid or missing correct answer reference. Must specify 0-3 index, A/B/C/D letter, or matching option text.`,
    };
  }

  // 4. Stable ID
  const idRaw = item.id;
  const stableId =
    idRaw !== undefined && idRaw !== null && String(idRaw).trim() !== ""
      ? String(idRaw).trim()
      : `q_${fallbackIndex + 1}`;

  // 5. Explanation
  const explanation =
    typeof item.explanation === "string" && item.explanation.trim()
      ? item.explanation.trim()
      : undefined;

  return {
    question: {
      id: stableId,
      questionNumber: fallbackIndex + 1,
      question: cleanQuestion,
      options: [cleanOptions[0], cleanOptions[1], cleanOptions[2], cleanOptions[3]],
      correctIndex: resolvedCorrectIndex,
      explanation,
    },
  };
}

/**
 * Validates a list of candidate questions, ensuring unique IDs and valid format.
 */
export function validateQuestionList(
  candidates: unknown[],
  meta?: { title?: string; description?: string }
): QuizParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const validatedQuestions: NormalizedQuestion[] = [];
  const seenIds = new Set<string>();

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return {
      success: false,
      errors: ["Quiz data must contain an array of at least 1 question."],
      warnings: [],
    };
  }

  for (let i = 0; i < candidates.length; i++) {
    const res = validateAndNormalizeQuestion(candidates[i], i);
    if (res.error) {
      errors.push(res.error);
    } else if (res.question) {
      let q = res.question;
      // Deduplicate IDs if necessary
      if (seenIds.has(q.id)) {
        const uniqueId = `${q.id}_${i + 1}`;
        warnings.push(`Question ${i + 1}: Duplicate ID "${q.id}" renamed to "${uniqueId}".`);
        q = { ...q, id: uniqueId };
      }
      seenIds.add(q.id);
      validatedQuestions.push(q);
    }
    if (res.warning) {
      warnings.push(res.warning);
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      warnings,
    };
  }

  return {
    success: true,
    quiz: {
      title: meta?.title,
      description: meta?.description,
      questions: validatedQuestions,
    },
    errors: [],
    warnings,
  };
}
