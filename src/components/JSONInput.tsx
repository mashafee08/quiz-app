"use client";

import React, { useState, useId } from "react";
import { parseQuizInput, QuizParseResult, NormalizedQuiz } from "@/lib/parser";
import { SAMPLE_QUIZZES } from "@/lib/parser/samples";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  FileJson,
  Play,
  Trash2,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface JSONInputProps {
  onStartQuiz: (quiz: NormalizedQuiz) => void;
}

export function JSONInput({ onStartQuiz }: JSONInputProps) {
  const [inputText, setInputText] = useState("");
  const [parseResult, setParseResult] = useState<QuizParseResult | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const textareaId = useId();

  // Validate on text change or clear
  const handleTextChange = (text: string) => {
    setInputText(text);
    if (!text.trim()) {
      setParseResult(null);
      return;
    }
    const result = parseQuizInput(text);
    setParseResult(result);
  };

  const handleClear = () => {
    setInputText("");
    setParseResult(null);
    setHasAttemptedSubmit(false);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleTextChange(text);
      }
    } catch {
      // Clipboard permissions denied or unavailable
    }
  };

  const handleLoadSample = (sampleData: unknown) => {
    const formatted = JSON.stringify(sampleData, null, 2);
    handleTextChange(formatted);
  };

  const handleStartQuiz = () => {
    setHasAttemptedSubmit(true);
    const result = parseQuizInput(inputText);
    setParseResult(result);

    if (result.success && result.quiz && result.quiz.questions.length > 0) {
      onStartQuiz(result.quiz);
    }
  };

  const questionCount = parseResult?.quiz?.questions.length ?? 0;
  const isReady = Boolean(parseResult?.success && questionCount > 0);

  return (
    <Card className="w-full border-slate-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <FileJson className="w-5 h-5 text-indigo-500" />
              Import Quiz JSON
            </CardTitle>
            <CardDescription className="mt-1">
              Paste your multiple-choice questions in JSON format. Each question requires 4 answer choices and 1 correct answer.
            </CardDescription>
          </div>

          {/* Sample Quizzes Quick-Loader */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Samples:
            </span>
            {SAMPLE_QUIZZES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample.data)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-medium transition-colors"
              >
                {sample.id === "tech-web" ? "Web Dev" : sample.id === "science-general" ? "Science" : "1 Question"}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action toolbar above textarea */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <label htmlFor={textareaId} className="font-medium cursor-pointer">
            JSON Quiz Payload
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              Paste from Clipboard
            </button>
            {inputText && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            id={textareaId}
            value={inputText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={`[\n  {\n    "question": "What is the capital of France?",\n    "options": ["London", "Berlin", "Paris", "Madrid"],\n    "correctIndex": 2,\n    "explanation": "Paris is the capital of France."\n  }\n]`}
            rows={12}
            className="w-full font-mono text-xs sm:text-sm p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/60 text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/30 transition-all resize-y"
          />
        </div>

        {/* Status indicator / Live Validation */}
        {inputText.trim() && parseResult && (
          <div className="space-y-3 pt-1">
            {parseResult.success ? (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <div className="font-semibold flex items-center gap-2">
                    Valid Quiz JSON Detected
                    <Badge variant="success" className="text-[11px]">
                      {questionCount} {questionCount === 1 ? "Question" : "Questions"}
                    </Badge>
                    {parseResult.detectedFormat && (
                      <span className="text-xs text-emerald-700 dark:text-emerald-400/80">
                        ({parseResult.detectedFormat})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400/80 mt-1">
                    Ready to start interactive quiz. Each question has 4 verified choices and 1 correct answer.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <div className="font-semibold">Validation Errors Detected</div>
                  <ul className="mt-1.5 space-y-1 text-xs list-disc pl-4 text-rose-700 dark:text-rose-300/90 max-h-36 overflow-y-auto">
                    {parseResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Warnings (e.g. duplicate ID normalized) */}
            {parseResult.warnings.length > 0 && (
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold">Notices: </span>
                  {parseResult.warnings.map((warn, i) => (
                    <span key={i} className="inline mr-2">
                      {warn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {hasAttemptedSubmit && !inputText.trim() && (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Please paste JSON content or select one of the sample presets to begin.
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="text-xs text-slate-500 dark:text-zinc-400">
          {questionCount > 0 ? (
            <span className="font-medium text-slate-700 dark:text-zinc-300">
              {questionCount} {questionCount === 1 ? "question" : "questions"} loaded
            </span>
          ) : (
            <span>Paste JSON or click a sample to populate</span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {inputText && (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleClear}
              className="flex-1 sm:flex-none"
            >
              Clear Input
            </Button>
          )}

          <Button
            type="button"
            size="default"
            disabled={!isReady}
            onClick={handleStartQuiz}
            className="flex-1 sm:flex-none bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-zinc-200"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            Start Quiz
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
