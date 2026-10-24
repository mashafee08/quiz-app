"use client";

import React from "react";
import { NormalizedQuestion } from "@/lib/parser/types";
import { SubmittedAnswer, QuizScoreSummary } from "@/lib/quiz/types";
import { QuizProgress } from "./QuizProgress";
import { QuestionCard } from "./QuestionCard";
import { QuizNavigation } from "./QuizNavigation";
import { Info } from "lucide-react";

interface QuizContainerProps {
  currentQuestion: NormalizedQuestion;
  currentIndex: number;
  totalQuestions: number;
  questions: NormalizedQuestion[];
  submittedAnswers: Record<string, SubmittedAnswer>;
  scoreSummary: QuizScoreSummary;
  justAnsweredId: string | null;
  isRetry?: boolean;
  onSelectOption: (index: 0 | 1 | 2 | 3) => void;
  onPrev: () => void;
  onNext: () => void;
  onJumpTo: (index: number) => void;
}

export function QuizContainer({
  currentQuestion,
  currentIndex,
  totalQuestions,
  questions,
  submittedAnswers,
  scoreSummary,
  justAnsweredId,
  isRetry,
  onSelectOption,
  onPrev,
  onNext,
  onJumpTo,
}: QuizContainerProps) {
  const currentAnswer = submittedAnswers[currentQuestion.id];
  const isAnswered = Boolean(currentAnswer);
  const isAutoAdvancing = justAnsweredId === currentQuestion.id;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Read-Only Notice when revisiting previously answered questions */}
      {isAnswered && !isAutoAdvancing && (
        <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-xs text-slate-600 dark:text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Previously answered &bull; Read-only mode
          </span>
          <span>Submitted answer locked</span>
        </div>
      )}

      {/* Progress & Stats Bar */}
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        scoreSummary={scoreSummary}
        isRetry={isRetry}
      />

      {/* The Single Active Question */}
      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        submittedAnswer={currentAnswer}
        isAutoAdvancing={isAutoAdvancing}
        onSelectOption={(idx) => onSelectOption(idx)}
      />

      {/* Navigation Bar */}
      <QuizNavigation
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        questions={questions}
        submittedAnswers={submittedAnswers}
        onPrev={onPrev}
        onNext={onNext}
        onJumpTo={onJumpTo}
        isCurrentAnswered={isAnswered}
      />
    </div>
  );
}
