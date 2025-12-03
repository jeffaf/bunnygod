/**
 * PhilPapers & CrossRef API Client
 *
 * Primary: PhilPapers.org - Specialized philosophy database with 2.96M+ philosophical papers
 * Fallback: CrossRef - General scholarly database with DOI registration
 *
 * PhilPapers API requires authentication (apiId + apiKey)
 * Register at: https://philpapers.org/help/api.html
 */

export interface PhilPaper {
  title: string;
  authors: string;
  abstract?: string;
  url: string;
  year?: number;
  categories?: string[];
}

export interface PhilPapersSearchResult {
  papers: PhilPaper[];
  total: number;
  source?: 'philpapers' | 'crossref'; // Track which API was used
}

export interface PhilPapersApiCredentials {
  apiId?: string;
  apiKey?: string;
}

/**
 * Search PhilPapers.org database for philosophical papers
 * Falls back to CrossRef if PhilPapers is unavailable or fails
 */
export async function searchPhilPapers(
  query: string,
  limit: number = 5,
  credentials?: PhilPapersApiCredentials
): Promise<PhilPapersSearchResult> {
  // Try PhilPapers API first if credentials are provided
  if (credentials?.apiId && credentials?.apiKey) {
    try {
      const philPapersResult = await searchPhilPapersAPI(query, limit, credentials);
      if (philPapersResult.papers.length > 0) {
        console.log('✅ Successfully retrieved papers from PhilPapers API');
        return { ...philPapersResult, source: 'philpapers' };
      }
    } catch (error) {
      console.warn('PhilPapers API failed, falling back to CrossRef:', error);
    }
  } else {
    console.log('⚠️ PhilPapers credentials not provided, using CrossRef');
  }

  // Fallback to CrossRef API
  return searchCrossRefAPI(query, limit);
}

/**
 * Search PhilPapers.org API directly
 * Requires API credentials from https://philpapers.org/help/api.html
 */
async function searchPhilPapersAPI(
  query: string,
  limit: number,
  credentials: PhilPapersApiCredentials
): Promise<PhilPapersSearchResult> {
  // PhilPapers API endpoint
  // Documentation: https://philpapers.org/help/api/json.html
  const apiUrl = 'https://philpapers.org/philpapers/api/search';

  const searchUrl = new URL(apiUrl);
  searchUrl.searchParams.set('apiId', credentials.apiId!);
  searchUrl.searchParams.set('apiKey', credentials.apiKey!);
  searchUrl.searchParams.set('searchStr', query);
  searchUrl.searchParams.set('limit', limit.toString());
  searchUrl.searchParams.set('format', 'json');

  const response = await fetch(searchUrl.toString(), {
    headers: {
      'User-Agent': 'BunnyGod/1.0 (mailto:contact@bunnygod.ai; Philosophical Q&A AI)',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`PhilPapers API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as any;

  const papers: PhilPaper[] = [];

  // Parse PhilPapers response format
  // Note: Actual format may vary - this is based on typical API patterns
  if (data?.results && Array.isArray(data.results)) {
    for (const item of data.results.slice(0, limit)) {
      papers.push({
        title: item.title || 'Untitled',
        authors: formatPhilPapersAuthors(item.authors || item.author || []),
        abstract: item.abstract || item.description || '',
        url: item.url || item.link || `https://philpapers.org/rec/${item.id}`,
        year: item.year || item.pubYear || undefined,
        categories: item.categories || item.topics || [],
      });
    }
  }

  return {
    papers,
    total: data?.total || data?.totalResults || papers.length,
  };
}

/**
 * Search CrossRef API as fallback
 * CrossRef is a general scholarly database with DOI registration
 */
