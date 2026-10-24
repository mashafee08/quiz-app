# MyQuizGPT - Free & Browser-Based MCQ Quiz Platform

A fast, modern, and completely free browser-based MCQ quiz application inspired by MyQuizGPT.

Paste your JSON questions and immediately convert them into an interactive quiz with instant feedback, review modes, retries for missed questions, and local browser persistence.

---

## Features

- **100% Free & Client-Side**: No backend, no accounts, no subscriptions, and zero paywalls or artificial question limits.
- **Modular JSON Parser & Adapter System**:
  - Independent parsing and validation layer.
  - Normalizes any format into a consistent internal model (`NormalizedQuestion`).
  - Supports 0-based (`0-3`), 1-based (`1-4`), letter-based (`"A"-"D"`), and option-text matching correct answer formats.
  - Dedicated `MyQuizGptAdapter` stub in `src/lib/parser/adapters/myquizgpt.ts` ready to receive and map the exact schema once provided.
  - Validates exactly 4 choices and 1 correct answer per question with detailed error reporting.
- **Interactive Quiz Interface**:
  - Displays exactly one question at a time.
  - Immediate visual feedback on selection:
    - **Correct**: Selected option highlighted in green.
    - **Incorrect**: Selected option highlighted in red; correct option highlighted in green.
  - Disables further selections and waits exactly 2 seconds before advancing to the next unanswered question.
  - Safe timer management: manual navigation or refresh cleanly cancels timers to prevent double navigation or phantom states.
- **Question Navigation**:
  - Revisit previous questions in read-only mode without altering scores or triggering auto-advance.
  - Interactive Question Map / Drawer to jump to any question quickly.
- **Progress Tracking**:
  - Live progress bar reflecting answered count (`Answered / Total`), not merely the current view index.
  - Live counters for correct and incorrect answers.
- **Results Summary & Actions**:
  - Final score, accuracy percentage, and detailed performance breakdown.
  - **Review Answers**: Dedicated review mode showing all questions, user selection vs. correct answer, and explanations.
  - **Retry Incorrect Questions**: Re-quizzes missed questions in an isolated retry session, repeatable until 100% accuracy.
  - **New Quiz**: Clears state and returns to JSON input.
- **Local Progress Persistence**:
  - Automatically saves quiz state, answers, and progress to `localStorage`.
  - Reopen or refresh the tab without losing progress.
  - Resume banner allows resuming or discarding progress.
  - Safely handles edge cases like refreshing during the 2-second feedback timer without duplicate scoring.
- **Light & Dark Mode**:
  - System theme detection + manual toggle with local persistence.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Test Suite
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## Project Structure

```
src/
├── app/
│   ├── globals.css         # Tailwind v4 styles and dark mode variables
│   ├── layout.tsx          # Root layout with ThemeProvider
│   └── page.tsx            # Main App Router page (manages views)
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Card, Badge, Progress)
│   ├── Navbar.tsx          # App header with branding and theme toggle
│   ├── ThemeToggle.tsx     # Light/Dark/System theme switcher
│   ├── ThemeProvider.tsx   # Theme context and localStorage persistence
│   ├── JSONInput.tsx       # JSON paste textarea, sample loader, live validation
│   ├── QuizProgress.tsx    # Answered-based progress bar and live counters
│   ├── QuestionCard.tsx    # Single question card with 2s indicator & feedback
│   ├── AnswerOption.tsx    # 4 distinct option choices (A, B, C, D)
│   ├── QuizNavigation.tsx  # Prev/Next buttons and question map drawer
│   ├── QuizContainer.tsx   # Quiz view container
│   ├── ResultsSummary.tsx  # Score summary, accuracy %, retry & review triggers
│   ├── AnswerReview.tsx    # Comprehensive review mode with filters
│   └── ResumeQuizDialog.tsx # Banner to resume or discard unfinished quiz
├── lib/
│   ├── utils.ts            # Utility functions (cn)
│   ├── parser/
│   │   ├── types.ts        # NormalizedQuestion & Adapter interfaces
│   │   ├── validator.ts    # Schema validation and error reporting
│   │   ├── samples.ts      # Built-in sample quiz presets
│   │   └── adapters/
│   │       ├── base.ts     # Adapter contract
│   │       ├── standard.ts # Standard array/object adapter
│   │       ├── myquizgpt.ts# Decoupled stub ready for MyQuizGPT sample schema
│   │       └── index.ts    # Adapter registry and auto-detection
│   ├── quiz/
│   │   ├── types.ts        # Quiz state and submitted answer types
│   │   └── useQuizManager.ts # Core quiz state hook, timers, navigation
│   └── storage/
│       └── storage.ts      # localStorage persistence and score integrity checks
scripts/
└── verify-quiz-system.ts   # Automated 14-test verification suite
```

---

## Connecting the MyQuizGPT Schema

As instructed, the internal quiz engine operates strictly on `NormalizedQuestion`.

When you provide the sample JSON export from MyQuizGPT, update `src/lib/parser/adapters/myquizgpt.ts`:
1. In `canParse(raw)`, verify the unique signature or fields of the export.
2. In `parse(raw)`, map the export properties (question text, choices array, correct answer indicator, explanations) into `NormalizedQuestion[]`.

No other components or quiz logic will need changes.
