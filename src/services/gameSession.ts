import { supabase } from './supabase';
import type { Quiz, Player, Question, PlayerAnswer } from '../types';

const generateGamePin = (): string => {
  // Generate 6 digit PIN
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const gameSessionService = {
  async createQuiz(questions: Question[], allowLateJoin = true, penalizeWrongAnswers = true): Promise<Quiz> {
    const gamePin = generateGamePin();
    const quizId = crypto.randomUUID();
    
    const quiz: Quiz = {
      id: quizId,
      gamePin,
      adminId: `admin_${Date.now()}`,
      questions,
      status: 'lobby',
      currentQuestionIndex: 0,
      createdAt: new Date().toISOString(),
      allowLateJoin,
      penalizeWrongAnswers,
    };

    // Insert into Supabase
    const { error } = await supabase
      .from('quizzes')
      .insert({
        id: quiz.id,
        game_pin: quiz.gamePin,
        admin_id: quiz.adminId,
        questions: quiz.questions,
        status: quiz.status,
        current_question_index: quiz.currentQuestionIndex,
        allow_late_join: quiz.allowLateJoin,
        penalize_wrong_answers: quiz.penalizeWrongAnswers,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Failed to create quiz');
    }

    return quiz;
  },

  async getQuizByPin(gamePin: string): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('game_pin', gamePin)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      gamePin: data.game_pin,
      adminId: data.admin_id,
      questions: data.questions as Question[],
      status: data.status,
      currentQuestionIndex: data.current_question_index,
      createdAt: data.created_at,
      startedAt: data.started_at,
      endedAt: data.ended_at,
      allowLateJoin: data.allow_late_join,
      penalizeWrongAnswers: data.penalize_wrong_answers,
    };
  },

  async joinGame(gamePin: string, playerData: Omit<Player, 'id' | 'score' | 'answeredQuestions' | 'joinedAt' | 'lastActivityAt'>): Promise<Player> {
    // Check if quiz exists and is joinable
    const quiz = await this.getQuizByPin(gamePin);
    if (!quiz) {
      throw new Error('Game not found');
    }
    if (quiz.status === 'finished') {
      throw new Error('Game has ended');
    }
    if (quiz.status === 'in_progress' && !quiz.allowLateJoin) {
      throw new Error('Game already in progress');
    }

    // Generate UUID for player ID
    const playerId = crypto.randomUUID();
    
    const player: Player = {
      ...playerData,
      id: playerId,
      score: 0,
      answeredQuestions: [],
      joinedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    // Insert into Supabase
    const insertData: Record<string, string | number> = {
      id: player.id,
      game_pin: gamePin,
      nickname: player.nickname,
      avatar: player.avatar,
      score: player.score,
    };
    
    // Only include optional fields if they exist
    if (player.team) insertData.team = player.team;
    if (player.school) insertData.school = player.school;

    const { error } = await supabase
      .from('players')
      .insert(insertData);

    if (error) {
      console.error('Error joining game:', error);
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Nickname already taken');
      }
      throw new Error('Failed to join game');
    }

    return player;
  },

  async getPlayers(gamePin: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('game_pin', gamePin)
      .order('score', { ascending: false });

    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }

    // Fetch answered questions for each player
    const playersWithAnswers = await Promise.all(
      data.map(async (p) => {
        const answers = await this.getPlayerAnswers(p.id);
        return {
          id: p.id,
          gamePin: p.game_pin,
          nickname: p.nickname,
          team: p.team,
          school: p.school,
          avatar: p.avatar,
          score: p.score,
          answeredQuestions: answers,
          joinedAt: p.joined_at,
          lastActivityAt: p.last_activity_at,
        };
      })
    );

    return playersWithAnswers;
  },

  async submitAnswer(
    playerId: string,
    questionId: string,
    answer: 'A' | 'B' | 'C' | 'D',
    timeTakenMs: number,
    correctAnswer: 'A' | 'B' | 'C' | 'D'
  ): Promise<{ isCorrect: boolean; pointsEarned: number }> {
    const isCorrect = answer === correctAnswer;
    
    // Speed bonus: up to 50 points for fast answers (under 5 seconds)
    const speedBonus = timeTakenMs < 5000 ? Math.max(0, 50 - (timeTakenMs / 100)) : 0;
    
    // Base points: 100 for correct, -20 for wrong
    const basePoints = isCorrect ? 100 : -20;
    
    // Total points
    const pointsEarned = isCorrect ? Math.floor(basePoints + speedBonus) : basePoints;

    // Save answer to database
    const { error: answerError } = await supabase
      .from('player_answers')
      .insert({
        player_id: playerId,
        question_id: questionId,
        answer,
        is_correct: isCorrect,
        time_taken_ms: timeTakenMs,
        points_earned: pointsEarned,
      });

    if (answerError) {
      console.error('Error saving answer:', answerError);
    }

    // Update player score
    const { data: player } = await supabase
      .from('players')
      .select('score')
      .eq('id', playerId)
      .single();

    if (player) {
      await supabase
        .from('players')
        .update({ score: player.score + pointsEarned })
        .eq('id', playerId);
    }

    return { isCorrect, pointsEarned };
  },

  async getPlayerAnswers(playerId: string): Promise<PlayerAnswer[]> {
    const { data, error } = await supabase
      .from('player_answers')
      .select('*')
      .eq('player_id', playerId)
      .order('answered_at', { ascending: true });

    if (error) {
      console.error('Error fetching answers:', error);
      return [];
    }

    return data.map(a => ({
      questionId: a.question_id,
      answer: a.answer,
      isCorrect: a.is_correct,
      timeTakenMs: a.time_taken_ms,
      pointsEarned: a.points_earned,
      answeredAt: a.answered_at,
    }));
  },

  async updateQuizStatus(gamePin: string, status: 'lobby' | 'in_progress' | 'finished'): Promise<void> {
    const updates: Record<string, string> = { status };
    
    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'finished') {
      updates.ended_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('quizzes')
      .update(updates)
      .eq('game_pin', gamePin);

    if (error) {
      console.error('Error updating quiz status:', error);
      throw new Error('Failed to update quiz status');
    }
  },

  async updateCurrentQuestion(gamePin: string, questionIndex: number): Promise<void> {
    const { error } = await supabase
      .from('quizzes')
      .update({ 
        current_question_index: questionIndex,
        is_showing_results: false,
      })
      .eq('game_pin', gamePin);

    if (error) {
      console.error('Error updating question:', error);
      throw new Error('Failed to update question');
    }
  },

  async setShowingResults(gamePin: string, showing: boolean): Promise<void> {
    const { error } = await supabase
      .from('quizzes')
      .update({ is_showing_results: showing })
      .eq('game_pin', gamePin);

    if (error) {
      console.error('Error updating results state:', error);
    }
  },

  generateGamePin(): string {
    return generateGamePin();
  },
};
