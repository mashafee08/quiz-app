import { QuizAdapter, QuizParseResult } from "../types";
import { validateQuestionList } from "../validator";

export const StandardAdapter: QuizAdapter = {
  id: "standard",
  name: "Standard Quiz JSON",
  description: "Standard JSON format containing an array of multiple-choice questions or a quiz wrapper object.",

  canParse(raw: unknown): boolean {
    if (!raw || typeof raw !== "object") return false;

    if (Array.isArray(raw)) {
      return raw.length > 0 && typeof raw[0] === "object";
    }

    const obj = raw as Record<string, unknown>;
    const candidateArray =
      obj.questions || obj.quiz || obj.data || obj.items || obj.mcqs;

    return Array.isArray(candidateArray) && candidateArray.length > 0;
  },

  parse(raw: unknown): QuizParseResult {
    if (!raw || typeof raw !== "object") {
      return {
        success: false,
        errors: ["Invalid JSON format. Expected an array of questions or an object with a 'questions' property."],
        warnings: [],
      };
    }

    let items: unknown[] = [];
    let title: string | undefined;
    let description: string | undefined;

    if (Array.isArray(raw)) {
      items = raw;
    } else {
      const obj = raw as Record<string, unknown>;
      if (typeof obj.title === "string") title = obj.title.trim();
      if (typeof obj.description === "string") description = obj.description.trim();

      const candidateArray =
        obj.questions ?? obj.quiz ?? obj.data ?? obj.items ?? obj.mcqs;

      if (Array.isArray(candidateArray)) {
        items = candidateArray;
      }
    }

    const result = validateQuestionList(items, { title, description });
    return {
      ...result,
      detectedFormat: "Standard JSON",
    };
  },
};
