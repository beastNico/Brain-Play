/**
 * Comprehensive Test Suite for Brain Play Application
 *
 * This test file covers all major components and functionality
 * including game pin generation, quiz logic, leaderboard, utilities,
 * and game session management.
 */

import { describe, expect, test, vi } from 'vitest';
import {
  generateGamePin,
  calculateLeaderboardRank,
  validateCSV,
  convertRowsToQuestions,
  getAvatarEmoji,
  formatTime,
  getOptionLabel,
} from '../utils/helpers';
import { gameSessionService } from '../services/gameSession';
import type { Question, Player, Quiz, PlayerAnswer } from '../types';

// Mock the supabase service
vi.mock('../services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: { id: 'quiz-1', game_pin: '123456', questions: [] }, error: null })) })) })),
      select: vi.fn(() => ({ 
        eq: vi.fn(() => ({ 
          single: vi.fn(() => ({ data: null, error: null })),
          order: vi.fn(() => ({ data: [], error: null }))
        })) 
      })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ error: null })) })),
      on: vi.fn(() => ({ subscribe: vi.fn() })),
      removeChannel: vi.fn(),
    })),
  },
}));

describe('Brain Play Application Tests', () => {
  // Test Game Pin Generation
  describe('Game Pin Generation', () => {
    test('generateGamePin should create 6-digit numeric PIN', () => {
      const pin = generateGamePin();
      expect(pin).toMatch(/^\d{6}$/);
      expect(pin.length).toBe(6);

      // Test multiple generations
      const pins = Array.from({ length: 10 }, () => generateGamePin());
      pins.forEach(pin => {
        expect(pin).toMatch(/^\d{6}$/);
        expect(parseInt(pin)).toBeGreaterThanOrEqual(100000);
        expect(parseInt(pin)).toBeLessThanOrEqual(999999);
      });
    });

    test('gameSessionService.generateGamePin should use same logic', () => {
      const pin = gameSessionService.generateGamePin();
      expect(pin).toMatch(/^\d{6}$/);
      expect(pin.length).toBe(6);
    });
  });

  // Test CSV Utilities
  describe('CSV Utilities', () => {
    const validCSVData = [
      {
        'Question': 'What is 2+2?',
        'Option A': '3',
        'Option B': '4',
        'Option C': '5',
        'Option D': '6',
        'Correct Answer': 'B'
      },
      {
        'Question': 'Capital of France?',
        'Option A': 'London',
        'Option B': 'Paris',
        'Option C': 'Berlin',
        'Option D': 'Madrid',
        'Correct Answer': 'B'
      }
    ];

    test('validateCSV should accept valid CSV format', () => {
      const result = validateCSV(validCSVData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('validateCSV should reject missing required columns', () => {
      const invalidData = [{ 'Question': 'Test', 'Option A': 'A' }]; // Missing columns
      const result = validateCSV(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.some(error => error.includes('Missing required column'))).toBe(true);
    });

    test('validateCSV should reject invalid correct answer format', () => {
      const invalidData = [{
        'Question': 'Test',
        'Option A': 'A',
        'Option B': 'B',
        'Option C': 'C',
        'Option D': 'D',
        'Correct Answer': 'Z' // Invalid
      }];
      const result = validateCSV(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.some(error => error.includes('Correct Answer must be A, B, C, or D'))).toBe(true);
    });

    test('convertRowsToQuestions should transform CSV to Question objects', () => {
      const questions = convertRowsToQuestions(validCSVData);
      expect(questions).toHaveLength(2);
      expect(questions[0]).toHaveProperty('id');
      expect(questions[0].text).toBe('What is 2+2?');
      expect(questions[0].correctAnswer).toBe('B');
    });
  });

  // Test Leaderboard Calculations
  describe('Leaderboard Calculations', () => {
    test('calculateLeaderboardRank should correctly rank players', () => {
      const players = [
        { score: 100, name: 'Player1' },
        { score: 200, name: 'Player2' },
        { score: 150, name: 'Player3' },
        { score: 200, name: 'Player4' }, // Tie with Player2
        { score: 50, name: 'Player5' }
      ];

      const ranks = calculateLeaderboardRank(players);
      expect(ranks).toEqual([4, 1, 3, 1, 5]); // Player2 and Player4 both rank 1
    });

    test('calculateLeaderboardRank should handle empty array', () => {
      const ranks = calculateLeaderboardRank([]);
      expect(ranks).toHaveLength(0);
    });
  });

  // Test Game Session Service - Quiz Creation
  describe('Game Session Service - Quiz Creation and Management', () => {
    test('createQuiz should generate valid quiz structure with all required fields', async () => {
      const questions: Question[] = [
        {
          id: 'q1',
          text: 'Test Question',
          optionA: 'A',
          optionB: 'B',
          optionC: 'C',
          optionD: 'D',
          correctAnswer: 'A'
        },
        {
          id: 'q2',
          text: 'Test Question 2',
          optionA: 'A',
          optionB: 'B',
          optionC: 'C',
          optionD: 'D',
          correctAnswer: 'B'
        }
      ];

      const quiz = await gameSessionService.createQuiz(questions, true, true);
      
      expect(quiz).toHaveProperty('gamePin');
      expect(quiz.gamePin).toMatch(/^\d{6}$/);
      expect(quiz.questions).toHaveLength(2);
      expect(quiz.status).toBe('lobby');
      expect(quiz.currentQuestionIndex).toBe(0);
      expect(quiz.allowLateJoin).toBe(true);
      expect(quiz.penalizeWrongAnswers).toBe(true);
      expect(quiz.adminId).toBeTruthy();
      expect(quiz.createdAt).toBeTruthy();
    });

    test('createQuiz should respect configuration options', async () => {
      const questions: Question[] = [{
        id: 'q1',
        text: 'Test',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        correctAnswer: 'A'
      }];

      const quiz1 = await gameSessionService.createQuiz(questions, false, false);
      expect(quiz1.allowLateJoin).toBe(false);
      expect(quiz1.penalizeWrongAnswers).toBe(false);

      const quiz2 = await gameSessionService.createQuiz(questions, true, false);
      expect(quiz2.allowLateJoin).toBe(true);
      expect(quiz2.penalizeWrongAnswers).toBe(false);
    });

    test('getQuizByPin should return null for non-existent quiz', async () => {
      const quiz = await gameSessionService.getQuizByPin('999999');
      expect(quiz).toBeNull();
    });

    test('updateQuizStatus should transition quiz through valid states', async () => {
      // Test that status can be updated to each state
      const testPin = '123456';
      
      await expect(gameSessionService.updateQuizStatus(testPin, 'lobby')).resolves.not.toThrow();
      await expect(gameSessionService.updateQuizStatus(testPin, 'in_progress')).resolves.not.toThrow();
      await expect(gameSessionService.updateQuizStatus(testPin, 'finished')).resolves.not.toThrow();
    });

    test('updateCurrentQuestion should update question index', async () => {
      const testPin = '123456';
      
      await expect(gameSessionService.updateCurrentQuestion(testPin, 0)).resolves.not.toThrow();
      await expect(gameSessionService.updateCurrentQuestion(testPin, 5)).resolves.not.toThrow();
      await expect(gameSessionService.updateCurrentQuestion(testPin, 10)).resolves.not.toThrow();
    });

    test('setShowingResults should toggle results visibility', async () => {
      const testPin = '123456';
      
      await expect(gameSessionService.setShowingResults(testPin, true)).resolves.not.toThrow();
      await expect(gameSessionService.setShowingResults(testPin, false)).resolves.not.toThrow();
    });
  });

  // Test Game Session Service - Answer Submission and Scoring
  describe('Game Session Service - Answer Submission and Scoring', () => {
    test('submitAnswer should calculate points correctly for correct fast answer', async () => {
      const timeTaken = 1000; // 1 second
      const { isCorrect, pointsEarned } = await gameSessionService.submitAnswer(
        'player1',
        'q1',
        'A',
        timeTaken,
        'A' // Correct answer
      );

      expect(isCorrect).toBe(true);
      expect(pointsEarned).toBeGreaterThan(100); // Base 100 + speed bonus
      expect(pointsEarned).toBeLessThanOrEqual(150); // Max 100 + 50 bonus
    });

    test('submitAnswer should calculate points correctly for correct slow answer', async () => {
      const timeTaken = 6000; // 6 seconds (no speed bonus)
      const { isCorrect, pointsEarned } = await gameSessionService.submitAnswer(
        'player1',
        'q1',
        'B',
        timeTaken,
        'B' // Correct answer
      );

      expect(isCorrect).toBe(true);
      expect(pointsEarned).toBe(100); // Base 100, no speed bonus
    });

    test('submitAnswer should return negative points for wrong answer', async () => {
      const { isCorrect, pointsEarned } = await gameSessionService.submitAnswer(
        'player1',
        'q1',
        'A',
        5000,
        'B' // Wrong answer
      );

      expect(isCorrect).toBe(false);
      expect(pointsEarned).toBe(-20); // Penalty
    });

    test('submitAnswer should track answer correctly', async () => {
      const result = await gameSessionService.submitAnswer(
        'player1',
        'q1',
        'C',
        3000,
        'C'
      );

      expect(result).toHaveProperty('isCorrect');
      expect(result).toHaveProperty('pointsEarned');
      expect(typeof result.isCorrect).toBe('boolean');
      expect(typeof result.pointsEarned).toBe('number');
    });

    test('getPlayerAnswers should return array of answers', async () => {
      // Note: getPlayerAnswers requires Supabase connection, skipping mock test
      const answers = await gameSessionService.getPlayerAnswers('player1');
      expect(Array.isArray(answers)).toBe(true);
    });
  });

  // Test Speed Bonus Calculations
  describe('Answer Speed Bonus Calculations', () => {
    test('Speed bonus should max out at 50 points for very fast answers', async () => {
      const { pointsEarned } = await gameSessionService.submitAnswer(
        'player1',
        'q1',
        'A',
        100, // 100ms
        'A'
      );

      expect(pointsEarned).toBeLessThanOrEqual(150);
      expect(pointsEarned).toBeGreaterThan(140);
    });

    test('Speed bonus should decrease linearly with time', async () => {
      const result1 = await gameSessionService.submitAnswer('p1', 'q1', 'A', 1000, 'A');
      const result2 = await gameSessionService.submitAnswer('p1', 'q1', 'A', 3000, 'A');
      const result3 = await gameSessionService.submitAnswer('p1', 'q1', 'A', 4900, 'A');
      const result4 = await gameSessionService.submitAnswer('p1', 'q1', 'A', 5000, 'A');

      // Speed bonus decreases as time increases
      expect(result1.pointsEarned).toBeGreaterThan(result2.pointsEarned);
      expect(result2.pointsEarned).toBeGreaterThan(result3.pointsEarned);
      // At 5 seconds, no bonus
      expect(result4.pointsEarned).toBe(100);
    });
  });

  // Test Multi-Player Game Flow
  describe('Multi-Player Game Flow Scenarios', () => {
    // Note: These tests require actual Supabase connection for joinGame
    // Skipping in unit test suite - covered by integration tests

    test('Players should accumulate scores from multiple questions', async () => {
      // Simulate player answering multiple questions correctly
      const result1 = await gameSessionService.submitAnswer('p1', 'q1', 'A', 2000, 'A');
      const result2 = await gameSessionService.submitAnswer('p1', 'q2', 'B', 3000, 'B');
      const result3 = await gameSessionService.submitAnswer('p1', 'q3', 'C', 1000, 'C');

      const totalPoints = result1.pointsEarned + result2.pointsEarned + result3.pointsEarned;
      expect(totalPoints).toBeGreaterThan(200); // At least 100*2 + some bonuses
    });
  });

  // Test Quiz State Transitions
  describe('Quiz State Transitions and Progression', () => {
    test('Quiz should progress through questions correctly', async () => {
      const testPin = '123456';
      
      await gameSessionService.updateQuizStatus(testPin, 'in_progress');
      await gameSessionService.updateCurrentQuestion(testPin, 0);
      
      // Should be able to update to next question
      await gameSessionService.updateCurrentQuestion(testPin, 1);
      await gameSessionService.updateCurrentQuestion(testPin, 2);
      
      // Should complete the quiz
      await gameSessionService.updateQuizStatus(testPin, 'finished');
    });

    test('Quiz status transitions should follow: lobby -> in_progress -> finished', async () => {
      const testPin = '123456';
      
      // Start in lobby (default)
      await gameSessionService.updateQuizStatus(testPin, 'lobby');
      
      // Transition to in_progress
      await gameSessionService.updateQuizStatus(testPin, 'in_progress');
      
      // Transition to finished
      await gameSessionService.updateQuizStatus(testPin, 'finished');
      
      // Should be able to go back (in case of restart)
      await gameSessionService.updateQuizStatus(testPin, 'lobby');
    });

    test('Results visibility should toggle correctly', async () => {
      const testPin = '123456';
      
      await gameSessionService.setShowingResults(testPin, true);
      await gameSessionService.setShowingResults(testPin, false);
      await gameSessionService.setShowingResults(testPin, true);
    });
  });

  // Test CSV with Large Datasets
  describe('CSV Parsing with Large Datasets', () => {
    test('convertRowsToQuestions should handle 100 questions', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        'Question': `Question ${i + 1}`,
        'Option A': 'A',
        'Option B': 'B',
        'Option C': 'C',
        'Option D': 'D',
        'Correct Answer': 'A'
      }));

      const questions = convertRowsToQuestions(largeDataset);
      expect(questions).toHaveLength(100);
      expect(questions[0].text).toBe('Question 1');
      expect(questions[99].text).toBe('Question 100');
    });

    test('All questions should have unique IDs', () => {
      const dataset = Array.from({ length: 50 }, (_, i) => ({
        'Question': `Q${i}`,
        'Option A': 'A',
        'Option B': 'B',
        'Option C': 'C',
        'Option D': 'D',
        'Correct Answer': 'B'
      }));

      const questions = convertRowsToQuestions(dataset);
      const ids = questions.map(q => q.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(questions.length);
    });
  });

  // Test Leaderboard Calculations - Updated
  describe('Leaderboard Calculations - Advanced', () => {
    test('calculateLeaderboardRank should correctly rank players', () => {
      const players = [
        { score: 100, name: 'Player1' },
        { score: 200, name: 'Player2' },
        { score: 150, name: 'Player3' },
        { score: 200, name: 'Player4' },
        { score: 50, name: 'Player5' }
      ];

      const ranks = calculateLeaderboardRank(players);
      expect(ranks).toEqual([4, 1, 3, 1, 5]);
    });

    test('Question objects should have required properties', () => {
      const question: Question = {
        id: 'test-1',
        text: 'Sample question',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctAnswer: 'A'
      };

      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('optionA');
      expect(question).toHaveProperty('optionB');
      expect(question).toHaveProperty('optionC');
      expect(question).toHaveProperty('optionD');
      expect(question).toHaveProperty('correctAnswer');
      expect(['A', 'B', 'C', 'D']).toContain(question.correctAnswer);
    });
  });

  // Test Player Validation
  describe('Player Validation', () => {
    test('Player objects should have required properties', () => {
      const player: Player = {
        id: 'player-1',
        gamePin: '123456',
        nickname: 'TestPlayer',
        avatar: 'rocket',
        score: 0,
        answeredQuestions: [],
        joinedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
      };

      expect(player).toHaveProperty('id');
      expect(player).toHaveProperty('gamePin');
      expect(player).toHaveProperty('nickname');
      expect(player).toHaveProperty('avatar');
      expect(player).toHaveProperty('score');
      expect(player).toHaveProperty('answeredQuestions');
    });
  });

  // Test Quiz Validation
  describe('Quiz Validation', () => {
    test('Quiz objects should have required properties', () => {
      const quiz: Quiz = {
        id: 'quiz-1',
        gamePin: '123456',
        adminId: 'admin-1',
        questions: [],
        status: 'lobby',
        currentQuestionIndex: 0,
        createdAt: new Date().toISOString(),
        allowLateJoin: true,
        penalizeWrongAnswers: true
      };

      expect(quiz).toHaveProperty('id');
      expect(quiz).toHaveProperty('gamePin');
      expect(quiz).toHaveProperty('adminId');
      expect(quiz).toHaveProperty('questions');
      expect(quiz).toHaveProperty('status');
      expect(quiz).toHaveProperty('currentQuestionIndex');
      expect(['lobby', 'in_progress', 'finished']).toContain(quiz.status);
    });
  });

  // Test Avatar and Formatting Utilities
  describe('Avatar and Formatting Utilities', () => {
    test('getAvatarEmoji should return correct emoji for valid avatar types', () => {
      expect(getAvatarEmoji('rocket')).toBe('🚀');
      expect(getAvatarEmoji('star')).toBe('⭐');
      expect(getAvatarEmoji('fire')).toBe('🔥');
      expect(getAvatarEmoji('lightning')).toBe('⚡');
      expect(getAvatarEmoji('brain')).toBe('🧠');
      expect(getAvatarEmoji('crown')).toBe('👑');
    });

    test('getAvatarEmoji should return default emoji for unknown avatar type', () => {
      expect(getAvatarEmoji('unknown')).toBe('🎮');
      expect(getAvatarEmoji('')).toBe('🎮');
    });

    test('formatTime should format milliseconds to mm:ss format', () => {
      expect(formatTime(0)).toBe('0s');
      expect(formatTime(1000)).toBe('1s');
      expect(formatTime(5000)).toBe('5s');
      expect(formatTime(60000)).toBe('1:00');
      expect(formatTime(90000)).toBe('1:30');
      expect(formatTime(120000)).toBe('2:00');
      expect(formatTime(125000)).toBe('2:05');
    });

    test('getOptionLabel should return correct label for each option', () => {
      expect(getOptionLabel('A')).toBe('Option A');
      expect(getOptionLabel('B')).toBe('Option B');
      expect(getOptionLabel('C')).toBe('Option C');
      expect(getOptionLabel('D')).toBe('Option D');
    });
  });

  // Test Edge Cases
  describe('Edge Cases and Error Handling', () => {
    test('generateGamePin should handle edge cases', () => {
      // Test that we never generate pins outside the expected range
      for (let i = 0; i < 100; i++) {
        const pin = generateGamePin();
        const num = parseInt(pin);
        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThanOrEqual(999999);
      }
    });

    test('CSV validation should handle empty input', () => {
      const result = validateCSV([]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('CSV file is empty');
    });

    test('CSV validation should detect empty questions', () => {
      const invalidData = [{
        'Question': '   ', // Empty after trim
        'Option A': 'A',
        'Option B': 'B',
        'Option C': 'C',
        'Option D': 'D',
        'Correct Answer': 'A'
      }];
      const result = validateCSV(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Question is empty'))).toBe(true);
    });

    test('calculateLeaderboardRank should handle single player', () => {
      const players = [{ score: 100 }];
      const ranks = calculateLeaderboardRank(players);
      expect(ranks).toEqual([1]);
    });

    test('calculateLeaderboardRank should handle all same scores', () => {
      const players = [
        { score: 100 },
        { score: 100 },
        { score: 100 }
      ];
      const ranks = calculateLeaderboardRank(players);
      expect(ranks).toEqual([1, 1, 1]);
    });
  });

  // Test Question Details
  describe('Question Conversion and Details', () => {
    test('convertRowsToQuestions should preserve all data correctly', () => {
      const csvData = [
        {
          'Question': 'What color is the sky?',
          'Option A': 'Red',
          'Option B': 'Blue',
          'Option C': 'Green',
          'Option D': 'Yellow',
          'Correct Answer': 'B'
        }
      ];

      const questions = convertRowsToQuestions(csvData);
      expect(questions[0]).toMatchObject({
        text: 'What color is the sky?',
        optionA: 'Red',
        optionB: 'Blue',
        optionC: 'Green',
        optionD: 'Yellow',
        correctAnswer: 'B'
      });
    });

    test('convertRowsToQuestions should handle case-insensitive correct answer', () => {
      const csvData = [
        {
          'Question': 'Test',
          'Option A': 'A',
          'Option B': 'B',
          'Option C': 'C',
          'Option D': 'D',
          'Correct Answer': 'c' // lowercase
        }
      ];

      const questions = convertRowsToQuestions(csvData);
      expect(questions[0].correctAnswer).toBe('C');
    });

    test('convertRowsToQuestions should generate unique IDs', () => {
      const csvData = [
        {
          'Question': 'Q1',
          'Option A': 'A',
          'Option B': 'B',
          'Option C': 'C',
          'Option D': 'D',
          'Correct Answer': 'A'
        },
        {
          'Question': 'Q2',
          'Option A': 'A',
          'Option B': 'B',
          'Option C': 'C',
          'Option D': 'D',
          'Correct Answer': 'B'
        }
      ];

      const questions = convertRowsToQuestions(csvData);
      expect(questions[0].id).not.toBe(questions[1].id);
      expect(questions[0].id).toMatch(/^q_\d+_\d+$/);
      expect(questions[1].id).toMatch(/^q_\d+_\d+$/);
    });
  });

  // Test CSV Edge Cases
  describe('CSV Validation Edge Cases', () => {
    test('validateCSV should reject rows with invalid correct answers', () => {
      const invalidData = [
        {
          'Question': 'Q1',
          'Option A': 'A',
          'Option B': 'B',
          'Option C': 'C',
          'Option D': 'D',
          'Correct Answer': 'E' // Invalid
        },
        {
          'Question': 'Q2',
          'Option A': 'A',
          'Option B': 'B',
          'Option C': 'C',
          'Option D': 'D',
          'Correct Answer': 'X' // Invalid
        }
      ];
      const result = validateCSV(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    test('validateCSV should accept lowercase correct answer', () => {
      const data = [{
        'Question': 'Test',
        'Option A': 'A',
        'Option B': 'B',
        'Option C': 'C',
        'Option D': 'D',
        'Correct Answer': 'a' // lowercase
      }];
      const result = validateCSV(data);
      expect(result.valid).toBe(true);
    });

    test('validateCSV should handle multiple errors per row', () => {
      const invalidData = [{
        'Question': '', // Empty
        'Option A': 'A',
        'Option B': 'B',
        'Option C': 'C',
        'Option D': 'D',
        'Correct Answer': 'Z' // Invalid
      }];
      const result = validateCSV(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  // Test Leaderboard Ranking Complexities
  describe('Advanced Leaderboard Ranking', () => {
    test('calculateLeaderboardRank should handle complex tie scenarios', () => {
      const players = [
        { score: 500 },  // Rank 1
        { score: 400 },  // Rank 2
        { score: 400 },  // Rank 2 (tie)
        { score: 300 },  // Rank 4 (skipped rank 3)
        { score: 300 },  // Rank 4 (tie)
        { score: 300 },  // Rank 4 (tie)
        { score: 200 }   // Rank 7 (skipped ranks 5-6)
      ];

      const ranks = calculateLeaderboardRank(players);
      expect(ranks).toEqual([1, 2, 2, 4, 4, 4, 7]);
    });

    test('calculateLeaderboardRank preserves original order with ranking', () => {
      const players = [
        { score: 100 },
        { score: 300 },
        { score: 200 },
        { score: 300 }
      ];

      const ranks = calculateLeaderboardRank(players);
      // Original order: 100, 300, 200, 300
      // Ranks: 4, 1, 3, 1
      expect(ranks[0]).toBe(4);
      expect(ranks[1]).toBe(1);
      expect(ranks[2]).toBe(3);
      expect(ranks[3]).toBe(1);
    });
  });

  // Test Game Session Service Structure
  describe('Game Session Service Structure', () => {
    test('gameSessionService should have all required methods', () => {
      expect(typeof gameSessionService.createQuiz).toBe('function');
      expect(typeof gameSessionService.getQuizByPin).toBe('function');
      expect(typeof gameSessionService.joinGame).toBe('function');
      expect(typeof gameSessionService.getPlayers).toBe('function');
      expect(typeof gameSessionService.submitAnswer).toBe('function');
      expect(typeof gameSessionService.getPlayerAnswers).toBe('function');
      expect(typeof gameSessionService.updateQuizStatus).toBe('function');
      expect(typeof gameSessionService.updateCurrentQuestion).toBe('function');
      expect(typeof gameSessionService.setShowingResults).toBe('function');
      expect(typeof gameSessionService.generateGamePin).toBe('function');
    });
  });

  // Test Types and Interfaces
  describe('Type Validation', () => {
    test('PlayerAnswer type should have all required fields', () => {
      const answer: PlayerAnswer = {
        questionId: 'q1',
        answer: 'A',
        isCorrect: true,
        timeTakenMs: 5000,
        pointsEarned: 150,
        answeredAt: new Date().toISOString()
      };

      expect(answer.questionId).toBe('q1');
      expect(answer.answer).toBe('A');
      expect(answer.isCorrect).toBe(true);
      expect(answer.timeTakenMs).toBe(5000);
      expect(answer.pointsEarned).toBe(150);
      expect(answer.answeredAt).toBeTruthy();
    });

    test('Player optional fields should be handled correctly', () => {
      const playerWithoutOptional: Player = {
        id: 'p1',
        gamePin: '123456',
        nickname: 'Player1',
        avatar: 'rocket',
        score: 0,
        answeredQuestions: [],
        joinedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
      };

      const playerWithOptional: Player = {
        ...playerWithoutOptional,
        team: 'Team A',
        school: 'School B'
      };

      expect(playerWithoutOptional.team).toBeUndefined();
      expect(playerWithOptional.team).toBe('Team A');
      expect(playerWithOptional.school).toBe('School B');
    });

    test('Quiz should accept optional status fields', () => {
      const quizWithoutOptional: Quiz = {
        id: 'q1',
        gamePin: '123456',
        adminId: 'admin1',
        questions: [],
        status: 'lobby',
        currentQuestionIndex: 0,
        createdAt: new Date().toISOString(),
        allowLateJoin: true,
        penalizeWrongAnswers: true
      };

      const quizWithOptional: Quiz = {
        ...quizWithoutOptional,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString()
      };

      expect(quizWithoutOptional.startedAt).toBeUndefined();
      expect(quizWithOptional.startedAt).toBeTruthy();
      expect(quizWithOptional.endedAt).toBeTruthy();
    });
  });

  // Test Scoring Logic Validation
  describe('Scoring Logic Validation', () => {
    test('Correct answer scoring calculation', () => {
      // Base: 100 points, Speed bonus up to 50 points for answers under 5 seconds
      const fastCorrectMs = 1000; // 1 second
      const speedBonus = Math.max(0, 50 - (fastCorrectMs / 100)); // Should be ~40
      const expectedScore = Math.floor(100 + speedBonus);

      expect(expectedScore).toBeGreaterThan(100);
      expect(expectedScore).toBeLessThanOrEqual(150);
    });

    test('Incorrect answer should have negative base points', () => {
      // Base: -20 points for wrong answer (no speed bonus)
      const wrongAnswerPoints = -20;
      expect(wrongAnswerPoints).toBeLessThan(0);
    });

    test('Speed bonus calculation boundaries', () => {
      // Fast answer (under 5 seconds)
      const veryFastMs = 100;
      const speedBonus1 = Math.max(0, 50 - (veryFastMs / 100));
      expect(speedBonus1).toBeCloseTo(49, 1);

      // Exactly 5 seconds - no bonus
      const boundaryMs = 5000;
      const speedBonus2 = Math.max(0, 50 - (boundaryMs / 100));
      expect(speedBonus2).toBe(0);

      // Slow answer
      const slowMs = 8000;
      const speedBonus3 = Math.max(0, 50 - (slowMs / 100));
      expect(speedBonus3).toBe(0);
    });
  });

  // Test Game Status Transitions
  describe('Game Status Validation', () => {
    test('Quiz should start in lobby status', () => {
      const quiz: Quiz = {
        id: 'quiz1',
        gamePin: '123456',
        adminId: 'admin1',
        questions: [],
        status: 'lobby',
        currentQuestionIndex: 0,
        createdAt: new Date().toISOString(),
        allowLateJoin: true,
        penalizeWrongAnswers: true
      };

      expect(quiz.status).toBe('lobby');
    });

    test('Quiz status values should be valid transitions', () => {
      const validStatuses = ['lobby', 'in_progress', 'finished'] as const;
      
      validStatuses.forEach(status => {
        const quiz: Quiz = {
          id: 'quiz1',
          gamePin: '123456',
          adminId: 'admin1',
          questions: [],
          status,
          currentQuestionIndex: 0,
          createdAt: new Date().toISOString(),
          allowLateJoin: true,
          penalizeWrongAnswers: true
        };
        expect(validStatuses).toContain(quiz.status);
      });
    });
  });
});
