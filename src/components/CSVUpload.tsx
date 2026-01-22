import { useState } from 'react';
import type { Question } from '../types';
import { validateCSV, convertRowsToQuestions } from '../utils/helpers';

// Browser-compatible CSV parser
function parseCSV(text: string): Array<Record<string, string>> {
  const lines = text.split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());

  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    const row: Record<string, string> = {};

    for (let j = 0; j < Math.min(values.length, headers.length); j++) {
      row[headers[j]] = values[j].trim();
    }

    rows.push(row);
  }

  return rows;
}

interface CSVUploadProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

export function CSVUpload({ onQuestionsLoaded }: CSVUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      const validation = validateCSV(rows);
      if (!validation.valid) {
        setError(validation.errors.join('\n'));
        setLoading(false);
        return;
      }

      const questions = convertRowsToQuestions(rows);
      onQuestionsLoaded(questions);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]?.type === 'text/csv' || files[0]?.name.endsWith('.csv')) {
      handleFile(files[0]);
    } else {
      setError('Please upload a CSV file');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative p-8 border-4 text-center transition-all ${
          dragActive
            ? 'border-cyan-900 bg-yellow-100'
            : 'border-cyan-900 bg-white hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
          id="csv-upload"
          disabled={loading}
        />
        <label htmlFor="csv-upload" className="cursor-pointer block">
          <p className="text-lg font-bold text-cyan-900 mb-1">
            {loading ? 'PROCESSING...' : 'UPLOAD QUIZ CSV'}
          </p>
          <p className="text-sm text-cyan-900 font-bold">
            Drag & drop or click to select
          </p>
          <p className="text-xs text-cyan-900 mt-2 font-bold">
            Question, Option A-D, Correct Answer
          </p>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-300 border-4 border-red-900">
          <p className="text-sm text-red-900 font-bold whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-300 border-4 border-green-900">
          <p className="text-sm text-green-900 font-bold">Questions loaded successfully!</p>
        </div>
      )}
    </div>
  );
}
