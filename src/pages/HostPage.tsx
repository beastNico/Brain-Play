import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { CSVUpload } from '../components/CSVUpload';
import { QuestionPreview } from '../components/QuestionPreview';
import type { Question } from '../types';
import { gameSessionService } from '../services/gameSession';

interface HostPageProps {
  onGameStarted: () => void;
}

export function HostPage({ onGameStarted }: HostPageProps) {
  const { currentQuiz, setCurrentQuiz, setIsAdmin, gamePin, setGamePin, allPlayers } = useGame();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [allowLateJoin, setAllowLateJoin] = useState(true);
  const [penalizeWrong, setPenalizeWrong] = useState(true);

  const handleQuestionsLoaded = async (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    const quiz = await gameSessionService.createQuiz(loadedQuestions, allowLateJoin, penalizeWrong);
    setCurrentQuiz(quiz);
    setGamePin(quiz.gamePin);
    setIsAdmin(true);
  };

  const handleStartGame = async () => {
    if (currentQuiz && gamePin) {
      await gameSessionService.updateQuizStatus(gamePin, 'in_progress');
      onGameStarted();
    }
  };

  const copyGamePin = () => {
    if (gamePin) {
      navigator.clipboard.writeText(gamePin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentQuiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-yellow-200 p-6 border-4 border-cyan-900">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => window.location.reload()}
              className="text-cyan-900 hover:text-cyan-800 font-bold border-2 border-cyan-900 px-4 py-2 bg-cyan-300"
            >
              BACK
            </button>
          </div>

          <div className="bg-white border-4 border-cyan-900 p-8">
            <h1 className="text-4xl font-bold text-cyan-900 mb-2">HOST A QUIZ</h1>
            <p className="text-cyan-900 mb-8 font-bold">Upload questions in CSV format</p>

            <CSVUpload onQuestionsLoaded={handleQuestionsLoaded} />

            {/* Instructions */}
            <div className="mt-12 pt-8 border-t-4 border-cyan-900">
              <h3 className="font-bold text-lg text-cyan-900 mb-4">CSV FORMAT INSTRUCTIONS</h3>
              <p className="text-cyan-900 mb-4 font-bold">Your CSV file must include:</p>
              <div className="bg-gray-100 border-2 border-cyan-900 p-4 font-mono text-sm mb-4 overflow-x-auto">
                <pre>Question,Option A,Option B,Option C,Option D,Correct Answer
What is 2+2?,3,4,5,6,B
What is the capital of France?,London,Paris,Berlin,Madrid,B</pre>
              </div>
              <div className="space-y-2 text-sm text-cyan-900 font-bold">
                <p>First row should be the header</p>
                <p>Correct Answer must be A, B, C, or D</p>
                <p>Don't include row numbers</p>
                <p>Maximum 100 questions recommended</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-200 p-6 border-4 border-cyan-900">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.location.reload()}
          className="text-cyan-900 hover:text-cyan-800 font-bold mb-6 border-2 border-cyan-900 px-4 py-2 bg-cyan-300"
        >
          BACK
        </button>

        {/* Game PIN Section */}
        <div className="bg-yellow-300 text-cyan-900 border-4 border-cyan-900 p-8 mb-6">
          <p className="text-lg font-bold mb-2">GAME PIN:</p>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold tracking-widest border-4 border-cyan-900 px-4 py-2 bg-white">{gamePin}</div>
            <button
              onClick={copyGamePin}
              className="bg-cyan-300 hover:bg-cyan-200 border-2 border-cyan-900 px-4 py-2 transition-colors font-bold text-cyan-900"
            >
              {copied ? 'COPIED!' : 'COPY'}
            </button>
          </div>
          <p className="text-sm font-bold mt-4">Share this PIN with players</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border-4 border-cyan-900 p-6">
            <div>
              <p className="text-cyan-900 text-sm font-bold">TOTAL QUESTIONS</p>
              <p className="text-3xl font-bold text-cyan-900">{questions.length}</p>
            </div>
          </div>
          <div className="bg-white border-4 border-cyan-900 p-6">
            <div>
              <p className="text-cyan-900 text-sm font-bold">PLAYERS JOINED</p>
              <p className="text-3xl font-bold text-cyan-900">{allPlayers.length}</p>
            </div>
          </div>
          <div className="bg-white border-4 border-cyan-900 p-6">
            <div>
              <p className="text-cyan-900 text-sm font-bold">STATUS</p>
              <p className="text-2xl font-bold text-cyan-900">LOBBY</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowPreview(true)}
            className="bg-cyan-300 hover:bg-cyan-200 text-cyan-900 font-bold py-3 px-6 border-2 border-cyan-900 transition-colors"
          >
            PREVIEW QUESTIONS
          </button>

          <label className="bg-cyan-300 hover:bg-cyan-200 text-cyan-900 font-bold py-3 px-6 border-2 border-cyan-900 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowLateJoin}
              onChange={(e) => setAllowLateJoin(e.target.checked)}
              className="w-4 h-4"
            />
            ALLOW LATE JOIN
          </label>

          <label className="bg-cyan-300 hover:bg-cyan-200 text-cyan-900 font-bold py-3 px-6 border-2 border-cyan-900 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={penalizeWrong}
              onChange={(e) => setPenalizeWrong(e.target.checked)}
              className="w-4 h-4"
            />
            PENALIZE WRONG
          </label>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full bg-yellow-300 hover:bg-yellow-200 text-cyan-900 font-bold py-4 px-6 border-4 border-cyan-900 transition-colors text-lg"
        >
          START QUIZ NOW
        </button>

        {showPreview && (
          <QuestionPreview
            questions={questions}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </div>
  );
}
