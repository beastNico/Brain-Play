import { Zap } from 'lucide-react';

interface LandingPageProps {
  onHostClick: () => void;
  onJoinClick: () => void;
}

export function LandingPage({ onHostClick, onJoinClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-slideIn">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-yellow-500" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Brain Play
            </h1>
            <Zap className="w-12 h-12 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 font-medium">
            Real-Time Multiplayer Quiz for Everyone! 🎮
          </p>
        </div>

        {/* Description */}
        <div className="mb-12 text-gray-700">
          <p className="text-lg mb-4">
            Host an exciting quiz session or join your friends and compete for the top spot!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm font-medium">Instant Feedback</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-sm font-medium">Multiplayer Fun</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-sm font-medium">Live Rankings</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Host Button */}
          <button
            onClick={onHostClick}
            className="group relative px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-3">
              <span>🎯</span>
              <span>Host Game</span>
            </div>
            <p className="text-sm opacity-90 mt-2">Upload questions & manage the quiz</p>
          </button>

          {/* Join Button */}
          <button
            onClick={onJoinClick}
            className="group relative px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-3">
              <span>🚀</span>
              <span>Join Game</span>
            </div>
            <p className="text-sm opacity-90 mt-2">Enter Game PIN & compete</p>
          </button>
        </div>

        {/* Footer */}
        <div className="text-gray-500 text-sm">
          <p>No installation required • Works on all devices • Instant play</p>
        </div>
      </div>
    </div>
  );
}
