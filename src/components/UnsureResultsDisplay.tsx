import React from 'react';
import { HelpCircleIcon } from './icons/HelpCircleIcon';
import { UnsureDetection } from '../services/geminiService';

interface UnsureResultsDisplayProps {
  detections: UnsureDetection[];
}

export const UnsureResultsDisplay: React.FC<UnsureResultsDisplayProps> = ({ detections }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <HelpCircleIcon className="w-7 h-7 text-amber-500" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Potential Detections ({detections.length})</h2>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 -mt-2">
        The AI wasn't sure about these. They might be incorrect or incomplete.
      </p>
      <ul className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 space-y-1 max-h-96 overflow-y-auto">
        {detections.map((detection, index) => (
          <li key={index} className="flex items-start gap-3 text-slate-800 dark:text-slate-200 p-2 rounded transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
            <HelpCircleIcon className="w-5 h-5 mt-1 text-amber-500 flex-shrink-0" />
            <div>
              <span className="font-semibold">{detection.title}</span>
              <span className="block text-sm text-slate-500 dark:text-slate-400">{detection.author}</span>
              <span className="block text-xs text-amber-600 dark:text-amber-400 italic mt-1">Reason: {detection.reason}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};