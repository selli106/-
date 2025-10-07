import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div
        className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-indigo-500 border-t-transparent"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};