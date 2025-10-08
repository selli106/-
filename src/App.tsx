import React, { useState, useCallback, useEffect } from 'react';
import bkgImg from './assets/bkg.png';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { UnsureResultsDisplay } from './components/UnsureResultsDisplay';
import { RawTextDisplay } from './components/RawTextDisplay';
import { Spinner } from './components/Spinner';
import { ApiKeyInput } from './components/ApiKeyInput';
import { extractBookInfoFromImages, Book, UnsureDetection } from './services/geminiService';
import { fetchGoogleBookInfo } from './services/googleBooksService';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [extractedBooks, setExtractedBooks] = useState<Book[]>([]);
  const [unsureDetections, setUnsureDetections] = useState<UnsureDetection[]>([]);
  const [rawText, setRawText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  const handleApiKeySave = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('gemini-api-key', newApiKey);
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    const previews = newFiles.map(file => URL.createObjectURL(file));
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews(previews);
    resetResults();
  };
  
  const resetResults = () => {
    setExtractedBooks([]);
    setUnsureDetections([]);
    setRawText('');
    setError(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    if (!apiKey) {
      setError("Please enter your Gemini API key before analyzing.");
      return;
    }
    setIsLoading(true);
    resetResults();
    try {
      const result = await extractBookInfoFromImages(files, apiKey);
      setExtractedBooks(result.identifiedBooks);
      setUnsureDetections(result.unsureDetections);
      setRawText(result.rawText);
      if (result.identifiedBooks.length === 0 && result.unsureDetections.length === 0) {
        setError("No books could be identified. Please try with clearer images.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [files, apiKey]);
  
  const handleEnrichBooksClick = useCallback(async () => {
    if (extractedBooks.length === 0) return;
    setIsEnriching(true);
    setError(null);
    try {
        const enrichedBooksPromises = extractedBooks.map(async (book) => {
            // Avoid re-fetching if already enriched with a link
            if (book.googleBooksLink) return book;
            const info = await fetchGoogleBookInfo(book.title, book.author);
            return info ? { ...book, ...info } : book;
        });
        const enrichedBooks = await Promise.all(enrichedBooksPromises);
        setExtractedBooks(enrichedBooks);
    } catch (err) {
        console.error("Failed to enrich books:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching book details.");
    } finally {
        setIsEnriching(false);
    }
  }, [extractedBooks]);


  const canAnalyze = !isLoading && files.length > 0 && !!apiKey;
  const hasResults = extractedBooks.length > 0 || unsureDetections.length > 0 || rawText.length > 0;

  return (
  <div className="app-container min-h-screen font-sans" style={{ position: 'relative' }}>
      {/* Decorative background image placed behind the app content. Inline styles
          ensure proper positioning and opacity even if external CSS hasn't loaded. */}
      <img
        src={bkgImg}
        alt=""
        aria-hidden="true"
        className="app-bg-image ai-style-change-1"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.27,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-4">
            <img
              src="https://raw.githubusercontent.com/selli106/BookshELF/main/src/assets/Gemini_Generated_Image_op3vexop3vexop3v.png"
              alt="BookshELF logo"
              className="logo"
              style={{ width: '93.75px', height: 'auto' }}
            />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight app-header-title">
              BookshELF
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Your magical bookshelf assistant. Snap a picture, and let the elf catalog your books!
          </p>
        </header>

  <div
    className="max-w-4xl mx-auto card-surface rounded-2xl shadow-lg p-6 md:p-8"
    style={{ backgroundColor: 'rgba(243,239,229,0.75)' }}
  >
          <ApiKeyInput apiKey={apiKey} onApiKeySave={handleApiKeySave} />

          <ImageUploader onFilesChange={handleFilesChange} />

          <div className="mt-6 text-center">
            <button
              onClick={handleAnalyzeClick}
              disabled={!canAnalyze}
              className="w-full md:w-auto px-8 py-3 btn-primary font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-102 disabled:scale-100"
              aria-label={apiKey ? `Analyze ${files.length} Image${files.length !== 1 ? 's' : ''}` : 'API Key required'}
            >
              {isLoading ? 'Analyzing...' : `Analyze ${files.length} Image${files.length === 1 ? '' : 's'}`}
            </button>
          </div>
          
          {isLoading && <Spinner />}

          {error && !isLoading && (
            <div className="mt-6 text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && hasResults && (
             <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-8">
                {extractedBooks.length > 0 && (
                  <ResultsDisplay 
                    books={extractedBooks} 
                    isEnriching={isEnriching}
                    onEnrichBooks={handleEnrichBooksClick}
                  />
                )}
                {unsureDetections.length > 0 && <UnsureResultsDisplay detections={unsureDetections} />}
                {rawText.length > 0 && <RawTextDisplay text={rawText} />}
             </div>
          )}

        </div>
      </main>
       <footer className="text-center py-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
              Powered by Google Gemini & Google Books
          </p>
      </footer>
    </div>
  );
};

export default App;
