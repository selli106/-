import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TerminalIcon } from './icons/TerminalIcon';

interface RawTextDisplayProps {
  text: string;
}

export const RawTextDisplay: React.FC<RawTextDisplayProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <TerminalIcon className="w-7 h-7 main-accent" />
          <h2 className="text-2xl font-bold text-app-text">All Detected Text</h2>
        </div>
        <button
          onClick={handleCopy}
    className="flex items-center gap-2 px-4 py-2 card-surface text-app-text font-medium rounded-lg focus:outline-none transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="w-5 h-5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-5 h-5" />
              Copy Text
            </>
          )}
        </button>
      </div>
      <div className="card-surface rounded-lg p-4 max-h-60 overflow-y-auto">
        <pre className="text-sm whitespace-pre-wrap font-mono" style={{ color: 'rgba(158,103,67,0.9)' }}>
          {text}
        </pre>
      </div>
    </div>
  );
};