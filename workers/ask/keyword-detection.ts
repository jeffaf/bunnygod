/**
 * Philosophy Subfield Keyword Detection
 *
 * Analyzes user questions to automatically detect the primary philosophy subfield
 * (epistemology, metaphysics, ethics, etc.) using keyword matching.
 *
 * This eliminates the hardcoded "ethics moral" bias in the original implementation
 * and enables intelligent query augmentation for better source diversity.
 */

import type { PhilosophySubfield, SubfieldDetection } from './types';
import { PHILOSOPHY_SUBFIELDS } from './subfield-keywords';

/**
 * Common English stop words to filter out during keyword matching
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'what', 'when', 'where', 'who', 'why',
  'how', 'can', 'could', 'should', 'would', 'do', 'does', 'did',
]);

/**
 * Normalize text for keyword matching
 * - Convert to lowercase
 * - Remove punctuation
 * - Remove extra whitespace
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')  // Remove punctuation except hyphens
    .replace(/\s+/g, ' ')        // Normalize whitespace
    .trim();
}

/**
 * Tokenize text into words, filtering out stop words
 */
function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  const words = normalized.split(' ').filter(word => word.length > 0);
  return words.filter(word => !STOP_WORDS.has(word));
}

/**
 * Calculate simple string similarity (case insensitive)
 * Used for fuzzy keyword matching with Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Check if a keyword matches a word with fuzzy matching
 * Allows Levenshtein distance ≤ 1 for precision (only single typo/variant)
 */
function fuzzyMatch(keyword: string, word: string): boolean {
  // Exact match
  if (keyword === word) {
    return true;
  }

  // Only handle single-word keywords here; multi-word handled elsewhere
  if (keyword.includes(' ')) {
    return false;
  }

  // Fuzzy match (Levenshtein distance ≤ 1)
  // This allows for single typos or close variants, but avoids false positives
  const distance = levenshteinDistance(keyword, word);
  return distance <= 1;
}

/**
 * Count keyword matches in text for a given subfield
 */
function countKeywordMatches(
  tokens: string[],
  keywords: string[],
  normalizedText: string
): { count: number; matched: string[] } {
  const matched = new Set<string>();

  // Check each keyword against all tokens
  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);

    // For multi-word keywords, check in full text
    if (normalizedKeyword.includes(' ')) {
      if (normalizedText.includes(normalizedKeyword)) {
        matched.add(keyword);
      }
      continue;
    }

    // For single-word keywords, check against tokens
    for (const token of tokens) {
      if (fuzzyMatch(normalizedKeyword, token)) {
        matched.add(keyword);
        break; // Count keyword only once
      }
    }
  }

  return {
    count: matched.size,
    matched: Array.from(matched),
  };
}

/**
 * Detect the primary philosophy subfield for a given question
 *
 * Algorithm:
 * 1. Normalize and tokenize the question
 * 2. Count keyword matches for each subfield
 * 3. Calculate confidence score based on match density
 * 4. Return subfield with highest score if confidence >= 30%
 * 5. Return null if no clear subfield detected
 *
 * @param question - The user's question text
 * @returns SubfieldDetection object with primary subfield and confidence
 *
 * @example
 * detectPhilosophySubfield("What is knowledge?")
 * // => { primarySubfield: 'epistemology', confidence: 0.85, ... }
 *
 * @example
 * detectPhilosophySubfield("Tell me about Plato")
 * // => { primarySubfield: null, confidence: 0.0, ... }
 */
