export default function LoadingOracle() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12 animate-in fade-in duration-500">
      <div className="bg-cosmic-900/30 backdrop-blur-md border border-cosmic-500/30 rounded-2xl p-12 shadow-2xl shadow-mystic-500/20">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Animated Bunny Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cosmic-500 to-mystic-500 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-cosmic-500 to-mystic-500 rounded-full flex items-center justify-center shadow-lg shadow-mystic-500/50 animate-float">
              <span className="text-5xl">🐰</span>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-display font-bold gradient-text animate-glow">
              Consulting the Divine Wisdom...
            </h3>
            <p className="text-cosmic-300/70 text-sm max-w-md">
              Bunny God is searching the sacred texts of PhilPapers.org and channeling cosmic knowledge through the AI realms
            </p>
          </div>

          {/* Animated Progress Dots */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-cosmic-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-mystic-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-divine-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          {/* Mystical Circle Animation */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray="70 30"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
