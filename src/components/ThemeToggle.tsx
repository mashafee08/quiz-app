"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className="w-14 sm:w-16 h-7 sm:h-8 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle light or dark theme"
        title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex items-center h-7 sm:h-8 w-14 sm:w-16 rounded-full p-0.5 sm:p-1 cursor-pointer transition-colors duration-200 ease-in-out border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          isDark
            ? "bg-zinc-800 border-zinc-700 focus-visible:ring-offset-zinc-900"
            : "bg-slate-200 border-slate-300 focus-visible:ring-offset-white"
        )}
      >
        {/* Track Icons */}
        <Sun className="absolute left-1.5 w-3.5 h-3.5 text-amber-500 transition-opacity duration-200" />
        <Moon className="absolute right-1.5 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 transition-opacity duration-200" />

        {/* Sliding Thumb */}
        <span
          className={cn(
            "pointer-events-none inline-flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white dark:bg-zinc-950 shadow-sm border border-slate-200/60 dark:border-zinc-700/80 transform transition-transform duration-200 ease-in-out z-10",
            isDark ? "translate-x-7 sm:translate-x-8" : "translate-x-0"
          )}
        >
          {isDark ? (
            <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 fill-indigo-400/20" />
          ) : (
            <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500/20" />
          )}
        </span>
      </button>
    </div>
  );
}
