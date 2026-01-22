import { useState } from 'react';
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to join game. Check the PIN and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-magenta-200 flex items-center justify-center p-4 border-4 border-cyan-900">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => window.location.reload()}
          className="text-cyan-900 hover:text-cyan-800 font-bold mb-6 border-2 border-cyan-900 px-4 py-2 bg-yellow-300"
        >
          BACK
        </button>

        <div className="bg-white border-4 border-cyan-900 p-8">
          <h1 className="text-3xl font-bold text-cyan-900 mb-2 text-center">JOIN GAME</h1>
          <p className="text-cyan-900 mb-8 text-center font-bold">Enter the Game PIN</p>

          <form onSubmit={handleJoinGame} className="space-y-6">
            {/* Game PIN */}
            <div>
              <label className="block text-sm font-bold text-cyan-900 mb-2">
                GAME PIN
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={gamePin}
                onChange={(e) => setLocalGamePin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border-4 border-cyan-900 focus:outline-none text-2xl tracking-widest text-center font-bold"
              />
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-sm font-bold text-cyan-900 mb-2">
                YOUR NICKNAME
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 border-4 border-cyan-900 focus:outline-none"
              />
            </div>

            {/* Team / School */}
            <div>
              <label className="block text-sm font-bold text-cyan-900 mb-2">
                TEAM OR SCHOOL (Optional)
              </label>
              <input
                type="text"
                placeholder="Class A, Team Blue"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-4 py-3 border-4 border-cyan-900 focus:outline-none"
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-bold text-cyan-900 mb-3">
                CHOOSE YOUR AVATAR
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-full aspect-square text-3xl flex items-center justify-center transition-all transform ${
                      selectedAvatar === avatar
                        ? 'border-4 border-cyan-900 bg-yellow-300'
                        : 'border-2 border-cyan-900 bg-white'
                    }`}
                  >
                    {getAvatarEmoji(avatar)}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-yellow-300 border-4 border-red-600">
                <p className="text-sm text-red-900 font-bold">{error}</p>
              </div>
            )}

            {/* Join Button */}
            <button
              type="submit"
              disabled={loading || !gamePin || !nickname}
              className="w-full bg-cyan-300 text-black font-bold py-3 px-6 border-4 border-cyan-900 transition-colors active:bg-cyan-400 hover:bg-cyan-200 disabled:bg-gray-400 disabled:text-gray-600"
            >
              {loading ? 'JOINING...' : 'JOIN GAME'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-4 border-cyan-900 text-center text-cyan-900 text-sm font-bold">
            <p>Ask the quiz host for the Game PIN</p>
          </div>
        </div>
      </div>
    </div>
  );
}
