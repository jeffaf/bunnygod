import ShareButtons from './phase2/ShareButtons';
import FeedbackButtons from './phase2/FeedbackButtons';

interface AnswerDisplayProps {
  answer: string;
  question: string;
  sources?: Array<{
    title: string;
    authors: string;
    url: string;
  }>;
}

export default function AnswerDisplay({ answer, question, sources }: AnswerDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-in fade-in duration-500">
      <div className="bg-cosmic-900/30 backdrop-blur-md border border-cosmic-500/30 rounded-2xl p-8 shadow-2xl shadow-mystic-500/20">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cosmic-500 to-mystic-500 rounded-full flex items-center justify-center shadow-lg shadow-mystic-500/50">
            <span className="text-3xl">🐰</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-display font-bold gradient-text mb-2">
              Divine Wisdom from Bunny God
            </h3>
            <p className="text-cosmic-300/70 text-sm">
              Synthesized from philosophical literature
            </p>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-cosmic-100 leading-relaxed whitespace-pre-wrap">
            {answer}
          </p>
        </div>

        {/* Share Buttons */}
        <ShareButtons question={question} answer={answer} />

        {/* Feedback Buttons */}
        <FeedbackButtons question={question} />

        {sources && sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-cosmic-500/30">
            <h4 className="text-lg font-semibold text-mystic-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Sources from PhilPapers
            </h4>
            <ul className="space-y-3">
              {sources.map((source, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cosmic-800/50 flex items-center justify-center text-xs text-cosmic-300">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mystic-400 hover:text-mystic-300 transition-colors underline decoration-mystic-500/30 hover:decoration-mystic-400"
                    >
                      {source.title}
                    </a>
                    <p className="text-cosmic-400/70 text-sm mt-1">{source.authors}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
