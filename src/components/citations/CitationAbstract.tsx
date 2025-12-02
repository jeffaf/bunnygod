interface CitationAbstractProps {
  abstract: string;
  url: string;
  year?: number;
  categories?: string[];
  id: string;
}

export default function CitationAbstract({
  abstract,
  url,
  year,
  categories,
  id
}: CitationAbstractProps) {
  // Extract DOI from URL
  const doi = url.includes('doi.org')
    ? url.split('doi.org/')[1]
    : null;

  return (
    <div
      id={id}
      className="
        mt-4
        animate-in slide-in-from-top-2 fade-in
        duration-300
      "
      role="region"
      aria-live="polite"
    >
      {/* Abstract Text */}
      <div className="
        p-4 rounded-lg
        bg-cosmic-800/30
        border border-cosmic-700/20
      ">
        <p className="
          text-[15px] leading-relaxed
          text-cosmic-200
        ">
          {abstract}
        </p>
      </div>

      {/* Detailed Metadata */}
      <div className="
        mt-3
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-3
        text-sm
      ">
        {/* Publication Info */}
        <div className="text-cosmic-400">
          {categories && categories.length > 0 && (
            <span className="capitalize">
              {categories[0].replace('-', ' ')}
            </span>
          )}
          {year && categories && (
            <span className="mx-2 text-cosmic-500">•</span>
          )}
          {year && <span>{year}</span>}
        </div>

        {/* DOI Link */}
        {doi && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              font-mono text-mystic-400
              hover:text-mystic-300
              transition-all duration-150
              hover:scale-102
              underline decoration-mystic-500/30
              hover:decoration-mystic-400
            "
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="truncate max-w-[200px] sm:max-w-none">
              DOI: {doi}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
