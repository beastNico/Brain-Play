import { useState } from 'react';
import type { Question } from '../types';
import { Copy, CheckCircle2 } from 'lucide-react';

interface QuestionPreviewProps {
  questions: Question[];
  onClose: () => void;
}

export function QuestionPreview({ questions, onClose }: QuestionPreviewProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Preview Questions ({questions.length})</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="flex gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-bold text-sm flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="font-semibold text-gray-800 flex-1">{q.text}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 ml-11">
                {(['optionA', 'optionB', 'optionC', 'optionD'] as const).map((key, i) => {
                  const letter = String.fromCharCode(65 + i) as 'A' | 'B' | 'C' | 'D';
                  const isCorrect = q.correctAnswer === letter;
                  return (
                    <div
                      key={key}
                      className={`p-2 rounded text-sm ${
                        isCorrect
                          ? 'bg-green-100 border border-green-300 text-green-800 font-medium'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="font-bold">{letter}:</span> {q[key]}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Details
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
