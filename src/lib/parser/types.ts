export interface NormalizedQuestion {
  id: string;
  questionNumber: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
}

export interface NormalizedQuiz {
  title?: string;
  description?: string;
  questions: NormalizedQuestion[];
}

export interface QuizParseResult {
  success: boolean;
  quiz?: NormalizedQuiz;
  errors: string[];
  warnings: string[];
  detectedFormat?: string;
}

export interface QuizAdapter {
  id: string;
  name: string;
  description: string;
  canParse: (raw: unknown) => boolean;
  parse: (raw: unknown) => QuizParseResult;
}
