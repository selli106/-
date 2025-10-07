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
          <TerminalIcon className="w-7 h-7 text-cyan-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Detected Text</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-colors"
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
      <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
        <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
          {text}
        </pre>
      </div>
    </div>
  );
};