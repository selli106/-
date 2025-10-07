import React, { useState, useEffect } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeySave: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeySave }) => {
  const [currentKey, setCurrentKey] = useState(apiKey);
  const [isPassword, setIsPassword] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCurrentKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    onApiKeySave(currentKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="mb-8 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100/80 dark:bg-slate-800/50">
      <label htmlFor="api-key-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Your Gemini API Key
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            id="api-key-input"
            type={isPassword ? 'password' : 'text'}
            value={currentKey}
            onChange={(e) => setCurrentKey(e.target.value)}
            placeholder="Enter your API key here"
            className="w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Gemini API Key Input"
          />
          <button
            type="button"
            onClick={() => setIsPassword(!isPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            aria-label={isPassword ? 'Show API key' : 'Hide API key'}
          >
            {isPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-colors duration-200"
        >
          {isSaved ? 'Saved!' : 'Save'}
        </button>
      </div>
       <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Your key is saved in your browser's local storage and is never sent to our servers. Get a key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500">Google AI Studio</a>.
      </p>
    </div>
  );
};