import { useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Quiz, Player, LeaderboardEntry, PlayerAnswer } from '../types';
import { GameContext } from './game';
import { supabase } from '../services/supabase';
import { gameSessionService } from '../services/gameSession';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [gamePin, setGamePin] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(30);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const updateQuizStatus = useCallback((status: 'lobby' | 'in_progress' | 'finished') => {
    if (currentQuiz) {
      setCurrentQuiz({
        ...currentQuiz,
        status,
        startedAt: status === 'in_progress' ? new Date().toISOString() : currentQuiz.startedAt,
        endedAt: status === 'finished' ? new Date().toISOString() : currentQuiz.endedAt,
      });
    }
  }, [currentQuiz]);

  const updateCurrentQuestion = useCallback((index: number) => {
    if (currentQuiz && index >= 0 && index < currentQuiz.questions.length) {
      setCurrentQuiz({
        ...currentQuiz,
        currentQuestionIndex: index,
      });
    }
  }, [currentQuiz]);

  const addPlayer = useCallback((player: Player) => {
    setAllPlayers(prev => [...prev, player]);
  }, []);

  const updatePlayerScore = useCallback((playerId: string, points: number) => {
    setAllPlayers(prev =>
      prev.map(p =>
        p.id === playerId ? { ...p, score: p.score + points } : p
      )
    );
  }, []);

  const addPlayerAnswer = useCallback((playerId: string, answer: PlayerAnswer) => {
    setAllPlayers(prev =>
      prev.map(p =>
        p.id === playerId
          ? { ...p, answeredQuestions: [...p.answeredQuestions, answer] }
          : p
      )
    );
  }, []);

  const calculateLeaderboard = useCallback(() => {
    const entries = allPlayers.map((player) => {
      const correctAnswers = player.answeredQuestions.filter(a => a.isCorrect).length;
      const totalQuestions = player.answeredQuestions.length;

      return {
        playerId: player.id,
        nickname: player.nickname,
        team: player.team,
        avatar: player.avatar,
        score: player.score,
        correctAnswers,
        totalQuestions,
        accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
        rank: 0,
      };
    }).sort((a, b) => b.score - a.score);

    // Assign ranks
    const rankedEntries = entries.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));

    setLeaderboard(rankedEntries);
  }, [allPlayers]);

  const resetGame = useCallback(() => {
    setCurrentQuiz(null);
    setCurrentPlayer(null);
    setAllPlayers([]);
    setGamePin(null);
    setIsAdmin(false);
    setLeaderboard([]);
    setQuestionTimeRemaining(30);
    
    // Unsubscribe from realtime
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    if (!gamePin) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new channel for this game
    const channel = supabase.channel(`game:${gamePin}`);

    // Subscribe to quiz changes
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quizzes',
          filter: `game_pin=eq.${gamePin}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const data = payload.new;
            setCurrentQuiz({
              id: data.id,
              gamePin: data.game_pin,
              adminId: data.admin_id,
              questions: data.questions,
              status: data.status,
              currentQuestionIndex: data.current_question_index,
              createdAt: data.created_at,
              startedAt: data.started_at,
              endedAt: data.ended_at,
              allowLateJoin: data.allow_late_join,
              penalizeWrongAnswers: data.penalize_wrong_answers,
            });

            // Handle results state synchronization
            if (data.is_showing_results !== undefined) {
              setQuestionTimeRemaining(data.is_showing_results ? 0 : 30);
            }
          }
        }
      )
      // Subscribe to players changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_pin=eq.${gamePin}`,
        },
        async () => {
          // Fetch all players when there's a change
          const players = await gameSessionService.getPlayers(gamePin);
          setAllPlayers(players);
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Initial fetch of players
    gameSessionService.getPlayers(gamePin).then(setAllPlayers);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [gamePin]);

  return (
    <GameContext.Provider
      value={{
        currentQuiz,
        setCurrentQuiz,
        updateQuizStatus,
        updateCurrentQuestion,
        currentPlayer,
        setCurrentPlayer,
        allPlayers,
        setAllPlayers,
        addPlayer,
        updatePlayerScore,
        addPlayerAnswer,
        gamePin,
        setGamePin,
        isAdmin,
        setIsAdmin,
        leaderboard,
        calculateLeaderboard,
        questionTimeRemaining,
        setQuestionTimeRemaining,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
