import { QuizParseResult } from "./types";
import { findMatchingAdapter } from "./adapters";

/**
 * Parses and validates raw string input into a NormalizedQuiz.
 * Handles empty strings, syntax errors, adapter selection, and schema validation.
 */
export function parseQuizInput(input: string): QuizParseResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      success: false,
      errors: ["JSON input is empty. Please paste your quiz JSON above."],
      warnings: [],
    };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(trimmed);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      errors: [
        `Malformed JSON syntax: ${errorMsg}. Please ensure your text is valid JSON with closed quotes and matching braces.`,
      ],
      warnings: [],
    };
  }

  if (typeof parsedJson !== "object" || parsedJson === null) {
    return {
      success: false,
      errors: ["Invalid JSON format: Expected a JSON array or object containing questions."],
      warnings: [],
    };
  }

  const adapter = findMatchingAdapter(parsedJson);
  const result = adapter.parse(parsedJson);

  return result;
}

export * from "./types";
export * from "./validator";
export * from "./adapters";