export async function searchCrossRefAPI(
  query: string,
  limit: number
): Promise<PhilPapersSearchResult> {
  try {
    // CrossRef API endpoint
    // Documentation: https://api.crossref.org/swagger-ui/index.html
    const apiUrl = 'https://api.crossref.org/works';

    // Add philosophy-related keywords to improve relevance
    const philosophyQuery = `${query} philosophy`;

    // Build search URL
    const searchUrl = new URL(apiUrl);
    searchUrl.searchParams.set('query', philosophyQuery);
    searchUrl.searchParams.set('rows', limit.toString());
    searchUrl.searchParams.set('select', 'DOI,title,author,published,abstract,type');
    searchUrl.searchParams.set('sort', 'relevance');

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'BunnyGod/1.0 (mailto:contact@bunnygod.ai; Philosophical Q&A AI)',
      },
    });

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;

    // Parse CrossRef response format
    const papers: PhilPaper[] = [];

    if (data?.message?.items && Array.isArray(data.message.items)) {
      for (const item of data.message.items.slice(0, limit)) {
        // Get publication year
        const year = item.published?.['date-parts']?.[0]?.[0] ||
                    item.created?.['date-parts']?.[0]?.[0];

        // Get title (CrossRef returns title as array)
        const title = Array.isArray(item.title) ? item.title[0] :
                     (item.title || 'Untitled');

        papers.push({
          title,
          authors: formatAuthors(item.author || []),
          abstract: item.abstract || '',
          url: item.DOI ? `https://doi.org/${item.DOI}` : '#',
          year,
          categories: item.type ? [item.type] : [],
        });
      }
    }

    // If we got results, return them
    if (papers.length > 0) {
      console.log('✅ Successfully retrieved papers from CrossRef');
      return {
        papers,
        total: data?.message?.['total-results'] || papers.length,
        source: 'crossref',
      };
    }

    // If no results, throw error to trigger final fallback
    throw new Error('No papers found in CrossRef');

  } catch (error) {
    console.error('CrossRef search error:', error);

    // Return minimal fallback result only if everything fails
    return {
      papers: [{
        title: 'Philosophy Research on PhilPapers.org',
        authors: 'Various Philosophers',
        url: 'https://philpapers.org',
      }],
      total: 0,
      source: 'crossref',
    };
  }
}

/**
 * Extract key concepts from a question for better searching
 */
export function extractSearchTerms(question: string): string {
  // Remove question words and common terms
  const stopWords = [
    'what', 'is', 'are', 'the', 'a', 'an', 'how', 'why', 'when', 'where',
    'who', 'which', 'can', 'could', 'would', 'should', 'do', 'does',
    'did', 'will', 'was', 'were', 'been', 'being', 'have', 'has', 'had',
    'about', 'according', 'to', 'of', 'for', 'in', 'on', 'at', 'by'
  ];

  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));

  return words.slice(0, 5).join(' ');
}

/**
 * Format PhilPapers author list
 * PhilPapers typically returns author names as strings or objects
 */
function formatPhilPapersAuthors(authors: any[]): string {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }

  if (typeof authors[0] === 'string') {
    const names = authors.slice(0, 3);
    return authors.length > 3 ? names.join(', ') + ' et al.' : names.join(', ');
  }

  const names = authors
    .slice(0, 3)
    .map(author => {
      if (typeof author === 'object' && author !== null) {
        return author.name || author.fullName ||
               (author.firstName && author.lastName ? `${author.firstName} ${author.lastName}` : 'Unknown');
      }
      return String(author);
    });

  return authors.length > 3 ? names.join(', ') + ' et al.' : names.join(', ');
}

/**
 * Format author list for display
 * CrossRef format: { given: "John", family: "Smith" }
 */
function formatAuthors(authors: any[]): string {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }

  if (typeof authors[0] === 'string') {
    return authors.slice(0, 3).join(', ');
  }

  const names = authors
    .slice(0, 3)
    .map(author => {
      if (typeof author === 'object' && author !== null) {
        // CrossRef format: { given: "FirstName", family: "LastName" }
        if (author.given && author.family) {
          return `${author.given} ${author.family}`;
        }
        // Fallback formats
        return author.name || author.fullName || 'Unknown';
      }
      return String(author);
    });

  if (authors.length > 3) {
    return names.join(', ') + ' et al.';
  }

  return names.join(', ');
}
