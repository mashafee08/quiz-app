"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Grid, Check, X } from "lucide-react";
import { NormalizedQuestion } from "@/lib/parser/types";
import { SubmittedAnswer } from "@/lib/quiz/types";

interface QuizNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  questions: NormalizedQuestion[];
  submittedAnswers: Record<string, SubmittedAnswer>;
  onPrev: () => void;
  onNext: () => void;
  onJumpTo: (index: number) => void;
  isCurrentAnswered: boolean;
}

export function QuizNavigation({
  currentIndex,
  totalQuestions,
  questions,
  submittedAnswers,
  onPrev,
  onNext,
  onJumpTo,
  isCurrentAnswered,
}: QuizNavigationProps) {
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalQuestions - 1;

  return (
    <div className="w-full mt-6 space-y-4">
      {/* Primary Prev / Next bar */}
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={!hasPrev}
          className="border-slate-300 dark:border-zinc-700"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {/* Question Drawer / Grid Toggle Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowQuestionGrid(!showQuestionGrid)}
          className="text-xs text-slate-600 dark:text-zinc-400 font-medium"
        >
          <Grid className="w-3.5 h-3.5 mr-1.5" />
          {showQuestionGrid ? "Hide Question Map" : "Question Map"}
        </Button>

        <Button
          type="button"
          variant={isCurrentAnswered ? "default" : "outline"}
          onClick={onNext}
          disabled={!hasNext}
          className="border-slate-300 dark:border-zinc-700"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Expandable Question Jump Grid */}
      {showQuestionGrid && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span className="font-semibold text-slate-800 dark:text-zinc-200">
              Question Navigator
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Correct
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Incorrect
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-600 inline-block" />
                Unanswered
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-1">
            {questions.map((q, idx) => {
              const answer = submittedAnswers[q.id];
              const isCurrent = idx === currentIndex;
              const isAnswered = Boolean(answer);
              const isCorrect = answer?.isCorrect;

              let btnStyle =
                "border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 text-slate-700 dark:text-zinc-300 hover:bg-slate-100";

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle =
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold";
                } else {
                  btnStyle =
                    "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold";
                }
              }

              if (isCurrent) {
                btnStyle += " ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-zinc-900";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    onJumpTo(idx);
                    setShowQuestionGrid(false);
                  }}
                  title={`Question ${idx + 1}${isAnswered ? (isCorrect ? " (Correct)" : " (Incorrect)") : " (Unanswered)"}`}
                  className={`h-9 rounded-lg text-xs flex items-center justify-center border transition-all ${btnStyle}`}
                >
                  {isAnswered ? (
                    <span className="flex items-center gap-0.5">
                      {idx + 1}
                      {isCorrect ? (
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      ) : (
                        <X className="w-2.5 h-2.5 stroke-[3]" />
                      )}
                    </span>
                  ) : (
                    idx + 1
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
