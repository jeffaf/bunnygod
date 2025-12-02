# Bunny God Architecture Documentation

This document describes the system architecture, data flow, component hierarchy, and technical design decisions for the Bunny God philosophical Q&A application.

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Data Flow](#data-flow)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Caching Strategy](#caching-strategy)
- [Security Considerations](#security-considerations)
- [Performance Optimizations](#performance-optimizations)
- [Technology Choices](#technology-choices)

---

## System Overview

Bunny God is a full-stack philosophical Q&A application built on Cloudflare's edge computing platform. The system follows a modern JAMstack architecture with server-side AI processing.

**Architecture Pattern:** JAMstack + Edge Computing + AI Integration

**Key Characteristics:**
- **Static Frontend:** Pre-built Astro site hosted on Cloudflare Pages
- **Serverless Backend:** Cloudflare Workers for API and AI processing
- **Edge Caching:** Cloudflare KV for distributed caching
- **AI Integration:** Workers AI for natural language processing
- **External APIs:** CrossRef for academic paper retrieval

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Bunny God Frontend (React + Astro)                       │  │
│  │  - Question Input                                         │  │
│  │  - Answer Display                                         │  │
│  │  - Citations                                              │  │
│  │  - History Management                                     │  │
│  │  - Mystical Background (Canvas Animation)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓ ↑                                   │
│                    HTTPS POST Request                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE GLOBAL NETWORK                     │
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │  Cloudflare Pages │         │ Cloudflare Workers│             │
│  │  (Static Hosting) │         │  (API + AI)       │             │
│  │                   │         │                   │             │
│  │  - /dist output   │         │  - /api/ask       │             │
│  │  - HTML/CSS/JS    │         │  - /api/feedback  │             │
│  │  - Auto-deployed  │         │                   │             │
│  └──────────────────┘         └──────────────────┘             │
│                                        ↓ ↑                       │
│                    ┌───────────────────┴──────────────┐         │
│                    ↓                   ↓              ↓         │
│         ┌─────────────────┐  ┌──────────────┐  ┌──────────┐   │
│         │ Cloudflare KV   │  │ Workers AI   │  │ Analytics│   │
│         │                 │  │              │  │ Engine   │   │
│         │ - CACHE         │  │ - Llama 3.1  │  │ (Optional)│   │
│         │ - FEEDBACK      │  │ - 8B Instruct│  │          │   │
│         └─────────────────┘  └──────────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  CrossRef API (api.crossref.org)                     │        │
│  │  - Scholarly publication database                    │        │
│  │  - DOI resolution                                    │        │
│  │  - Paper metadata (title, authors, abstract)         │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Question → Answer Flow

```
1. USER ASKS QUESTION
   ↓
2. FRONTEND VALIDATION
   - Minimum 10 characters
   - Maximum 500 characters
   - Trim whitespace
   ↓
3. SEND TO WORKER API
   POST https://bunnygod-api.jeffbarron.workers.dev
   Body: { "question": "What is consciousness?" }
   ↓
4. WORKER: CHECK CACHE
   - Hash question → cache key
   - Query KV namespace
   - If cached → return immediately
   ↓
5. WORKER: QUERY CROSSREF
   - Extract search terms from question
   - Add philosophy keywords
   - Search CrossRef API
   - Return top 5 papers
   ↓
6. WORKER: SYNTHESIZE WITH AI
   - Build context from paper abstracts
   - Create system prompt (Bunny God personality)
   - Create user prompt (question + papers)
   - Call Workers AI (Llama 3.1 8B)
   - Generate 150-300 word answer
   ↓
7. WORKER: CACHE RESPONSE
   - Store in KV with 24-hour TTL
   - Return JSON response
   ↓
8. FRONTEND: DISPLAY ANSWER
   - Render answer text
   - Show expandable citations
   - Add to question history
   - Enable feedback buttons
   - Enable share buttons
```

### Feedback Submission Flow

```
1. USER CLICKS HELPFUL/NOT-HELPFUL
   ↓
2. FRONTEND: PREPARE FEEDBACK
   - Hash question → questionHash
   - Get sessionId from localStorage
   - Add timestamp
   ↓
3. SEND TO WORKER API
   POST https://bunnygod-api.jeffbarron.workers.dev/api/feedback
   Body: {
     "questionHash": "abc123",
     "rating": "helpful",
     "timestamp": 1701234567890,
     "sessionId": "uuid-v4"
   }
   ↓
4. WORKER: VALIDATE & RATE LIMIT
   - Check if already rated (session + question)
   - If already rated → return 429
   ↓
5. WORKER: STORE FEEDBACK
   - Add metadata (user-agent, country)
   - Store in KV with 30-day TTL
   - Store rate limit key with 7-day TTL
   ↓
6. WORKER: TRACK ANALYTICS
   - Write to Analytics Engine (if enabled)
   ↓
7. FRONTEND: UPDATE UI
   - Disable feedback buttons
   - Show "Thank you" message
```

---

## Frontend Architecture

### Technology Stack

- **Framework:** Astro 4.15+ (Static Site Generation)
- **UI Library:** React 18.3+ (Islands Architecture)
- **Styling:** Tailwind CSS 3.4+
- **Build Tool:** Vite (bundled with Astro)
- **Package Manager:** Bun
- **Type Checking:** TypeScript 5.6+

### Islands Architecture

Bunny God uses Astro's Islands Architecture for optimal performance:

**Static Components (Server-Rendered):**
- `MainLayout.astro` - Page layout, meta tags
- `index.astro` - Homepage structure

**Interactive Islands (Client-Side React):**
- `BunnyGodInterface.tsx` - Main Q&A interface (client:idle)
- `MysticalBackground.tsx` - Canvas particle animation (client:idle)
- `QuestionHistory.tsx` - Recent questions sidebar
- `ShareButtons.tsx` - Social sharing
- `FeedbackButtons.tsx` - Helpful/not-helpful rating

**Benefits:**
- Minimal JavaScript (only interactive components)
- Fast initial page load (HTML rendered server-side)
- Progressive enhancement (works without JS for static content)

### Component Loading Strategy

```typescript
// astro.config.mjs
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // Custom base styles
    }),
  ],
  output: 'static', // Static site generation
  build: {
    format: 'directory', // /page/ instead of /page.html
    inlineStylesheets: 'auto', // Inline critical CSS
  },
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS by route
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'], // Separate vendor chunk
          },
        },
      },
    },
  },
});
```

**Client Directives:**
- `client:idle` - Load after browser is idle (non-blocking)
- Used for all interactive components
- Improves Time to Interactive (TTI) by ~500-800ms

---

## Backend Architecture

### Technology Stack

- **Runtime:** Cloudflare Workers (V8 Isolates)
- **Language:** TypeScript 5.6+
- **AI:** Cloudflare Workers AI (Llama 3.1 8B Instruct)
- **Storage:** Cloudflare KV (Key-Value)
- **Analytics:** Cloudflare Analytics Engine (optional)

### Worker Structure

```
workers/ask/
├── index.ts          # Main worker entry point (fetch handler)
├── ai.ts             # Workers AI integration
├── philpapers.ts     # CrossRef API client
├── analytics.ts      # Analytics tracking
├── crypto.ts         # Hashing utilities
└── wrangler.toml     # Configuration & bindings
```

### Request Routing

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Route 1: Feedback endpoint
    if (url.pathname === '/api/feedback') {
      return handleFeedback(request, env, corsHeaders);
    }

    // Route 2: Question answering (default)
    return handleQuestion(request, env, corsHeaders);
  }
};
```

### Module Organization

**index.ts - Main Entry Point:**
- Request routing
- CORS handling
- Error handling
- Cache management

**ai.ts - AI Integration:**
- System prompt configuration (Bunny God personality)
- User prompt generation
- Workers AI API calls
- Context building from papers
- Fallback responses

**philpapers.ts - Academic Paper Retrieval:**
- CrossRef API integration
- Search term extraction
- Author name formatting
- Result parsing and validation

**analytics.ts - Tracking:**
- Event logging
- Performance metrics
- Error tracking
- Analytics Engine integration

### Environment Bindings

```toml
# wrangler.toml
[ai]
binding = "AI"  # Workers AI binding

[[kv_namespaces]]
binding = "CACHE"
id = "976ec464998d4ec1ad3371eb3a411c57"

[[kv_namespaces]]
binding = "FEEDBACK"
id = "6c82b5c661fc47898f9626770fad8c2e"

[[analytics_engine_datasets]]
binding = "ANALYTICS"  # Optional
```

---

## Component Hierarchy

### Frontend Component Tree

```
MainLayout.astro (Static)
└── index.astro (Static)
    └── BunnyGodInterface.tsx (client:idle)
        ├── QuestionHistory.tsx
        │   └── (Renders recent questions from localStorage)
        │
        ├── QuestionInput.tsx
        │   └── (Controlled input with validation)
        │
        ├── LoadingOracle.tsx (Conditional)
        │   └── (Animated mystical loading state)
        │
        ├── AnswerDisplay.tsx (Conditional)
        │   ├── ShareButtons.tsx
        │   │   └── (Twitter, LinkedIn, Copy Link)
        │   │
        │   ├── FeedbackButtons.tsx
        │   │   └── (Helpful / Not Helpful)
        │   │
        │   └── citations/
        │       └── CitationCard.tsx (Array)
        │           ├── CitationHeader.tsx
        │           ├── CitationAbstract.tsx
        │           └── CitationExpand.tsx
        │
        └── MysticalBackground.tsx (client:idle)
            └── (Canvas-based particle system)
```

### Component Responsibilities

**BunnyGodInterface.tsx (Container):**
- State management (question, answer, loading, error)
- API communication
- History management
- URL query parameter handling (?q=question)
- Child component orchestration

**QuestionInput.tsx (Controlled Component):**
- Input field rendering
- Validation (10-500 characters)
- Submit handling
- Loading state (disabled during fetch)

**AnswerDisplay.tsx (Presentational):**
- Answer text rendering
- Citations display
- Share/feedback buttons integration
- Markdown-like formatting

**LoadingOracle.tsx (Animation):**
- Mystical loading animation
- Rotating philosophical quotes
- Opacity transitions

**QuestionHistory.tsx (Local Storage):**
- Persist recent questions (localStorage)
- Click to re-ask
- Time-based sorting
- Limited to last 10 questions

**MysticalBackground.tsx (Canvas):**
- Particle system animation
- Performance-optimized (requestAnimationFrame)
- Responsive to screen size
- Low CPU usage (< 5%)

**Citations Components:**
- `CitationCard.tsx` - Container with expand/collapse
- `CitationHeader.tsx` - Title, authors, link
- `CitationAbstract.tsx` - Expandable abstract text
- `CitationExpand.tsx` - Expand/collapse button

---

## State Management

### Approach: React Hooks (No Redux)

Bunny God uses React's built-in state management (useState, useEffect, useCallback) without external libraries.

**Rationale:**
- Simple state requirements (single component tree)
- No cross-component state sharing needed
- Lightweight (no Redux bundle)
- Easier to understand and maintain

### State Structure

```typescript
// BunnyGodInterface.tsx
const [answer, setAnswer] = useState<Answer | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [currentQuestion, setCurrentQuestion] = useState<string>('');
const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('');
```

### State Transitions

```
INITIAL STATE
├── answer: null
├── isLoading: false
├── error: null
└── currentQuestion: ''

USER SUBMITS QUESTION
├── answer: null
├── isLoading: true  ← Set before fetch
├── error: null
└── lastAskedQuestion: 'What is...'

API SUCCESS
├── answer: { text, sources }  ← Set from response
├── isLoading: false
├── error: null
└── lastAskedQuestion: 'What is...'

API ERROR
├── answer: null
├── isLoading: false
├── error: 'Error message'  ← Set from catch
└── lastAskedQuestion: 'What is...'
```

### Persistent State (localStorage)

**Question History:**
```typescript
// Stored in localStorage as JSON array
const historyKey = 'bunnyGodHistory';
const history = JSON.parse(localStorage.getItem(historyKey) || '[]');

// Structure: Array<string>
// Example: ['What is consciousness?', 'What is free will?']
```

**Session ID (for feedback):**
```typescript
// Stored in localStorage for session continuity
const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
localStorage.setItem('sessionId', sessionId);
```

---

## Caching Strategy

### Three-Tier Caching

**1. Browser Cache (Static Assets)**
- **What:** HTML, CSS, JavaScript bundles
- **Where:** Browser cache
- **TTL:** Controlled by Cloudflare Pages (immutable hashed assets)
- **Cache Key:** File hash in filename (e.g., `client.BuOr9PT5.js`)
- **Invalidation:** New deployment → new hashes

**2. KV Cache (API Responses)**
- **What:** Question/answer pairs
- **Where:** Cloudflare KV namespace (edge-distributed)
- **TTL:** 24 hours
- **Cache Key:** `answer:{hash(question)}`
- **Invalidation:** Automatic expiration after 24 hours

**3. Cloudflare CDN Cache**
- **What:** Static pages, assets
- **Where:** Cloudflare edge nodes (200+ locations)
- **TTL:** Configured per asset type
- **Cache Key:** Full URL
- **Invalidation:** Purge via API or automatic on deployment

### Cache Hit Rate Analysis

**Estimated Cache Hit Rates:**
- Static assets: ~95% (immutable, long-lived)
- API responses: ~60-70% (varies by question uniqueness)
- Overall page load: ~90% served from cache

**Performance Impact:**
- Cache hit: ~50-100ms response time
- Cache miss: ~2-4s response time (AI synthesis)
- Cache savings: ~40x faster for repeated questions

---

## Security Considerations

### Input Validation

**Question Validation (Frontend):**
```typescript
// Minimum 10 characters
if (question.length < 10) return;

// Maximum 500 characters
if (question.length > 500) return;

// Trim whitespace
question = question.trim();
```

**Question Validation (Backend):**
```typescript
// Validate type
if (!body.question || typeof body.question !== 'string') {
  return error(400, 'Invalid question format');
}

// Sanitize
const sanitized = question.trim().replace(/\s+/g, ' ').substring(0, 500);
```

### API Security

**CORS Policy:**
- `Access-Control-Allow-Origin: *` (permissive for public API)
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

**Rate Limiting:**
- Cloudflare automatic DDoS protection
- Custom rate limiting for feedback (1 per session per question)
- Workers free tier: 100,000 requests/day

**Authentication:**
- None required (public API)
- No user accounts or personal data collection

### Data Privacy

**What We Store:**
- Question hashes (not original text) - 24 hours
- AI-generated answers - 24 hours
- Feedback ratings with minimal metadata - 30 days
- Session IDs (client-generated, not linked to identity)

**What We DON'T Store:**
- IP addresses (not logged)
- User accounts or emails
- Personal information
- Detailed analytics beyond Cloudflare defaults

**GDPR Compliance:**
- No personal data collection
- No cookies (except Cloudflare essential)
- No tracking scripts (except optional analytics)
- Data retention: 24-30 days max

### XSS Protection

**All user input is sanitized:**
```typescript
// React automatically escapes JSX content
<p>{answer.text}</p>  // XSS-safe

// URL encoding for share links
const shareUrl = encodeURIComponent(question);
```

### Content Security Policy (CSP)

Recommended CSP headers (configured in Cloudflare Pages):
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://bunnygod-api.jeffbarron.workers.dev;
  img-src 'self' data:;
```

---

## Performance Optimizations

### Bundle Optimization

**Code Splitting:**
- React/React-DOM in separate vendor chunk (42.66 KB gzipped)
- Component-based code splitting
- CSS code splitting by route

**Tree Shaking:**
- Unused Tailwind classes purged (32 KB → 6.25 KB gzipped)
- Unused imports removed by Vite
- No duplicate dependencies

**Compression:**
- Gzip compression by default
- Brotli available via Cloudflare

**Total Bundle Size:**
- JavaScript: 54.42 KB gzipped
- CSS: 6.25 KB gzipped
- **Total: 60.67 KB gzipped** ✅

### Loading Optimization

**Client Directives:**
```astro
<!-- Non-blocking loading -->
<BunnyGodInterface client:idle />
<MysticalBackground client:idle />
```

**Font Optimization:**
```html
<!-- Preload critical font -->
<link rel="preload" href="..." as="font" crossorigin>

<!-- Prevent FOIT with display=swap -->
<link href="...&display=swap" rel="stylesheet">
```

**Resource Hints:**
```html
<!-- Preconnect to API domain -->
<link rel="preconnect" href="https://bunnygod-api.jeffbarron.workers.dev">

<!-- DNS prefetch for fonts -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

### Rendering Optimization

**Server-Side Rendering:**
- Astro renders HTML server-side
- React hydrates only interactive components
- Reduces Time to First Contentful Paint (FCP)

**Lazy Loading:**
- Images (if added): `loading="lazy"`
- Components: Dynamic imports for heavy components

**Animation Performance:**
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid layout thrashing
- RequestAnimationFrame for canvas animations

### Network Optimization

**HTTP/2:**
- Cloudflare automatically uses HTTP/2
- Multiplexing for parallel asset loading

**Edge Computing:**
- Workers execute at Cloudflare edge (200+ locations)
- Reduced latency to <50ms for most users

**Caching:**
- Static assets: Browser cache + CDN cache
- API responses: KV cache (24-hour TTL)
- Cache hit rate: ~70-90%

### Estimated Performance Metrics

**Mobile (Slow 4G):**
- First Contentful Paint (FCP): 1.2-1.5s
- Largest Contentful Paint (LCP): 1.8-2.2s
- Time to Interactive (TTI): 2.5-2.8s
- Lighthouse Score: 92-95

**Desktop (Fast Connection):**
- First Contentful Paint (FCP): 0.4-0.6s
- Largest Contentful Paint (LCP): 0.6-0.9s
- Time to Interactive (TTI): 0.8-1.2s
- Lighthouse Score: 96-98

See [PERFORMANCE_REPORT.md](../PERFORMANCE_REPORT.md) for detailed metrics.

---

## Technology Choices

### Why Astro?

**Pros:**
- Minimal JavaScript by default (Islands Architecture)
- Fast build times
- Excellent DX (Developer Experience)
- Built-in TypeScript support
- React integration for interactive components

**Cons:**
- Smaller ecosystem than Next.js
- Less mature (but rapidly growing)

**Decision:** Chosen for performance and simplicity. No need for SSR (server-side rendering) since content is dynamic via API.

### Why Cloudflare Workers?

**Pros:**
- Edge computing (low latency worldwide)
- Generous free tier (100K requests/day)
- Built-in AI (Workers AI)
- Integrated KV storage
- Instant deployments

**Cons:**
- No Node.js APIs (V8 isolates, not full Node)
- Cold start latency (minimal with Workers)

**Decision:** Best combination of performance, cost, and AI integration. Edge execution crucial for global audience.

### Why React (not Vue/Svelte)?

**Pros:**
- Largest ecosystem
- Team familiarity
- Excellent TypeScript support
- Astro integration is first-class

**Cons:**
- Larger bundle than Svelte
- More boilerplate than Vue

**Decision:** React's ecosystem and stability outweigh bundle size concerns (mitigated by code splitting).

### Why Tailwind CSS?

**Pros:**
- Utility-first (rapid development)
- Excellent purging (6.25 KB gzipped)
- Consistent design system
- No CSS file management

**Cons:**
- Verbose HTML classes
- Learning curve for new developers

**Decision:** Tailwind's productivity and bundle size make it ideal for this project.

### Why Bun (not npm/yarn)?

**Pros:**
- Fastest package manager
- Built-in TypeScript support
- Drop-in npm replacement
- Excellent DX

**Cons:**
- Less mature than npm
- Some compatibility issues (rare)

**Decision:** Speed and DX improvements worth the trade-off. Fallback to npm for CI/CD if needed.

### Why CrossRef (not PhilPapers)?

**Pros:**
- RESTful JSON API
- No authentication required
- Broader coverage (all scholarly works)
- Fast and reliable

**Cons:**
- Not philosophy-specific
- Less detailed metadata than PhilPapers

**Decision:** PhilPapers API has authentication and rate limit challenges. CrossRef is more reliable and has sufficient data.

---

## Future Architecture Considerations

### Scalability

**Current Limits:**
- Cloudflare Workers: 100K requests/day (free tier)
- Workers AI: 10K AI requests/day (free tier)
- KV: 100K reads/day, 1K writes/day (free tier)

**Scaling Strategy:**
- Caching significantly extends free tier capacity
- Upgrade to Workers Paid ($5/month) for unlimited requests
- Consider CDN caching for popular questions

### Potential Enhancements

**1. Advanced Caching:**
- Precompute answers for common questions
- Longer TTL for stable answers (e.g., historical questions)

**2. Multi-Model AI:**
- Use different AI models for different question types
- Fallback models if primary fails

**3. Enhanced Analytics:**
- User behavior tracking (privacy-preserving)
- A/B testing for UI improvements
- Performance monitoring (RUM - Real User Monitoring)

**4. Content Moderation:**
- Filter inappropriate questions
- Detect and block spam/abuse

**5. Internationalization:**
- Multi-language support
- Translate questions/answers

**6. Offline Support:**
- Service worker for offline caching
- Progressive Web App (PWA)

---

## Conclusion

Bunny God's architecture prioritizes:
1. **Performance** - Edge computing, aggressive caching, minimal JavaScript
2. **Simplicity** - No complex state management, straightforward data flow
3. **Scalability** - Serverless architecture, distributed caching
4. **Developer Experience** - TypeScript, modern tooling, clear separation of concerns
5. **Cost Efficiency** - Free tier for all services, caching reduces API usage

The system is production-ready, performant, and maintainable.

---

**Last Updated:** 2025-12-01
**Maintained by:** Daniel Miessler
**Architecture Version:** 1.0
