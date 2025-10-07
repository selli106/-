import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { BookIcon } from './icons/BookIcon';
import { Book } from '../services/geminiService';

interface ResultsDisplayProps {
  books: Book[];
  isEnriching: boolean;
  onEnrichBooks: () => void;
}

const ActionButton: React.FC<{ onClick: () => void, disabled?: boolean, title?: string, children: React.ReactNode, variant?: 'primary' | 'secondary' }> = ({ onClick, disabled, title, children, variant = 'secondary' }) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed transition-all duration-200";
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800",
    secondary: "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 disabled:opacity-50"
  };

  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  books, 
  isEnriching,
  onEnrichBooks,
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const textToCopy = books.map(book => `${book.title} by ${book.author}`).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Extracted Books ({books.length})</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            title="Copy book list to clipboard"
          >
            {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="my-4 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex flex-wrap gap-4 items-center justify-center">
        <ActionButton onClick={onEnrichBooks} disabled={isEnriching} variant="secondary">
          {isEnriching ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding Books...
            </>
          ) : (
            <>
              <BookIcon className="w-5 h-5" />
              Find on Google Books
            </>
          )}
        </ActionButton>
      </div>

      <ul className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 space-y-1 max-h-96 overflow-y-auto">
        {books.map((book, index) => (
          <li key={index} className="flex items-start gap-4 text-slate-800 dark:text-slate-200 p-2 rounded transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
            {book.coverImageUrl ? (
                <img src={book.coverImageUrl} alt={`Cover of ${book.title}`} className="w-12 h-auto object-contain rounded shadow-md flex-shrink-0" />
            ) : (
                <div className="w-12 h-16 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded flex-shrink-0">
                    <BookIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
            )}
            
            <div>
              {book.googleBooksLink ? (
                <a href={book.googleBooksLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    {book.title}
                </a>
              ) : (
                <span className="font-semibold">{book.title}</span>
              )}
                <span className="block text-sm text-slate-500 dark:text-slate-400">{book.author}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};