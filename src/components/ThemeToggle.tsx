"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50" />
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Toggle theme (currently ${theme})`}
      title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to switch)`}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-zinc-600"
    >
      {theme === "system" ? (
        <Monitor className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
      ) : resolvedTheme === "dark" ? (
        <Moon className="w-4 h-4 text-amber-400" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500" />
      )}
    </button>
  );
}
