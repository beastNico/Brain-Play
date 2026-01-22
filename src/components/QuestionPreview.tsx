import { useState } from 'react';
import type { Question } from '../types';

interface QuestionPreviewProps {
  questions: Question[];
  onClose: () => void;
}

export function QuestionPreview({ questions, onClose }: QuestionPreviewProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-cyan-900 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-yellow-300 border-b-4 border-cyan-900 text-cyan-900 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">PREVIEW QUESTIONS ({questions.length})</h2>
          <button
            onClick={onClose}
            className="text-cyan-900 hover:bg-yellow-200 p-2 border-2 border-cyan-900 transition-colors font-bold text-lg w-8 h-8 flex items-center justify-center"
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4 bg-cyan-50">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="border-4 border-cyan-900 p-4 bg-white"
            >
              <div className="flex gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-300 text-cyan-900 border-2 border-cyan-900 font-bold text-sm flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="font-bold text-cyan-900 flex-1">{q.text}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 ml-11">
                {(['optionA', 'optionB', 'optionC', 'optionD'] as const).map((key, i) => {
                  const letter = String.fromCharCode(65 + i) as 'A' | 'B' | 'C' | 'D';
                  const isCorrect = q.correctAnswer === letter;
                  return (
                    <div
                      key={key}
                      className={`p-2 border-2 text-sm font-bold ${
                        isCorrect
                          ? 'bg-green-300 border-green-900 text-green-900'
                          : 'bg-white border-cyan-900 text-cyan-900'
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
        <div className="bg-yellow-200 border-t-4 border-cyan-900 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-cyan-300 text-cyan-900 border-2 border-cyan-900 font-bold hover:bg-cyan-200 transition-colors"
          >
            CLOSE
          </button>
          <button
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex-1 px-6 py-3 bg-yellow-300 text-cyan-900 border-2 border-cyan-900 font-bold hover:bg-yellow-200 transition-colors"
          >
            {copied ? 'COPIED!' : 'COPY DETAILS'}
          </button>
        </div>
      </div>
    </div>
  );
}
