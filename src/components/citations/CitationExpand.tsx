interface CitationExpandProps {
  isExpanded: boolean;
  onToggle: () => void;
  abstractId: string;
  title: string;
}

export default function CitationExpand({
  isExpanded,
  onToggle,
  abstractId,
  title
}: CitationExpandProps) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-controls={abstractId}
      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} abstract for: ${title}`}
      className="
        w-full mt-4
        h-12 sm:h-14
        flex items-center justify-center gap-2
        border border-dashed border-cosmic-500/30
        rounded-lg
        text-sm font-medium text-mystic-400
        hover:bg-cosmic-800/20 hover:border-cosmic-400/40 hover:text-mystic-300
        active:scale-98
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-mystic-400 focus-visible:outline-offset-2
      "
    >
      <svg
        className={`
          w-5 h-5
          transition-transform duration-250
          ${isExpanded ? 'rotate-180' : 'rotate-0'}
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
      <span>{isExpanded ? 'Collapse Abstract' : 'Read Abstract'}</span>
    </button>
  );
}
