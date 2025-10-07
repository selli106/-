import React, { useState, useEffect } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface GoogleClientIdInputProps {
  clientId: string;
  onClientIdSave: (key: string) => void;
}

export const GoogleClientIdInput: React.FC<GoogleClientIdInputProps> = ({ clientId, onClientIdSave }) => {
  const [currentId, setCurrentId] = useState(clientId);
  const [isPassword, setIsPassword] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCurrentId(clientId);
  }, [clientId]);

  const handleSave = () => {
    onClientIdSave(currentId);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="mb-8 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100/80 dark:bg-slate-800/50">
      <label htmlFor="client-id-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Google Client ID
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            id="client-id-input"
            type={isPassword ? 'password' : 'text'}
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            placeholder="Enter your Google Client ID"
            className="w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Google Client ID Input"
          />
          <button
            type="button"
            onClick={() => setIsPassword(!isPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            aria-label={isPassword ? 'Show Client ID' : 'Hide Client ID'}
          >
            {isPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isSaved ? 'Saved!' : 'Save'}
        </button>
      </div>
       <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Required for Google Books integration. Get this from the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500">Google Cloud Console</a>.
      </p>
    </div>
  );
};
