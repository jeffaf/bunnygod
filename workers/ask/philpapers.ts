/**
 * CrossRef API Client
 *
 * Queries the CrossRef scholarly database to find relevant academic papers
 * CrossRef is a Digital Object Identifier (DOI) Registration Agency providing
 * access to millions of scholarly publications with metadata.
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
 * Search CrossRef for relevant philosophical papers
 */
export async function searchPhilPapers(
  query: string,
  limit: number = 5
): Promise<PhilPapersSearchResult> {
  try {
    // CrossRef API endpoint
    // Documentation: https://api.crossref.org/swagger-ui/index.html
    const apiUrl = 'https://api.crossref.org/works';

    // Add philosophy-related keywords to improve relevance
    const philosophyQuery = `${query} philosophy ethics moral`;

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
      return {
        papers,
        total: data?.message?.['total-results'] || papers.length,
      };
    }

    // If no results, throw error to trigger fallback
    throw new Error('No papers found in CrossRef');

  } catch (error) {
    console.error('CrossRef search error:', error);

    // Return fallback result only if CrossRef completely fails
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
