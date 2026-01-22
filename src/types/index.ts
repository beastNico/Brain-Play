export type UserRole = 'admin' | 'player';

export interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  imageUrl?: string;
}

export interface Quiz {
  id: string;
  gamePin: string;
  adminId: string;
  questions: Question[];
  status: 'lobby' | 'in_progress' | 'finished';
  currentQuestionIndex: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  allowLateJoin: boolean;
  penalizeWrongAnswers: boolean;
}

export interface Player {
  id: string;
  gamePin: string;
  nickname: string;
  team?: string;
  school?: string;
  avatar: string;
  score: number;
  answeredQuestions: PlayerAnswer[];
  joinedAt: string;
  lastActivityAt: string;
}

export interface PlayerAnswer {
  questionId: string;
  answer: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  timeTakenMs: number;
  pointsEarned: number;
  answeredAt: string;
}

export interface GameSession {
  gamePin: string;
  quiz: Quiz;
  players: Player[];
  questionStartTime?: string;
  questionEndTime?: string;
  isShowingResults: boolean;
}

export interface LeaderboardEntry {
  playerId: string;
  nickname: string;
  team?: string;
  avatar: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  rank: number;
}

export interface GameContextType {
  // Quiz management
  currentQuiz: Quiz | null;
  setCurrentQuiz: (quiz: Quiz) => void;
  updateQuizStatus: (status: 'lobby' | 'in_progress' | 'finished') => void;
  updateCurrentQuestion: (index: number) => void;
  
  // Player management
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player) => void;
  allPlayers: Player[];
  setAllPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  updatePlayerScore: (playerId: string, points: number) => void;
  addPlayerAnswer: (playerId: string, answer: PlayerAnswer) => void;
  
  // Game state
  gamePin: string | null;
  setGamePin: (pin: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  calculateLeaderboard: () => void;
  
  // Timer
  questionTimeRemaining: number;
  setQuestionTimeRemaining: (time: number) => void;
  
  // Reset
  resetGame: () => void;
}
