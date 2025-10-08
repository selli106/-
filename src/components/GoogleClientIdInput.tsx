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
    <div className="mb-8 p-4 rounded-lg card-surface">
      <label htmlFor="client-id-input" className="block text-sm font-medium text-app-text mb-2">
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
            className="w-full pl-3 pr-10 py-2 bg-white rounded-md shadow-sm focus:outline-none" style={{ border: '1px solid rgba(14,74,77,0.06)' }}
            aria-label="Google Client ID Input"
          />
          <button
            type="button"
            onClick={() => setIsPassword(!isPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-app-text/70 hover:text-app-text"
            aria-label={isPassword ? 'Show Client ID' : 'Hide Client ID'}
          >
            {isPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2 btn-primary font-semibold rounded-lg shadow-md focus:outline-none"
        >
          {isSaved ? 'Saved!' : 'Save'}
        </button>
      </div>
       <p className="text-xs mt-2" style={{ color: 'rgba(158,103,67,0.75)' }}>
        Required for Google Books integration. Get this from the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--main-accent)' }}>Google Cloud Console</a>.
      </p>
    </div>
  );
};
