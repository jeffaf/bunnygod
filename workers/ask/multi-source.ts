/**
 * Multi-Source Orchestration for Bunny God
 *
 * Queries multiple academic APIs in parallel (Semantic Scholar + CrossRef)
 * and intelligently merges, deduplicates, and ranks results for optimal
 * philosophical paper discovery.
 *
 * Phase 2, Tasks 6-8: Multi-Source Orchestration & Deduplication
 */

import { PhilPaper, PhilPapersSearchResult, searchPhilPapers } from './philpapers';
import { searchSemanticScholar, PhilosophySubfield } from './semantic-scholar';
import { detectPhilosophySubfield } from './keyword-detection';
import { getSubfieldSearchTerms } from './subfield-keywords';

/**
 * Search multiple academic sources in parallel and merge results
 *
 * This function:
 * 1. Detects philosophy subfield using keyword detection
 * 2. Queries BOTH Semantic Scholar AND CrossRef in parallel
 * 3. Merges and deduplicates results
 * 4. Returns top N results sorted by relevance/citation count
 *
 * @param query - Search query string
 * @param limit - Maximum number of results to return (default: 5)
 * @returns Promise with merged and deduplicated papers
 */
export async function searchMultiSource(
  query: string,
  limit: number = 5
): Promise<PhilPapersSearchResult> {
  const startTime = Date.now();

  // Step 1: Detect philosophy subfield
  const detection = detectPhilosophySubfield(query);
  const detectedSubfield = detection.primarySubfield as PhilosophySubfield | null;

  console.log(
    `🔍 Subfield detection: ${detectedSubfield || 'none'} (confidence: ${detection.confidence.toFixed(2)})`
  );

  // Step 2: Launch parallel queries to both APIs
  // Use Promise.allSettled to handle failures gracefully
  const [semanticResult, crossrefResult] = await Promise.allSettled([
    searchSemanticScholar(query, limit * 2, detectedSubfield || undefined),
    searchCrossRefAPI(query, limit * 2)
  ]);

  // Step 3: Collect successful results
  let semanticPapers: PhilPaper[] = [];
  let crossrefPapers: PhilPaper[] = [];

  if (semanticResult.status === 'fulfilled') {
    semanticPapers = semanticResult.value.papers;
    console.log(`✅ Semantic Scholar: ${semanticPapers.length} papers`);
  } else {
    console.warn(`❌ Semantic Scholar failed: ${semanticResult.reason}`);
  }

  if (crossrefResult.status === 'fulfilled') {
    crossrefPapers = crossrefResult.value.papers;
    console.log(`✅ CrossRef: ${crossrefPapers.length} papers`);
  } else {
    console.warn(`❌ CrossRef failed: ${crossrefResult.reason}`);
  }

  // Step 4: If both failed, return empty results
  if (semanticPapers.length === 0 && crossrefPapers.length === 0) {
    console.error('❌ Both APIs failed - returning empty results');
    return {
      papers: [],
      total: 0,
      source: 'crossref'
    };
  }

  // Step 5: Merge and deduplicate results
  const mergedPapers = mergeResults(semanticPapers, crossrefPapers, limit);

  const totalTime = Date.now() - startTime;
  console.log(
    `✅ Multi-source search complete: ${mergedPapers.length} papers in ${totalTime}ms`
  );

  return {
    papers: mergedPapers,
    total: semanticPapers.length + crossrefPapers.length,
    source: 'crossref' // Maintain compatibility with existing code
  };
}

/**
 * Search CrossRef API (wrapper for existing function)
 *
 * This wrapper uses the existing searchPhilPapers function which
 * falls back to CrossRef when PhilPapers credentials are not provided.
 *
 * @param query - Search query string
 * @param limit - Maximum number of results
 * @returns Promise with CrossRef search results
 */
async function searchCrossRefAPI(
  query: string,
  limit: number
): Promise<PhilPapersSearchResult> {
  // Use existing searchPhilPapers function without credentials
  // This will automatically fall back to CrossRef
  return searchPhilPapers(query, limit);
}

