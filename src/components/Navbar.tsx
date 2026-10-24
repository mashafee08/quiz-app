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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-zinc-100">
                MyQuizGPT
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                Free Edition
              </span>
            </div>
            {quizTitle && (
              <p className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs">
                {quizTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {inQuiz && onResetQuiz && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetQuiz}
              className="text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              title="Return to JSON input"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">New Quiz</span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
