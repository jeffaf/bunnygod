/**
 * Philosophy Subfield Keyword Mappings
 *
 * Complete keyword taxonomy for 9 major philosophy subfields.
 * Used by keyword-detection.ts for automatic subfield classification.
 *
 * Source: PRD Appendix C - Philosophy Subfield Keywords
 */

import type { PhilosophySubfield } from './types';

/**
 * Keyword mapping structure with weights for scoring
 */
export interface SubfieldKeywordMap {
  keywords: string[];
  weight: number;
}

/**
 * Complete keyword taxonomy for all supported philosophy subfields
 */
export const PHILOSOPHY_SUBFIELDS: Record<PhilosophySubfield, SubfieldKeywordMap> = {
  epistemology: {
    keywords: [
      'knowledge',
      'truth',
      'belief',
      'justification',
      'skepticism',
      'certainty',
      'evidence',
      'epistemic',
      'cognition',
      'understanding',
      'rationalism',
      'empiricism',
      'perception',
      'testimony',
      'memory',
    ],
    weight: 1.0,
  },

  metaphysics: {
    keywords: [
      'existence',
      'reality',
      'being',
      'causation',
      'time',
      'space',
      'identity',
      'essence',
      'substance',
      'property',
      'possible world',
      'necessity',
      'contingency',
      'ontology',
      'persistence',
      'change',
    ],
    weight: 1.0,
  },

  ethics: {
    keywords: [
      'right',
      'wrong',
      'ought',
      'good',
      'evil',
      'virtue',
      'duty',
      'moral',
      'ethical',
      'justice',
      'fairness',
      'obligation',
      'consequentialism',
      'deontology',
      'utilitarianism',
      'character',
    ],
    weight: 1.0,
  },

  'philosophy-of-mind': {
    keywords: [
      'consciousness',
      'mind',
      'mental',
      'thought',
      'perception',
      'qualia',
      'intentionality',
      'self',
      'awareness',
      'experience',
      'cognition',
      'brain',
      'dualism',
      'materialism',
      'functionalism',
    ],
    weight: 1.0,
  },

  'political-philosophy': {
    keywords: [
      'justice',
      'rights',
      'state',
      'government',
      'liberty',
      'freedom',
      'authority',
      'democracy',
      'power',
      'equality',
      'legitimacy',
      'social contract',
      'sovereignty',
      'citizenship',
      'law',
    ],
    weight: 1.0,
  },

  aesthetics: {
    keywords: [
      'beauty',
      'art',
      'taste',
      'aesthetic',
      'sublime',
      'ugly',
      'artistic',
      'creative',
      'expression',
      'representation',
      'interpretation',
      'criticism',
      'style',
      'form',
      'content',
    ],
    weight: 1.0,
  },

  logic: {
    keywords: [
      'argument',
      'reasoning',
      'validity',
      'proof',
      'inference',
      'premise',
      'conclusion',
      'fallacy',
      'deduction',
      'induction',
      'soundness',
      'consistency',
      'contradiction',
      'formal',
      'modal',
    ],
    weight: 1.0,
  },

  'philosophy-of-science': {
    keywords: [
      'science',
      'theory',
      'explanation',
      'law',
      'hypothesis',
      'experiment',
      'observation',
      'scientific method',
      'paradigm',
      'confirmation',
      'falsification',
      'realism',
      'instrumentalism',
    ],
    weight: 1.0,
  },

  existentialism: {
    keywords: [
      'meaning',
      'freedom',
      'existence',
      'absurd',
      'authenticity',
      'anxiety',
      'choice',
      'responsibility',
      'being-in-the-world',
      'nothingness',
      'death',
      'facticity',
      'transcendence',
    ],
    weight: 1.0,
  },
};

/**
 * Get search terms optimized for querying academic APIs
 * Maps subfields to their most representative search keywords
 */
export function getSubfieldSearchTerms(subfield: PhilosophySubfield): string[] {
  const searchTermMap: Record<PhilosophySubfield, string[]> = {
    epistemology: ['epistemology', 'knowledge', 'justification'],
    metaphysics: ['metaphysics', 'ontology', 'existence'],
    ethics: ['ethics', 'moral', 'normative'],
    'philosophy-of-mind': ['philosophy of mind', 'consciousness', 'mental'],
    'political-philosophy': ['political philosophy', 'justice', 'rights'],
    aesthetics: ['aesthetics', 'art', 'beauty'],
    logic: ['logic', 'reasoning', 'argument'],
    'philosophy-of-science': ['philosophy of science', 'scientific method'],
    existentialism: ['existentialism', 'meaning', 'freedom'],
  };

  return searchTermMap[subfield] || [];
}
