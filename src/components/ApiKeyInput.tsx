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
    <div className="mb-8 p-4 rounded-lg card-surface">
      <label htmlFor="api-key-input" className="block text-sm font-medium text-app-text mb-2">
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
            className="w-full pl-3 pr-10 py-2 bg-white rounded-md shadow-sm focus:outline-none" style={{ border: '1px solid rgba(14,74,77,0.06)' }}
            aria-label="Gemini API Key Input"
          />
          <button
            type="button"
            onClick={() => setIsPassword(!isPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-app-text/70 hover:text-app-text"
            aria-label={isPassword ? 'Show API key' : 'Hide API key'}
          >
            {isPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2 btn-primary font-semibold rounded-lg shadow-md focus:outline-none transition-colors duration-200"
        >
          {isSaved ? 'Saved!' : 'Save'}
        </button>
      </div>
       <p className="text-xs mt-2" style={{ color: 'rgba(158,103,67,0.75)' }}>
        Your key is saved in your browser's local storage and is never sent to our servers. Get a key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--main-accent)' }}>Google AI Studio</a>.
      </p>
    </div>
  );
};