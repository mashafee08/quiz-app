"use client";

import React from "react";
import { Play, Trash2, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { QuizState } from "@/lib/quiz/types";

interface ResumeQuizDialogProps {
  savedQuiz: QuizState;
  onResume: () => void;
  onDiscard: () => void;
}

export function ResumeQuizDialog({
  savedQuiz,
  onResume,
  onDiscard,
}: ResumeQuizDialogProps) {
  const answeredCount = Object.keys(savedQuiz.submittedAnswers).length;
  const totalCount = savedQuiz.originalQuiz.questions.length;
  const isRetry = savedQuiz.isRetry;
  const progressPercent = Math.round((answeredCount / totalCount) * 100);

  const formattedDate = new Date(savedQuiz.lastUpdated).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/60 via-white to-indigo-50/30 dark:from-indigo-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-sm mb-6">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-zinc-100">
                  {isRetry ? "Saved Retry Session" : "Unfinished Quiz in Progress"}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {progressPercent}% Complete
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-0.5">
                {answeredCount} of {totalCount} questions answered &bull; Last saved at {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onDiscard}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-slate-200 dark:border-zinc-700"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={onResume}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Play className="w-3.5 h-3.5 mr-1 fill-white" />
              Resume Quiz
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
