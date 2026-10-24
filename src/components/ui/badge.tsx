import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "destructive" | "warning";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
    secondary:
      "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200",
    outline:
      "border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300",
    success:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30",
    destructive:
      "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30",
    warning:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
