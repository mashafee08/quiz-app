import { NormalizedQuestion, NormalizedQuiz } from "../parser/types";

export interface SubmittedAnswer {
  questionId: string;
  selectedIndex: 0 | 1 | 2 | 3;
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizState {
  version: 1;
  id: string;
  originalQuiz: NormalizedQuiz;
  isRetry: boolean;
  retryQuestionIds?: string[];
  currentQuestionIndex: number; // 0-based index within active questions
  submittedAnswers: Record<string, SubmittedAnswer>; // keyed by questionId
  isCompleted: boolean;
  lastUpdated: number;
}

export interface QuizScoreSummary {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number; // 0 - 100
  isPerfectScore: boolean;
  scoreText: string; // e.g. "42 / 50"
}
