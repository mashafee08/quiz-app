"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Check,
  X,
  FilePlus2,
  Filter,
} from "lucide-react";
import { NormalizedQuestion } from "@/lib/parser/types";
import { SubmittedAnswer, QuizScoreSummary } from "@/lib/quiz/types";

interface AnswerReviewProps {
  questions: NormalizedQuestion[];
  submittedAnswers: Record<string, SubmittedAnswer>;
  scoreSummary: QuizScoreSummary;
  onBackToResults: () => void;
  onNewQuiz: () => void;
}

export function AnswerReview({
  questions,
  submittedAnswers,
  scoreSummary,
  onBackToResults,
  onNewQuiz,
}: AnswerReviewProps) {
  const [filter, setFilter] = useState<"all" | "incorrect" | "correct">("all");

  const filteredQuestions = questions.filter((q) => {
    const ans = submittedAnswers[q.id];
    if (filter === "incorrect") return ans && !ans.isCorrect;
    if (filter === "correct") return ans && ans.isCorrect;
    return true;
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToResults}
            className="border-slate-300 dark:border-zinc-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Results
          </Button>
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-zinc-100">
              Quiz Review
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Score: {scoreSummary.scoreText} ({scoreSummary.accuracy}%) &bull; Read-only
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="text-xs text-slate-400 dark:text-zinc-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200"
            }`}
          >
            All ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("incorrect")}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === "incorrect"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100"
            }`}
          >
            Missed ({scoreSummary.incorrectCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("correct")}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === "correct"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
            }`}
          >
            Correct ({scoreSummary.correctCount})
          </button>
        </div>
      </div>

      {/* Empty Filter State */}
      {filteredQuestions.length === 0 && (
        <Card className="p-8 text-center border-slate-200 dark:border-zinc-800">
          <p className="text-slate-600 dark:text-zinc-400 text-sm">
            {filter === "incorrect"
              ? "Great job! You did not miss any questions."
              : "No questions match this filter."}
          </p>
        </Card>
      )}

      {/* Question Cards List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, qIndex) => {
          const answer = submittedAnswers[q.id];
          const isCorrect = answer?.isCorrect ?? false;
          const userSelectedIndex = answer?.selectedIndex;
          const originalIndex = questions.findIndex((item) => item.id === q.id);

          return (
            <Card
              key={q.id}
              className={`border transition-all ${
                isCorrect
                  ? "border-emerald-200 dark:border-emerald-950/60 bg-white dark:bg-zinc-900"
                  : "border-rose-200 dark:border-rose-950/60 bg-white dark:bg-zinc-900"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                      Q{originalIndex + 1}
                    </span>
                    <Badge variant={isCorrect ? "success" : "destructive"}>
                      {isCorrect ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-base sm:text-lg font-bold mt-2 text-slate-900 dark:text-zinc-100 leading-snug">
                  {q.question}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                {/* 4 Choices */}
                <div className="space-y-2.5">
                  {q.options.map((optionText, optIdx) => {
                    const isOptionCorrect = q.correctIndex === optIdx;
                    const isUserSelected = userSelectedIndex === optIdx;

                    let rowStyle =
                      "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-slate-500 dark:text-zinc-400";
                    let badgeStyle =
                      "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 border-slate-200 dark:border-zinc-800";

                    if (isOptionCorrect) {
                      // Correct option is always green
                      rowStyle =
                        "border-emerald-500/80 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-medium ring-1 ring-emerald-500/50";
                      badgeStyle = "bg-emerald-500 text-white border-emerald-600";
                    } else if (isUserSelected && !isOptionCorrect) {
                      // User's wrong selection is red
                      rowStyle =
                        "border-rose-500/80 bg-rose-50/80 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100 font-medium ring-1 ring-rose-500/50";
                      badgeStyle = "bg-rose-500 text-white border-rose-600";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 text-sm transition-colors ${rowStyle}`}
                      >
                        <span
                          className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold shrink-0 border mt-0.5 ${badgeStyle}`}
                        >
                          {isOptionCorrect ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : isUserSelected ? (
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            ["A", "B", "C", "D"][optIdx]
                          )}
                        </span>

                        <div className="flex-1 leading-relaxed self-center">
                          {optionText}
                        </div>

                        {/* Status Label */}
                        <div className="shrink-0 self-center text-xs font-semibold">
                          {isOptionCorrect && (
                            <span className="text-emerald-700 dark:text-emerald-400">
                              Correct Answer
                            </span>
                          )}
                          {isUserSelected && !isOptionCorrect && (
                            <span className="text-rose-700 dark:text-rose-400">
                              Your Selection
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 text-xs text-slate-700 dark:text-zinc-300 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        Explanation:{" "}
                      </span>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <Button
          variant="outline"
          onClick={onBackToResults}
          className="border-slate-300 dark:border-zinc-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>

        <Button
          variant="secondary"
          onClick={onNewQuiz}
        >
          <FilePlus2 className="w-4 h-4 mr-2" />
          Start New Quiz
        </Button>
      </div>
    </div>
  );
}
