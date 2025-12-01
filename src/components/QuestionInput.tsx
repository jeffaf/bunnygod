import { useState } from 'react';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export default function QuestionInput({ onSubmit, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Bunny God a philosophical question..."
          className="w-full px-6 py-4 bg-cosmic-900/50 border-2 border-cosmic-500/30 rounded-2xl
                     text-white placeholder-cosmic-300/50
                     focus:outline-none focus:border-mystic-500/50 focus:ring-2 focus:ring-mystic-500/30
                     transition-all duration-300 resize-none
                     backdrop-blur-sm shadow-lg shadow-cosmic-500/20
                     hover:border-cosmic-400/40"
          rows={4}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="absolute bottom-4 right-4 px-8 py-3 rounded-xl
                     bg-gradient-to-r from-cosmic-600 to-mystic-600
                     hover:from-cosmic-500 hover:to-mystic-500
                     disabled:from-cosmic-800 disabled:to-mystic-800
                     disabled:cursor-not-allowed
                     transition-all duration-300
                     font-semibold text-white text-sm
                     shadow-lg shadow-cosmic-500/50
                     hover:shadow-xl hover:shadow-mystic-500/50
                     transform hover:-translate-y-0.5
                     disabled:transform-none disabled:shadow-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Consulting...
            </span>
          ) : (
            'Ask Bunny God'
          )}
        </button>
      </div>

      <p className="mt-4 text-center text-cosmic-300/60 text-sm">
        Ask anything about philosophy, ethics, metaphysics, epistemology, and more
      </p>
    </form>
  );
}
