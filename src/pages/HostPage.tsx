import { useState } from 'react';
import { Copy, Play, Users, Eye } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 Host a Quiz</h1>
            <p className="text-gray-600 mb-8">Upload your questions in CSV format to get started</p>

            <CSVUpload onQuestionsLoaded={handleQuestionsLoaded} />

            {/* Instructions */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-bold text-lg text-gray-800 mb-4">CSV Format Instructions</h3>
              <p className="text-gray-600 mb-4">Your CSV file must include these columns:</p>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                <pre>Question,Option A,Option B,Option C,Option D,Correct Answer
What is 2+2?,3,4,5,6,B
What is the capital of France?,London,Paris,Berlin,Madrid,B</pre>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ First row should be the header</p>
                <p>✓ Correct Answer must be A, B, C, or D</p>
                <p>✓ Don't include row numbers in the CSV</p>
                <p>✓ Maximum 100 questions recommended</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-6"
        >
          ← Back
        </button>

        {/* Game PIN Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-8 mb-6">
          <p className="text-lg opacity-90 mb-2">Game PIN:</p>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold tracking-widest">{gamePin}</div>
            <button
              onClick={copyGamePin}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm opacity-75 mt-4">Share this PIN with your players</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Questions</p>
                <p className="text-3xl font-bold text-indigo-600">{questions.length}</p>
              </div>
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Players Joined</p>
                <p className="text-3xl font-bold text-green-600">{allPlayers.length}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="text-2xl font-bold text-amber-600">Lobby</p>
              </div>
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowPreview(true)}
            className="bg-white hover:bg-gray-50 text-indigo-600 font-bold py-3 px-6 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Preview Questions
          </button>

          <label className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowLateJoin}
              onChange={(e) => setAllowLateJoin(e.target.checked)}
              className="w-4 h-4"
            />
            Allow Late Join
          </label>

          <label className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={penalizeWrong}
              onChange={(e) => setPenalizeWrong(e.target.checked)}
              className="w-4 h-4"
            />
            Penalize Wrong
          </label>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 text-lg flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6" />
          Start Quiz Now!
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
