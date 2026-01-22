interface LandingPageProps {
  onHostClick: () => void;
  onJoinClick: () => void;
}

export function LandingPage({ onHostClick, onJoinClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-cyan-200 flex items-center justify-center p-4 border-4 border-cyan-900">
      <div className="text-center max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-cyan-900 mb-2 border-4 border-cyan-900 p-4 bg-yellow-300" style={{textShadow: '3px 3px 0px #000'}}>
            BRAIN PLAY
          </h1>
          <p className="text-xl text-cyan-900 font-bold mt-4">
            Real-Time Multiplayer Quiz
          </p>
        </div>

        {/* Description */}
        <div className="mb-12 text-cyan-900 bg-white border-4 border-cyan-900 p-6">
          <p className="text-lg mb-6 font-bold">
            Host an exciting quiz session or join your friends and compete!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-300 border-4 border-cyan-900 p-4">
              <p className="font-bold">Instant Feedback</p>
            </div>
            <div className="bg-magenta-300 border-4 border-cyan-900 p-4">
              <p className="font-bold">Multiplayer</p>
            </div>
            <div className="bg-cyan-300 border-4 border-cyan-900 p-4">
              <p className="font-bold">Live Rankings</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Host Button */}
          <button
            onClick={onHostClick}
            className="px-8 py-6 bg-yellow-300 text-black border-4 border-cyan-900 font-bold text-lg active:bg-yellow-400 hover:bg-yellow-200 transition-colors"
            style={{textShadow: '2px 2px 0px rgba(0,0,0,0.1)'}}
          >
            <div className="mb-2 font-bold">HOST GAME</div>
            <p className="text-sm">Upload questions & manage</p>
          </button>

          {/* Join Button */}
          <button
            onClick={onJoinClick}
            className="px-8 py-6 bg-cyan-300 text-black border-4 border-cyan-900 font-bold text-lg active:bg-cyan-400 hover:bg-cyan-200 transition-colors"
            style={{textShadow: '2px 2px 0px rgba(0,0,0,0.1)'}}
          >
            <div className="mb-2 font-bold">JOIN GAME</div>
            <p className="text-sm">Enter Game PIN & compete</p>
          </button>
        </div>

        {/* Footer */}
        <div className="text-cyan-900 text-sm font-bold">
          <p>No installation • Works on all devices • Instant play</p>
        </div>
      </div>
    </div>
  );
}
