import { useState, useEffect } from 'react';

interface QuestionHistoryProps {
  onQuestionSelect: (question: string) => void;
}

const STORAGE_KEY = 'bunny-god-question-history';
const MAX_HISTORY_SIZE = 10;

export default function QuestionHistory({ onQuestionSelect }: QuestionHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, MAX_HISTORY_SIZE));
        }
      }
    } catch (error) {
      console.error('Failed to load question history:', error);
      // Silently fail - history is not critical
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (!isMounted) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save question history:', error);
      // Silently fail - history is not critical
    }
  }, [history, isMounted]);

  // Add question to history (called externally)
  const addToHistory = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setHistory((prevHistory) => {
      // Remove duplicate if it exists
      const filtered = prevHistory.filter((q) => q !== trimmedQuestion);
      // Add to front, keep max 10
      const newHistory = [trimmedQuestion, ...filtered].slice(0, MAX_HISTORY_SIZE);
      return newHistory;
    });
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    setIsOpen(false);
  };

  // Handle question click
  const handleQuestionClick = (question: string) => {
    onQuestionSelect(question);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, question: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleQuestionClick(question);
    }
  };

  // Expose addToHistory method via global window (handled by parent)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Attach method to window for parent access
      (window as any).__bunnyGodAddToHistory = addToHistory;
    }
  }, [addToHistory]);

  // Don't render until mounted (avoid hydration mismatch)
  if (!isMounted) {
    return null;
  }

  // Don't render if no history
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-cosmic-800/80 border border-cosmic-500/40
                   backdrop-blur-md shadow-lg shadow-cosmic-500/30
                   hover:bg-cosmic-700/80 hover:border-cosmic-400/50
                   transition-all duration-300 hover:scale-110
                   focus:outline-none focus:ring-2 focus:ring-mystic-500/50
                   group"
        aria-label="Question History"
        aria-expanded={isOpen}
        aria-controls="question-history-panel"
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">
            📜
          </span>
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-mystic-600
                           rounded-full flex items-center justify-center
                           text-[10px] font-bold text-white border border-mystic-400">
              {history.length}
            </span>
          )}
        </div>
      </button>

      {/* History Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            id="question-history-panel"
            className="absolute top-16 right-0 w-[calc(100vw-2rem)] md:w-96
                       max-h-[70vh] overflow-hidden
                       bg-cosmic-900/95 border border-cosmic-500/40 rounded-2xl
                       backdrop-blur-xl shadow-2xl shadow-cosmic-500/30
                       animate-in fade-in slide-in-from-top-2 duration-300"
            role="region"
            aria-label="Question History"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-cosmic-500/30 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-cosmic-200 flex items-center gap-2">
                <span>📜</span>
                <span>Recent Questions</span>
                <span className="text-cosmic-400 text-xs">({history.length})</span>
              </h3>
              <button
                onClick={clearHistory}
                className="text-sm px-4 py-2.5 rounded-lg
                         bg-divine-800/40 border border-divine-500/30
                         text-divine-200 hover:bg-divine-700/50 hover:border-divine-400/50
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-divine-500/50"
                aria-label="Clear all history"
              >
                Clear All
              </button>
            </div>

            {/* Question List */}
            <div className="overflow-y-auto max-h-[calc(70vh-3.5rem)] custom-scrollbar">
              <ul className="p-2 space-y-1" role="list">
                {history.map((question, index) => (
                  <li key={`${question}-${index}`}>
                    <button
                      onClick={() => handleQuestionClick(question)}
                      onKeyDown={(e) => handleKeyDown(e, question)}
                      className="w-full text-left px-4 py-3 rounded-xl
                               bg-cosmic-800/40 border border-cosmic-500/20
                               hover:bg-cosmic-700/50 hover:border-cosmic-400/40
                               transition-all duration-200
                               focus:outline-none focus:ring-2 focus:ring-mystic-500/50
                               group cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Re-ask question: ${question}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-cosmic-400 text-xs mt-1 flex-shrink-0
                                       group-hover:text-mystic-400 transition-colors">
                          {index + 1}
                        </span>
                        <p className="text-sm text-cosmic-200 leading-relaxed
                                    group-hover:text-white transition-colors
                                    line-clamp-3">
                          {question}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helper Text */}
            <div className="px-4 py-3 border-t border-cosmic-500/30
                          bg-cosmic-800/30 rounded-b-2xl">
              <p className="text-xs text-cosmic-300/60 text-center">
                Click any question to ask again
              </p>
            </div>
          </div>
        </>
      )}

      {/* Custom scrollbar styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(99, 102, 241, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.7);
          }

          @keyframes slide-in-from-top-2 {
            from {
              transform: translateY(-8px);
            }
            to {
              transform: translateY(0);
            }
          }

          .slide-in-from-top-2 {
            animation: slide-in-from-top-2 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