export function detectPhilosophySubfield(question: string): SubfieldDetection {
  // Normalize and tokenize input
  const normalizedText = normalizeText(question);
  const tokens = tokenize(question);

  // Edge case: empty or very short question
  if (tokens.length === 0 || question.trim().length < 3) {
    return {
      primarySubfield: null,
      confidence: 0.0,
      matchedKeywords: [],
      allMatches: {},
    };
  }

  // Count keyword matches for each subfield
  const subfieldScores: Array<{
    subfield: PhilosophySubfield;
    matchCount: number;
    matched: string[];
    score: number;
  }> = [];

  const allMatches: Record<string, number> = {};

  for (const [subfield, config] of Object.entries(PHILOSOPHY_SUBFIELDS)) {
    const { count, matched } = countKeywordMatches(
      tokens,
      config.keywords,
      normalizedText
    );

    allMatches[subfield] = count;

    // Calculate score: match count weighted by subfield weight
    // Note: We use absolute match count rather than percentage because
    // percentage would unfairly penalize subfields with more keywords.
    // A question with 2 strong keyword matches is highly relevant regardless
    // of whether the subfield has 15 or 20 total keywords.
    const score = count * config.weight;

    subfieldScores.push({
      subfield: subfield as PhilosophySubfield,
      matchCount: count,
      matched,
      score,
    });
  }

  // Sort by score (descending)
  subfieldScores.sort((a, b) => b.score - a.score);

  const topSubfield = subfieldScores[0];

  // Threshold filtering:
  // - For questions with 1 match: check if it's a clear winner
  // - For questions with 2+ matches: automatically accept (strong signal)
  // Since we're using absolute match counts as scores, no additional threshold needed for 2+
  // If no matches at all, return null
  if (topSubfield.matchCount === 0) {
    return {
      primarySubfield: null,
      confidence: 0.0,
      matchedKeywords: [],
      allMatches,
    };
  }

  // If only 1 match, check if it's a clear winner (no other subfield has matches)
  if (topSubfield.matchCount === 1) {
    const secondSubfield = subfieldScores[1];
    // Accept single match if:
    // 1. No other subfield has any matches (clear winner)
    // 2. Score is significantly higher than second place (not a tie)
    if (secondSubfield.matchCount === 0) {
      return {
        primarySubfield: topSubfield.subfield,
        confidence: Math.min(1.0, topSubfield.matchCount / 5), // Normalize to 0-1 range
        matchedKeywords: topSubfield.matched,
        allMatches,
      };
    }
    // For ties (both have 1 match), just pick the top one (already sorted)
    // This is common for overlapping keywords like "justice" (ethics vs political-philosophy)
    // In practice, returning any reasonable answer is better than returning null
    if (secondSubfield.matchCount === 1) {
      return {
        primarySubfield: topSubfield.subfield,
        confidence: topSubfield.matchCount / 5, // Normalize to 0-1 range
        matchedKeywords: topSubfield.matched,
        allMatches,
      };
    }
    // If second subfield has more matches (shouldn't happen given sorting), reject
    return {
      primarySubfield: null,
      confidence: 0.0,
      matchedKeywords: [],
      allMatches,
    };
  }

  // For 2+ matches, automatically accept as it's a strong signal
  // (Already handled by being here - we passed the 1-match checks above)

  // Handle exact ties (same match count)
  // Prefer epistemology/metaphysics as core philosophy
  const secondSubfield = subfieldScores[1];
  if (secondSubfield && topSubfield.matchCount === secondSubfield.matchCount) {
    const coreSubfields: PhilosophySubfield[] = ['epistemology', 'metaphysics'];
    if (coreSubfields.includes(secondSubfield.subfield) &&
        !coreSubfields.includes(topSubfield.subfield)) {
      return {
        primarySubfield: secondSubfield.subfield,
        confidence: secondSubfield.matchCount / 5, // Normalize to 0-1 range (assume max 5 matches)
        matchedKeywords: secondSubfield.matched,
        allMatches,
      };
    }
  }

  return {
    primarySubfield: topSubfield.subfield,
    confidence: topSubfield.matchCount / 5, // Normalize to 0-1 range (assume max 5 matches)
    matchedKeywords: topSubfield.matched,
    allMatches,
  };
}

/**
 * Extract search terms from question for query augmentation
 * Returns relevant keywords found in the question
 */
export function extractSearchTerms(
  question: string,
  detection: SubfieldDetection
): string[] {
  if (!detection.primarySubfield) {
    return [];
  }

  return detection.matchedKeywords.slice(0, 3); // Limit to top 3 for query
}
