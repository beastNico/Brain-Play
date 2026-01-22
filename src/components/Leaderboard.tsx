import { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
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
      <div className="bg-white border-4 border-cyan-900 p-8 text-center">
        <p className="text-cyan-900 font-bold">No players yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-cyan-900 overflow-hidden">
      {/* Header */}
      <div className="bg-yellow-300 border-b-4 border-cyan-900 text-cyan-900 p-6">
        <h3 className="text-2xl font-bold">
          {isGameEnd ? 'FINAL LEADERBOARD' : 'TOP PLAYERS'}
        </h3>
        <p className="text-sm font-bold mt-1">
          {isGameEnd
            ? 'Quiz Complete'
            : `${leaderboard.length} player${leaderboard.length !== 1 ? 's' : ''} joined`}
        </p>
      </div>

      {/* Winners Celebration (Game End) */}
      {isGameEnd && hasWinner && (
        <div className="bg-yellow-200 border-b-4 border-cyan-900 p-6">
          <div className="text-center">
            <p className="text-lg font-bold text-cyan-900">
              {leaderboard[0].nickname} IS THE CHAMPION!
            </p>
            <p className="text-sm text-cyan-900 mt-1 font-bold">
              {leaderboard[0].score} points
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard Entries */}
      <div className="divide-y-4 divide-cyan-900">
        {displayEntries.map((entry: LeaderboardEntry, idx: number) => {
          return (
            <div
              key={entry.playerId}
              className={`p-6 flex items-center gap-4 ${
                idx === 0 && isGameEnd ? 'bg-yellow-50' : 'bg-white'
              }`}
            >
              {/* Rank */}
              <div className="w-12 h-12 border-4 border-cyan-900 bg-yellow-300 text-cyan-900 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {entry.rank}
              </div>

              {/* Avatar & Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-3xl flex-shrink-0">
                    {getAvatarEmoji(entry.avatar)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-cyan-900 truncate">
                      {entry.nickname}
                    </p>
                    {entry.team && (
                      <p className="text-sm text-cyan-900 truncate">
                        {entry.team}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-cyan-900">
                  {entry.score}
                </p>
                <p className="text-xs text-cyan-900 mt-1 font-bold">
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
        <div className="bg-gray-100 border-t-4 border-cyan-900 p-4 text-center text-sm text-cyan-900 font-bold">
          Showing top {displayEntries.length} of {leaderboard.length} players
        </div>
      )}
    </div>
  );
}
