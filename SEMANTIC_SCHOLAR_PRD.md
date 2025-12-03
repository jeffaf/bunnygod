# Semantic Scholar API Integration - Product Requirements Document

**Project:** Bunny God Philosophical Q&A System
**Document Version:** 1.0
**Created:** 2025-12-02
**Author:** Atlas (Principal Software Architect)
**Status:** Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Technical Architecture](#technical-architecture)
4. [System Design](#system-design)
5. [API Integration Specifications](#api-integration-specifications)
6. [Smart Keyword Detection System](#smart-keyword-detection-system)
7. [Multi-Source Strategy](#multi-source-strategy)
8. [Response Normalization](#response-normalization)
9. [File Structure & Organization](#file-structure--organization)
10. [Implementation Checklist](#implementation-checklist)
11. [Testing Strategy](#testing-strategy)
12. [Rollback Plan](#rollback-plan)
13. [Performance Considerations](#performance-considerations)
14. [Success Metrics](#success-metrics)
15. [Appendices](#appendices)

---

## Executive Summary

### Project Overview

The Bunny God philosophical Q&A system currently relies exclusively on CrossRef API as its data source, with a hardcoded bias toward ethics and moral philosophy keywords. This creates an imbalanced user experience where questions about epistemology, metaphysics, philosophy of mind, and other subfields receive disproportionately few relevant sources.

This PRD outlines the integration of Semantic Scholar API as a complementary data source alongside CrossRef, introducing intelligent philosophy subfield detection to eliminate hardcoded biases and improve source diversity across all philosophical domains.

### Business Objectives

- **Improve source diversity**: Provide balanced coverage across all philosophy subfields
- **Enhance relevance**: Match sources to specific philosophical domains (epistemology, metaphysics, etc.)
- **Increase reliability**: Dual-source architecture with intelligent fallbacks
- **Maintain performance**: No degradation in response time or user experience
- **Future-proof architecture**: Scalable foundation for additional academic APIs

### Technical Scope

- Integrate Semantic Scholar Academic Graph API (free tier, optional API key support)
- Implement smart keyword detection for 9 major philosophy subfields
- Design parallel dual-source querying with intelligent result merging
- Normalize responses from multiple APIs into unified format
- Implement feature flag for safe rollout
- Maintain backward compatibility with existing CrossRef implementation

### Timeline Estimate

- **Phase 1 (Week 1)**: Core API integration, keyword detection, response normalization
- **Phase 2 (Week 2)**: Multi-source orchestration, caching strategy, error handling
- **Phase 3 (Week 3)**: Testing, feature flag rollout, monitoring
- **Phase 4 (Week 4)**: Performance optimization, documentation, production deployment

**Total estimated development time:** 3-4 weeks (single engineer)

### Success Criteria

- 50%+ reduction in "ethics/moral" papers for non-ethics queries
- 30%+ increase in subfield-specific source relevance
- Zero degradation in P95 response latency
- 95%+ API success rate across both sources
- Successful A/B test showing improved user feedback ratings

---

## Problem Statement

### Current Architecture Issues

**Location:** `/home/gat0r/bunnygod/workers/ask/philpapers.ts` (line 129)

```typescript
// PROBLEM: Hardcoded bias toward moral philosophy
const philosophyQuery = `${query} philosophy ethics moral`;
```

**Impact:**
- User asks: "What is knowledge?" (epistemology)
- System searches: "knowledge philosophy ethics moral"
- Result: 80% ethics papers, 20% epistemology papers
- User experience: Frustrated by irrelevant sources

### Root Causes

1. **Single data source**: CrossRef alone lacks sophisticated subject classification
2. **Hardcoded keywords**: "ethics moral" appended to ALL queries regardless of intent
3. **No subfield detection**: System cannot distinguish epistemology from ethics from metaphysics
4. **Limited filtering**: CrossRef's subject filtering is minimal for philosophy

### User Impact

**Affected user scenarios:**
- Epistemology questions (knowledge, truth, justification) → get ethics papers
- Metaphysics questions (existence, causation, time) → get ethics papers
- Philosophy of mind questions (consciousness, qualia) → get ethics papers
- Logic questions (validity, soundness, proof) → get ethics papers

**Result:** Users perceive Bunny God as "only good at ethics questions"

---

## Technical Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Question Input                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Smart Keyword Detection Module                      │
│  Analyzes question → Detects philosophy subfield                │
│  Output: { subfield: 'epistemology', keywords: [...] }          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Multi-Source Orchestration Layer                    │
│                                                                   │
│  ┌───────────────────┐              ┌───────────────────┐       │
│  │  Semantic Scholar │              │     CrossRef      │       │
│  │   Primary Source  │              │  Fallback Source  │       │
│  │                   │              │                   │       │
│  │  - Philosophy tag │              │  - General search │       │
│  │  - Subfield boost │              │  - No bias added  │       │
│  │  - 5 results      │              │  - 3 results      │       │
│  └─────────┬─────────┘              └─────────┬─────────┘       │
│            │                                  │                 │
│            └──────────────┬───────────────────┘                 │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Response Normalization & Merging                    │
│  - Deduplicate by title similarity                              │
│  - Rank by relevance score                                      │
│  - Limit to top 5 papers                                        │
│  - Track source attribution                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    KV Cache Storage                              │
│  Key: hash(question+subfield)                                   │
│  TTL: 24 hours                                                  │
│  Value: { papers, sources, metadata }                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Workers AI (Llama 3.1)                          │
│             Synthesize answer from sources                       │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Parallel execution**: Both APIs queried simultaneously for minimum latency
2. **Graceful degradation**: If one API fails, the other continues
3. **Source diversity**: Merge results from both sources for maximum coverage
4. **Smart caching**: Cache key includes detected subfield for precision
5. **Feature flag control**: Easy rollback if issues arise
6. **Backward compatibility**: Existing CrossRef-only mode remains functional

---

## System Design

### Component Responsibilities

#### 1. Keyword Detection Module
**File:** `/home/gat0r/bunnygod/workers/ask/keyword-detection.ts` (NEW)

**Responsibilities:**
- Analyze user question text
- Detect primary philosophy subfield
- Extract domain-specific keywords
- Return augmented search parameters

**Input:** User question string
**Output:** `{ subfield: string, keywords: string[], confidence: number }`

#### 2. Semantic Scholar Client
**File:** `/home/gat0r/bunnygod/workers/ask/semantic-scholar.ts` (NEW)

**Responsibilities:**
- HTTP client for Semantic Scholar API
- Request building with philosophy filters
- Response parsing and error handling
- Rate limit management
- Retry logic with exponential backoff

**Input:** Search query + subfield hint
**Output:** Array of normalized papers

#### 3. Multi-Source Orchestrator
**File:** `/home/gat0r/bunnygod/workers/ask/multi-source.ts` (NEW)

**Responsibilities:**
- Parallel API invocation
- Result merging and deduplication
- Relevance ranking
- Source attribution tracking
- Fallback coordination

**Input:** Detected keywords + subfield
**Output:** Merged paper list with source tags

#### 4. Response Normalizer
**File:** `/home/gat0r/bunnygod/workers/ask/normalizer.ts` (NEW)

**Responsibilities:**
- Map Semantic Scholar format → unified `PhilPaper` interface
- Map CrossRef format → unified `PhilPaper` interface
- Handle missing fields gracefully
- Ensure consistent data types

**Input:** Raw API response (any source)
**Output:** Array of `PhilPaper` objects

#### 5. Updated Main Module
**File:** `/home/gat0r/bunnygod/workers/ask/philpapers.ts` (MODIFIED)

**Changes:**
- Remove hardcoded "ethics moral" bias
- Import multi-source orchestrator
- Add feature flag checks
- Maintain backward compatibility

---

## API Integration Specifications

### Semantic Scholar API Details

**Base URL:** `https://api.semanticscholar.org/graph/v1`

**Endpoint:** `/paper/search`

**Rate Limits:**
- **Free (no API key)**: 100 requests per 5 minutes (shared pool)
- **With API key**: 1 request per second (1000 requests per 5 minutes)

**Authentication:** Optional API key via `x-api-key` header

### Request Format

```typescript
// Semantic Scholar paper search request
interface SemanticScholarSearchParams {
  query: string;              // REQUIRED: search query
  fields?: string;            // Comma-separated field list
  year?: string;              // Filter by year range (e.g., "2000-2024")
  fieldsOfStudy?: string[];   // Filter by academic field
  limit?: number;             // Results limit (default: 10, max: 100)
  offset?: number;            // Pagination offset
}

// Example request
GET https://api.semanticscholar.org/graph/v1/paper/search?query=epistemology+knowledge&fields=paperId,title,authors,abstract,year,citationCount,fieldsOfStudy&fieldsOfStudy=Philosophy&limit=5
```

### Response Format

```typescript
// Semantic Scholar API response
interface SemanticScholarResponse {
  total: number;
  offset: number;
  next?: number;
  data: Array<{
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
  }>;
}
```

### Required Fields Parameter

**Optimal fields for philosophy queries:**
```
paperId,title,authors,abstract,year,citationCount,fieldsOfStudy,publicationVenue,url
```

**Field descriptions:**
- `paperId`: Semantic Scholar unique identifier
- `title`: Paper title
- `authors`: Author list with names
- `abstract`: Paper abstract (critical for relevance)
- `year`: Publication year
- `citationCount`: Citation count (quality signal)
- `fieldsOfStudy`: Subject classification (includes "Philosophy")
- `publicationVenue`: Journal/conference name
- `url`: Semantic Scholar paper URL

### Error Handling

**Expected error codes:**
- `400`: Invalid query parameters
- `429`: Rate limit exceeded
- `500`: Semantic Scholar server error
- `503`: Service temporarily unavailable

**Retry strategy:**
- Initial retry delay: 1000ms
- Max retries: 2
- Exponential backoff: delay * 2^retryCount
- Fallback to CrossRef after max retries

---

## Smart Keyword Detection System

### Philosophy Subfield Taxonomy

The system recognizes **9 major philosophy subfields** based on keyword analysis:

```typescript
// Subfield taxonomy with detection keywords
const PHILOSOPHY_SUBFIELDS = {
  epistemology: {
    keywords: [
      'knowledge', 'truth', 'belief', 'justification', 'skepticism',
      'certainty', 'evidence', 'epistemic', 'cognition', 'understanding',
      'rationalism', 'empiricism', 'perception', 'testimony', 'memory'
    ],
    weight: 1.0,
  },

  metaphysics: {
    keywords: [
      'existence', 'reality', 'being', 'causation', 'time', 'space',
      'identity', 'essence', 'substance', 'property', 'possible world',
      'necessity', 'contingency', 'ontology', 'persistence', 'change'
    ],
    weight: 1.0,
  },

  ethics: {
    keywords: [
      'right', 'wrong', 'ought', 'good', 'evil', 'virtue', 'duty',
      'moral', 'ethical', 'justice', 'fairness', 'obligation',
      'consequentialism', 'deontology', 'utilitarianism', 'character'
    ],
    weight: 1.0,
  },

  philosophyOfMind: {
    keywords: [
      'consciousness', 'mind', 'mental', 'thought', 'perception',
      'qualia', 'intentionality', 'self', 'awareness', 'experience',
      'cognition', 'brain', 'dualism', 'materialism', 'functionalism'
    ],
    weight: 1.0,
  },

  politicalPhilosophy: {
    keywords: [
      'justice', 'rights', 'state', 'government', 'liberty', 'freedom',
      'authority', 'democracy', 'power', 'equality', 'legitimacy',
      'social contract', 'sovereignty', 'citizenship', 'law'
    ],
    weight: 1.0,
  },

  aesthetics: {
    keywords: [
      'beauty', 'art', 'taste', 'aesthetic', 'sublime', 'ugly',
      'artistic', 'creative', 'expression', 'representation',
      'interpretation', 'criticism', 'style', 'form', 'content'
    ],
    weight: 1.0,
  },

  logic: {
    keywords: [
      'argument', 'reasoning', 'validity', 'proof', 'inference',
      'premise', 'conclusion', 'fallacy', 'deduction', 'induction',
      'soundness', 'consistency', 'contradiction', 'formal', 'modal'
    ],
    weight: 1.0,
  },

  philosophyOfScience: {
    keywords: [
      'science', 'theory', 'explanation', 'law', 'hypothesis',
      'experiment', 'observation', 'scientific method', 'paradigm',
      'confirmation', 'falsification', 'realism', 'instrumentalism'
    ],
    weight: 1.0,
  },

  existentialism: {
    keywords: [
      'meaning', 'freedom', 'existence', 'absurd', 'authenticity',
      'anxiety', 'choice', 'responsibility', 'being-in-the-world',
      'nothingness', 'death', 'facticity', 'transcendence'
    ],
    weight: 1.0,
  },
};
```

### Detection Algorithm

**Function signature:**
```typescript
interface SubfieldDetection {
  primarySubfield: string | null;
  confidence: number;           // 0.0 - 1.0
  matchedKeywords: string[];
  allMatches: Record<string, number>;  // subfield → match count
}

function detectPhilosophySubfield(question: string): SubfieldDetection
```

**Algorithm steps:**

1. **Normalize input**
   - Convert to lowercase
   - Remove punctuation
   - Tokenize into words
   - Remove stop words

2. **Keyword matching**
   - For each subfield:
     - Count keyword matches in question
     - Apply fuzzy matching (Levenshtein distance ≤ 2)
     - Weight by keyword importance

3. **Score calculation**
   ```typescript
   score = (matchCount / totalKeywords) * subfieldWeight
   ```

4. **Threshold filtering**
   - Minimum 2 keyword matches required
   - Minimum confidence 0.3 (30%)
   - If no subfield meets threshold → return `null` (use general search)

5. **Primary subfield selection**
   - Select subfield with highest score
   - If tie (within 0.1) → prefer epistemology/metaphysics (core philosophy)

**Example outputs:**

```typescript
// Input: "What is knowledge?"
{
  primarySubfield: 'epistemology',
  confidence: 0.85,
  matchedKeywords: ['knowledge'],
  allMatches: { epistemology: 3, metaphysics: 0, ethics: 0, ... }
}

// Input: "Is the mind separate from the brain?"
{
  primarySubfield: 'philosophyOfMind',
  confidence: 0.92,
  matchedKeywords: ['mind', 'brain'],
  allMatches: { philosophyOfMind: 5, metaphysics: 2, ... }
}

// Input: "What is the best action to take?"
{
  primarySubfield: 'ethics',
  confidence: 0.65,
  matchedKeywords: ['good', 'ought'],
  allMatches: { ethics: 3, politicalPhilosophy: 1, ... }
}

// Input: "Tell me about Plato"
{
  primarySubfield: null,
  confidence: 0.0,
  matchedKeywords: [],
  allMatches: {}
}
// → Falls back to general philosophy search
```

### Query Augmentation Strategy

**Instead of hardcoded "ethics moral", use:**

```typescript
function buildSearchQuery(
  originalQuery: string,
  detection: SubfieldDetection
): string {
  // Base query
  let query = originalQuery;

  // Add "philosophy" for scope
  query += ' philosophy';

  // Add subfield-specific terms if detected
  if (detection.primarySubfield && detection.confidence > 0.5) {
    const subfieldTerms = getSubfieldSearchTerms(detection.primarySubfield);
    query += ' ' + subfieldTerms.join(' ');
  }

  return query;
}

// Subfield-specific search term mappings
const SUBFIELD_SEARCH_TERMS = {
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
```

**Example transformations:**

| Original Query | Detected Subfield | Old Query (CrossRef) | New Query (Semantic Scholar) |
|----------------|-------------------|----------------------|------------------------------|
| "What is knowledge?" | epistemology (0.85) | "What is knowledge? philosophy ethics moral" | "What is knowledge? philosophy epistemology justification" |
| "Does the mind exist?" | philosophyOfMind (0.92) | "Does the mind exist? philosophy ethics moral" | "Does the mind exist? philosophy consciousness mental" |
| "What is beauty?" | aesthetics (0.78) | "What is beauty? philosophy ethics moral" | "What is beauty? philosophy aesthetics art" |
| "Tell me about Kant" | null (0.0) | "Tell me about Kant philosophy ethics moral" | "Tell me about Kant philosophy" |

---

## Multi-Source Strategy

### Recommended Approach: **Parallel Query with Intelligent Merging (Option B)**

After evaluating three approaches, **Option B** is optimal for performance and user experience.

### Comparison of Approaches

| Criterion | Option A (Sequential Fallback) | Option B (Parallel Merge) | Option C (Conditional Routing) |
|-----------|-------------------------------|---------------------------|-------------------------------|
| **Latency** | 2-4s (sequential) | 1-2s (parallel) | 1-3s (varies) |
| **Source Diversity** | Low (one source wins) | High (both contribute) | Medium (one source per query) |
| **Reliability** | Good (automatic fallback) | Excellent (dual redundancy) | Medium (single point of failure) |
| **Implementation Complexity** | Low | Medium | High (routing logic) |
| **User Experience** | Slower, less diverse | Faster, more diverse | Fast but less diverse |
| **Recommendation** | ❌ | ✅ **BEST CHOICE** | ❌ |

### Option B Implementation Details

#### Architecture Flow

```
┌─────────────────────────────────────────────┐
│          User Question Input                 │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      Keyword Detection (synchronous)         │
│      ~ 5ms overhead                          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│       Parallel API Invocation                │
│                                               │
│   ┌─────────────────┐  ┌─────────────────┐  │
│   │ Semantic Scholar│  │    CrossRef     │  │
│   │   (Primary)     │  │   (Secondary)   │  │
│   │                 │  │                 │  │
│   │ Query: base +   │  │ Query: base +   │  │
│   │   subfield      │  │   "philosophy"  │  │
│   │ Limit: 5        │  │ Limit: 3        │  │
│   │ Timeout: 3s     │  │ Timeout: 3s     │  │
│   └────────┬────────┘  └────────┬────────┘  │
│            │                    │            │
│   ┌────────▼────────────────────▼────────┐  │
│   │    Promise.allSettled()             │  │
│   │    Wait for both (or timeout)       │  │
│   └────────┬────────────────────────────┘  │
│            │                                │
└────────────┼────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│        Result Merging Logic                  │
│                                               │
│  1. Collect all successful results           │
│  2. Deduplicate by title similarity (>80%)   │
│  3. Rank by relevance score                  │
│  4. Limit to top 5 papers                    │
│  5. Track source attribution                 │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          Return Merged Results               │
│  Format: { papers, sources, metadata }       │
└─────────────────────────────────────────────┘
```

#### Code Structure

```typescript
// File: /home/gat0r/bunnygod/workers/ask/multi-source.ts

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
}

export async function queryMultipleSources(
  query: string,
  subfield: string | null,
  limit: number = 5
): Promise<MultiSourceResult> {
  const startTime = Date.now();

  // Build queries for each source
  const semanticScholarQuery = buildSemanticScholarQuery(query, subfield);
  const crossrefQuery = buildCrossRefQuery(query, subfield);

  // Launch parallel requests
  const [semanticScholarResult, crossrefResult] = await Promise.allSettled([
    querySemanticScholar(semanticScholarQuery, 5),
    queryCrossRef(crossrefQuery, 3),
  ]);

  // Collect successful results
  const allPapers: PhilPaper[] = [];
  const sources = { semanticScholar: 0, crossref: 0 };
  const timing = {
    semanticScholar: null as number | null,
    crossref: null as number | null,
    total: 0,
  };

  if (semanticScholarResult.status === 'fulfilled') {
    allPapers.push(...semanticScholarResult.value.papers);
    sources.semanticScholar = semanticScholarResult.value.papers.length;
    timing.semanticScholar = semanticScholarResult.value.timing;
  }

  if (crossrefResult.status === 'fulfilled') {
    allPapers.push(...crossrefResult.value.papers);
    sources.crossref = crossrefResult.value.papers.length;
    timing.crossref = crossrefResult.value.timing;
  }

  // If both failed, throw error
  if (allPapers.length === 0) {
    throw new Error('All sources failed to return results');
  }

  // Deduplicate and rank
  const mergedPapers = deduplicateAndRank(allPapers, query, limit);

  timing.total = Date.now() - startTime;

  return {
    papers: mergedPapers,
    sources,
    timing,
  };
}
```

#### Deduplication Algorithm

**Title similarity threshold: 80%**

```typescript
function deduplicateAndRank(
  papers: PhilPaper[],
  originalQuery: string,
  limit: number
): PhilPaper[] {
  const uniquePapers: PhilPaper[] = [];

  for (const paper of papers) {
    // Check if similar paper already exists
    const isDuplicate = uniquePapers.some(existing =>
      calculateTitleSimilarity(existing.title, paper.title) > 0.8
    );

    if (!isDuplicate) {
      uniquePapers.push(paper);
    }
  }

  // Rank by relevance (citation count, year, title match)
  const ranked = uniquePapers
    .map(paper => ({
      paper,
      score: calculateRelevanceScore(paper, originalQuery),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.paper);

  return ranked;
}

function calculateTitleSimilarity(title1: string, title2: string): number {
  // Levenshtein distance ratio
  const normalized1 = title1.toLowerCase().trim();
  const normalized2 = title2.toLowerCase().trim();

  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);

  return 1 - (distance / maxLength);
}

function calculateRelevanceScore(
  paper: PhilPaper,
  query: string
): number {
  let score = 0;

  // Title relevance (TF-IDF style)
  const titleWords = paper.title.toLowerCase().split(/\s+/);
  const queryWords = query.toLowerCase().split(/\s+/);
  const matchCount = titleWords.filter(word =>
    queryWords.some(qWord => word.includes(qWord) || qWord.includes(word))
  ).length;
  score += matchCount * 10;

  // Citation count (log scale)
  if (paper.citationCount) {
    score += Math.log10(paper.citationCount + 1) * 5;
  }

  // Recency (prefer last 20 years)
  if (paper.year) {
    const age = new Date().getFullYear() - paper.year;
    if (age <= 20) {
      score += (20 - age) * 0.5;
    }
  }

  // Abstract presence (quality signal)
  if (paper.abstract && paper.abstract.length > 100) {
    score += 5;
  }

  return score;
}
```

#### Fallback Behavior

**Scenario 1: Semantic Scholar fails, CrossRef succeeds**
- Return CrossRef results
- Log warning for monitoring
- No user impact

**Scenario 2: CrossRef fails, Semantic Scholar succeeds**
- Return Semantic Scholar results
- Log warning for monitoring
- No user impact

**Scenario 3: Both succeed**
- Merge results
- Deduplicate
- Rank and return top 5
- Optimal user experience

**Scenario 4: Both fail**
- Throw error
- Trigger fallback response in main handler
- Return generic philosophy resource link

---

## Response Normalization

### Unified Interface Design

**Current interface** (already exists in `philpapers.ts`):

```typescript
export interface PhilPaper {
  title: string;
  authors: string;
  abstract?: string;
  url: string;
  year?: number;
  categories?: string[];
}
```

**Enhanced interface** (backward compatible):

```typescript
export interface PhilPaper {
  // Core fields (required)
  title: string;
  authors: string;
  url: string;

  // Optional metadata
  abstract?: string;
  year?: number;
  categories?: string[];

  // NEW: Source tracking
  source?: 'semantic-scholar' | 'crossref' | 'philpapers';

  // NEW: Quality signals
  citationCount?: number;
  venue?: string;  // Journal or conference name

  // NEW: Internal identifiers
  externalId?: string;  // Semantic Scholar paperId or CrossRef DOI
}
```

### Mapping Functions

#### Semantic Scholar → PhilPaper

```typescript
// File: /home/gat0r/bunnygod/workers/ask/normalizer.ts

function normalizeSemanticScholar(
  item: SemanticScholarPaper
): PhilPaper {
  return {
    title: item.title || 'Untitled',

    authors: formatSemanticScholarAuthors(item.authors || []),

    abstract: item.abstract || undefined,

    url: item.url ||
         (item.paperId ? `https://www.semanticscholar.org/paper/${item.paperId}` : '#'),

    year: item.year || undefined,

    categories: item.fieldsOfStudy || undefined,

    source: 'semantic-scholar',

    citationCount: item.citationCount || undefined,

    venue: item.publicationVenue?.name || undefined,

    externalId: item.paperId || undefined,
  };
}

function formatSemanticScholarAuthors(
  authors: Array<{ authorId: string; name: string }>
): string {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }

  const names = authors.slice(0, 3).map(a => a.name);

  if (authors.length > 3) {
    return names.join(', ') + ' et al.';
  }

  return names.join(', ');
}
```

#### CrossRef → PhilPaper (Updated)

```typescript
function normalizeCrossRef(item: CrossRefWork): PhilPaper {
  // Get publication year
  const year = item.published?.['date-parts']?.[0]?.[0] ||
              item.created?.['date-parts']?.[0]?.[0];

  // Get title (CrossRef returns title as array)
  const title = Array.isArray(item.title) ? item.title[0] :
               (item.title || 'Untitled');

  return {
    title,

    authors: formatCrossRefAuthors(item.author || []),

    abstract: item.abstract || undefined,

    url: item.DOI ? `https://doi.org/${item.DOI}` : '#',

    year,

    categories: item.type ? [item.type] : undefined,

    source: 'crossref',

    citationCount: item['is-referenced-by-count'] || undefined,

    venue: item['container-title']?.[0] || undefined,

    externalId: item.DOI || undefined,
  };
}

function formatCrossRefAuthors(
  authors: Array<{ given?: string; family?: string; name?: string }>
): string {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }

  const names = authors.slice(0, 3).map(author => {
    if (author.given && author.family) {
      return `${author.given} ${author.family}`;
    }
    return author.name || 'Unknown';
  });

  if (authors.length > 3) {
    return names.join(', ') + ' et al.';
  }

  return names.join(', ');
}
```

### Handling Missing Data

**Field-specific fallback strategies:**

| Field | Semantic Scholar Missing | CrossRef Missing |
|-------|-------------------------|------------------|
| `title` | Use "Untitled" | Use "Untitled" |
| `authors` | Use "Unknown Author" | Use "Unknown Author" |
| `abstract` | Omit (`undefined`) | Omit (`undefined`) |
| `url` | Generate from `paperId` | Use "#" placeholder |
| `year` | Omit (`undefined`) | Omit (`undefined`) |
| `categories` | Omit (`undefined`) | Use `type` field |
| `citationCount` | Omit (`undefined`) | Use `is-referenced-by-count` |
| `venue` | Use `publicationVenue.name` | Use `container-title[0]` |

**Quality filter:** Papers with missing title OR missing authors are discarded during normalization.

---

## File Structure & Organization

### New File Architecture

```
/home/gat0r/bunnygod/
├── workers/
│   └── ask/
│       ├── index.ts                    # [MODIFIED] Main worker entry
│       ├── ai.ts                       # [UNCHANGED] Workers AI integration
│       ├── analytics.ts                # [UNCHANGED] Analytics tracking
│       ├── crypto.ts                   # [UNCHANGED] Crypto utilities
│       │
│       ├── philpapers.ts               # [MODIFIED] Legacy CrossRef client
│       │                               # - Remove hardcoded "ethics moral"
│       │                               # - Redirect to multi-source.ts
│       │                               # - Maintain backward compat
│       │
│       ├── keyword-detection.ts        # [NEW] Philosophy subfield detection
│       │   └── Functions:
│       │       - detectPhilosophySubfield()
│       │       - extractSearchTerms()
│       │       - getSubfieldSearchTerms()
│       │
│       ├── semantic-scholar.ts         # [NEW] Semantic Scholar API client
│       │   └── Functions:
│       │       - querySemanticScholar()
│       │       - buildSemanticScholarRequest()
│       │       - parseSemanticScholarResponse()
│       │
│       ├── multi-source.ts             # [NEW] Multi-source orchestration
│       │   └── Functions:
│       │       - queryMultipleSources()
│       │       - deduplicateAndRank()
│       │       - calculateRelevanceScore()
│       │
│       ├── normalizer.ts               # [NEW] Response normalization
│       │   └── Functions:
│       │       - normalizeSemanticScholar()
│       │       - normalizeCrossRef()
│       │       - formatAuthors()
│       │
│       └── types.ts                    # [NEW] Shared TypeScript types
│           └── Interfaces:
│               - PhilPaper (enhanced)
│               - SubfieldDetection
│               - MultiSourceResult
│               - SemanticScholarPaper
│               - CrossRefWork
```

### Module Dependencies

```
index.ts
  ├─> multi-source.ts
  │     ├─> keyword-detection.ts
  │     ├─> semantic-scholar.ts
  │     │     └─> normalizer.ts
  │     ├─> philpapers.ts (CrossRef)
  │     │     └─> normalizer.ts
  │     └─> types.ts
  ├─> ai.ts
  ├─> analytics.ts
  └─> types.ts
```

### File Size Estimates

| File | Estimated LOC | Complexity |
|------|---------------|------------|
| `keyword-detection.ts` | ~200 | Medium |
| `semantic-scholar.ts` | ~150 | Medium |
| `multi-source.ts` | ~250 | High |
| `normalizer.ts` | ~120 | Low |
| `types.ts` | ~80 | Low |
| `philpapers.ts` (modified) | ~50 changes | Low |
| `index.ts` (modified) | ~30 changes | Low |

**Total new code:** ~800 LOC
**Total modified code:** ~80 LOC

---

## Implementation Checklist

### Phase 1: Core Infrastructure (Week 1)

#### Task 1.1: Create Type Definitions
**File:** `/home/gat0r/bunnygod/workers/ask/types.ts`

- [ ] Define `PhilPaper` interface (enhanced version)
- [ ] Define `SubfieldDetection` interface
- [ ] Define `MultiSourceResult` interface
- [ ] Define `SemanticScholarPaper` interface
- [ ] Define `SemanticScholarResponse` interface
- [ ] Define `CrossRefWork` interface (if not exists)
- [ ] Export all types

**Acceptance Criteria:**
- All types compile without errors
- No circular dependencies
- JSDoc comments for all interfaces

**Time estimate:** 2 hours

---

#### Task 1.2: Implement Keyword Detection Module
**File:** `/home/gat0r/bunnygod/workers/ask/keyword-detection.ts`

- [ ] Define `PHILOSOPHY_SUBFIELDS` constant with keyword sets
- [ ] Implement `detectPhilosophySubfield()` function
  - [ ] Text normalization (lowercase, punctuation removal)
  - [ ] Stop word filtering
  - [ ] Keyword matching with fuzzy logic
  - [ ] Score calculation
  - [ ] Threshold filtering
  - [ ] Primary subfield selection
- [ ] Implement `extractSearchTerms()` helper
- [ ] Implement `getSubfieldSearchTerms()` mapper
- [ ] Add comprehensive JSDoc comments

**Acceptance Criteria:**
- Correctly detects subfield for 20+ test questions
- Returns `null` for ambiguous questions
- Confidence scores are accurate (0.0-1.0)
- Performance: < 10ms for typical questions

**Test cases:**
```typescript
// High confidence detection
detectPhilosophySubfield("What is knowledge?")
// → { primarySubfield: 'epistemology', confidence: 0.85, ... }

detectPhilosophySubfield("Does the mind exist separately from the brain?")
// → { primarySubfield: 'philosophyOfMind', confidence: 0.92, ... }

// Low confidence (ambiguous)
detectPhilosophySubfield("Tell me about Plato")
// → { primarySubfield: null, confidence: 0.0, ... }
```

**Time estimate:** 6 hours

---

#### Task 1.3: Implement Semantic Scholar API Client
**File:** `/home/gat0r/bunnygod/workers/ask/semantic-scholar.ts`

- [ ] Define Semantic Scholar API constants
  - [ ] Base URL
  - [ ] Default fields parameter
  - [ ] Rate limit constants
- [ ] Implement `querySemanticScholar()` function
  - [ ] Build request URL with query parameters
  - [ ] Add optional API key header
  - [ ] Set timeout (3 seconds)
  - [ ] Execute fetch request
  - [ ] Handle HTTP errors (400, 429, 500, 503)
  - [ ] Parse JSON response
  - [ ] Return normalized results
- [ ] Implement `buildSemanticScholarRequest()` helper
- [ ] Implement retry logic with exponential backoff
  - [ ] Max retries: 2
  - [ ] Initial delay: 1000ms
  - [ ] Backoff multiplier: 2x
- [ ] Add error logging
- [ ] Add timing instrumentation

**Acceptance Criteria:**
- Successfully queries Semantic Scholar API
- Handles rate limiting gracefully (429 errors)
- Retries failed requests with backoff
- Returns empty array on total failure (no exceptions)
- Respects timeout (3s max)
- Includes timing metadata

**Test cases:**
```typescript
// Successful query
await querySemanticScholar("epistemology knowledge", 5)
// → { papers: [...], timing: 1234 }

// Rate limited (429) → retry → success
// (Mock test with controlled responses)

// Total failure → empty results
await querySemanticScholar("", 5)
// → { papers: [], timing: null }
```

**Time estimate:** 5 hours

---

#### Task 1.4: Implement Response Normalizer
**File:** `/home/gat0r/bunnygod/workers/ask/normalizer.ts`

- [ ] Implement `normalizeSemanticScholar()` function
  - [ ] Map `paperId` → `externalId`
  - [ ] Map `title` (with fallback)
  - [ ] Map `authors` (format with `formatSemanticScholarAuthors()`)
  - [ ] Map `abstract` (optional)
  - [ ] Map `year` (optional)
  - [ ] Map `fieldsOfStudy` → `categories`
  - [ ] Map `citationCount`
  - [ ] Map `publicationVenue.name` → `venue`
  - [ ] Generate URL from `paperId` if `url` missing
  - [ ] Set `source: 'semantic-scholar'`
- [ ] Implement `normalizeCrossRef()` function
  - [ ] Map `DOI` → `externalId`
  - [ ] Map `title` (handle array format)
  - [ ] Map `author` (format with `formatCrossRefAuthors()`)
  - [ ] Map `abstract` (optional)
  - [ ] Map `published.date-parts` → `year`
  - [ ] Map `type` → `categories`
  - [ ] Map `is-referenced-by-count` → `citationCount`
  - [ ] Map `container-title[0]` → `venue`
  - [ ] Generate DOI URL
  - [ ] Set `source: 'crossref'`
- [ ] Implement `formatSemanticScholarAuthors()` helper
- [ ] Implement `formatCrossRefAuthors()` helper
- [ ] Add quality filtering (discard papers with missing title/authors)

**Acceptance Criteria:**
- All API responses map correctly to `PhilPaper` interface
- Missing fields handled gracefully (`undefined` not `null`)
- Author formatting matches existing format ("Name1, Name2 et al.")
- URLs are always valid (no broken links)
- Source attribution is correct

**Test cases:**
```typescript
// Semantic Scholar with all fields
normalizeSemanticScholar({
  paperId: "abc123",
  title: "The Nature of Knowledge",
  authors: [{ authorId: "1", name: "John Smith" }],
  year: 2020,
  // ...
})
// → PhilPaper with all fields populated

// CrossRef with minimal fields
normalizeCrossRef({
  DOI: "10.1234/test",
  title: ["Test Paper"],
  author: [],
})
// → PhilPaper with fallback "Unknown Author"
```

**Time estimate:** 4 hours

---

### Phase 2: Multi-Source Orchestration (Week 2)

#### Task 2.1: Implement Multi-Source Query Orchestrator
**File:** `/home/gat0r/bunnygod/workers/ask/multi-source.ts`

- [ ] Implement `queryMultipleSources()` function
  - [ ] Call keyword detection
  - [ ] Build queries for both sources
  - [ ] Launch parallel requests with `Promise.allSettled()`
  - [ ] Collect successful results
  - [ ] Handle both-failed scenario (throw error)
  - [ ] Track timing for each source
  - [ ] Track source attribution counts
- [ ] Implement `buildSemanticScholarQuery()` helper
  - [ ] Base query + "philosophy"
  - [ ] Add subfield-specific terms if detected
- [ ] Implement `buildCrossRefQuery()` helper
  - [ ] Base query + "philosophy" ONLY
  - [ ] NO "ethics moral" bias
- [ ] Implement result merging logic
- [ ] Add comprehensive error handling
- [ ] Add logging for debugging

**Acceptance Criteria:**
- Both APIs queried in parallel (< 2s total)
- Results merged correctly
- Timing tracked for monitoring
- Source counts accurate
- Errors logged but don't crash

**Time estimate:** 6 hours

---

#### Task 2.2: Implement Deduplication & Ranking
**File:** `/home/gat0r/bunnygod/workers/ask/multi-source.ts` (continued)

- [ ] Implement `deduplicateAndRank()` function
  - [ ] Title similarity calculation (Levenshtein)
  - [ ] Duplicate detection (>80% similarity)
  - [ ] Relevance scoring
  - [ ] Sorting by score (descending)
  - [ ] Limit to top N results
- [ ] Implement `calculateTitleSimilarity()` helper
  - [ ] Levenshtein distance algorithm
  - [ ] Normalization (lowercase, trim)
  - [ ] Return ratio (0.0-1.0)
- [ ] Implement `calculateRelevanceScore()` function
  - [ ] Title keyword matching (TF-IDF style)
  - [ ] Citation count weighting (log scale)
  - [ ] Recency bonus (last 20 years)
  - [ ] Abstract presence bonus
- [ ] Add unit tests for scoring algorithm

**Acceptance Criteria:**
- Duplicates correctly identified (80%+ title similarity)
- Ranking favors recent, highly-cited, relevant papers
- Performance: < 50ms for typical result set (10-15 papers)
- Deterministic results (same input → same output)

**Test cases:**
```typescript
// Duplicate detection
deduplicateAndRank([
  { title: "The Nature of Knowledge", ... },
  { title: "The nature of knowledge", ... },  // Duplicate
  { title: "Epistemology Today", ... },
], "knowledge", 5)
// → 2 papers (duplicate removed)

// Relevance ranking
// Should rank: high citations > recency > abstract presence
```

**Time estimate:** 5 hours

---

#### Task 2.3: Update Main Module Integration
**File:** `/home/gat0r/bunnygod/workers/ask/index.ts`

- [ ] Import `queryMultipleSources()` from `multi-source.ts`
- [ ] Add feature flag environment variable: `ENABLE_SEMANTIC_SCHOLAR`
- [ ] Update search logic:
  ```typescript
  if (env.ENABLE_SEMANTIC_SCHOLAR === 'true') {
    // Use new multi-source approach
    const result = await queryMultipleSources(searchTerms, 5);
    papers = result.papers;
  } else {
    // Use legacy CrossRef-only approach
    const result = await searchPhilPapers(searchTerms, 5, credentials);
    papers = result.papers;
  }
  ```
- [ ] Update cache key to include subfield:
  ```typescript
  const cacheKey = `answer:${hashString(normalizedQuestion + ':' + subfield)}`;
  ```
- [ ] Add source tracking to response metadata
- [ ] Update analytics to track source usage

**Acceptance Criteria:**
- Feature flag controls behavior (easy on/off)
- Legacy mode still works (backward compatible)
- Cache keys include subfield (better precision)
- Analytics tracks source distribution

**Time estimate:** 3 hours

---

#### Task 2.4: Update CrossRef Module (Remove Bias)
**File:** `/home/gat0r/bunnygod/workers/ask/philpapers.ts`

- [ ] Remove hardcoded "ethics moral" from line 129
- [ ] Update `searchCrossRefAPI()` to accept optional subfield parameter
- [ ] Modify query building:
  ```typescript
  // OLD (line 129):
  const philosophyQuery = `${query} philosophy ethics moral`;

  // NEW:
  const philosophyQuery = subfield
    ? `${query} philosophy ${getSubfieldSearchTerms(subfield).join(' ')}`
    : `${query} philosophy`;
  ```
- [ ] Add JSDoc warning about legacy usage
- [ ] Maintain backward compatibility (existing callers unaffected)

**Acceptance Criteria:**
- No hardcoded "ethics moral" anywhere
- Subfield-aware query building
- Backward compatible (optional parameter)
- All existing tests pass

**Time estimate:** 2 hours

---

### Phase 3: Testing & Validation (Week 3)

#### Task 3.1: Unit Tests - Keyword Detection
**File:** `/home/gat0r/bunnygod/tests/keyword-detection.test.ts` (NEW)

- [ ] Test subfield detection accuracy
  - [ ] Epistemology questions → epistemology
  - [ ] Ethics questions → ethics
  - [ ] Metaphysics questions → metaphysics
  - [ ] Philosophy of mind questions → philosophyOfMind
  - [ ] Ambiguous questions → null
- [ ] Test edge cases
  - [ ] Empty string → null
  - [ ] Single word → null
  - [ ] Mixed subfields → highest score wins
- [ ] Test confidence scoring
  - [ ] High keyword match → high confidence
  - [ ] Low keyword match → low confidence
- [ ] Performance tests
  - [ ] 1000 questions in < 100ms

**Acceptance Criteria:**
- 95%+ accuracy on 100 test questions
- All edge cases handled gracefully
- Performance meets target

**Time estimate:** 4 hours

---

#### Task 3.2: Unit Tests - Semantic Scholar Client
**File:** `/home/gat0r/bunnygod/tests/semantic-scholar.test.ts` (NEW)

- [ ] Test successful queries
  - [ ] Mock API response
  - [ ] Verify request parameters
  - [ ] Verify response parsing
- [ ] Test error handling
  - [ ] 429 rate limit → retry → success
  - [ ] 500 server error → retry → success
  - [ ] Timeout → empty results
  - [ ] Network error → empty results
- [ ] Test retry logic
  - [ ] Exponential backoff timing
  - [ ] Max retries respected
- [ ] Test API key header
  - [ ] With API key → header present
  - [ ] Without API key → header absent

**Acceptance Criteria:**
- All success paths work
- All error paths handled gracefully
- Retry logic correct
- Timeout respected

**Time estimate:** 5 hours

---

#### Task 3.3: Unit Tests - Response Normalizer
**File:** `/home/gat0r/bunnygod/tests/normalizer.test.ts` (NEW)

- [ ] Test Semantic Scholar normalization
  - [ ] All fields present → all mapped
  - [ ] Missing optional fields → undefined
  - [ ] Missing required fields → quality filter removes
- [ ] Test CrossRef normalization
  - [ ] All fields present → all mapped
  - [ ] Array title → first element
  - [ ] Missing authors → "Unknown Author"
- [ ] Test author formatting
  - [ ] Single author → name only
  - [ ] Three authors → comma-separated
  - [ ] Four+ authors → "et al."

**Acceptance Criteria:**
- All mapping paths tested
- Missing data handled correctly
- Author formatting matches spec

**Time estimate:** 3 hours

---

#### Task 3.4: Integration Tests - Multi-Source
**File:** `/home/gat0r/bunnygod/tests/multi-source.test.ts` (NEW)

- [ ] Test parallel execution
  - [ ] Both sources return results → merged
  - [ ] One source fails → uses other
  - [ ] Both fail → error thrown
- [ ] Test deduplication
  - [ ] Exact title match → removed
  - [ ] 90% title similarity → removed
  - [ ] 70% title similarity → kept (different papers)
- [ ] Test ranking
  - [ ] High citations ranked higher
  - [ ] Recent papers ranked higher
  - [ ] Title relevance ranked higher
- [ ] Test source attribution
  - [ ] Counts accurate
  - [ ] Source tags correct

**Acceptance Criteria:**
- All scenarios covered
- Deduplication works correctly
- Ranking is sensible
- Attribution accurate

**Time estimate:** 6 hours

---

#### Task 3.5: End-to-End Tests
**File:** `/home/gat0r/bunnygod/tests/e2e/semantic-scholar.test.ts` (NEW)

- [ ] Test full workflow with feature flag ON
  - [ ] Question → keyword detection → multi-source → AI synthesis
  - [ ] Verify response format
  - [ ] Verify sources include both APIs
  - [ ] Verify cache behavior
- [ ] Test full workflow with feature flag OFF
  - [ ] Question → legacy CrossRef → AI synthesis
  - [ ] Verify backward compatibility
- [ ] Test real API calls (integration test mode)
  - [ ] Semantic Scholar API (rate limit safe)
  - [ ] CrossRef API
  - [ ] Verify actual responses parse correctly

**Acceptance Criteria:**
- Feature flag controls behavior
- Both modes work correctly
- Real API integration successful
- Cache works with new key format

**Time estimate:** 5 hours

---

#### Task 3.6: Manual Testing Scenarios
**Manual test plan** (QA checklist)

- [ ] Test epistemology questions
  - [ ] "What is knowledge?"
  - [ ] "Can we be certain of anything?"
  - [ ] "What is the difference between belief and knowledge?"
  - [ ] Expected: Papers on epistemology, not ethics
- [ ] Test metaphysics questions
  - [ ] "What is reality?"
  - [ ] "Does time exist?"
  - [ ] "What is causation?"
  - [ ] Expected: Papers on metaphysics, not ethics
- [ ] Test philosophy of mind questions
  - [ ] "What is consciousness?"
  - [ ] "Does the mind exist separately from the brain?"
  - [ ] Expected: Papers on philosophy of mind
- [ ] Test ethics questions (should still work)
  - [ ] "What is the right thing to do?"
  - [ ] "Is lying always wrong?"
  - [ ] Expected: Papers on ethics (not broken by changes)
- [ ] Test edge cases
  - [ ] Very long questions (500 chars)
  - [ ] Single-word questions ("Knowledge?")
  - [ ] Non-philosophy questions ("How to bake a cake?")
  - [ ] Expected: Graceful handling, reasonable fallbacks
- [ ] Test performance
  - [ ] Response time < 3s for typical questions
  - [ ] No timeout errors
  - [ ] Caching works (second request instant)
- [ ] Test error scenarios
  - [ ] Semantic Scholar API down (mock)
  - [ ] CrossRef API down (mock)
  - [ ] Both APIs down (mock)
  - [ ] Expected: Graceful degradation, fallback responses

**Time estimate:** 4 hours

---

### Phase 4: Deployment & Monitoring (Week 4)

#### Task 4.1: Environment Configuration
**Files:** `.env`, `wrangler.toml`

- [ ] Add `ENABLE_SEMANTIC_SCHOLAR` environment variable
  - [ ] Development: `false` (default off)
  - [ ] Staging: `true` (test with real traffic)
  - [ ] Production: `false` initially (feature flag)
- [ ] Add optional `SEMANTIC_SCHOLAR_API_KEY` variable
  - [ ] Development: empty (free tier)
  - [ ] Production: register API key for higher limits
- [ ] Update Cloudflare Workers secrets
  ```bash
  wrangler secret put SEMANTIC_SCHOLAR_API_KEY
  ```
- [ ] Document configuration in README

**Acceptance Criteria:**
- Environment variables configured correctly
- API key stored securely (Workers secrets)
- Documentation updated

**Time estimate:** 1 hour

---

#### Task 4.2: Feature Flag Rollout Strategy

**Week 4 rollout plan:**

1. **Day 1-2: Deploy to staging**
   - [ ] Set `ENABLE_SEMANTIC_SCHOLAR=true` in staging
   - [ ] Run manual test scenarios
   - [ ] Monitor logs for errors
   - [ ] Verify source diversity improves

2. **Day 3-4: Canary deployment (10% traffic)**
   - [ ] Deploy to production with flag OFF
   - [ ] Use A/B testing framework (or random 10%)
   - [ ] Monitor metrics:
     - [ ] Error rate (should stay < 1%)
     - [ ] Response time (should stay < 3s P95)
     - [ ] Source diversity (should increase)
     - [ ] User feedback ratings (should improve)

3. **Day 5-6: Expand to 50% traffic**
   - [ ] If canary successful, expand to 50%
   - [ ] Continue monitoring
   - [ ] Collect user feedback

4. **Day 7: Full rollout (100% traffic)**
   - [ ] Set `ENABLE_SEMANTIC_SCHOLAR=true` globally
   - [ ] Monitor for 24 hours
   - [ ] Be ready to rollback if issues arise

**Acceptance Criteria:**
- Gradual rollout minimizes risk
- Metrics monitored at each stage
- Rollback plan ready

**Time estimate:** 2 hours (planning) + ongoing monitoring

---

#### Task 4.3: Monitoring & Alerting

**Metrics to track:**

- [ ] **Source distribution**
  - [ ] % requests using Semantic Scholar
  - [ ] % requests using CrossRef only
  - [ ] % requests with both sources
  - [ ] Dashboard: Cloudflare Analytics

- [ ] **API success rates**
  - [ ] Semantic Scholar success rate (target: >95%)
  - [ ] CrossRef success rate (target: >95%)
  - [ ] Combined success rate (target: >99%)
  - [ ] Alert if success rate drops below 90%

- [ ] **Performance**
  - [ ] P50, P95, P99 response times
  - [ ] Semantic Scholar API latency
  - [ ] CrossRef API latency
  - [ ] Alert if P95 > 5s

- [ ] **Error tracking**
  - [ ] 429 rate limit errors (Semantic Scholar)
  - [ ] 500 server errors (both APIs)
  - [ ] Timeout errors
  - [ ] Alert if error rate > 5%

- [ ] **User experience**
  - [ ] Feedback rating distribution (helpful vs not-helpful)
  - [ ] Compare old vs new implementation
  - [ ] Target: 10%+ improvement in "helpful" ratings

**Implementation:**

- [ ] Add custom analytics events to `analytics.ts`
  ```typescript
  trackSourceUsage(
    semanticScholarCount: number,
    crossrefCount: number,
    totalTime: number
  )
  ```
- [ ] Log key metrics to Workers Analytics Engine
- [ ] Set up Cloudflare Dashboard widgets
- [ ] Configure Slack/email alerts for critical errors

**Acceptance Criteria:**
- All metrics tracked and visible
- Alerts configured for critical thresholds
- Dashboard accessible to team

**Time estimate:** 4 hours

---

#### Task 4.4: Documentation Updates

- [ ] Update README.md
  - [ ] Document Semantic Scholar integration
  - [ ] Explain feature flag usage
  - [ ] Update architecture diagram
  - [ ] Add API key registration instructions

- [ ] Update PRD.md (this document)
  - [ ] Mark as "IMPLEMENTED"
  - [ ] Add actual metrics after rollout
  - [ ] Document lessons learned

- [ ] Create runbook for operations
  - [ ] How to enable/disable feature flag
  - [ ] How to rollback deployment
  - [ ] How to investigate errors
  - [ ] Common issues and solutions

- [ ] Update API documentation
  - [ ] Response format changes (source attribution)
  - [ ] Cache behavior changes

**Acceptance Criteria:**
- All documentation accurate and up-to-date
- Runbook tested by someone unfamiliar with code
- API docs reflect actual behavior

**Time estimate:** 3 hours

---

### Phase Summary

| Phase | Duration | Engineer-Hours | Key Deliverables |
|-------|----------|----------------|------------------|
| **Phase 1: Core Infrastructure** | Week 1 | 17 hours | Keyword detection, Semantic Scholar client, normalizer |
| **Phase 2: Multi-Source** | Week 2 | 16 hours | Orchestration, deduplication, main integration |
| **Phase 3: Testing** | Week 3 | 27 hours | Unit tests, integration tests, manual QA |
| **Phase 4: Deployment** | Week 4 | 10 hours | Config, rollout, monitoring, docs |
| **TOTAL** | 4 weeks | **70 hours** | Production-ready Semantic Scholar integration |

---

## Testing Strategy

### Testing Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │  (5 tests)
                    │   Real APIs     │
                    └────────┬────────┘
                             │
                   ┌─────────▼──────────┐
                   │ Integration Tests  │  (15 tests)
                   │  Multi-source      │
                   │  Orchestration     │
                   └─────────┬──────────┘
                             │
              ┌──────────────▼──────────────┐
              │      Unit Tests             │  (50+ tests)
              │  - Keyword detection        │
              │  - Normalizer               │
              │  - Deduplication            │
              │  - Relevance scoring        │
              └─────────────────────────────┘
```

### Test Coverage Goals

- **Unit tests:** 90%+ coverage for new modules
- **Integration tests:** All multi-source scenarios
- **E2E tests:** Critical user journeys
- **Manual tests:** Edge cases and UX validation

### Test Environments

1. **Local development**
   - Mock API responses (no real API calls)
   - Fast execution (< 5s for all unit tests)
   - No rate limiting issues

2. **CI/CD pipeline**
   - Automated unit + integration tests
   - Run on every commit
   - Block merges if tests fail

3. **Staging**
   - Real API calls (with test API keys)
   - Full E2E testing
   - Performance testing under load

4. **Production**
   - Canary testing (10% → 50% → 100%)
   - Real user traffic
   - A/B testing vs old implementation

### Test Data Sets

**Philosophy question corpus for validation:**

Create `/home/gat0r/bunnygod/tests/fixtures/test-questions.json`:

```json
{
  "epistemology": [
    "What is knowledge?",
    "Can we be certain of anything?",
    "What is the difference between belief and knowledge?",
    "Is perception a reliable source of knowledge?",
    "What is truth?"
  ],
  "metaphysics": [
    "What is reality?",
    "Does time exist?",
    "What is causation?",
    "Do abstract objects exist?",
    "What is the nature of existence?"
  ],
  "ethics": [
    "What is the right thing to do?",
    "Is lying always wrong?",
    "What makes an action moral?",
    "Do ends justify means?",
    "What is virtue?"
  ],
  "philosophyOfMind": [
    "What is consciousness?",
    "Does the mind exist separately from the brain?",
    "Can machines think?",
    "What is qualia?",
    "Is there a hard problem of consciousness?"
  ],
  "politicalPhilosophy": [
    "What is justice?",
    "Do we have natural rights?",
    "What is the role of government?",
    "Is democracy the best system?",
    "What is freedom?"
  ],
  "aesthetics": [
    "What is beauty?",
    "Is art subjective?",
    "What makes something art?",
    "Can beauty be objective?",
    "What is the sublime?"
  ],
  "logic": [
    "What is a valid argument?",
    "What is the difference between validity and soundness?",
    "What are logical fallacies?",
    "What is deductive reasoning?",
    "What is inductive reasoning?"
  ],
  "philosophyOfScience": [
    "What is the scientific method?",
    "What makes a theory scientific?",
    "Can science prove anything?",
    "What is falsification?",
    "What is the demarcation problem?"
  ],
  "existentialism": [
    "What is the meaning of life?",
    "Are we free?",
    "What is authenticity?",
    "What is the absurd?",
    "What is existential anxiety?"
  ],
  "ambiguous": [
    "Tell me about Plato",
    "Philosophy",
    "Socrates",
    "Ancient Greece",
    "Philosophy books"
  ]
}
```

**Expected behavior:**
- Subfield questions → detect correct subfield
- Ambiguous questions → detect null (general search)

### Regression Testing

**Critical paths to verify after changes:**

1. **Existing functionality (must not break)**
   - [ ] Basic question answering still works
   - [ ] Caching still works
   - [ ] Feedback system still works
   - [ ] Analytics still works
   - [ ] Error handling still works

2. **Feature flag behavior**
   - [ ] Flag OFF → uses CrossRef only (legacy mode)
   - [ ] Flag ON → uses Semantic Scholar + CrossRef

3. **Backward compatibility**
   - [ ] Old cache entries still valid
   - [ ] API response format unchanged (for clients)
   - [ ] Existing tests pass without modification

### Performance Testing

**Load testing scenarios:**

1. **Concurrent requests**
   - [ ] 10 concurrent requests → all succeed
   - [ ] 100 concurrent requests → all succeed (may be rate limited)
   - [ ] Monitor response time distribution

2. **Rate limit handling**
   - [ ] Semantic Scholar free tier: 100 req/5min
   - [ ] Verify requests don't exceed limit
   - [ ] Verify graceful degradation if limit hit

3. **Cache effectiveness**
   - [ ] First request: 2-3s (API calls)
   - [ ] Second request: < 100ms (cached)
   - [ ] Cache hit rate > 60% in production

**Performance targets:**

| Metric | Current | Target | Maximum |
|--------|---------|--------|---------|
| P50 response time | 1.5s | 1.5s | 2s |
| P95 response time | 2.8s | 2.8s | 3.5s |
| P99 response time | 4.2s | 4.2s | 5s |
| Error rate | 0.5% | 0.5% | 1% |
| Cache hit rate | 65% | 70% | - |

---

## Rollback Plan

### Rollback Triggers

**Immediately rollback if:**

1. **Error rate > 5%** for 5 consecutive minutes
2. **P95 response time > 5s** for 10 consecutive minutes
3. **API success rate < 85%** for either source
4. **User feedback "helpful" rate drops > 20%** compared to baseline
5. **Critical bug** reported by users (data corruption, incorrect answers, etc.)

### Rollback Procedure

#### Quick Rollback (< 5 minutes)

**Option 1: Feature flag disable (fastest)**

```bash
# Disable Semantic Scholar integration via Cloudflare Dashboard
# Workers & Pages → bunny-god-api → Settings → Environment Variables
# Set: ENABLE_SEMANTIC_SCHOLAR = false

# OR via wrangler CLI
wrangler secret put ENABLE_SEMANTIC_SCHOLAR
# Enter value: false
```

**Expected behavior after rollback:**
- System reverts to CrossRef-only mode
- No code deployment needed
- Takes effect immediately (next request)

**Verification:**
- [ ] Check logs: should see "Using legacy CrossRef mode"
- [ ] Test question: verify sources are CrossRef only
- [ ] Monitor error rate: should return to baseline

---

**Option 2: Redeploy previous version (if flag doesn't work)**

```bash
# 1. Checkout previous git commit
git log --oneline  # Find last working commit
git checkout <commit-hash>

# 2. Redeploy to Cloudflare Workers
npm run deploy:production

# 3. Verify deployment
curl -X POST https://api.bunnygod.ai/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What is knowledge?"}'
```

**Time to complete:** 5-10 minutes

---

#### Partial Rollback (keep code, fix bugs)

**If issue is isolated to specific module:**

1. **Identify problematic module**
   - Check error logs for stack traces
   - Identify which file is causing errors

2. **Quick fix options**
   - Add try-catch around failing code
   - Add feature flag for specific module
   - Revert specific file to previous version

3. **Example: Semantic Scholar API failures**
   ```typescript
   // Add emergency fallback in semantic-scholar.ts
   export async function querySemanticScholar(...) {
     // Emergency kill switch
     if (env.DISABLE_SEMANTIC_SCHOLAR_EMERGENCY === 'true') {
       return { papers: [], timing: null };
     }

     try {
       // ... existing code ...
     } catch (error) {
       console.error('[EMERGENCY] Semantic Scholar failed:', error);
       return { papers: [], timing: null };  // Fail gracefully
     }
   }
   ```

**Time to complete:** 15-30 minutes

---

### Post-Rollback Checklist

After rollback, complete these steps:

- [ ] **Verify system stability**
  - [ ] Error rate returned to baseline (< 1%)
  - [ ] Response time returned to baseline
  - [ ] User feedback returns to normal

- [ ] **Notify stakeholders**
  - [ ] Post in team Slack channel
  - [ ] Create incident report
  - [ ] Tag relevant engineers

- [ ] **Investigate root cause**
  - [ ] Review error logs
  - [ ] Analyze metrics spike
  - [ ] Reproduce issue in staging
  - [ ] Create bug report with reproduction steps

- [ ] **Create fix plan**
  - [ ] Identify root cause
  - [ ] Design fix
  - [ ] Write fix code
  - [ ] Add regression test
  - [ ] Test in staging
  - [ ] Deploy fix with gradual rollout

- [ ] **Document lessons learned**
  - [ ] Update runbook with new troubleshooting steps
  - [ ] Add monitoring for detected gap
  - [ ] Share learnings with team

---

### Rollback Testing

**Practice rollback procedure in staging:**

- [ ] Simulate API failure (mock Semantic Scholar 500 errors)
- [ ] Trigger rollback via feature flag
- [ ] Verify system recovers
- [ ] Time the rollback procedure
- [ ] Document any issues

**Goal:** Rollback should be practiced and smooth, not improvised under pressure.

---

## Performance Considerations

### Network Latency

**Current architecture (CrossRef only):**
```
Sequential flow:
User → Worker → CrossRef API → Worker → Workers AI → User
                   ↓ 800-1200ms
Total: ~2-3s
```

**New architecture (Semantic Scholar + CrossRef parallel):**
```
Parallel flow:
User → Worker → ┌─ Semantic Scholar → ┐
                │      ↓ 600-1000ms    │
                │                      ├→ Merge → Workers AI → User
                │                      │
                └─ CrossRef ───────────┘
                       ↓ 800-1200ms

Total: max(S.S., CrossRef) + merge + AI
     = max(1000ms, 1200ms) + 50ms + 800ms
     = ~2.05s

IMPROVEMENT: -200ms (10% faster due to parallel execution)
```

**Latency optimization strategies:**

1. **Parallel execution** (already implemented)
   - Both APIs called simultaneously
   - Wait for both with `Promise.allSettled()`
   - Total time = slowest API, not sum

2. **Timeout controls**
   - Semantic Scholar timeout: 3s
   - CrossRef timeout: 3s
   - If both timeout → fallback response (don't wait forever)

3. **Caching** (already exists, enhanced)
   - Cache key includes subfield
   - Cache hit → < 100ms response
   - Cache TTL: 24 hours
   - Target cache hit rate: 70%+

4. **Request optimization**
   - Only request needed fields (reduce response size)
   - Semantic Scholar: 9 fields (not all 50+)
   - CrossRef: 6 fields

### Bundle Size Impact

**Current bundle size:** ~45 KB (Cloudflare Worker)

**New modules size estimates:**
- `keyword-detection.ts`: +8 KB (keyword dictionary)
- `semantic-scholar.ts`: +4 KB
- `multi-source.ts`: +6 KB
- `normalizer.ts`: +3 KB
- `types.ts`: +2 KB

**Total increase:** +23 KB → **New bundle: ~68 KB**

**Cloudflare Workers limit:** 1 MB (uncompressed), 10 MB (compressed)

**Impact:** Minimal (still < 7% of limit)

**Optimization opportunities:**
- Tree-shaking unused code
- Compress keyword dictionary
- Lazy load modules (dynamic imports)

### KV Storage Impact

**Current KV usage:**
- Cache namespace: ~500 keys/day
- Feedback namespace: ~100 keys/day
- Total storage: < 1 MB

**New KV usage:**
- Cache keys now include subfield
- May increase unique cache keys by 2-3x
- Estimated: ~1500 keys/day
- Total storage: < 3 MB

**Cloudflare KV limits:**
- Storage: Unlimited (paid plan)
- Reads: 10M/day (free tier)
- Writes: 1M/day (free tier)

**Impact:** Minimal (well within limits)

**Cache key format change:**
```typescript
// OLD
const cacheKey = `answer:${hashString(question)}`;

// NEW
const cacheKey = `answer:${hashString(question + ':' + subfield)}`;
```

**Implication:** Old cache entries will not be hit after deployment (cold start for all queries)

**Mitigation:**
- Deploy during low-traffic period
- Cache will repopulate naturally within 24 hours
- Consider pre-warming cache with common questions

### Rate Limit Management

**Semantic Scholar rate limits:**
- **Free tier:** 100 requests / 5 minutes (shared pool)
- **With API key:** 1 request/second (1000 req / 5 minutes)

**Estimated Bunny God traffic:**
- Current: ~500 questions/day
- Peak: ~2 questions/minute
- Cache hit rate: ~65%

**Rate limit analysis:**

```
Without cache:
  2 req/min × 1440 min/day = 2880 req/day
  Free tier limit: 100 req / 5 min = 1200 req/5min = 28,800 req/day
  STATUS: ✅ Safe (10x headroom)

With cache (65% hit rate):
  2 req/min × 35% uncached = 0.7 req/min
  0.7 req/min × 1440 min/day = 1008 req/day
  STATUS: ✅ Very safe (28x headroom)
```

**Conclusion:** Free tier is sufficient for current traffic. API key optional.

**Fallback strategy if rate limited:**
- Semantic Scholar returns 429 → retry with backoff
- After 2 retries → skip Semantic Scholar, use CrossRef only
- No user-visible error (graceful degradation)

---

## Success Metrics

### Primary Success Metrics

#### 1. Source Diversity Improvement

**Metric:** % of non-ethics queries returning ethics papers

**Baseline (before):**
- Epistemology query → 80% ethics papers
- Metaphysics query → 75% ethics papers
- Philosophy of mind query → 70% ethics papers

**Target (after):**
- Epistemology query → 30% ethics papers (50% reduction ✅)
- Metaphysics query → 25% ethics papers (50% reduction ✅)
- Philosophy of mind query → 20% ethics papers (50% reduction ✅)

**Measurement:**
- Manually test 30 questions (10 per subfield)
- Count papers with "ethics" or "moral" in title/categories
- Compare before vs after

---

#### 2. Subfield Relevance Increase

**Metric:** % of papers matching detected subfield

**Baseline (before):**
- Epistemology query → 20% epistemology papers
- Metaphysics query → 25% metaphysics papers

**Target (after):**
- Epistemology query → 60% epistemology papers (40% increase ✅)
- Metaphysics query → 65% metaphysics papers (40% increase ✅)

**Measurement:**
- Use test questions corpus (100 questions)
- Analyze returned papers' categories/fieldsOfStudy
- Calculate match rate with detected subfield

---

#### 3. Performance (No Degradation)

**Metric:** P95 response latency

**Baseline (before):** 2.8s
**Target (after):** ≤ 2.8s (no degradation)
**Stretch goal:** < 2.5s (improvement via parallelization)

**Measurement:**
- Cloudflare Workers Analytics
- Track P50, P95, P99 over 7 days
- Compare week before vs week after

---

#### 4. Reliability Improvement

**Metric:** Combined API success rate

**Baseline (before):**
- CrossRef only success rate: ~97%

**Target (after):**
- Combined success rate: ≥ 99% (dual redundancy)
- Semantic Scholar success rate: ≥ 95%
- CrossRef success rate: ≥ 95%
- Both fail rate: < 0.25% (0.05 × 0.05)

**Measurement:**
- Track API success/failure rates
- Calculate combined success probability
- Monitor for 30 days

---

### Secondary Success Metrics

#### 5. User Feedback Improvement

**Metric:** "Helpful" feedback rating %

**Baseline (before):**
- Helpful: 68%
- Not helpful: 32%

**Target (after):**
- Helpful: ≥ 75% (10%+ improvement ✅)
- Not helpful: ≤ 25%

**Measurement:**
- Compare feedback ratings 2 weeks before vs 2 weeks after
- Statistical significance test (chi-square)
- Segment by question subfield

---

#### 6. Cache Performance

**Metric:** Cache hit rate

**Baseline (before):** 65%
**Target (after):** ≥ 70%

**Rationale:** Better subfield detection = more precise cache keys = higher hit rate for similar questions

**Measurement:**
- Track cache hits vs misses
- Calculate hit rate daily
- Compare 7-day average before vs after

---

#### 7. Source Utilization

**Metric:** % queries using Semantic Scholar

**Target:**
- ≥ 80% of queries successfully use Semantic Scholar
- ≥ 95% of queries use at least one source
- < 5% of queries fail to fetch any sources

**Measurement:**
- Track source attribution in logs
- Count: Semantic Scholar only, CrossRef only, both, neither
- Monitor daily

---

### Long-Term Impact Metrics (6 months)

#### 8. User Retention

**Metric:** % users who return after first visit

**Hypothesis:** Better sources → better answers → more return visits

**Measurement:**
- Track unique users (session IDs)
- Calculate 7-day retention rate
- Compare cohorts before vs after launch

---

#### 9. Query Diversity

**Metric:** Variety of philosophy subfields in queries

**Hypothesis:** If users perceive balanced coverage, they'll ask more diverse questions

**Measurement:**
- Analyze question distribution across subfields
- Calculate entropy of subfield distribution
- Higher entropy = more diversity

---

### Success Criteria Summary

**Minimum viable success (must achieve all):**
- ✅ 40%+ reduction in irrelevant ethics papers
- ✅ No performance degradation (P95 ≤ 2.8s)
- ✅ API success rate ≥ 95%
- ✅ Zero data corruption or critical bugs

**Stretch success (achieve 3 of 4):**
- ⭐ 10%+ improvement in user feedback ratings
- ⭐ P95 response time < 2.5s (faster than before)
- ⭐ Cache hit rate ≥ 70%
- ⭐ 80%+ queries successfully use Semantic Scholar

---

## Appendices

### Appendix A: Semantic Scholar API Examples

#### Example Request

```bash
curl -X GET "https://api.semanticscholar.org/graph/v1/paper/search?query=epistemology+knowledge&fields=paperId,title,authors,abstract,year,citationCount,fieldsOfStudy&fieldsOfStudy=Philosophy&limit=5" \
  -H "x-api-key: YOUR_API_KEY_HERE"
```

#### Example Response

```json
{
  "total": 4523,
  "offset": 0,
  "next": 5,
  "data": [
    {
      "paperId": "abc123def456",
      "title": "The Analysis of Knowledge",
      "abstract": "This paper examines the traditional definition of knowledge as justified true belief...",
      "year": 2019,
      "citationCount": 342,
      "fieldsOfStudy": ["Philosophy", "Epistemology"],
      "authors": [
        {
          "authorId": "12345",
          "name": "Linda Zagzebski"
        }
      ],
      "publicationVenue": {
        "name": "Philosophical Studies"
      },
      "url": "https://www.semanticscholar.org/paper/abc123def456"
    },
    {
      "paperId": "xyz789ghi012",
      "title": "Virtue Epistemology",
      "abstract": "An exploration of virtue-based approaches to epistemology...",
      "year": 2020,
      "citationCount": 289,
      "fieldsOfStudy": ["Philosophy"],
      "authors": [
        {
          "authorId": "67890",
          "name": "Ernest Sosa"
        }
      ],
      "url": "https://www.semanticscholar.org/paper/xyz789ghi012"
    }
  ]
}
```

---

### Appendix B: CrossRef API Examples

#### Example Request (Current)

```bash
curl "https://api.crossref.org/works?query=knowledge+philosophy+ethics+moral&rows=5&select=DOI,title,author,published,abstract,type&sort=relevance"
```

#### Example Request (Updated - No Bias)

```bash
curl "https://api.crossref.org/works?query=knowledge+philosophy+epistemology&rows=3&select=DOI,title,author,published,abstract,type&sort=relevance"
```

#### Example Response

```json
{
  "status": "ok",
  "message-type": "work-list",
  "message": {
    "total-results": 12456,
    "items": [
      {
        "DOI": "10.1093/mind/example",
        "title": ["Knowledge and Its Limits"],
        "author": [
          {
            "given": "Timothy",
            "family": "Williamson"
          }
        ],
        "published": {
          "date-parts": [[2000]]
        },
        "abstract": "<p>A comprehensive examination of knowledge...</p>",
        "type": "journal-article",
        "container-title": ["Mind"],
        "is-referenced-by-count": 1523
      }
    ]
  }
}
```

---

### Appendix C: Philosophy Subfield Keywords (Full List)

See [Smart Keyword Detection System](#smart-keyword-detection-system) section for complete keyword taxonomy.

**Additional keyword notes:**

- **Overlap handling:** Some keywords appear in multiple subfields (e.g., "freedom" in both politicalPhilosophy and existentialism). The detection algorithm handles this by scoring all matches and selecting the highest.

- **Future expansion:** Easy to add new subfields by extending `PHILOSOPHY_SUBFIELDS` object:
  ```typescript
  philosophyOfLanguage: {
    keywords: ['meaning', 'reference', 'semantics', 'pragmatics', ...],
    weight: 1.0,
  }
  ```

- **Localization:** Current keywords are English-only. For international support, add keyword translations.

---

### Appendix D: Error Codes & Troubleshooting

#### Semantic Scholar Errors

| Error Code | Meaning | Retry? | Fallback |
|------------|---------|--------|----------|
| 400 | Bad request (invalid query) | No | Use CrossRef |
| 429 | Rate limit exceeded | Yes (2x) | Use CrossRef after retries |
| 500 | Server error | Yes (2x) | Use CrossRef after retries |
| 503 | Service unavailable | Yes (2x) | Use CrossRef after retries |
| Timeout | Request took > 3s | No | Use CrossRef |
| Network | DNS/connection failure | Yes (1x) | Use CrossRef after retry |

#### CrossRef Errors

| Error Code | Meaning | Retry? | Fallback |
|------------|---------|--------|----------|
| 400 | Bad request | No | Return generic philosophy link |
| 429 | Rate limit (rare) | Yes (1x) | Return generic philosophy link |
| 500 | Server error | Yes (2x) | Return generic philosophy link |
| 503 | Service unavailable | Yes (2x) | Return generic philosophy link |
| Timeout | Request took > 3s | No | Return generic philosophy link |

#### Multi-Source Orchestration Errors

| Scenario | Behavior |
|----------|----------|
| Both APIs succeed | Merge and deduplicate results |
| Semantic Scholar fails, CrossRef succeeds | Use CrossRef results only |
| CrossRef fails, Semantic Scholar succeeds | Use Semantic Scholar results only |
| Both APIs fail | Throw error → trigger fallback response |
| Both APIs timeout | Return fallback response after 3s |

---

### Appendix E: Glossary

**API Terms:**
- **Semantic Scholar:** Free academic search engine with AI-powered paper recommendations
- **CrossRef:** DOI registration agency with metadata API for scholarly works
- **PhilPapers:** Philosophy-specific bibliography (current system name, not used in new implementation)
- **Workers AI:** Cloudflare's AI inference platform (Llama 3.1)

**Architecture Terms:**
- **Multi-source:** Querying multiple APIs simultaneously for diverse results
- **Normalization:** Converting different API response formats to unified interface
- **Deduplication:** Removing duplicate papers based on title similarity
- **Subfield detection:** Analyzing question to determine philosophy domain
- **Feature flag:** Environment variable to enable/disable new functionality

**Performance Terms:**
- **P50/P95/P99:** Percentile latency (e.g., P95 = 95% of requests faster than this)
- **Cache hit rate:** % of requests served from cache vs API
- **Rate limit:** Max requests per time period allowed by API
- **Exponential backoff:** Retry strategy with increasing delays (1s, 2s, 4s, ...)

---

### Appendix F: Related Resources

**Semantic Scholar Documentation:**
- [Academic Graph API Docs](https://api.semanticscholar.org/api-docs)
- [API Tutorial](https://www.semanticscholar.org/product/api/tutorial)
- [API Key Registration](https://www.semanticscholar.org/product/api#api-key-form)

**CrossRef Documentation:**
- [API Documentation](https://api.crossref.org/swagger-ui/index.html)
- [Best Practices](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)

**Cloudflare Workers:**
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [KV Storage Guide](https://developers.cloudflare.com/kv/)
- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

**Philosophy Resources:**
- [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/)
- [PhilPapers.org](https://philpapers.org/) (inspiration for current system name)
- [Internet Encyclopedia of Philosophy](https://iep.utm.edu/)

---

### Appendix G: Contact & Support

**Project Maintainer:** Bunny God Development Team
**Repository:** (Internal - add GitHub link)
**Slack Channel:** #bunny-god-dev

**Key Stakeholders:**
- Product Owner: (Name)
- Lead Engineer: (Name)
- QA Lead: (Name)

**Escalation Path:**
1. Check runbook for common issues
2. Search existing GitHub issues
3. Post in #bunny-god-dev Slack channel
4. Create GitHub issue with [BUG] or [QUESTION] tag
5. Escalate to Lead Engineer if critical

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-02 | Atlas | Initial PRD creation |

---

**END OF DOCUMENT**

*This PRD is a living document. Update as implementation progresses and requirements evolve.*
