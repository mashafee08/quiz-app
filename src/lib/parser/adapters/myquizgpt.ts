import { QuizAdapter, QuizParseResult } from "../types";
import { StandardAdapter } from "./standard";

/**
 * MyQuizGPT JSON Adapter Stub.
 *
 * NOTE: As per project guidelines, this adapter is decoupled and prepared
 * to be finalized as soon as the user provides their exact MyQuizGPT export JSON schema.
 *
 * It will map MyQuizGPT specific keys (e.g. custom question tags, choice objects,
 * answer flags, or export wrappers) into the NormalizedQuestion internal model.
 */
export const MyQuizGptAdapter: QuizAdapter = {
  id: "myquizgpt",
  name: "MyQuizGPT Export (Ready for Schema)",
  description: "Specialized adapter for MyQuizGPT exports. Ready to be mapped to the sample schema.",

  canParse(raw: unknown): boolean {
    if (!raw || typeof raw !== "object") return false;

    const obj = raw as Record<string, unknown>;
    // Check for potential MyQuizGPT export markers (e.g., generator signature, specific wrapper keys)
    const hasMyQuizGptMarker =
      obj.source === "myquizgpt" ||
      obj.app === "MyQuizGPT" ||
      obj.quiz_source === "MyQuizGPT" ||
      "myQuizGptData" in obj;

    return hasMyQuizGptMarker;
  },

  parse(raw: unknown): QuizParseResult {
    // When the user supplies their sample export structure,
    // this mapper will be completed with the exact field mappings.
    // For now, it delegates cleanly to the validator/standard adapter while flagging the format.
    const standardResult = StandardAdapter.parse(raw);

    return {
      ...standardResult,
      detectedFormat: "MyQuizGPT Export",
      warnings: [
        ...standardResult.warnings,
        "MyQuizGPT adapter will be mapped to the exact export format once provided.",
      ],
    };
  },
};
