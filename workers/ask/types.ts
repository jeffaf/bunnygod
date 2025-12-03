/**
 * Type Definitions for Semantic Scholar Integration
 *
 * Shared types used across the philosophy Q&A system for multi-source
 * academic paper retrieval and response normalization.
 */

/**
 * Unified format for academic papers from any source
 * Compatible with both Semantic Scholar and CrossRef APIs
 */
export interface PhilPaper {
  // Core fields (required)
  title: string;
  authors: string;
  url: string;

  // Optional metadata
  abstract?: string;
  year?: number;
  categories?: string[];

  // Source tracking
  source?: 'semantic-scholar' | 'crossref' | 'philpapers';

  // Quality signals
  citationCount?: number;
  venue?: string;  // Journal or conference name

  // Internal identifiers
  externalId?: string;  // Semantic Scholar paperId or CrossRef DOI
}

/**
 * Search result container with metadata
 */
export interface PhilPapersSearchResult {
  papers: PhilPaper[];
  total: number;
  source?: 'philpapers' | 'crossref' | 'semantic-scholar'; // Track which API was used
}

/**
 * Philosophy subfield categories supported by keyword detection
 */
export type PhilosophySubfield =
  | 'epistemology'
  | 'metaphysics'
  | 'ethics'
  | 'philosophy-of-mind'
  | 'political-philosophy'
  | 'aesthetics'
  | 'logic'
  | 'philosophy-of-science'
  | 'existentialism';

/**
 * Result of philosophy subfield detection algorithm
 */
export interface SubfieldDetection {
  primarySubfield: PhilosophySubfield | null;
  confidence: number;           // 0.0 - 1.0
  matchedKeywords: string[];
  allMatches: Record<string, number>;  // subfield → match count
}

/**
 * Semantic Scholar API response format
 */
export interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract?: string;
  year?: number;
  citationCount?: number;
  fieldsOfStudy?: string[];
  authors: Array<{
    authorId: string;
    name: string;
  }>;
  publicationVenue?: {
    name?: string;
  };
  url?: string;
}

export interface SemanticScholarResponse {
  total: number;
  offset: number;
  next?: number;
  data: SemanticScholarPaper[];
}

/**
 * CrossRef API response format
 */
export interface CrossRefWork {
  DOI?: string;
  title?: string | string[];
  author?: Array<{
    given?: string;
    family?: string;
    name?: string;
  }>;
  published?: {
    'date-parts'?: number[][];
  };
  created?: {
    'date-parts'?: number[][];
  };
  abstract?: string;
  type?: string;
  'container-title'?: string[];
  'is-referenced-by-count'?: number;
}

/**
 * Multi-source query result with timing and attribution
 */
export interface MultiSourceResult {
  papers: PhilPaper[];
  sources: {
    semanticScholar: number;  // Count from each source
    crossref: number;
  };
  timing: {
    semanticScholar: number | null;  // ms or null if failed
    crossref: number | null;
    total: number;
  };
  detectedSubfield?: PhilosophySubfield;  // Detected philosophy subfield for caching
}
