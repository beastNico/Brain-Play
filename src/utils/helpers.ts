import type { Question } from '../types';

export function generateGamePin(): string {
  return Math.floor(Math.random() * 900000 + 100000).toString();
}

export function calculateLeaderboardRank(players: Array<{ score: number }>): number[] {
  const sorted = [...players]
    .map((p, idx) => ({ score: p.score, idx }))
    .sort((a, b) => b.score - a.score);

  const ranks = new Array(players.length);
  let currentRank = 1;
  let lastScore = sorted[0]?.score;

  sorted.forEach((item, index) => {
    if (item.score !== lastScore) {
      currentRank = index + 1;
      lastScore = item.score;
    }
    ranks[item.idx] = currentRank;
  });

  return ranks;
}

export function getAvatarEmoji(avatar: string): string {
  const emojis: Record<string, string> = {
    'rocket': '🚀',
    'star': '⭐',
    'fire': '🔥',
    'lightning': '⚡',
    'brain': '🧠',
    'crown': '👑',
    'diamond': '💎',
    'heart': '❤️',
    'smile': '😊',
    'cool': '😎',
    'happy': '😄',
    'party': '🎉',
  };
  return emojis[avatar] || '🎮';
}

export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${remainingSeconds}s`;
}

export function getOptionLabel(option: 'A' | 'B' | 'C' | 'D'): string {
  const labels: Record<'A' | 'B' | 'C' | 'D', string> = {
    A: 'Option A',
    B: 'Option B',
    C: 'Option C',
    D: 'Option D',
  };
  return labels[option];
}

export function validateCSV(rows: Array<Record<string, string>>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (rows.length === 0) {
    errors.push('CSV file is empty');
    return { valid: false, errors };
  }

  const requiredColumns = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer'];
  const firstRow = rows[0];

  for (const col of requiredColumns) {
    if (!(col in firstRow)) {
      errors.push(`Missing required column: ${col}`);
    }
  }

  rows.forEach((row, idx) => {
    if (!row['Question']?.trim()) {
      errors.push(`Row ${idx + 1}: Question is empty`);
    }
    if (!['A', 'B', 'C', 'D'].includes(row['Correct Answer']?.toUpperCase())) {
      errors.push(`Row ${idx + 1}: Correct Answer must be A, B, C, or D`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function convertRowsToQuestions(rows: Array<Record<string, string>>): Question[] {
  return rows.map((row, idx) => ({
    id: `q_${idx}_${Date.now()}`,
    text: row['Question'],
    optionA: row['Option A'],
    optionB: row['Option B'],
    optionC: row['Option C'],
    optionD: row['Option D'],
    correctAnswer: row['Correct Answer'].toUpperCase() as 'A' | 'B' | 'C' | 'D',
  }));
}

export function downloadCSV(data: Array<Record<string, unknown>>, filename: string = 'results.csv'): void {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertToCSV(data: Array<Record<string, unknown>>): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csv = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value ?? '');
    });
    csv.push(values.join(','));
  }

  return csv.join('\n');
}
