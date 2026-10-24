"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  FilePlus2,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { QuizScoreSummary } from "@/lib/quiz/types";

interface ResultsSummaryProps {
  scoreSummary: QuizScoreSummary;
  isRetry?: boolean;
  onReview: () => void;
  onRetryIncorrect: () => void;
  onNewQuiz: () => void;
}

export function ResultsSummary({
  scoreSummary,
  isRetry,
  onReview,
  onRetryIncorrect,
  onNewQuiz,
}: ResultsSummaryProps) {
  const { totalQuestions, correctCount, incorrectCount, accuracy, isPerfectScore, scoreText } =
    scoreSummary;

  // Feedback tier
  let headline = "Quiz Completed!";
  let subline = "Here is a breakdown of your results.";
  let badgeColor: "success" | "warning" | "destructive" | "default" = "default";

  if (isPerfectScore) {
    headline = "Perfect Score! 🌟";
    subline = "Flawless performance! You answered every question correctly.";
    badgeColor = "success";
  } else if (accuracy >= 80) {
    headline = "Impressive Work! 🎯";
    subline = "Solid mastery of the material. Keep up the high standard!";
    badgeColor = "success";
  } else if (accuracy >= 50) {
    headline = "Good Effort! 📚";
    subline = "You're on the right track. Review the missed questions to sharpen your skills.";
    badgeColor = "warning";
  } else {
    headline = "Practice Makes Perfect! 💪";
    subline = "Don't worry—use review mode or retry the missed questions to improve.";
    badgeColor = "destructive";
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="text-center pb-2 pt-8">
        <div className="flex justify-center mb-3">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${
              isPerfectScore
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : accuracy >= 70
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
            }`}
          >
            {isPerfectScore ? (
              <Trophy className="w-8 h-8 fill-amber-500" />
            ) : accuracy >= 70 ? (
              <Award className="w-8 h-8" />
            ) : (
              <Sparkles className="w-8 h-8" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <Badge variant={badgeColor} className="text-xs font-semibold px-3 py-1">
            {isRetry ? "Retry Attempt Finished" : "Final Results"}
          </Badge>
        </div>

        <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
          {headline}
        </CardTitle>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
          {subline}
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-4 pb-6">
        {/* Main Score Hero Card */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 text-center space-y-1">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500">
            Final Score
          </div>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            {scoreText}
          </div>
          <div className="text-base font-semibold text-slate-600 dark:text-zinc-400">
            Accuracy:{" "}
            <span
              className={
                accuracy >= 70
                  ? "text-emerald-600 dark:text-emerald-400"
                  : accuracy >= 40
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-rose-600 dark:text-rose-400"
              }
            >
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Questions */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
              Total
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
              {totalQuestions}
            </div>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">
              Questions
            </span>
          </div>

          {/* Correct Answers */}
          <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-center space-y-1">
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Correct
            </span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {correctCount}
            </div>
            <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/70">
              {totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0}%
            </span>
          </div>

          {/* Incorrect Answers */}
          <div className="p-4 rounded-xl border border-rose-500/25 bg-rose-500/10 text-center space-y-1">
            <span className="text-xs font-medium text-rose-800 dark:text-rose-300 flex items-center justify-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              Incorrect
            </span>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {incorrectCount}
            </div>
            <span className="text-[11px] text-rose-700/80 dark:text-rose-400/70">
              {totalQuestions > 0 ? Math.round((incorrectCount / totalQuestions) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 100% Correct Message */}
        {isPerfectScore && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-semibold">All answers are 100% correct!</p>
              <p className="text-amber-700 dark:text-amber-300/90 text-xs mt-0.5">
                No questions need to be retried. You have fully conquered this quiz.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="pt-2 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-zinc-800/80">
        <Button
          variant="outline"
          size="default"
          onClick={onReview}
          className="flex-1 border-slate-300 dark:border-zinc-700"
        >
          <Eye className="w-4 h-4 mr-2" />
          Review Answers
        </Button>

        {!isPerfectScore && incorrectCount > 0 ? (
          <Button
            size="default"
            onClick={onRetryIncorrect}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-zinc-950 font-semibold"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry Incorrect ({incorrectCount})
          </Button>
        ) : null}

        <Button
          variant="secondary"
          size="default"
          onClick={onNewQuiz}
          className="flex-1"
        >
          <FilePlus2 className="w-4 h-4 mr-2" />
          New Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
