import { useState, useEffect } from 'react';

const MYSTICAL_MESSAGES = [
  "Consulting the ancient philosophers...",
  "Channeling divine wisdom...",
  "Traversing the philosophical realms...",
  "Querying the cosmic knowledge base...",
  "Synthesizing sacred texts...",
  "Communing with the academic gods...",
  "Before judgment day... I mean, before your answer arrives...",
];

export default function LoadingOracle() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Rotate messages every 2.5 seconds
    const messageInterval = setInterval(() => {
      setIsTransitioning(true);

      // After fade out, change message
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % MYSTICAL_MESSAGES.length);
        setIsTransitioning(false);
      }, 300); // Match CSS transition duration
    }, 2500);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 animate-in fade-in duration-500">
      <div className="bg-cosmic-900/30 backdrop-blur-md border border-cosmic-500/30 rounded-2xl p-12 shadow-2xl shadow-mystic-500/20">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Animated Bunny Icon with Enhanced Cosmic Rings */}
          <div className="relative">
            {/* Multiple pulsing layers for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-cosmic-500 to-mystic-500 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-mystic-500 to-divine-500 rounded-full blur-2xl opacity-30 animate-pulse" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-divine-500 to-cosmic-500 rounded-full blur-xl opacity-20 animate-pulse" style={{ animationDuration: '2s' }}></div>

            {/* Particle sparkles around bunny */}
            <div className="absolute -inset-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-cosmic-400 to-mystic-400 rounded-full animate-pulse"
                  style={{
                    top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                    left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    animationDelay: `${i * 150}ms`,
                    animationDuration: '1.5s',
                  }}
                ></div>
              ))}
            </div>

            {/* Main bunny icon */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-cosmic-500 to-mystic-500 rounded-full flex items-center justify-center shadow-lg shadow-mystic-500/50 animate-float">
              <span className="text-5xl">🐰</span>
            </div>
          </div>

          {/* Loading Text with Rotating Messages */}
          <div className="text-center space-y-3 min-h-[80px] flex flex-col justify-center">
            <h3
              className={`text-2xl font-display font-bold gradient-text animate-glow transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
              role="status"
              aria-live="polite"
            >
              {MYSTICAL_MESSAGES[messageIndex]}
            </h3>
            <p className="text-cosmic-200 text-sm max-w-md">
              Bunny God is searching the sacred texts of PhilPapers.org and channeling cosmic knowledge through the AI realms
            </p>
          </div>

          {/* Animated Progress Dots */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-cosmic-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-mystic-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-divine-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          {/* Enhanced Mystical Circle Animation with Multiple Layers */}
          <div className="relative w-32 h-32">
            {/* Outer ring - slow rotation */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin opacity-40"
              style={{ animationDuration: '5s' }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#gradient-outer)"
                strokeWidth="1"
                strokeDasharray="80 20"
                strokeLinecap="round"
              />
            </svg>

            {/* Middle ring - medium rotation */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin opacity-60"
              style={{ animationDuration: '3.5s', animationDirection: 'reverse' }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient-middle)"
                strokeWidth="1.5"
                strokeDasharray="60 40"
                strokeLinecap="round"
              />
            </svg>

            {/* Inner ring - fast rotation */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin"
              style={{ animationDuration: '2.5s' }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="32"
                fill="none"
                stroke="url(#gradient-inner)"
                strokeWidth="2"
                strokeDasharray="70 30"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="gradient-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                </linearGradient>
                <linearGradient id="gradient-middle" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                  <stop offset="100%" stopColor="rgb(244, 63, 94)" />
                </linearGradient>
                <linearGradient id="gradient-inner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" />
                  <stop offset="50%" stopColor="rgb(168, 85, 247)" />
                  <stop offset="100%" stopColor="rgb(244, 63, 94)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
