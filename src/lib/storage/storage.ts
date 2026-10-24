import { QuizState, SubmittedAnswer } from "../quiz/types";

const STORAGE_KEY = "myquizgpt_active_quiz_v1";

/**
 * Validates whether a raw object looks like a valid QuizState.
 */
function isValidQuizState(data: unknown): data is QuizState {
  if (!data || typeof data !== "object") return false;
  const state = data as Partial<QuizState>;

  if (state.version !== 1) return false;
  if (!state.id || typeof state.id !== "string") return false;
  if (!state.originalQuiz || !Array.isArray(state.originalQuiz.questions)) return false;
  if (state.originalQuiz.questions.length === 0) return false;
  if (typeof state.currentQuestionIndex !== "number") return false;
  if (!state.submittedAnswers || typeof state.submittedAnswers !== "object") return false;

  return true;
}

/**
 * Saves the current quiz state into localStorage.
 */
export function saveQuizToStorage(state: QuizState): boolean {
  if (typeof window === "undefined") return false;

  try {
    const payload = JSON.stringify({
      ...state,
      lastUpdated: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (err) {
    console.warn("Failed to persist quiz to localStorage:", err);
    return false;
  }
}

/**
 * Retrieves and validates the saved quiz state from localStorage.
 * If data is corrupted or outdated, returns null and cleans up.
 */
export function loadQuizFromStorage(): QuizState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!isValidQuizState(parsed)) {
      console.warn("Invalid or incompatible quiz state found in localStorage, clearing.");
      clearSavedQuiz();
      return null;
    }

    return parsed;
  } catch (err) {
    console.warn("Error reading quiz state from localStorage:", err);
    clearSavedQuiz();
    return null;
  }
}

/**
 * Clears the persisted quiz state from localStorage.
 */
export function clearSavedQuiz(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore error
  }
}

/**
 * Helper to recalculate answers and integrity check against questions.
 */
export function recalculateAnswers(
  questions: Array<{ id: string; correctIndex: 0 | 1 | 2 | 3 }>,
  submittedAnswers: Record<string, SubmittedAnswer>
): {
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  accuracy: number;
} {
  const total = questions.length;
  let answered = 0;
  let correct = 0;

  for (const q of questions) {
    const ans = submittedAnswers[q.id];
    if (ans) {
      answered++;
      if (ans.selectedIndex === q.correctIndex) {
        correct++;
      }
    }
  }

  const incorrect = answered - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    total,
    answered,
    correct,
    incorrect,
    accuracy,
  };
}
