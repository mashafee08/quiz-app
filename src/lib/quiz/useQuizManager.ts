"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { NormalizedQuiz, NormalizedQuestion } from "../parser/types";
import { QuizState, SubmittedAnswer, QuizScoreSummary } from "./types";
import {
  saveQuizToStorage,
  loadQuizFromStorage,
  clearSavedQuiz,
  recalculateAnswers,
} from "../storage/storage";

export function useQuizManager() {
  const [state, setState] = useState<QuizState | null>(null);
  const [viewMode, setViewMode] = useState<"import" | "quiz" | "results" | "review">("import");
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [savedQuizAvailable, setSavedQuizAvailable] = useState<QuizState | null>(null);

  // Timer reference to cleanly cancel timeouts on unmount or manual navigation
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [justAnsweredId, setJustAnsweredId] = useState<string | null>(null);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setJustAnsweredId(null);
  }, []);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      clearAdvanceTimer();
    };
  }, [clearAdvanceTimer]);

  // Check storage on initial mount
  useEffect(() => {
    const saved = loadQuizFromStorage();
    if (saved) {
      setSavedQuizAvailable(saved);
    }
    setIsStorageLoaded(true);
  }, []);

  // Active questions subset (either original or retry list)
  const activeQuestions: NormalizedQuestion[] = useMemo(() => {
    if (!state) return [];
    if (!state.isRetry || !state.retryQuestionIds) {
      return state.originalQuiz.questions;
    }
    const idSet = new Set(state.retryQuestionIds);
    return state.originalQuiz.questions.filter((q) => idSet.has(q.id));
  }, [state]);

  const currentQuestion: NormalizedQuestion | undefined = useMemo(() => {
    if (!state || activeQuestions.length === 0) return undefined;
    const safeIndex = Math.max(0, Math.min(state.currentQuestionIndex, activeQuestions.length - 1));
    return activeQuestions[safeIndex];
  }, [state, activeQuestions]);

  // Recalculated score and statistics
  const scoreSummary: QuizScoreSummary = useMemo(() => {
    if (!state) {
      return {
        totalQuestions: 0,
        answeredCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        accuracy: 0,
        isPerfectScore: false,
        scoreText: "0 / 0",
      };
    }

    const { total, answered, correct, incorrect, accuracy } = recalculateAnswers(
      activeQuestions,
      state.submittedAnswers
    );

    return {
      totalQuestions: total,
      answeredCount: answered,
      correctCount: correct,
      incorrectCount: incorrect,
      accuracy,
      isPerfectScore: answered === total && correct === total && total > 0,
      scoreText: `${correct} / ${total}`,
    };
  }, [state, activeQuestions]);

  // Start brand new quiz
  const startQuiz = useCallback((quiz: NormalizedQuiz) => {
    clearAdvanceTimer();
    const newState: QuizState = {
      version: 1,
      id: `quiz_${Date.now()}`,
      originalQuiz: quiz,
      isRetry: false,
      currentQuestionIndex: 0,
      submittedAnswers: {},
      isCompleted: false,
      lastUpdated: Date.now(),
    };

    setState(newState);
    saveQuizToStorage(newState);
    setSavedQuizAvailable(null);
    setViewMode("quiz");
  }, [clearAdvanceTimer]);

  // Resume saved quiz
  const resumeSavedQuiz = useCallback(() => {
    if (!savedQuizAvailable) return;
    clearAdvanceTimer();
    setState(savedQuizAvailable);
    setSavedQuizAvailable(null);
    if (savedQuizAvailable.isCompleted) {
      setViewMode("results");
    } else {
      setViewMode("quiz");
    }
  }, [savedQuizAvailable, clearAdvanceTimer]);

  // Discard saved quiz
  const discardSavedQuiz = useCallback(() => {
    clearSavedQuiz();
    setSavedQuizAvailable(null);
  }, []);

  // Answer selection handler
  const submitAnswer = useCallback(
    (questionId: string, selectedIndex: 0 | 1 | 2 | 3) => {
      if (!state) return;

      // Prevent duplicate submissions if already answered
      if (state.submittedAnswers[questionId]) {
        return;
      }

      const question = activeQuestions.find((q) => q.id === questionId);
      if (!question) return;

      const isCorrect = selectedIndex === question.correctIndex;
      const newAnswer: SubmittedAnswer = {
        questionId,
        selectedIndex,
        isCorrect,
        timestamp: Date.now(),
      };

      const nextSubmitted = {
        ...state.submittedAnswers,
        [questionId]: newAnswer,
      };

      // Check if all active questions are now answered
      const allAnswered = activeQuestions.every(
        (q) => q.id === questionId || Boolean(nextSubmitted[q.id])
      );

      const nextState: QuizState = {
        ...state,
        submittedAnswers: nextSubmitted,
        isCompleted: allAnswered,
        lastUpdated: Date.now(),
      };

      // Commit to state and storage immediately
      setState(nextState);
      saveQuizToStorage(nextState);

      // Trigger 2-second feedback timer
      clearAdvanceTimer();
      setJustAnsweredId(questionId);

      advanceTimerRef.current = setTimeout(() => {
        setJustAnsweredId(null);
        if (allAnswered) {
          setViewMode("results");
        } else {
          // Find next unanswered question index
          const currentIndex = activeQuestions.findIndex((q) => q.id === questionId);
          let targetIndex = -1;

          // 1. Search forward from current question
          for (let i = currentIndex + 1; i < activeQuestions.length; i++) {
            if (!nextSubmitted[activeQuestions[i].id]) {
              targetIndex = i;
              break;
            }
          }

          // 2. Wrap around from beginning if not found forward
          if (targetIndex === -1) {
            for (let i = 0; i < currentIndex; i++) {
              if (!nextSubmitted[activeQuestions[i].id]) {
                targetIndex = i;
                break;
              }
            }
          }

          if (targetIndex !== -1) {
            setState((prev) => {
              if (!prev) return null;
              const updated = { ...prev, currentQuestionIndex: targetIndex };
              saveQuizToStorage(updated);
              return updated;
            });
          } else {
            // All answered
            setViewMode("results");
          }
        }
      }, 2000);
    },
    [state, activeQuestions, clearAdvanceTimer]
  );

  // Manual navigation between questions
  const goToQuestion = useCallback(
    (index: number) => {
      if (!state || index < 0 || index >= activeQuestions.length) return;
      clearAdvanceTimer(); // Cancel timer on manual navigation

      setState((prev) => {
        if (!prev) return null;
        const updated = { ...prev, currentQuestionIndex: index };
        saveQuizToStorage(updated);
        return updated;
      });
    },
    [state, activeQuestions.length, clearAdvanceTimer]
  );

  const nextQuestion = useCallback(() => {
    if (!state) return;
    if (state.currentQuestionIndex < activeQuestions.length - 1) {
      goToQuestion(state.currentQuestionIndex + 1);
    }
  }, [state, activeQuestions.length, goToQuestion]);

  const prevQuestion = useCallback(() => {
    if (!state) return;
    if (state.currentQuestionIndex > 0) {
      goToQuestion(state.currentQuestionIndex - 1);
    }
  }, [state, goToQuestion]);

  // Retry only incorrect questions
  const startRetry = useCallback(() => {
    if (!state) return;
    clearAdvanceTimer();

    // Collect questions that were answered incorrectly
    const incorrectQuestionIds = activeQuestions
      .filter((q) => {
        const ans = state.submittedAnswers[q.id];
        return ans && !ans.isCorrect;
      })
      .map((q) => q.id);

    if (incorrectQuestionIds.length === 0) return;

    const retryState: QuizState = {
      ...state,
      id: `retry_${Date.now()}`,
      isRetry: true,
      retryQuestionIds: incorrectQuestionIds,
      currentQuestionIndex: 0,
      submittedAnswers: {},
      isCompleted: false,
      lastUpdated: Date.now(),
    };

    setState(retryState);
    saveQuizToStorage(retryState);
    setViewMode("quiz");
  }, [state, activeQuestions, clearAdvanceTimer]);

  // Open Answer Review
  const openReview = useCallback(() => {
    clearAdvanceTimer();
    setViewMode("review");
  }, [clearAdvanceTimer]);

  // Back to Results from Review
  const backToResults = useCallback(() => {
    clearAdvanceTimer();
    setViewMode("results");
  }, [clearAdvanceTimer]);

  // Return to JSON Input / New Quiz
  const resetToNewQuiz = useCallback(() => {
    clearAdvanceTimer();
    clearSavedQuiz();
    setState(null);
    setSavedQuizAvailable(null);
    setViewMode("import");
  }, [clearAdvanceTimer]);

  return {
    state,
    viewMode,
    setViewMode,
    isStorageLoaded,
    savedQuizAvailable,
    activeQuestions,
    currentQuestion,
    currentQuestionIndex: state?.currentQuestionIndex ?? 0,
    scoreSummary,
    justAnsweredId,
    startQuiz,
    resumeSavedQuiz,
    discardSavedQuiz,
    submitAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    startRetry,
    openReview,
    backToResults,
    resetToNewQuiz,
  };
}
