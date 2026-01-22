import { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import { useGame } from '../hooks/useGame';
import { Clock, Medal } from 'lucide-react';
import { gameSessionService } from '../services/gameSession';
import { getAvatarEmoji } from '../utils/helpers';

const QUESTION_TIME = 10; // seconds

type QuizState = {
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  showResults: boolean;
  timeLeft: number;
  hasAnswered: boolean;
};

const initialQuizState: QuizState = {
  selectedAnswer: null,
  showResults: false,
  timeLeft: QUESTION_TIME,
  hasAnswered: false,
};

type QuizAction =
  | { type: 'RESET_QUESTION' }
  | { type: 'SET_SELECTED_ANSWER'; payload: 'A' | 'B' | 'C' | 'D' }
  | { type: 'SHOW_RESULTS' }
  | { type: 'SET_TIME_LEFT'; payload: number }
  | { type: 'SET_HAS_ANSWERED' };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'RESET_QUESTION':
      return {
        selectedAnswer: null,
        showResults: false,
        timeLeft: QUESTION_TIME,
        hasAnswered: false,
      };
    case 'SET_SELECTED_ANSWER':
      return { ...state, selectedAnswer: action.payload };
    case 'SHOW_RESULTS':
      return { ...state, showResults: true };
    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.payload };
    case 'SET_HAS_ANSWERED':
      return { ...state, hasAnswered: true };
    default:
      return state;
  }
}

