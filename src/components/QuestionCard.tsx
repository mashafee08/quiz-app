"use client";

import React from "react";
import { NormalizedQuestion } from "@/lib/parser/types";
import { SubmittedAnswer } from "@/lib/quiz/types";
import { AnswerOption } from "./AnswerOption";
import { Card, CardContent } from "./ui/card";
import { CheckCircle2, XCircle, Lightbulb, Clock } from "lucide-react";

interface QuestionCardProps {
  question: NormalizedQuestion;
  submittedAnswer?: SubmittedAnswer;
  isAutoAdvancing: boolean;
  onSelectOption: (index: 0 | 1 | 2 | 3) => void;
}

export function QuestionCard({
  question,
  submittedAnswer,
  isAutoAdvancing,
  onSelectOption,
}: QuestionCardProps) {
  const isAnswered = Boolean(submittedAnswer);
  const selectedIndex = submittedAnswer?.selectedIndex;
  const isCorrect = submittedAnswer?.isCorrect;

  return (
    <Card className="w-full border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* 2-second auto advance top indicator */}
      {isAutoAdvancing && (
        <div className="w-full bg-indigo-50 dark:bg-indigo-950/50 border-b border-indigo-100 dark:border-indigo-900/40 px-4 py-1.5 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 animate-pulse">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            Advancing to next question in 2 seconds...
          </span>
          <span className="text-[11px] opacity-75">Click Next to jump immediately</span>
        </div>
      )}

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-snug">
            {question.question}
          </h2>
        </div>

        {/* 4 Options */}
        <div className="space-y-3">
          {question.options.map((optionText, idx) => {
            const optIndex = idx as 0 | 1 | 2 | 3;
            return (
              <AnswerOption
                key={optIndex}
                index={optIndex}
                text={optionText}
                isAnswered={isAnswered}
                isSelected={selectedIndex === optIndex}
                isCorrectOption={question.correctIndex === optIndex}
                disabled={isAnswered}
                onSelect={onSelectOption}
              />
            );
          })}
        </div>

        {/* Post-Answer Feedback Banner & Explanation */}
        {isAnswered && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-sm ${
                isCorrect
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-800 dark:text-rose-300"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">
                  {isCorrect ? "Correct answer!" : "Incorrect answer"}
                </p>
                {!isCorrect && (
                  <p className="text-xs sm:text-sm mt-0.5 text-rose-700 dark:text-rose-300/90">
                    The correct choice is:{" "}
                    <span className="font-semibold underline">
                      {["A", "B", "C", "D"][question.correctIndex]}: {question.options[question.correctIndex]}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Explanation if present */}
            {question.explanation && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-zinc-100">
                    Explanation:{" "}
                  </span>
                  {question.explanation}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
