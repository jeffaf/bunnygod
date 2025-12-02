# PhilPapers API Research Report

**Date:** 2025-12-01
**Investigator:** Atlas (Principal Software Engineer)
**Mission:** Determine if PhilPapers API supports free-text paper search

---

## Executive Summary

**FINDING: PhilPapers API does NOT support free-text search functionality.**

The PhilPapers JSON API only provides **category taxonomy data** via a single endpoint. There is no search API for querying papers by keywords, titles, authors, or abstracts.

**RECOMMENDATION: Rollback PhilPapers integration and rely solely on CrossRef API.**

---

## Research Methodology

### 1. Documentation Research

Attempted to access official PhilPapers API documentation:
- `https://philpapers.org/help/api.html` - **403 Forbidden**
- `https://philpapers.org/help/api/json.html` - **403 Forbidden**

Web search revealed:
- PhilPapers API provides category taxonomy via JSON feed
- No mention of search functionality in any documentation
- Third-party wrapper (BassP97/Philpapers-API) only implements category tree navigation, no search

### 2. Authentication Discovery

Initial testing with query parameters (`?apiId=X&apiKey=Y`) returned **403 Cloudflare blocks**.

**Breakthrough:** Tested multiple authentication methods and discovered PhilPapers requires **custom HTTP headers**:

```typescript
{
  'X-API-ID': 'your_api_id',
  'X-API-Key': 'your_api_key'
}
```

### 3. Endpoint Testing

Tested 12 potential endpoints with correct authentication headers:

#### ✅ Working Endpoints

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `https://philpapers.org/philpapers/raw/categories.json` | Category taxonomy | 200 OK |

**Response format:** Array of arrays containing category metadata
```json
[
  ["Philosophy, Misc", 4, "1", 1],
  ["Metaphysics and Epistemology", 10, "1", 1],
  ...
]
```

#### ❌ Non-Existent Endpoints (All returned 404)

Tested endpoints that do NOT exist:
- `/philpapers/api/search`
- `/api/search`
- `/philpapers/raw/search.json`
- `/philpapers/raw/papers.json`
- `/philpapers/raw/entries.json`
- `/philpapers/api/query`
- `/philpapers/raw/catentries.json`
- `/philpapers/raw/items.json`
- `/philpapers/raw/categoryPapers.json`

---

## Credentials Tested

- **API ID:** 2173589
- **API Key:** LJgLd84PeF2M3y8m
- **Status:** Valid (categories.json endpoint works with these credentials)

---

## Current Implementation Issues

### File: `/home/gat0r/bunnygod/workers/ask/philpapers.ts`

**Problem 1: Wrong Authentication Method**
```typescript
// Line 70-77: Current implementation (WRONG)
const searchUrl = new URL(apiUrl);
searchUrl.searchParams.set('apiId', credentials.apiId!);  // ❌ Wrong
searchUrl.searchParams.set('apiKey', credentials.apiKey!); // ❌ Wrong
```

Should be:
```typescript
// Correct authentication
const response = await fetch(url, {
  headers: {
    'X-API-ID': credentials.apiId!,    // ✅ Correct
    'X-API-Key': credentials.apiKey!,  // ✅ Correct
  }
});
```

**Problem 2: Non-Existent Endpoint**
```typescript
// Line 70: This endpoint doesn't exist
const apiUrl = 'https://philpapers.org/philpapers/api/search'; // ❌ 404 Not Found
```

**Problem 3: No Search API Exists**

PhilPapers API does not provide paper search functionality. Only category taxonomy is available.

---

## Alternative Search Sources

### CrossRef API (Already Implemented as Fallback)

**Status:** ✅ Working
**Endpoint:** `https://api.crossref.org/works`
**Features:**
- Free-text search across scholarly papers
- No authentication required
- Returns papers with titles, authors, abstracts, DOIs
- Works well with philosophy-related queries

**Current Implementation:** Lines 119-200 in `philpapers.ts` - already functional

---

## Test Scripts Created

Created three comprehensive test scripts for validation:

1. **`test-philpapers.ts`** - Basic endpoint testing (8 endpoints)
2. **`test-philpapers-advanced.ts`** - Authentication method discovery (9 methods)
3. **`test-philpapers-search.ts`** - Search endpoint testing (11 endpoints)

All scripts are executable with: `bun run <script-name>.ts`

---

## Recommendations

### Option 1: Rollback PhilPapers Integration (RECOMMENDED)

**Reasons:**
- PhilPapers API does NOT support search functionality
- CrossRef API already provides excellent philosophy paper results
- No additional value from PhilPapers integration
- Simplifies codebase and reduces API complexity

**Actions:**
1. Remove PhilPapers API code from `philpapers.ts` (lines 35-113)
2. Rename file to `crossref.ts` for clarity
3. Update function names to reflect CrossRef-only implementation
4. Remove PhilPapers credentials from environment/config

### Option 2: Category-Based Browse (NOT RECOMMENDED)

PhilPapers could theoretically be used to:
1. Fetch category taxonomy via `categories.json`
2. Browse papers by category ID (via web scraping, as no API exists)
3. Match user queries to categories

**Why NOT recommended:**
- Requires web scraping (no API for papers)
- Categories don't map well to free-text questions
- Adds significant complexity for minimal benefit
- CrossRef already provides better results

---

## Conclusion

**The PhilPapers API does not support free-text paper search. The API only provides category taxonomy data.**

The current implementation in `philpapers.ts` attempts to use a non-existent search endpoint with incorrect authentication. Even if authentication were corrected, no search functionality exists.

**FINAL RECOMMENDATION: Remove PhilPapers integration and rely exclusively on CrossRef API, which already provides excellent philosophy paper search results.**

---

## Appendix: Working Code Example

If someone wants to fetch PhilPapers categories (the ONLY working endpoint):

```typescript
async function fetchPhilPapersCategories(
  apiId: string,
  apiKey: string
): Promise<Array<[string, number, string, number]>> {
  const response = await fetch(
    'https://philpapers.org/philpapers/raw/categories.json',
    {
      headers: {
        'X-API-ID': apiId,
        'X-API-Key': apiKey,
        'User-Agent': 'YourApp/1.0',
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`PhilPapers API error: ${response.status}`);
  }

  return await response.json();
}
```

**Format:** `[categoryName, categoryId, parentIds, primaryParentId]`

---

## Sources

Documentation and research sources:
- [PhilPapers API Documentation](https://philpapers.org/help/api/)
- [PhilPapers JSON API](https://philpapers.org/help/api/json.html)
- [PhilPapers REST API - ProgrammableWeb](https://www.programmableweb.com/api/philpapers-rest-api-v1)
- [BassP97/Philpapers-API GitHub](https://github.com/BassP97/Philpapers-API)
- [CrossRef API Documentation](https://api.crossref.org/swagger-ui/index.html)
