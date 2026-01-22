import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
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
        className={`relative p-8 border-2 border-dashed rounded-xl text-center transition-all ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
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
          <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-700 mb-1">
            {loading ? 'Processing...' : 'Upload Quiz CSV'}
          </p>
          <p className="text-sm text-gray-500">
            Drag & drop or click to select
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Required columns: Question, Option A, Option B, Option C, Option D, Correct Answer
          </p>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 animate-slideIn">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">Questions loaded successfully! ✨</p>
        </div>
      )}
    </div>
  );
}
