"use client";

import React from "react";
import { Progress } from "./ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { QuizScoreSummary } from "@/lib/quiz/types";

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  scoreSummary: QuizScoreSummary;
  isRetry?: boolean;
}

export function QuizProgress({
  currentIndex,
  totalQuestions,
  scoreSummary,
  isRetry,
}: QuizProgressProps) {
  const answeredPercent =
    totalQuestions > 0
      ? Math.round((scoreSummary.answeredCount / totalQuestions) * 100)
      : 0;

  return (
    <div className="w-full space-y-3 mb-6">
      {/* Top row with counters */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 dark:text-zinc-100">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          {isRetry && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              Retry Mode
            </span>
          )}
        </div>

        {/* Answered progress stats */}
        <div className="flex items-center gap-3 font-medium">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{scoreSummary.correctCount}</span>
          </div>
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs">
            <XCircle className="w-3.5 h-3.5" />
            <span>{scoreSummary.incorrectCount}</span>
          </div>
          <span className="text-slate-400 dark:text-zinc-600">|</span>
          <span className="text-slate-600 dark:text-zinc-400 text-xs">
            {scoreSummary.answeredCount} of {totalQuestions} answered ({answeredPercent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress
        value={answeredPercent}
        className="h-2 bg-slate-200/70 dark:bg-zinc-800"
        indicatorClassName="bg-slate-900 dark:bg-zinc-100"
      />
    </div>
  );
}
