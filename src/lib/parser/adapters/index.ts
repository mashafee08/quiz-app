import { QuizAdapter } from "../types";
import { MyQuizGptAdapter } from "./myquizgpt";
import { StandardAdapter } from "./standard";

export const ADAPTERS: QuizAdapter[] = [
  MyQuizGptAdapter,
  StandardAdapter,
];

export function findMatchingAdapter(raw: unknown): QuizAdapter {
  for (const adapter of ADAPTERS) {
    if (adapter.canParse(raw)) {
      return adapter;
    }
  }
  return StandardAdapter;
}

export { StandardAdapter, MyQuizGptAdapter };
