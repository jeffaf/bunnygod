import { useState } from 'react';
import CitationHeader from './CitationHeader';
import CitationExpand from './CitationExpand';
import CitationAbstract from './CitationAbstract';

interface CitationCardProps {
  paper: {
    title: string;
    authors: string;
    abstract?: string;
    url: string;
    year?: number;
    categories?: string[];
  };
  index: number;
}

export default function CitationCard({ paper, index }: CitationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article
      className={`
        citation-card
        rounded-xl
        border transition-all duration-200
        backdrop-blur-sm
        ${isExpanded
          ? 'bg-cosmic-900/25 border-mystic-500/25'
          : 'bg-cosmic-900/20 border-cosmic-500/20'
        }
        hover:bg-cosmic-900/30 hover:border-cosmic-400/30
        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-mystic-500/10
      `}
      aria-labelledby={`citation-title-${index}`}
    >
      <div className="p-6 sm:p-8">
        <CitationHeader
          title={paper.title}
          authors={paper.authors}
          year={paper.year}
          index={index}
        />

        {paper.abstract && (
          <>
            <CitationExpand
              isExpanded={isExpanded}
              onToggle={toggleExpand}
              abstractId={`citation-abstract-${index}`}
              title={paper.title}
            />

            {isExpanded && (
              <CitationAbstract
                abstract={paper.abstract}
                url={paper.url}
                year={paper.year}
                categories={paper.categories}
                id={`citation-abstract-${index}`}
              />
            )}
          </>
        )}

        {!paper.abstract && (
          <div className="mt-4">
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                text-sm font-mono text-mystic-400
                hover:text-mystic-300 transition-colors
                underline decoration-mystic-500/30
                hover:decoration-mystic-400
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Paper
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
