/**
 * Semantic Scholar API Client
 *
 * Academic Graph API for accessing 200M+ research papers
 * Documentation: https://api.semanticscholar.org/api-docs
 *
 * Rate Limits:
 * - Free (no API key): 100 requests per 5 minutes
 * - With API key: 1 request/second (1000 requests per 5 minutes)
 */

import { PhilPaper, PhilPapersSearchResult } from './philpapers';

// Semantic Scholar API types
export interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract?: string;
  authors?: Array<{
    authorId: string;
    name: string;
  }>;
  year?: number;
  citationCount?: number;
  fieldsOfStudy?: string[];
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

// Philosophy subfield types
export type PhilosophySubfield =
  | 'epistemology'
  | 'metaphysics'
  | 'ethics'
  | 'philosophyOfMind'
  | 'politicalPhilosophy'
  | 'aesthetics'
  | 'logic'
  | 'philosophyOfScience'
  | 'existentialism';

// Subfield-specific search term mappings
const SUBFIELD_SEARCH_TERMS: Record<PhilosophySubfield, string[]> = {
  epistemology: ['epistemology', 'knowledge', 'justification'],
  metaphysics: ['metaphysics', 'ontology', 'existence'],
  ethics: ['ethics', 'moral', 'normative'],
  philosophyOfMind: ['philosophy of mind', 'consciousness', 'mental'],
  politicalPhilosophy: ['political philosophy', 'justice', 'rights'],
  aesthetics: ['aesthetics', 'art', 'beauty'],
  logic: ['logic', 'reasoning', 'argument'],
  philosophyOfScience: ['philosophy of science', 'scientific method'],
  existentialism: ['existentialism', 'meaning', 'freedom'],
};

// Semantic Scholar API constants
const SEMANTIC_SCHOLAR_API_BASE = 'https://api.semanticscholar.org/graph/v1';
const SEARCH_ENDPOINT = `${SEMANTIC_SCHOLAR_API_BASE}/paper/search`;
const DEFAULT_FIELDS = 'paperId,title,authors,abstract,year,citationCount,fieldsOfStudy,publicationVenue,url';
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds

/**
 * Search Semantic Scholar Academic Graph API for philosophical papers
 *
 * @param query - Search query string
 * @param limit - Number of results to return (default: 5)
 * @param subfield - Optional philosophy subfield for query enhancement
 * @param apiKey - Optional API key for higher rate limits
 * @returns Promise with search results in unified PhilPaper format
 */
export async function searchSemanticScholar(
  query: string,
  limit: number = 5,
  subfield?: PhilosophySubfield,
  apiKey?: string
): Promise<PhilPapersSearchResult> {
  try {
    // Build enhanced query with philosophy keywords
    const enhancedQuery = buildSemanticScholarQuery(query, subfield);

    // Build request URL
    const searchUrl = new URL(SEARCH_ENDPOINT);
    searchUrl.searchParams.set('query', enhancedQuery);
    searchUrl.searchParams.set('fields', DEFAULT_FIELDS);
    searchUrl.searchParams.set('limit', limit.toString());

    // Build headers
    const headers: Record<string, string> = {
      'User-Agent': 'BunnyGod/2.0',
      'Accept': 'application/json',
    };

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    // Execute request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(searchUrl.toString(), {
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Semantic Scholar rate limit exceeded (429)');
        } else {
          console.warn(`Semantic Scholar API error: ${response.status} ${response.statusText}`);
        }

        // Return empty results on error (don't throw)
        return {
          papers: [],
          total: 0,
          source: 'crossref', // Indicate source type for fallback
        };
      }

      // Parse response
      const data = await response.json() as SemanticScholarResponse;

      // Convert to unified PhilPaper format
      const papers = data.data
        .filter(paper => paper.title && paper.authors && paper.authors.length > 0)
        .map(paper => normalizeSemanticScholarPaper(paper))
        .slice(0, limit);

      console.log(`✅ Semantic Scholar returned ${papers.length} papers`);

      return {
        papers,
        total: data.total || papers.length,
        source: 'crossref', // Use existing source type for compatibility
      };

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.warn('Semantic Scholar request timeout (10s)');
      } else {
        console.warn('Semantic Scholar fetch error:', fetchError.message);
      }

      // Return empty results on error (don't throw)
      return {
        papers: [],
        total: 0,
        source: 'crossref',
      };
    }

  } catch (error: any) {
    console.error('Semantic Scholar search error:', error.message);

    // Return empty results on error (don't throw)
    return {
      papers: [],
      total: 0,
      source: 'crossref',
    };
  }
}

/**
 * Build enhanced search query with philosophy keywords
 *
 * @param query - Original search query
 * @param subfield - Optional philosophy subfield
 * @returns Enhanced query string
 */
export function buildSemanticScholarQuery(
  query: string,
  subfield?: PhilosophySubfield
): string {
  // Start with base query
  let enhancedQuery = query.trim();

  // Add "philosophy" for scope
  enhancedQuery += ' philosophy';

  // Add subfield-specific terms if provided
  if (subfield && SUBFIELD_SEARCH_TERMS[subfield]) {
    const subfieldTerms = SUBFIELD_SEARCH_TERMS[subfield];
    enhancedQuery += ' ' + subfieldTerms.join(' ');
  }

  return enhancedQuery;
}

/**
 * Convert Semantic Scholar paper format to unified PhilPaper interface
 *
 * @param paper - Semantic Scholar paper object
 * @returns Normalized PhilPaper object
 */
function normalizeSemanticScholarPaper(paper: SemanticScholarPaper): PhilPaper {
  return {
    title: paper.title || 'Untitled',
    authors: formatSemanticScholarAuthors(paper.authors || []),
    abstract: paper.abstract,
    url: paper.url || (paper.paperId
      ? `https://www.semanticscholar.org/paper/${paper.paperId}`
      : '#'),
    year: paper.year,
    categories: paper.fieldsOfStudy,
  };
}

/**
 * Format Semantic Scholar author list to string
 *
 * @param authors - Array of Semantic Scholar author objects
 * @returns Formatted author string (e.g., "John Smith, Jane Doe et al.")
 */
export function formatSemanticScholarAuthors(
  authors: Array<{ authorId: string; name: string }>
): string {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }

  // Take first 3 authors
  const names = authors.slice(0, 3).map(author => author.name);

  // Add "et al." if more than 3 authors
  if (authors.length > 3) {
    return names.join(', ') + ' et al.';
  }

  return names.join(', ');
}
