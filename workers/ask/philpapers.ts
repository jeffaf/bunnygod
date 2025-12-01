/**
 * PhilPapers.org API Client
 *
 * Queries the PhilPapers API to find relevant philosophical papers
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
}

/**
 * Search PhilPapers for relevant philosophical papers
 */
export async function searchPhilPapers(
  query: string,
  limit: number = 5
): Promise<PhilPapersSearchResult> {
  try {
    // PhilPapers API endpoint
    // Documentation: https://philpapers.org/help/api/
    const apiUrl = 'https://philpapers.org/s/';

    // Build search URL
    const searchUrl = new URL(apiUrl + encodeURIComponent(query));
    searchUrl.searchParams.set('format', 'json');
    searchUrl.searchParams.set('limit', limit.toString());

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'BunnyGod/1.0 (Philosophical Q&A AI)',
      },
    });

    if (!response.ok) {
      throw new Error(`PhilPapers API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;

    // Parse PhilPapers response format
    const papers: PhilPaper[] = [];

    if (data && Array.isArray(data)) {
      for (const item of data.slice(0, limit)) {
        papers.push({
          title: item.title || 'Untitled',
          authors: formatAuthors(item.authors || []),
          abstract: item.abstract || '',
          url: item.url || `https://philpapers.org/rec/${item.id}`,
          year: item.pubYear,
          categories: item.categories || [],
        });
      }
    }

    return {
      papers,
      total: data?.length || 0,
    };

  } catch (error) {
    console.error('PhilPapers search error:', error);

    // Return fallback result
    return {
      papers: [{
        title: 'Philosophy Research on PhilPapers.org',
        authors: 'Various Philosophers',
        url: 'https://philpapers.org',
      }],
      total: 0,
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
 * Format author list for display
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
        return author.name || author.fullName || 'Unknown';
      }
      return String(author);
    });

  if (authors.length > 3) {
    return names.join(', ') + ' et al.';
  }

  return names.join(', ');
}
