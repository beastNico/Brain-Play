import { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { gameSessionService } from '../services/gameSession';
import { getAvatarEmoji } from '../utils/helpers';

interface JoinPageProps {
  onPlayerJoined: () => void;
}

const AVATARS = ['rocket', 'star', 'fire', 'lightning', 'brain', 'crown', 'diamond', 'heart', 'smile', 'cool', 'happy', 'party'];

export function JoinPage({ onPlayerJoined }: JoinPageProps) {
  const { setGamePin, setCurrentPlayer } = useGame();
  const [gamePin, setLocalGamePin] = useState('');
  const [nickname, setNickname] = useState('');
  const [team, setTeam] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('rocket');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!gamePin.trim()) {
      setError('Please enter a Game PIN');
      return;
    }
    if (!nickname.trim()) {
      setError('Please enter your nickname');
      return;
    }
    if (gamePin.length !== 6 || !/^\d+$/.test(gamePin)) {
      setError('Game PIN must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const player = await gameSessionService.joinGame(gamePin, {
        gamePin,
        nickname: nickname.trim(),
        team: team.trim() || undefined,
        avatar: selectedAvatar,
      });

      setGamePin(gamePin);
      setCurrentPlayer(player);
      onPlayerJoined();
    } catch (error: any) {
      setError(error.message || 'Failed to join game. Check the PIN and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚀 Join Game</h1>
          <p className="text-gray-600 mb-8">Enter the Game PIN to start playing</p>

          <form onSubmit={handleJoinGame} className="space-y-6">
            {/* Game PIN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Game PIN
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={gamePin}
                onChange={(e) => setLocalGamePin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-2xl tracking-widest text-center font-bold"
              />
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Nickname *
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Team / School */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team or School (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Class A, Team Blue"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Your Avatar
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-full aspect-square rounded-lg text-3xl flex items-center justify-center transition-all transform hover:scale-110 ${
                      selectedAvatar === avatar
                        ? 'ring-2 ring-purple-600 bg-purple-50'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {getAvatarEmoji(avatar)}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Join Button */}
            <button
              type="submit"
              disabled={loading || !gamePin || !nickname}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Joining...' : 'Join Game'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-gray-600 text-sm">
            <p>💡 Ask the quiz host for the Game PIN</p>
          </div>
        </div>
      </div>
    </div>
  );
}
