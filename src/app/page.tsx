"use client";

import React from "react";
import { useQuizManager } from "@/lib/quiz/useQuizManager";
import { Navbar } from "@/components/Navbar";
import { JSONInput } from "@/components/JSONInput";
import { QuizContainer } from "@/components/QuizContainer";
import { ResultsSummary } from "@/components/ResultsSummary";
import { AnswerReview } from "@/components/AnswerReview";
import { ResumeQuizDialog } from "@/components/ResumeQuizDialog";
import { ShieldCheck, Zap, Laptop, BookOpen } from "lucide-react";

export default function HomePage() {
  const {
    state,
    viewMode,
    savedQuizAvailable,
    activeQuestions,
    currentQuestion,
    currentQuestionIndex,
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
  } = useQuizManager();

  const quizTitle = state?.originalQuiz.title || (state?.isRetry ? "Retry Incorrect Questions" : undefined);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors">
      <Navbar
        inQuiz={viewMode !== "import"}
        onResetQuiz={resetToNewQuiz}
        quizTitle={quizTitle}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start">
        {/* VIEW 1: JSON IMPORT & HOME */}
        {viewMode === "import" && (
          <div className="w-full space-y-6">
            {/* Unfinished Quiz Banner */}
            {savedQuizAvailable && (
              <ResumeQuizDialog
                savedQuiz={savedQuizAvailable}
                onResume={resumeSavedQuiz}
                onDiscard={discardSavedQuiz}
              />
            )}

            {/* JSON Importer */}
            <JSONInput onStartQuiz={startQuiz} />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    100% Free &amp; Private
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    No logins, subscriptions, or telemetry. Runs completely in your browser.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    Instant Interactive Mode
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Immediate visual feedback, automatic progression, and progress persistence.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    Review &amp; Repeat Retries
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Review full answer explanations or retry only the questions you missed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE QUIZ */}
        {viewMode === "quiz" && currentQuestion && (
          <QuizContainer
            currentQuestion={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={activeQuestions.length}
            questions={activeQuestions}
            submittedAnswers={state?.submittedAnswers ?? {}}
            scoreSummary={scoreSummary}
            justAnsweredId={justAnsweredId}
            isRetry={state?.isRetry}
            onSelectOption={(idx) => submitAnswer(currentQuestion.id, idx)}
            onPrev={prevQuestion}
            onNext={nextQuestion}
            onJumpTo={goToQuestion}
          />
        )}

        {/* VIEW 3: RESULTS SUMMARY */}
        {viewMode === "results" && (
          <ResultsSummary
            scoreSummary={scoreSummary}
            isRetry={state?.isRetry}
            onReview={openReview}
            onRetryIncorrect={startRetry}
            onNewQuiz={resetToNewQuiz}
          />
        )}

        {/* VIEW 4: ANSWER REVIEW */}
        {viewMode === "review" && (
          <AnswerReview
            questions={activeQuestions}
            submittedAnswers={state?.submittedAnswers ?? {}}
            scoreSummary={scoreSummary}
            onBackToResults={backToResults}
            onNewQuiz={resetToNewQuiz}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200/70 dark:border-zinc-800/70 py-4 text-center text-xs text-slate-500 dark:text-zinc-500">
        <p>MyQuizGPT Alternative &bull; Free, Open &amp; Client-Side MCQ Quiz Platform</p>
      </footer>
    </div>
  );
}
