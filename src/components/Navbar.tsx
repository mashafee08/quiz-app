"use client";

import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Sparkles, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  inQuiz?: boolean;
  onResetQuiz?: () => void;
  quizTitle?: string;
}

export function Navbar({ inQuiz, onResetQuiz, quizTitle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sm sm:text-lg tracking-tight text-slate-900 dark:text-zinc-100 truncate">
                MyQuizGPT
              </span>
              <span className="hidden xs:inline-flex text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 shrink-0">
                Free
              </span>
            </div>
            {quizTitle && (
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[130px] sm:max-w-xs">
                {quizTitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Actions: New Quiz button + Light/Dark Switch */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {inQuiz && onResetQuiz && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetQuiz}
              className="h-8 px-2.5 sm:px-3 text-xs text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 border-slate-200 dark:border-zinc-700"
              title="Return to JSON input"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">New Quiz</span>
            </Button>
          )}

          {/* Dedicated Light / Dark Mode Switch */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
