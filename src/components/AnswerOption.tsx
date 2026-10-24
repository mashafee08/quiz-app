"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

interface AnswerOptionProps {
  index: 0 | 1 | 2 | 3;
  text: string;
  isAnswered: boolean;
  isSelected: boolean;
  isCorrectOption: boolean;
  disabled: boolean;
  onSelect: (index: 0 | 1 | 2 | 3) => void;
}

export function AnswerOption({
  index,
  text,
  isAnswered,
  isSelected,
  isCorrectOption,
  disabled,
  onSelect,
}: AnswerOptionProps) {
  const letter = OPTION_LETTERS[index];

  // Determine state styling
  let stateClasses = "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:border-slate-400 dark:hover:border-zinc-600 hover:bg-slate-50/50 dark:hover:bg-zinc-800/40";
  let letterClasses = "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700";
  let showCheck = false;
  let showCross = false;

  if (isAnswered) {
    if (isCorrectOption) {
      // Highlight correct option in green
      stateClasses = "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-medium ring-1 ring-emerald-500";
      letterClasses = "bg-emerald-500 text-white border-emerald-600";
      showCheck = true;
    } else if (isSelected && !isCorrectOption) {
      // Highlight selected incorrect option in red
      stateClasses = "border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100 font-medium ring-1 ring-rose-500";
      letterClasses = "bg-rose-500 text-white border-rose-600";
      showCross = true;
    } else {
      // Other unselected options when answered
      stateClasses = "border-slate-200 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 opacity-60";
      letterClasses = "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800";
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || isAnswered}
      onClick={() => onSelect(index)}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
        stateClasses,
        disabled || isAnswered ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
      )}
    >
      {/* Letter Badge (A, B, C, D) */}
      <span
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 border mt-0.5 transition-colors",
          letterClasses
        )}
      >
        {showCheck ? (
          <Check className="w-4 h-4 stroke-[3]" />
        ) : showCross ? (
          <X className="w-4 h-4 stroke-[3]" />
        ) : (
          letter
        )}
      </span>

      {/* Option Text */}
      <span className="flex-1 text-sm sm:text-base leading-relaxed self-center">
        {text}
      </span>

      {/* Trailing Feedback Tag */}
      {isAnswered && isCorrectOption && (
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 self-center hidden sm:inline">
          Correct
        </span>
      )}
      {isAnswered && isSelected && !isCorrectOption && (
        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 shrink-0 self-center hidden sm:inline">
          Incorrect
        </span>
      )}
    </button>
  );
}
