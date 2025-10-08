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
        <HelpCircleIcon className="w-7 h-7 main-accent" />
        <h2 className="text-2xl font-bold text-app-text">Potential Detections ({detections.length})</h2>
      </div>
      <p className="text-sm" style={{ color: 'rgba(158,103,67,0.85)' }}>
        The AI wasn't sure about these. They might be incorrect or incomplete.
      </p>
      <ul className="card-surface rounded-lg p-4 space-y-1 max-h-96 overflow-y-auto">
        {detections.map((detection, index) => (
          <li key={index} className="flex items-start gap-3 text-app-text p-2 rounded transition-colors hover:opacity-95">
            <HelpCircleIcon className="w-5 h-5 mt-1 main-accent flex-shrink-0" />
            <div>
              <span className="font-semibold">{detection.title}</span>
              <span className="block text-sm" style={{ color: 'rgba(158,103,67,0.85)' }}>{detection.author}</span>
              <span className="block text-xs main-accent italic mt-1">Reason: {detection.reason}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};