export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  timeRemaining: number;
  quizStatus: 'idle' | 'in-progress' | 'completed';
  score?: number;
  feedback?: string;
  isLoading?: boolean;
  error?: string
}