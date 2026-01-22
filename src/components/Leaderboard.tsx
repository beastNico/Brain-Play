import { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { Trophy, Medal } from 'lucide-react';
import { getAvatarEmoji } from '../utils/helpers';
import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  isGameEnd?: boolean;
}

export function Leaderboard({ isGameEnd = false }: LeaderboardProps) {
  const { leaderboard, calculateLeaderboard, allPlayers } = useGame();

  useEffect(() => {
    calculateLeaderboard();
  }, [allPlayers, calculateLeaderboard]);

  const displayEntries = isGameEnd ? leaderboard : leaderboard.slice(0, 5);
  const hasWinner = isGameEnd && leaderboard.length > 0 && leaderboard.some(entry => entry.score > 0);

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">No players yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          {isGameEnd ? (
            <>
              <Trophy className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Final Leaderboard</h3>
            </>
          ) : (
            <>
              <Medal className="w-6 h-6" />
              <h3 className="text-xl font-bold">Top Players</h3>
            </>
          )}
        </div>
        <p className="text-sm opacity-90">
          {isGameEnd
            ? 'Quiz Complete - Final Rankings'
            : `${leaderboard.length} player${leaderboard.length !== 1 ? 's' : ''} joined`}
        </p>
      </div>

          {/* Winners Celebration (Game End) */}
          {isGameEnd && hasWinner && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 border-b">
              <div className="text-center">
                <p className="text-4xl mb-2">
                  {['🥇', '🥈', '🥉'][Math.min(leaderboard[0].rank - 1, 2)]}
                </p>
                <p className="text-lg font-bold text-gray-800">
                  🎉 {leaderboard[0].nickname} is the Champion! 🎉
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  with {leaderboard[0].score} points
                </p>
              </div>
            </div>
          )}

      {/* Leaderboard Entries */}
      <div className="divide-y">
        {displayEntries.map((entry: LeaderboardEntry, idx: number) => {
          return (
            <div
              key={entry.playerId}
              className={`p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                idx === 0 && isGameEnd ? 'bg-yellow-50' : ''
              }`}
            >
              {/* Rank */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {entry.rank}
              </div>

              {/* Avatar & Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-3xl flex-shrink-0">
                    {getAvatarEmoji(entry.avatar)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 truncate">
                      {entry.nickname}
                    </p>
                    {entry.team && (
                      <p className="text-sm text-gray-600 truncate">
                        {entry.team}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-indigo-600">
                  {entry.score}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {entry.correctAnswers}/{entry.totalQuestions} correct
                  {entry.totalQuestions > 0 && (
                    <span className="ml-1">
                      ({Math.round(entry.accuracy)}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - Show more if needed */}
      {isGameEnd && leaderboard.length > 5 && (
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
          Showing top {displayEntries.length} of {leaderboard.length} players
        </div>
      )}
    </div>
  );
}
