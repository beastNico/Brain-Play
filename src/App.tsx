import { useState, useEffect } from 'react';
import { GameProvider } from './context/GameContext.tsx';
import { LandingPage } from './pages/LandingPage';
import { HostPage } from './pages/HostPage';
import { JoinPage } from './pages/JoinPage';
import { QuizPlay } from './components/QuizPlay.tsx';
import { Leaderboard } from './components/Leaderboard';
import { useGame } from './hooks/useGame';

type AppView = 'landing' | 'host' | 'join' | 'quiz-play' | 'game-end';

function AppContent() {
  const [view, setView] = useState<AppView>('landing');
  const { currentQuiz } = useGame();

  // Watch for quiz status changes
  useEffect(() => {
    if (currentQuiz?.status === 'finished' && view === 'quiz-play') {
      setView('game-end');
    }
  }, [currentQuiz?.status]);

  return (
    <div className="min-h-screen">
      {view === 'landing' && (
        <LandingPage
          onHostClick={() => setView('host')}
          onJoinClick={() => setView('join')}
        />
      )}
      {view === 'host' && (
        <HostPage
          onGameStarted={() => setView('quiz-play')}
        />
      )}
      {view === 'join' && (
        <JoinPage
          onPlayerJoined={() => setView('quiz-play')}
        />
      )}
      {view === 'quiz-play' && (
        <QuizPlay />
      )}
      {view === 'game-end' && (
        <div className="min-h-screen bg-cyan-200 p-6 border-4 border-cyan-900">
          <div className="max-w-2xl mx-auto">
            <Leaderboard isGameEnd={true} />
            <button
              onClick={() => {
                setView('landing');
              }}
              className="w-full mt-8 bg-yellow-300 hover:bg-yellow-200 text-cyan-900 font-bold py-4 px-6 border-4 border-cyan-900 transition-colors"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