export function QuizPlay() {
  const {
    currentQuiz,
    currentPlayer,
    gamePin,
    isAdmin,
  } = useGame();

  // All hooks MUST be called unconditionally, in the same order every render
  const [playerScore, setPlayerScore] = useState(0);
  const [quizState, dispatch] = useReducer(quizReducer, initialQuizState);
  const answerStartTimeRef = useRef<number>(0);

  // Debug: Log when component mounts or dependencies change
  useEffect(() => {
    console.log('QuizPlay Debug:', {
      currentQuiz: currentQuiz ? `Quiz ${currentQuiz.id}, Status: ${currentQuiz.status}` : 'null',
      currentPlayer: currentPlayer ? `Player ${currentPlayer.nickname}` : isAdmin ? 'Admin (no player)' : 'null',
      gamePin,
      isAdmin,
    });
  }, [currentQuiz, currentPlayer, gamePin, isAdmin]);

  // Reset state when question changes
  useEffect(() => {
    if (currentQuiz) {
      answerStartTimeRef.current = Date.now();
      dispatch({ type: 'RESET_QUESTION' });
    }
  }, [currentQuiz?.currentQuestionIndex]);

  // Handle answer submission
  const handleAnswerSelect = useCallback(async (answer: 'A' | 'B' | 'C' | 'D') => {
    if (!currentPlayer || !currentQuiz || !gamePin) return;
    
    if (!quizState.showResults && !quizState.hasAnswered) {
      const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestionIndex];
      const timeTaken = Date.now() - answerStartTimeRef.current;

      try {
        dispatch({ type: 'SET_HAS_ANSWERED' });
        dispatch({ type: 'SET_SELECTED_ANSWER', payload: answer });

        const result = await gameSessionService.submitAnswer(
          currentPlayer.id,
          currentQuestion.id,
          answer,
          timeTaken,
          currentQuestion.correctAnswer
        );

        setPlayerScore(prev => prev + result.pointsEarned);
        dispatch({ type: 'SHOW_RESULTS' });
      } catch (error) {
        console.error('Error submitting answer:', error);
        dispatch({ type: 'RESET_QUESTION' });
      }
    }
  }, [quizState.showResults, quizState.hasAnswered, currentQuiz, currentPlayer, gamePin]);

  // Timer effect
  useEffect(() => {
    if (!currentQuiz) return;

    const tick = () => {
      const newTimeLeft = Math.max(0, quizState.timeLeft - 1);
      dispatch({ type: 'SET_TIME_LEFT', payload: newTimeLeft });
      
      if (newTimeLeft === 0 && !quizState.showResults) {
        dispatch({ type: 'SHOW_RESULTS' });
      }
    };

    const timer: ReturnType<typeof setInterval> = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [quizState.timeLeft, currentQuiz]);

  // Auto-advance to next question after showing results for 10 seconds
  useEffect(() => {
    if (!quizState.showResults || !gamePin || !currentQuiz) return;

    const timeout = setTimeout(async () => {
      const isLastQuestion = currentQuiz.currentQuestionIndex === currentQuiz.questions.length - 1;

      if (isLastQuestion) {
        if (isAdmin) {
          await gameSessionService.updateQuizStatus(gamePin, 'finished');
        }
      } else if (isAdmin) {
        await gameSessionService.updateCurrentQuestion(gamePin, currentQuiz.currentQuestionIndex + 1);
      }
    }, 10000); // 10 second delay to show results

    return () => clearTimeout(timeout);
  }, [quizState.showResults, gamePin, currentQuiz, isAdmin]);

  // Keyboard navigation for answer selection
  useEffect(() => {
    if (!currentQuiz || !currentPlayer || isAdmin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!quizState.showResults && !quizState.hasAnswered) {
        const key = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(key)) {
          handleAnswerSelect(key as 'A' | 'B' | 'C' | 'D');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizState.showResults, quizState.hasAnswered, currentQuiz, currentPlayer, handleAnswerSelect, isAdmin]);

  // EARLY RETURNS - after all hooks are declared
  if (!currentQuiz) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Loading quiz...</p>
        <p className="text-sm text-gray-500">Waiting for quiz data</p>
      </div>
    );
  }

  if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
    return <div className="p-8 text-center text-gray-600">No questions available</div>;
  }

  if (currentQuiz.currentQuestionIndex >= currentQuiz.questions.length) {
    return <div className="p-8 text-center text-gray-600">Quiz finished!</div>;
  }

  if (!currentPlayer && !isAdmin) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Loading player data...</p>
        <p className="text-sm text-gray-500">Waiting for player registration</p>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestionIndex];

  const getOptionText = (option: 'A' | 'B' | 'C' | 'D'): string => {
    const options = {
      A: currentQuestion.optionA,
      B: currentQuestion.optionB,
      C: currentQuestion.optionC,
      D: currentQuestion.optionD,
    };
    return options[option];
  };

  const timeBarColor =
    quizState.timeLeft > 5 ? 'bg-green-500' : quizState.timeLeft > 3 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600 text-sm">Question {currentQuiz.currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{
                  width: `${((currentQuiz.currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          {!isAdmin && (
            <div className="text-right">
              <p className="text-gray-600 text-sm">Your Score</p>
              <p className="text-3xl font-bold text-indigo-600">{playerScore}</p>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6 text-indigo-600" />
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-2">Time Remaining</p>
              <div className="flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${timeBarColor}`}
                    style={{ width: `${(quizState.timeLeft / QUESTION_TIME) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-2xl font-bold w-12 text-right ${quizState.timeLeft <= 5 ? 'text-red-600' : 'text-indigo-600'}`}>
                  {quizState.timeLeft}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentQuestion.text}</h2>
          
          {isAdmin && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-purple-700 font-medium">👑 Host Mode</p>
              <p className="text-sm text-purple-600">The correct answer is: <span className="font-bold">{currentQuestion.correctAnswer}</span></p>
            </div>
          )}

          {!isAdmin && !quizState.showResults && (
            <p className="text-sm text-gray-500 mb-4">
              💡 Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">A</kbd>, <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">B</kbd>, <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">C</kbd>, or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">D</kbd> to select an answer quickly
            </p>
          )}

          {/* Options - Only show for players */}
          {!isAdmin && (
          <div className="grid grid-cols-1 gap-4">
            {(['A', 'B', 'C', 'D'] as const).map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={quizState.showResults}
                className={`p-4 rounded-lg text-left transition-all transform hover:scale-102 ${
                  quizState.selectedAnswer === option && option === currentQuestion.correctAnswer
                    ? 'ring-2 ring-green-500 bg-green-100 border border-green-300'
                    : quizState.selectedAnswer === option && option !== currentQuestion.correctAnswer
                    ? 'ring-2 ring-red-500 bg-red-100 border border-red-300'
                    : quizState.showResults && option === currentQuestion.correctAnswer
                    ? 'ring-2 ring-green-500 bg-green-100 border border-green-300'
                    : 'bg-gray-50 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
                aria-label={`Option ${option}: ${getOptionText(option)}`}
                aria-disabled={quizState.showResults}
              >
                <p className="font-bold text-indigo-600 mb-1">{option}</p>
                <p className="text-gray-800">{getOptionText(option)}</p>
              </button>
            ))}
          </div>
          )}
        </div>

        {/* Results Feedback */}
        {quizState.showResults && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-slideIn">
            <div className={`text-center ${quizState.selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
              {quizState.selectedAnswer === currentQuestion.correctAnswer ? (
                <>
                  <p className="text-5xl mb-2">🎉</p>
                  <p className="text-2xl font-bold">Correct!</p>
                </>
              ) : (
                <>
                  <p className="text-5xl mb-2">😅</p>
                  <p className="text-2xl font-bold">Wrong Answer</p>
                  <p className="text-sm text-gray-600 mt-2">
                    The correct answer is <span className="font-bold">{currentQuestion.correctAnswer}</span>
                  </p>
                </>
              )}
            </div>

            {!isAdmin && (
              <div className="mt-6 text-center text-gray-600">
                <p>Auto-advancing to next question...</p>
              </div>
            )}
            {isAdmin && (
              <div className="mt-6 text-center text-gray-600">
                <p>Auto-advancing to next question...</p>
              </div>
            )}
          </div>
        )}

        {/* Live Leaderboard */}
        <LiveLeaderboard isAdmin={isAdmin} />
      </div>
    </div>
  );
}

function LiveLeaderboard({ isAdmin }: { isAdmin: boolean }) {
  const { leaderboard, calculateLeaderboard, allPlayers } = useGame();

  useEffect(() => {
    calculateLeaderboard();
  }, [allPlayers, calculateLeaderboard]);

  // Filter out admin from leaderboard for display
  const filteredLeaderboard = leaderboard.filter(entry => !isAdmin || entry.score !== 0 || allPlayers.length > 1);
  const displayEntries = filteredLeaderboard.slice(0, 5);

  if (displayEntries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-4">
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5" />
          <h3 className="font-bold">Live Leaderboard</h3>
        </div>
      </div>
      <div className="divide-y">
        {displayEntries.map((entry) => (
          <div
            key={entry.playerId}
            className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            {/* Rank */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {entry.rank}
            </div>

            {/* Avatar & Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl flex-shrink-0">
                  {getAvatarEmoji(entry.avatar)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-800 truncate text-sm">
                    {entry.nickname}
                  </p>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-indigo-600">{entry.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
