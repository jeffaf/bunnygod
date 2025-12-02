# Bunny God API Documentation

This document describes the Cloudflare Workers API that powers the Bunny God philosophical Q&A system.

**Base URL:** `https://bunnygod-api.jeffbarron.workers.dev`

**Environment:** Cloudflare Workers (Edge Computing)

**AI Model:** Cloudflare Workers AI - Llama 3.1 8B Instruct

---

## Table of Contents

- [Endpoints](#endpoints)
  - [POST / - Ask Question](#post---ask-question)
  - [POST /api/feedback - Submit Feedback](#post-apifeedback---submit-feedback)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Caching](#caching)
- [Example Usage](#example-usage)

---

## Endpoints

### POST / - Ask Question

Submit a philosophical question and receive an AI-generated answer backed by academic citations.

**Endpoint:** `POST /`

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "What is the nature of consciousness?"
}
```

**Request Schema:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `question` | string | Yes | 10-500 characters | The philosophical question to ask |

**Response (200 OK):**
```json
{
  "answer": "Consciousness, as explored by philosophers like David Chalmers...",
  "sources": [
    {
      "title": "The Hard Problem of Consciousness",
      "authors": "David J. Chalmers",
      "url": "https://doi.org/10.1093/acprof:oso/9780195311105.003.0001"
    },
    {
      "title": "What is it Like to be a Bat?",
      "authors": "Thomas Nagel",
      "url": "https://doi.org/10.2307/2183914"
    }
  ],
  "cached": false
}
```

**Response Schema:**
| Field | Type | Description |
|-------|------|-------------|
| `answer` | string | AI-generated philosophical answer (150-300 words) |
| `sources` | array | Array of academic paper citations (up to 5) |
| `sources[].title` | string | Paper title |
| `sources[].authors` | string | Formatted author names (e.g., "John Smith, Jane Doe et al.") |
| `sources[].url` | string | DOI URL to the paper (https://doi.org/...) |
| `cached` | boolean | Whether response was served from cache (true) or generated fresh (false) |

---

### POST /api/feedback - Submit Feedback

Submit user feedback (helpful/not-helpful rating) for a question/answer pair.

**Endpoint:** `POST /api/feedback`

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "questionHash": "abc123def456",
  "rating": "helpful",
  "timestamp": 1701234567890,
  "sessionId": "uuid-v4-session-id"
}
```

**Request Schema:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `questionHash` | string | Yes | Non-empty string | Hash of the question (generated client-side) |
| `rating` | string | Yes | "helpful" or "not-helpful" | User's feedback rating |
| `timestamp` | number | Yes | Unix timestamp in milliseconds | When feedback was submitted |
| `sessionId` | string | No | UUID v4 recommended | Session identifier for rate limiting |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

**Response Schema:**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether feedback was successfully recorded |
| `message` | string | Human-readable success message |

---

## Request/Response Formats

### Content Types

All requests and responses use JSON format:
- **Request**: `Content-Type: application/json`
- **Response**: `Content-Type: application/json`

### Character Encoding

UTF-8 encoding is used for all text content.

### CORS Headers

The API includes permissive CORS headers for browser access:
```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Preflight `OPTIONS` requests are supported and return a 200 response with CORS headers.

---

## Error Handling

### Error Response Format

All error responses follow this structure:
```json
{
  "error": "Error message describing what went wrong",
  "message": "Optional detailed error message (development mode only)"
}
```

### HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| **200** | Success | Request completed successfully |
| **400** | Bad Request | Invalid request body, missing required fields, validation errors |
| **405** | Method Not Allowed | Non-POST request to API endpoint |
| **429** | Too Many Requests | Rate limit exceeded (feedback already submitted for this question/session) |
| **500** | Internal Server Error | Worker error, AI service failure, network issues |
| **503** | Service Unavailable | Required service (KV namespace) not configured |

### Error Examples

**400 - Invalid Question (Too Short):**
```json
{
  "error": "Question too short (minimum 10 characters)"
}
```

**400 - Invalid Question (Too Long):**
```json
{
  "error": "Question too long (maximum 500 characters)"
}
```

**400 - Invalid Question Format:**
```json
{
  "error": "Invalid question format"
}
```

**405 - Method Not Allowed:**
```json
{
  "error": "Method not allowed"
}
```

**429 - Rate Limited (Feedback):**
```json
{
  "error": "Already rated this question",
  "rating": "helpful"
}
```

**500 - Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "AI service timeout" // Development mode only
}
```

**503 - Service Unavailable:**
```json
{
  "error": "Feedback storage not configured"
}
```

---

## Rate Limiting

### Question Endpoint (`/`)

**No explicit rate limiting** - Cloudflare Workers handles abuse protection automatically.

Practical limits:
- Cloudflare free tier: 100,000 requests/day
- Workers AI free tier: 10,000 AI requests/day
- Caching significantly reduces AI usage for repeated questions

### Feedback Endpoint (`/api/feedback`)

**Session-based rate limiting** to prevent duplicate feedback:
- One rating per `questionHash` per `sessionId`
- Rate limit key: `ratelimit:{sessionId}:{questionHash}`
- TTL: 7 days
- Attempting to re-rate returns 429 with existing rating

---

## Caching

### Question Responses

**Cache Strategy:** 24-hour TTL in Cloudflare KV namespace

**Cache Key Format:** `answer:{hash(question)}`

**Hash Algorithm:** Simple 32-bit integer hash converted to base36
```javascript
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
```

**Cache Behavior:**
1. Request arrives with question
2. Question is hashed to generate cache key
3. KV namespace is checked for cached response
4. If cached: Return immediately with `cached: true`
5. If not cached: Query CrossRef → AI synthesis → Store in KV → Return with `cached: false`

**Cache Invalidation:** Automatic after 24 hours (TTL expiration)

**Benefits:**
- Instant responses for repeated questions
- Reduced AI API usage and costs
- Lower CrossRef API load
- Improved response times (cache hit: ~50-100ms, cache miss: ~2-4s)

### Feedback Storage

**Storage Strategy:** 30-day TTL in Cloudflare KV namespace

**Storage Key Format:** `feedback:{questionHash}:{timestamp}`

**Metadata Captured:**
- `questionHash`: Hash of the question
- `rating`: "helpful" or "not-helpful"
- `timestamp`: Unix timestamp (milliseconds)
- `sessionId`: Client session identifier (if provided)
- `userAgent`: User's browser/client (from request headers)
- `country`: Geographic location (from Cloudflare edge)

**Storage TTL:**
- Feedback data: 30 days
- Rate limit keys: 7 days

---

## Example Usage

### JavaScript/TypeScript (Fetch API)

**Ask a Question:**
```typescript
async function askBunnyGod(question: string) {
  const response = await fetch('https://bunnygod-api.jeffbarron.workers.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const data = await response.json();
  return data; // { answer, sources, cached }
}

// Usage
const result = await askBunnyGod('What is the meaning of life?');
console.log(result.answer);
console.log(`Citations: ${result.sources.length}`);
console.log(`Cached: ${result.cached}`);
```

**Submit Feedback:**
```typescript
async function submitFeedback(questionHash: string, rating: 'helpful' | 'not-helpful', sessionId: string) {
  const response = await fetch('https://bunnygod-api.jeffbarron.workers.dev/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questionHash,
      rating,
      timestamp: Date.now(),
      sessionId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json(); // { success: true, message: "..." }
}

// Usage
await submitFeedback('abc123', 'helpful', 'my-session-uuid');
```

### cURL

**Ask a Question:**
```bash
curl -X POST https://bunnygod-api.jeffbarron.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"question": "What is free will?"}'
```

**Submit Feedback:**
```bash
curl -X POST https://bunnygod-api.jeffbarron.workers.dev/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "questionHash": "abc123def456",
    "rating": "helpful",
    "timestamp": 1701234567890,
    "sessionId": "my-session-id"
  }'
```

### Python (requests library)

**Ask a Question:**
```python
import requests

def ask_bunny_god(question: str):
    response = requests.post(
        'https://bunnygod-api.jeffbarron.workers.dev',
        json={'question': question}
    )
    response.raise_for_status()
    return response.json()

# Usage
result = ask_bunny_god('What is consciousness?')
print(result['answer'])
print(f"Sources: {len(result['sources'])}")
print(f"Cached: {result['cached']}")
```

**Submit Feedback:**
```python
import time

def submit_feedback(question_hash: str, rating: str, session_id: str):
    response = requests.post(
        'https://bunnygod-api.jeffbarron.workers.dev/api/feedback',
        json={
            'questionHash': question_hash,
            'rating': rating,
            'timestamp': int(time.time() * 1000),
            'sessionId': session_id
        }
    )
    response.raise_for_status()
    return response.json()

# Usage
submit_feedback('abc123', 'helpful', 'my-session-id')
```

---

## Analytics

### Cloudflare Workers Analytics

Basic analytics are automatically tracked by Cloudflare Workers:
- Request count
- CPU time
- Response time
- Error rate
- Geographic distribution

**Dashboard:** https://dash.cloudflare.com → Workers → Analytics

### Custom Analytics (Optional)

The worker supports Cloudflare Analytics Engine (commented out in `wrangler.toml`):

**Events Tracked:**
- `question_answered` - Successful question/answer generation
- `feedback_submitted` - User feedback submission
- `error` - API errors

**Metrics:**
- Question length
- Response time (milliseconds)
- Number of sources returned
- Cache hit/miss

To enable: Uncomment Analytics Engine binding in `workers/ask/wrangler.toml`

---

## Data Sources

### CrossRef API

The worker queries the CrossRef API for scholarly publications:

**API:** https://api.crossref.org/works
**Documentation:** https://api.crossref.org/swagger-ui/index.html
**User-Agent:** `BunnyGod/1.0 (mailto:contact@bunnygod.ai; Philosophical Q&A AI)`

**Search Strategy:**
1. Extract key terms from question (remove stop words)
2. Add philosophy-related keywords: "philosophy ethics moral"
3. Query CrossRef API with `sort=relevance`
4. Return top 5 most relevant papers
5. Extract: title, authors, DOI, abstract, publication year

**Fallback:** If CrossRef fails or returns no results, a generic PhilPapers.org link is provided.

### Workers AI - Llama 3.1 8B Instruct

**Model:** `@cf/meta/llama-3.1-8b-instruct`
**Provider:** Cloudflare Workers AI
**Context Window:** 8192 tokens
**Max Output Tokens:** 512 (configured)
**Temperature:** 0.7 (balanced creativity/accuracy)

**System Prompt:** Configures Bunny God personality (mystical, authoritative, playful)
**User Prompt:** Includes question + paper abstracts for context

---

## Security & Privacy

### Data Retention

- **Questions**: Hashed for caching (24-hour TTL), original text not stored
- **Answers**: Cached for 24 hours, then deleted
- **Feedback**: Stored for 30 days with minimal metadata
- **Sessions**: Rate limit keys stored for 7 days

### Personal Data

The API does NOT collect:
- User accounts or authentication
- Email addresses or names
- IP addresses (not logged)
- Detailed analytics beyond Cloudflare defaults

The API DOES collect (for feedback only):
- Geographic location (country-level from Cloudflare edge)
- User-Agent header (browser/client information)
- Session IDs (client-generated, not linked to identity)

### CORS Policy

The API uses a permissive CORS policy (`Access-Control-Allow-Origin: *`) to allow browser-based access from any domain. This is intentional for public API access.

---

## Troubleshooting

### Common Issues

**"Question too short" error:**
- Ensure question is at least 10 characters
- Check for leading/trailing whitespace (API trims input)

**"Internal server error":**
- Check Cloudflare Workers dashboard for error logs
- Verify KV namespaces are configured correctly
- Ensure Workers AI binding is active

**"Already rated this question" (429):**
- User has already submitted feedback for this question in this session
- Wait 7 days or use a different session ID

**No sources returned:**
- CrossRef API may have failed (check worker logs)
- Fallback source (PhilPapers.org link) is provided

For detailed troubleshooting, see [docs/TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## API Versioning

**Current Version:** v1 (implicit, no version in URL)

The API is currently unversioned. Breaking changes will be announced and a versioned API (`/v2/`) will be introduced if needed.

**Stability:** Production-ready, but subject to minor improvements and bug fixes.

---

## Support

For API issues, bugs, or feature requests:

- **GitHub Issues:** https://github.com/jeffaf/bunnygod/issues
- **Documentation:** https://github.com/jeffaf/bunnygod/tree/main/docs

---

**Last Updated:** 2025-12-01
**Maintained by:** Daniel Miessler
**API Status:** Production
