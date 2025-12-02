interface CitationHeaderProps {
  title: string;
  authors: string;
  year?: number;
  index: number;
}

export default function CitationHeader({ title, authors, year, index }: CitationHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      {/* Citation Number Badge */}
      <span
        className="
          flex-shrink-0
          w-8 h-8 rounded-full
          bg-cosmic-800/50
          flex items-center justify-center
          text-sm font-semibold text-cosmic-300
        "
        aria-label={`Citation ${index + 1}`}
      >
        {index + 1}
      </span>

      {/* Title and Metadata */}
      <div className="flex-1 min-w-0">
        <h4
          id={`citation-title-${index}`}
          className="
            text-lg font-semibold leading-snug
            bg-gradient-to-r from-cosmic-400 via-mystic-400 to-divine-400
            bg-clip-text text-transparent
            mb-2
          "
        >
          {title}
        </h4>

        <p className="text-sm text-cosmic-300 flex flex-wrap items-center gap-2">
          <span>{authors}</span>
          {year && (
            <>
              <span className="text-cosmic-500" aria-hidden="true">•</span>
              <span className="text-cosmic-400 font-medium">{year}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