/**
 * Merge results from multiple sources with deduplication and ranking
 *
 * Algorithm:
 * 1. Combine both paper arrays
 * 2. Deduplicate based on title similarity (80% threshold)
 * 3. Sort by citation count (descending)
 * 4. Take top N results
 *
 * @param semanticPapers - Papers from Semantic Scholar
 * @param crossrefPapers - Papers from CrossRef
 * @param limit - Maximum number of results to return
 * @returns Array of merged and deduplicated papers
 */
export function mergeResults(
  semanticPapers: PhilPaper[],
  crossrefPapers: PhilPaper[],
  limit: number
): PhilPaper[] {
  // Step 1: Combine arrays (Semantic Scholar first for priority)
  const allPapers = [...semanticPapers, ...crossrefPapers];

  // Step 2: Deduplicate
  const uniquePapers = deduplicateResults(allPapers);

  // Step 3: Sort by citation count (if available)
  // Note: PhilPaper interface doesn't have citationCount yet
  // For now, keep order as-is (Semantic Scholar papers first)
  // In future: sort by citationCount when interface is updated

  // Step 4: Take top N results
  return uniquePapers.slice(0, limit);
}

/**
 * Remove duplicate papers based on title similarity
 *
 * Uses 80% similarity threshold to detect duplicates.
 * When duplicates are found, keeps the paper with more citations
 * (or first occurrence if citation data not available).
 *
 * @param results - Array of papers (possibly with duplicates)
 * @returns Array of unique papers with duplicates removed
 */
export function deduplicateResults(results: PhilPaper[]): PhilPaper[] {
  const uniquePapers: PhilPaper[] = [];

  for (const paper of results) {
    // Check if similar paper already exists
    let isDuplicate = false;

    for (let i = 0; i < uniquePapers.length; i++) {
      const existingPaper = uniquePapers[i];
      const similarity = calculateTitleSimilarity(paper.title, existingPaper.title);

      // If similarity > 80%, consider it a duplicate
      if (similarity > 0.8) {
        isDuplicate = true;

        // Replace existing paper if new one has more citations
        // Note: PhilPaper interface doesn't have citationCount yet
        // For now, keep first occurrence
        // In future: compare citationCount and keep higher one

        console.log(
          `🔄 Duplicate detected: "${paper.title}" ~= "${existingPaper.title}" (${(similarity * 100).toFixed(0)}% similar)`
        );

        break;
      }
    }

    // Add paper if not duplicate
    if (!isDuplicate) {
      uniquePapers.push(paper);
    }
  }

  console.log(
    `✅ Deduplication: ${results.length} → ${uniquePapers.length} papers (${results.length - uniquePapers.length} duplicates removed)`
  );

  return uniquePapers;
}

/**
 * Calculate similarity between two paper titles
 *
 * Uses normalized string comparison with Levenshtein distance ratio.
 * Returns similarity score from 0.0 (completely different) to 1.0 (identical).
 *
 * @param title1 - First title
 * @param title2 - Second title
 * @returns Similarity score (0.0 - 1.0)
 */
export function calculateTitleSimilarity(title1: string, title2: string): number {
  // Step 1: Normalize titles
  const normalized1 = normalizeTitle(title1);
  const normalized2 = normalizeTitle(title2);

  // Step 2: Quick exact match check
  if (normalized1 === normalized2) {
    return 1.0;
  }

  // Step 3: Calculate Levenshtein distance
  const distance = levenshteinDistance(normalized1, normalized2);

  // Step 4: Convert distance to similarity ratio
  const maxLength = Math.max(normalized1.length, normalized2.length);
  const similarity = maxLength > 0 ? 1 - (distance / maxLength) : 0;

  return similarity;
}

/**
 * Normalize title for comparison
 *
 * Removes punctuation, converts to lowercase, and trims whitespace.
 *
 * @param title - Original title
 * @returns Normalized title
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Collapse multiple spaces
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 *
 * Levenshtein distance is the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string
 * into another.
 *
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Levenshtein distance (number of edits)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // Create 2D array for dynamic programming
  const matrix: number[][] = [];

  // Initialize first column (transform str1 to empty string)
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  // Initialize first row (transform empty string to str2)
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Deletion
        matrix[i][j - 1] + 1,      // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[len1][len2];
}
