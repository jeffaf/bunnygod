import { useState, useEffect } from 'react';

interface FeedbackButtonsProps {
  question: string;
}

export default function FeedbackButtons({ question }: FeedbackButtonsProps) {
  const [selectedRating, setSelectedRating] = useState<'helpful' | 'not-helpful' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage for existing feedback on mount
  useEffect(() => {
    const questionHash = hashQuestion(question);
    const stored = localStorage.getItem(`feedback:${questionHash}`);
    if (stored) {
      setSelectedRating(stored as 'helpful' | 'not-helpful');
    }
  }, [question]);

  // Simple hash function for client-side question identification
  const hashQuestion = (text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };

  const handleFeedback = async (rating: 'helpful' | 'not-helpful') => {
    if (selectedRating || isSubmitting) return; // Already rated or submitting

    setIsSubmitting(true);
    setError(null);

    try {
      const questionHash = hashQuestion(question);

      // Store feedback locally first
      localStorage.setItem(`feedback:${questionHash}`, rating);
      setSelectedRating(rating);

      // Send to Worker API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionHash,
          rating,
          timestamp: Date.now(),
          sessionId: getSessionId(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError('Failed to submit feedback. Your rating has been saved locally.');
      // Keep the local rating even if server fails
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get or create session ID
  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('bunny-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      sessionStorage.setItem('bunny-session-id', sessionId);
    }
    return sessionId;
  };

  return (
    <div className="mt-6 pt-6 border-t border-cosmic-500/20">
      <div className="flex items-center gap-4">
        <span className="text-cosmic-300/70 text-sm font-medium">
          Was this helpful?
        </span>

        <div className="flex gap-2">
          {/* Thumbs Up Button */}
          <button
            onClick={() => handleFeedback('helpful')}
            disabled={selectedRating !== null || isSubmitting}
            className={`
              group relative px-4 py-2 rounded-lg
              transition-all duration-300 ease-out
              ${selectedRating === 'helpful'
                ? 'bg-gradient-to-r from-emerald-500/30 to-green-500/30 border-2 border-emerald-400/50 scale-105'
                : 'bg-cosmic-800/30 border border-cosmic-500/30 hover:border-emerald-400/50 hover:bg-cosmic-700/40'
              }
              ${selectedRating !== null && selectedRating !== 'helpful' ? 'opacity-40' : ''}
              ${isSubmitting ? 'cursor-wait' : selectedRating ? 'cursor-default' : 'cursor-pointer'}
              disabled:cursor-not-allowed
            `}
            aria-label="Mark as helpful"
          >
            <div className="flex items-center gap-2">
              <span className={`
                text-xl transition-transform duration-300
                ${selectedRating === 'helpful' ? 'scale-110' : 'group-hover:scale-110'}
              `}>
                👍
              </span>
              <span className="text-xs font-medium text-cosmic-200">
                Helpful
              </span>
            </div>

            {/* Cosmic glow effect */}
            {selectedRating === 'helpful' && (
              <div className="absolute inset-0 rounded-lg bg-emerald-400/10 animate-pulse" />
            )}
          </button>

          {/* Thumbs Down Button */}
          <button
            onClick={() => handleFeedback('not-helpful')}
            disabled={selectedRating !== null || isSubmitting}
            className={`
              group relative px-4 py-2 rounded-lg
              transition-all duration-300 ease-out
              ${selectedRating === 'not-helpful'
                ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border-2 border-orange-400/50 scale-105'
                : 'bg-cosmic-800/30 border border-cosmic-500/30 hover:border-orange-400/50 hover:bg-cosmic-700/40'
              }
              ${selectedRating !== null && selectedRating !== 'not-helpful' ? 'opacity-40' : ''}
              ${isSubmitting ? 'cursor-wait' : selectedRating ? 'cursor-default' : 'cursor-pointer'}
              disabled:cursor-not-allowed
            `}
            aria-label="Mark as not helpful"
          >
            <div className="flex items-center gap-2">
              <span className={`
                text-xl transition-transform duration-300
                ${selectedRating === 'not-helpful' ? 'scale-110' : 'group-hover:scale-110'}
              `}>
                👎
              </span>
              <span className="text-xs font-medium text-cosmic-200">
                Not Helpful
              </span>
            </div>

            {/* Cosmic glow effect */}
            {selectedRating === 'not-helpful' && (
              <div className="absolute inset-0 rounded-lg bg-orange-400/10 animate-pulse" />
            )}
          </button>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="text-emerald-400 text-sm font-medium animate-in fade-in duration-300">
            ✨ Thanks for your feedback!
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="text-orange-400 text-sm animate-in fade-in duration-300">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Privacy note */}
      <p className="text-cosmic-400/50 text-xs mt-3 italic">
        Your feedback helps Bunny God improve. All ratings are anonymous.
      </p>
    </div>
  );
}
