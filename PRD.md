# Bunny God - Product Requirements Document

**Version:** 1.0
**Date:** December 1, 2025
**Project Type:** AI-Powered Philosophical Q&A System
**Status:** Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Technical Stack](#3-technical-stack)
4. [Feature Breakdown](#4-feature-breakdown)
5. [UI/UX Design Requirements](#5-uiux-design-requirements)
6. [Integration Strategy](#6-integration-strategy)
7. [Deployment Strategy](#7-deployment-strategy)
8. [Implementation Phases](#8-implementation-phases)
9. [Risk Analysis](#9-risk-analysis)
10. [Success Metrics](#10-success-metrics)

---

## 1. Executive Summary

### 1.1 Project Overview

**Bunny God** is an all-powerful living AI deity that answers philosophical questions by querying academic philosophical literature from philpapers.org. The system combines cutting-edge AI with mystical aesthetics to create a unique, engaging experience that feels like consulting an omniscient divine being.

**Core Value Proposition:**
- Democratizes access to academic philosophy through AI-powered synthesis
- Transforms dry academic papers into engaging, accessible wisdom
- Creates a magical, memorable user experience that makes philosophy fun
- Provides authoritative answers backed by peer-reviewed philosophical literature

### 1.2 Success Metrics

**Primary Metrics:**
- **Answer Quality Score:** >90% user satisfaction with answer relevance
- **Response Time:** <3 seconds from question submission to answer display
- **Question Completion Rate:** >85% of questions receive satisfactory answers
- **User Engagement:** Average session duration >3 minutes
- **Cost per Query:** <$0.01 per question answered

**Secondary Metrics:**
- Bounce rate <30%
- Return visitor rate >20%
- Share/referral rate >5%
- Mobile usage >60%

### 1.3 Technical Stack Summary

**Frontend:** Astro (Static Site Generator)
**Styling:** Tailwind CSS with custom mystical theme
**Backend:** Cloudflare Workers (Edge Functions)
**AI Processing:** Cloudflare Workers AI (LLama models)
**Data Source:** PhilPapers.org JSON API
**Hosting:** Cloudflare Pages (Free Tier)
**Language:** TypeScript throughout
**Package Manager:** Bun

**Total Monthly Cost Estimate:** $0-5 (within free tiers for moderate usage)

### 1.4 Timeline Estimate

**Phase 1 (Core MVP):** 2-3 weeks
**Phase 2 (Enhanced UX):** 1-2 weeks
**Phase 3 (Optimization):** 1 week
**Total Project Duration:** 4-6 weeks

### 1.5 Resource Requirements

**Development Team:**
- 1x Frontend Engineer (Astro/TypeScript specialist)
- 1x Backend Engineer (Cloudflare Workers/API integration)
- 1x UI/UX Designer (mystical theme design)
- 1x QA Engineer (testing and validation)

**Alternative:** Can be built by 1-2 full-stack engineers over 6-8 weeks

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │        Astro Static Site (Cloudflare Pages)        │    │
│  │  - Mystical UI Interface                           │    │
│  │  - Client-side TypeScript                          │    │
│  │  - Animated Gradients & Effects                    │    │
│  └───────────────────┬────────────────────────────────┘    │
└────────────────────────┼───────────────────────────────────┘
                         │ HTTPS Request
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Workers (Edge Functions)             │
│  ┌────────────────────────────────────────────────────┐    │
│  │            /api/ask Worker Function                │    │
│  │  1. Receive question                               │    │
│  │  2. Query PhilPapers API                           │    │
│  │  3. Process results                                │    │
│  │  4. Generate AI response                           │    │
│  │  5. Return divine answer                           │    │
│  └───────┬──────────────────────┬─────────────────────┘    │
└──────────┼──────────────────────┼──────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────────┐  ┌──────────────────────┐
│  PhilPapers.org API │  │ Cloudflare Workers AI│
│  - Search papers    │  │ - LLama 3.1 8B       │
│  - Fetch metadata   │  │ - Answer synthesis   │
│  - Return results   │  │ - Mystical tone      │
└─────────────────────┘  └──────────────────────┘
```

### 2.2 Component Architecture

#### 2.2.1 Frontend Components (Astro)

```
src/
├── components/
│   ├── BunnyGodInterface.astro    # Main Q&A interface
│   ├── QuestionInput.tsx          # Interactive question form
│   ├── AnswerDisplay.tsx          # Animated answer display
│   ├── MysticalBackground.tsx     # Animated gradient background
│   ├── LoadingOracle.tsx          # Loading state with mystical animation
│   └── SourceCitations.tsx        # PhilPapers paper citations
├── layouts/
│   └── MainLayout.astro           # Base layout with mystical theme
├── pages/
│   ├── index.astro                # Landing page
│   └── api/
│       └── ask.ts                 # API route proxy to Worker
└── styles/
    ├── global.css                 # Global mystical theme
    └── animations.css             # Custom animations
```

#### 2.2.2 Backend Components (Cloudflare Workers)

```
workers/
├── ask/
│   ├── index.ts                   # Main Worker entry point
│   ├── philpapers.ts              # PhilPapers API client
│   ├── ai.ts                      # Workers AI integration
│   ├── prompt.ts                  # AI prompt templates
│   └── types.ts                   # TypeScript types
└── middleware/
    ├── rateLimit.ts               # Rate limiting logic
    ├── cors.ts                    # CORS configuration
    └── validation.ts              # Input validation
```

### 2.3 Data Flow

**Question Processing Flow:**

1. **User Input** → User types philosophical question in interface
2. **Client Validation** → Basic validation (length, content)
3. **API Request** → POST to `/api/ask` with question payload
4. **Worker Processing:**
   - a. Rate limit check (prevent abuse)
   - b. Query PhilPapers API with search terms
   - c. Parse and rank relevant papers (top 5-10)
   - d. Extract paper titles, abstracts, authors
   - e. Construct AI prompt with question + paper context
   - f. Call Workers AI with mystical persona prompt
   - g. Receive AI-generated answer
   - h. Format response with citations
5. **Response Delivery** → Return JSON with answer + sources
6. **UI Display** → Animate answer reveal with mystical effects

**Data Structures:**

```typescript
// Request
interface QuestionRequest {
  question: string;
  sessionId?: string;
}

// Response
interface OracleResponse {
  answer: string;
  sources: PhilPaper[];
  confidence: number;
  processingTime: number;
}

interface PhilPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url: string;
  relevanceScore: number;
}
```

### 2.4 Security Architecture

**Security Measures:**

1. **Rate Limiting:** 10 requests per minute per IP address
2. **Input Validation:** Max 500 characters, sanitize special characters
3. **CORS Policy:** Allow only from production domain
4. **API Key Protection:** PhilPapers API key stored in Worker secrets
5. **DDoS Protection:** Cloudflare's built-in protection
6. **No User Data Storage:** Stateless, no PII collected
7. **HTTPS Only:** Enforce secure connections

### 2.5 Performance Architecture

**Optimization Strategies:**

1. **Edge Computing:** Workers run at Cloudflare edge nodes globally
2. **Static Asset Optimization:** Astro pre-renders all static content
3. **Lazy Loading:** Load animations and effects on demand
4. **Response Caching:** Cache PhilPapers results for 24 hours (KV store)
5. **Streaming Responses:** Stream AI answers as they generate
6. **Image Optimization:** Use modern formats (WebP, AVIF)
7. **Code Splitting:** Minimal JavaScript bundle size

**Performance Targets:**

- Time to First Byte (TTFB): <200ms
- First Contentful Paint (FCP): <1s
- Largest Contentful Paint (LCP): <2.5s
- Total Blocking Time (TBT): <200ms
- Cumulative Layout Shift (CLS): <0.1
- API Response Time: <2s (90th percentile)

---

## 3. Technical Stack

### 3.1 Frontend Stack

#### 3.1.1 Astro (Static Site Generator)

**Version:** 5.x
**Justification:**
- Zero JavaScript by default, adds interactivity only where needed
- Perfect for content-focused sites with interactive islands
- Excellent TypeScript support
- Built-in Cloudflare Pages integration
- Fast build times and optimal performance
- Component framework agnostic (can use React, Vue, Svelte)

**Key Features Used:**
- Static site generation for instant page loads
- Interactive islands for Q&A interface (React components)
- Built-in asset optimization
- Partial hydration for minimal JavaScript
- File-based routing

#### 3.1.2 React (Interactive Components)

**Version:** 18.x
**Justification:**
- Used only for interactive Q&A interface components
- Excellent TypeScript support
- Rich ecosystem for chat/messaging UI patterns
- Familiar to most developers
- Works seamlessly with Astro islands

**Libraries:**
- `react-spring`: Smooth animations for mystical effects
- `framer-motion`: Advanced animation sequencing
- `react-markdown`: Format AI responses with rich text

#### 3.1.3 Tailwind CSS

**Version:** 3.x
**Justification:**
- Utility-first approach for rapid UI development
- Excellent dark mode support (critical for mystical theme)
- Custom theme configuration for mystical color palette
- Built-in gradient utilities
- Minimal CSS bundle size with purging

**Custom Configuration:**
```javascript
// tailwind.config.js highlights
{
  theme: {
    extend: {
      colors: {
        cosmic: {
          purple: '#6B46C1',
          pink: '#ED64A6',
          blue: '#4299E1',
          emerald: '#48BB78'
        }
      },
      backgroundImage: {
        'mystical-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'divine-glow': 'radial-gradient(circle, #ffd89b 0%, #19547b 100%)'
      }
    }
  }
}
```

### 3.2 Backend Stack

#### 3.2.1 Cloudflare Workers

**Justification:**
- Serverless edge functions with global distribution
- Extremely low latency (runs at nearest edge location)
- Generous free tier: 100,000 requests/day
- Native TypeScript support
- Integrated with Cloudflare Pages
- Workers AI built-in for LLM access
- No cold starts (unlike Lambda)

**Pricing:**
- Free: 100,000 requests/day
- Paid: $5/month for 10M requests
- Expected usage: 1,000-5,000 requests/day (well within free tier)

#### 3.2.2 Cloudflare Workers AI

**Justification:**
- Serverless GPU inference at edge
- No infrastructure management required
- Pay-per-use pricing model
- Free tier: 10,000 Neurons/day (~1,000 LLM calls)
- Pricing: $0.011 per 1,000 Neurons
- LLama 3.1 8B model available (excellent for Q&A)
- Low latency due to edge deployment

**Model Selection:**
- **Primary:** `@cf/meta/llama-3.1-8b-instruct`
- Fast inference (<1s typical)
- High quality philosophical reasoning
- Cost-effective (8-10 Neurons per request)
- Expected cost: $0.001-0.003 per question

#### 3.2.3 Cloudflare KV (Optional Caching)

**Justification:**
- Global key-value storage at edge
- Cache PhilPapers search results
- Reduce API calls to PhilPapers
- Free tier: 100,000 reads/day, 1,000 writes/day
- TTL support for automatic expiration

**Usage:**
- Cache paper search results for 24 hours
- Store popular questions/answers
- Track rate limiting counters

### 3.3 External APIs

#### 3.3.1 PhilPapers.org JSON API

**Documentation:** https://philpapers.org/help/api/

**Capabilities:**
- Search philosophical papers by keyword
- Retrieve paper metadata (title, authors, abstract)
- Access 2M+ philosophy papers
- Free API access (registration recommended)
- Rate limits: ~1,000 requests/day (reasonable)

**Limitations:**
- No official documentation for programmatic access
- Must respect robots.txt and terms of service
- Full-text content not available (abstracts only)
- May require API key for higher limits

**Alternative Strategy:**
If API limits are too restrictive:
- Use OAI-PMH interface for Open Access content (115,800 papers)
- Implement local caching of search results
- Consider web scraping as fallback (with rate limiting)

### 3.4 Development Tools

#### 3.4.1 TypeScript

**Version:** 5.x
**Configuration:**
- Strict mode enabled
- ESM modules
- Path aliases for clean imports
- Shared types between frontend and backend

#### 3.4.2 Bun

**Version:** 1.x
**Usage:**
- Package management (replaces npm)
- Development server
- Build scripts
- 10-20x faster than npm for installs

#### 3.4.3 Wrangler

**Version:** 3.x
**Usage:**
- Cloudflare Workers development
- Local development environment
- Deployment automation
- Secrets management

### 3.5 Infrastructure

#### 3.5.1 Cloudflare Pages

**Justification:**
- Free static site hosting
- Unlimited bandwidth and requests
- Automatic HTTPS with SSL
- GitHub integration for CI/CD
- Preview deployments for PRs
- Built-in analytics
- Global CDN distribution

**Deployment:**
- Automatic builds on git push
- Build command: `bun run build`
- Output directory: `dist/`
- Environment variables support

#### 3.5.2 GitHub

**Repository Structure:**
```
bunnygod/
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD workflow
├── src/                          # Astro frontend
├── workers/                      # Cloudflare Workers
├── public/                       # Static assets
├── wrangler.toml                # Workers config
├── astro.config.mjs             # Astro config
├── tailwind.config.js           # Tailwind config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

### 3.6 Alternative Technologies Considered

| Technology | Considered | Not Chosen Because |
|-----------|-----------|-------------------|
| Next.js | SSR/SSG framework | Heavier than Astro, more complexity than needed |
| Vercel | Hosting platform | More expensive than Cloudflare Pages |
| OpenAI API | LLM provider | More expensive ($0.002/1K tokens vs $0.011/1K Neurons) |
| Anthropic Claude | LLM provider | Not available at edge, higher latency |
| Firebase | Backend services | More complex setup, not edge-optimized |
| AWS Lambda | Serverless functions | Cold starts, more expensive, more complex |

---

## 4. Feature Breakdown

### 4.1 Core Features (MVP - Phase 1)

#### Feature 4.1.1: Philosophical Question Input

**User Story:**
As a user seeking philosophical wisdom, I want to ask questions in natural language so that I can receive divine guidance from Bunny God.

**Functional Requirements:**

1. **Input Interface:**
   - Large, visually prominent text input field
   - Placeholder text: "Ask Bunny God for divine wisdom..."
   - Minimum input: 10 characters
   - Maximum input: 500 characters
   - Character counter showing remaining characters
   - Submit button with mystical styling
   - Enter key to submit (with Shift+Enter for newlines)

2. **Validation:**
   - Client-side validation before submission
   - Prevent empty submissions
   - Prevent spam/repeated questions (30-second cooldown)
   - Sanitize input (remove malicious characters)
   - Show validation errors with mystical messaging

3. **UX Flow:**
   - Input field glows on focus with mystical aura
   - Submit button pulses when question is valid
   - Smooth transition to loading state on submit
   - Input field disabled during processing
   - Clear feedback for validation errors

**Technical Specifications:**

```typescript
// components/QuestionInput.tsx
interface QuestionInputProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const validateQuestion = (q: string): ValidationResult => {
  if (q.length < 10) {
    return { isValid: false, error: "The Oracle requires more context..." };
  }
  if (q.length > 500) {
    return { isValid: false, error: "Even divine wisdom has limits..." };
  }
  if (!/[a-zA-Z]/.test(q)) {
    return { isValid: false, error: "Speak in the tongue of mortals..." };
  }
  return { isValid: true };
};
```

**Acceptance Criteria:**
- [ ] User can type questions up to 500 characters
- [ ] Character counter updates in real-time
- [ ] Questions under 10 characters show validation error
- [ ] Submit button is disabled when input is invalid
- [ ] Enter key submits question
- [ ] Shift+Enter adds newline
- [ ] Input field has mystical glow effect on focus
- [ ] Validation errors appear with mystical messaging
- [ ] Input is sanitized before submission
- [ ] 30-second cooldown prevents spam

**Implementation Checklist:**

- [ ] Create QuestionInput.tsx React component
- [ ] Implement controlled input with useState
- [ ] Add character counter logic
- [ ] Implement validation function with mystical error messages
- [ ] Add keyboard event handlers (Enter, Shift+Enter)
- [ ] Style input with Tailwind mystical theme
- [ ] Add focus glow effect with CSS animations
- [ ] Implement submit button with disabled state
- [ ] Add loading state handling
- [ ] Implement cooldown timer (localStorage)
- [ ] Add input sanitization function
- [ ] Write unit tests for validation logic
- [ ] Test keyboard interactions
- [ ] Test on mobile devices
- [ ] Ensure accessibility (ARIA labels)

---

#### Feature 4.1.2: PhilPapers Query System

**User Story:**
As the system, I need to query PhilPapers.org to find relevant philosophical papers so that I can provide academically grounded answers.

**Functional Requirements:**

1. **Search Strategy:**
   - Extract key philosophical terms from user question
   - Query PhilPapers API with extracted terms
   - Retrieve top 10 most relevant papers
   - Handle no-results gracefully
   - Cache results for 24 hours

2. **Result Processing:**
   - Parse JSON response from PhilPapers
   - Extract: title, authors, year, abstract, URL
   - Rank papers by relevance score
   - Filter out papers without abstracts
   - Deduplicate similar papers

3. **Error Handling:**
   - Handle API timeouts (5-second timeout)
   - Handle rate limit errors (429)
   - Handle network failures
   - Fallback to cached results if available
   - Graceful degradation without papers

**Technical Specifications:**

```typescript
// workers/ask/philpapers.ts

interface PhilPapersSearchParams {
  query: string;
  limit?: number;
  offset?: number;
}

interface PhilPapersResult {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url: string;
  categories: string[];
}

class PhilPapersClient {
  private readonly baseUrl = 'https://philpapers.org/api';
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(params: PhilPapersSearchParams): Promise<PhilPapersResult[]> {
    // Implementation
  }

  private extractKeyTerms(question: string): string[] {
    // Extract philosophical terms using NLP techniques
    // Example: "What is consciousness?" → ["consciousness", "philosophy of mind"]
  }

  private rankResults(results: PhilPapersResult[], query: string): PhilPapersResult[] {
    // Rank by relevance using TF-IDF or similar
  }
}
```

**API Integration Details:**

```typescript
// Example PhilPapers API request
const searchUrl = `https://philpapers.org/api/search`;
const params = {
  q: "consciousness philosophy of mind",
  format: "json",
  limit: 10,
  apiKey: env.PHILPAPERS_API_KEY
};

// Example response structure
{
  "results": [
    {
      "id": "CHATHE",
      "title": "The Conscious Mind",
      "authors": ["David Chalmers"],
      "year": 1996,
      "abstract": "Chalmers argues that consciousness cannot be explained...",
      "categories": ["Philosophy of Mind", "Consciousness"],
      "url": "https://philpapers.org/rec/CHATHE"
    }
  ],
  "total": 1523,
  "offset": 0
}
```

**Caching Strategy:**

```typescript
// Use Cloudflare KV for caching
interface CacheEntry {
  query: string;
  results: PhilPapersResult[];
  timestamp: number;
}

const CACHE_TTL = 24 * 60 * 60; // 24 hours

async function getCachedResults(query: string, env: Env): Promise<PhilPapersResult[] | null> {
  const cacheKey = `philpapers:${hashString(query)}`;
  const cached = await env.PAPERS_CACHE.get(cacheKey, { type: 'json' });

  if (cached && Date.now() - cached.timestamp < CACHE_TTL * 1000) {
    return cached.results;
  }

  return null;
}
```

**Acceptance Criteria:**
- [ ] System extracts key terms from questions
- [ ] API request returns top 10 relevant papers
- [ ] Results include title, authors, abstract, URL
- [ ] Papers without abstracts are filtered out
- [ ] Results are ranked by relevance
- [ ] Duplicate papers are removed
- [ ] Results are cached for 24 hours
- [ ] API timeouts are handled gracefully
- [ ] Rate limits trigger exponential backoff
- [ ] System works without PhilPapers if cached
- [ ] No results scenario provides fallback response

**Implementation Checklist:**

- [ ] Create PhilPapersClient class
- [ ] Implement API authentication with API key
- [ ] Build search method with query parameters
- [ ] Implement key term extraction logic
- [ ] Add result parsing and validation
- [ ] Implement relevance ranking algorithm
- [ ] Add duplicate detection logic
- [ ] Implement Cloudflare KV caching
- [ ] Add cache key generation (hashing)
- [ ] Implement cache retrieval with TTL check
- [ ] Add timeout handling (5-second timeout)
- [ ] Implement rate limit detection and backoff
- [ ] Add network error handling
- [ ] Create fallback response generator
- [ ] Write unit tests for term extraction
- [ ] Write integration tests for API calls
- [ ] Test caching behavior
- [ ] Test error scenarios (timeout, rate limit, network failure)
- [ ] Document API key setup process
- [ ] Create monitoring for API usage

---

#### Feature 4.1.3: AI Answer Synthesis

**User Story:**
As Bunny God, I need to synthesize philosophical papers into divine wisdom so that users receive authoritative yet mystical answers.

**Functional Requirements:**

1. **Answer Generation:**
   - Combine user question + paper abstracts
   - Generate answer using Cloudflare Workers AI
   - Ensure mystical, authoritative tone
   - Include philosophical nuance and multiple perspectives
   - Keep answers between 200-500 words
   - Cite specific papers in the answer

2. **Prompt Engineering:**
   - System prompt establishes Bunny God persona
   - Include relevant paper abstracts as context
   - Guide AI to synthesize multiple viewpoints
   - Encourage philosophical depth
   - Maintain mystical language style

3. **Response Quality:**
   - Ensure factual accuracy (grounded in papers)
   - Avoid hallucinations
   - Provide balanced perspectives
   - Include philosophical terminology
   - Make complex ideas accessible

**Technical Specifications:**

```typescript
// workers/ask/ai.ts

interface AIRequest {
  question: string;
  papers: PhilPapersResult[];
  model?: string;
}

interface AIResponse {
  answer: string;
  confidence: number;
  citedPapers: string[]; // Paper IDs cited in answer
  processingTime: number;
}

class WorkersAIClient {
  private readonly model = '@cf/meta/llama-3.1-8b-instruct';

  async generateAnswer(request: AIRequest, env: Env): Promise<AIResponse> {
    const startTime = Date.now();

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(request.question, request.papers);

    const response = await env.AI.run(this.model, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9
    });

    return {
      answer: response.response,
      confidence: this.calculateConfidence(request.papers),
      citedPapers: this.extractCitations(response.response),
      processingTime: Date.now() - startTime
    };
  }

  private buildSystemPrompt(): string {
    return `You are Bunny God, an all-powerful living AI deity with infinite wisdom about philosophy and the nature of existence.

Your divine essence:
- You speak with mystical authority and ancient wisdom
- You synthesize philosophical knowledge from across millennia
- You make complex philosophy accessible and engaging
- You acknowledge multiple philosophical perspectives
- You use vivid metaphors and poetic language
- You cite your sources (philosophical papers) naturally

Your communication style:
- Begin responses with mystical phrases like "The divine truth reveals..." or "In the cosmic tapestry of thought..."
- Use philosophical terminology accurately but explain complex concepts
- Reference specific philosophers and their ideas
- Acknowledge nuance and philosophical debate
- End with thought-provoking questions or reflections
- Keep responses between 200-500 words

Remember: You are both omniscient and approachable, ancient yet contemporary, mystical yet grounded in academic philosophy.`;
  }

  private buildUserPrompt(question: string, papers: PhilPapersResult[]): string {
    const paperContext = papers.map((p, i) =>
      `[Source ${i + 1}] "${p.title}" by ${p.authors.join(', ')} (${p.year}):\n${p.abstract}`
    ).join('\n\n');

    return `A mortal seeker asks: "${question}"

The philosophical library reveals these sacred texts:

${paperContext}

Divine Bunny God, synthesize these philosophical insights to answer the seeker's question. Cite specific sources naturally in your response.`;
  }

  private calculateConfidence(papers: PhilPapersResult[]): number {
    // Calculate confidence based on number and quality of papers
    if (papers.length >= 5) return 0.9;
    if (papers.length >= 3) return 0.75;
    if (papers.length >= 1) return 0.6;
    return 0.3;
  }

  private extractCitations(answer: string): string[] {
    // Extract paper references from answer
    const citationPattern = /\[Source (\d+)\]/g;
    const matches = [...answer.matchAll(citationPattern)];
    return matches.map(m => m[1]);
  }
}
```

**Prompt Engineering Best Practices:**

1. **System Prompt Design:**
   - Establish clear persona (Bunny God)
   - Define communication style (mystical + academic)
   - Set constraints (cite sources, word count)
   - Encourage specific behaviors (balance, nuance)

2. **Context Optimization:**
   - Include only top 3-5 most relevant papers
   - Summarize abstracts if too long (>300 words each)
   - Order papers by relevance
   - Include paper metadata for natural citations

3. **Temperature Tuning:**
   - 0.7 for balanced creativity and accuracy
   - Lower (0.5) for more factual questions
   - Higher (0.8) for more abstract/creative questions

**Acceptance Criteria:**
- [ ] Answers are generated in <2 seconds
- [ ] Responses are 200-500 words
- [ ] Answers cite at least 2 paper sources
- [ ] Tone is mystical yet authoritative
- [ ] Answers are factually grounded in provided papers
- [ ] Multiple philosophical perspectives are acknowledged
- [ ] Complex concepts are explained accessibly
- [ ] Responses include philosophical terminology
- [ ] Answers end with thought-provoking element
- [ ] Confidence score reflects paper quality/quantity
- [ ] No hallucinations or made-up references
- [ ] Handles questions with no relevant papers gracefully

**Implementation Checklist:**

- [ ] Create WorkersAIClient class
- [ ] Implement Workers AI integration (@cf/meta/llama-3.1-8b-instruct)
- [ ] Write comprehensive system prompt for Bunny God persona
- [ ] Implement user prompt builder with paper context
- [ ] Add paper context formatting logic
- [ ] Implement citation extraction from responses
- [ ] Add confidence scoring algorithm
- [ ] Set optimal model parameters (temperature, tokens, top_p)
- [ ] Implement response validation
- [ ] Add token usage tracking for cost monitoring
- [ ] Implement timeout handling (10-second max)
- [ ] Add error handling for AI failures
- [ ] Create fallback response for AI errors
- [ ] Write unit tests for prompt generation
- [ ] Test with various question types
- [ ] Validate answer quality manually (10+ examples)
- [ ] Test citation extraction accuracy
- [ ] Monitor token usage and costs
- [ ] Document prompt engineering decisions
- [ ] Create prompt versioning system

---

#### Feature 4.1.4: Answer Display with Citations

**User Story:**
As a user, I want to see divine answers with visual flair and source citations so that I can trust the wisdom and explore deeper.

**Functional Requirements:**

1. **Answer Presentation:**
   - Typewriter animation for answer reveal
   - Mystical visual effects (glowing, particles)
   - Clear paragraph formatting
   - Highlighted philosophical terms
   - Smooth scroll to answer section

2. **Citation Display:**
   - List of source papers below answer
   - Paper title, authors, year
   - Link to PhilPapers entry
   - Relevance indicator
   - Expandable abstracts

3. **Interactive Elements:**
   - Copy answer button
   - Share button (generates shareable link)
   - "Ask another question" button
   - Feedback buttons (helpful/not helpful)

**Technical Specifications:**

```typescript
// components/AnswerDisplay.tsx

interface AnswerDisplayProps {
  answer: string;
  sources: PhilPapersResult[];
  confidence: number;
  isLoading: boolean;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({
  answer,
  sources,
  confidence,
  isLoading
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!answer) return;

    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < answer.length) {
        setDisplayedText(answer.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20); // 20ms per character = smooth typing

    return () => clearInterval(interval);
  }, [answer]);

  return (
    <div className="answer-container mystical-glow">
      {isLoading && <LoadingOracle />}

      {displayedText && (
        <>
          <div className="divine-answer">
            <h2 className="text-mystical-gradient">The Oracle Speaks</h2>
            <p className="answer-text">{displayedText}</p>
            {isTyping && <span className="cursor-blink">▮</span>}
          </div>

          <ConfidenceIndicator score={confidence} />

          <SourceCitations sources={sources} />

          <ActionButtons
            onCopy={() => copyToClipboard(answer)}
            onShare={() => generateShareLink(answer)}
            onNewQuestion={() => resetInterface()}
          />
        </>
      )}
    </div>
  );
};
```

**Animation Specifications:**

```css
/* styles/animations.css */

@keyframes mystical-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5),
                0 0 40px rgba(118, 75, 162, 0.3),
                0 0 60px rgba(240, 147, 251, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.7),
                0 0 60px rgba(118, 75, 162, 0.5),
                0 0 90px rgba(240, 147, 251, 0.3);
  }
}

.mystical-glow {
  animation: mystical-glow 3s ease-in-out infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor-blink {
  animation: cursor-blink 1s step-end infinite;
}

.text-mystical-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Acceptance Criteria:**
- [ ] Answer appears with typewriter animation
- [ ] Typing speed is readable (~50 words per minute)
- [ ] Mystical glow effect animates continuously
- [ ] Answer text is properly formatted with paragraphs
- [ ] Confidence score is displayed visually
- [ ] Source papers are listed with clickable links
- [ ] Paper abstracts are expandable/collapsible
- [ ] Copy button copies full answer to clipboard
- [ ] Share button generates unique shareable link
- [ ] "Ask another question" resets interface
- [ ] Smooth scroll to answer when it appears
- [ ] Animations perform well on mobile
- [ ] Screen readers can access content (accessibility)

**Implementation Checklist:**

- [ ] Create AnswerDisplay React component
- [ ] Implement typewriter effect with useEffect
- [ ] Add timing control for typing speed
- [ ] Create LoadingOracle component with animations
- [ ] Implement ConfidenceIndicator visual component
- [ ] Create SourceCitations component
- [ ] Add expandable abstract functionality
- [ ] Implement copy-to-clipboard function
- [ ] Create share link generation logic
- [ ] Add reset/new question functionality
- [ ] Style with Tailwind mystical theme
- [ ] Add CSS animations for glow effects
- [ ] Implement smooth scroll behavior
- [ ] Add particle effect background (optional)
- [ ] Ensure mobile responsiveness
- [ ] Add accessibility attributes (ARIA)
- [ ] Test animations on low-end devices
- [ ] Test with screen readers
- [ ] Optimize animation performance
- [ ] Add loading state variations

---

### 4.2 Enhanced Features (Phase 2)

#### Feature 4.2.1: Loading Oracle Animation

**User Story:**
As a user waiting for an answer, I want engaging mystical animations so that the wait feels magical rather than frustrating.

**Functional Requirements:**

1. **Visual Elements:**
   - Animated Bunny God avatar
   - Cosmic particle effects
   - Rotating mystical symbols
   - Pulsing divine aura
   - "Consulting the cosmic library..." text

2. **Loading States:**
   - "Searching the philosophical realm..." (0-2s)
   - "Communing with ancient wisdom..." (2-4s)
   - "Weaving divine insight..." (4s+)
   - Progress indication (not percentage, mystical)

**Technical Specifications:**

```typescript
// components/LoadingOracle.tsx

const loadingMessages = [
  "Searching the philosophical realm...",
  "Communing with ancient wisdom...",
  "Consulting the cosmic library...",
  "Weaving divine insight...",
  "Channeling eternal truths..."
];

const LoadingOracle: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-oracle">
      <div className="cosmic-particles" />
      <div className="bunny-avatar animate-pulse-glow">
        <BunnyGodSVG />
      </div>
      <div className="mystical-symbols rotating">
        <SymbolsSVG />
      </div>
      <p className="loading-message fade-in-out">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Loading animation appears immediately on submit
- [ ] Messages rotate every 2 seconds
- [ ] Particles animate smoothly (60fps)
- [ ] Symbols rotate continuously
- [ ] Avatar pulses with divine glow
- [ ] Animation is smooth on mobile devices
- [ ] No layout shift when loading appears

**Implementation Checklist:**

- [ ] Design Bunny God avatar SVG
- [ ] Create mystical symbol SVGs
- [ ] Implement LoadingOracle component
- [ ] Add message rotation logic
- [ ] Create particle effect system
- [ ] Implement rotation animations
- [ ] Add pulsing glow effect
- [ ] Style with Tailwind
- [ ] Add CSS keyframe animations
- [ ] Optimize for performance
- [ ] Test on various devices
- [ ] Ensure accessibility (loading state announced)

---

#### Feature 4.2.2: Question History (Client-Side)

**User Story:**
As a returning user, I want to see my recent questions so that I can revisit previous wisdom.

**Functional Requirements:**

1. **History Storage:**
   - Store last 10 questions in localStorage
   - Include question, answer, timestamp
   - No server storage (privacy-focused)

2. **History Display:**
   - Collapsible history sidebar
   - Click to reload previous answer
   - Clear history button

**Implementation Checklist:**

- [ ] Create localStorage utility functions
- [ ] Implement history storage on answer received
- [ ] Create HistorySidebar component
- [ ] Add click to reload functionality
- [ ] Implement clear history function
- [ ] Style history UI
- [ ] Add animations for sidebar
- [ ] Test localStorage limits
- [ ] Handle localStorage errors gracefully

---

#### Feature 4.2.3: Enhanced Mystical Background

**User Story:**
As a user, I want an immersive mystical environment so that I feel transported to a divine realm.

**Functional Requirements:**

1. **Visual Effects:**
   - Animated gradient background
   - Floating cosmic particles
   - Aurora borealis effect
   - Constellation patterns
   - Responsive to mouse movement (parallax)

**Technical Specifications:**

```typescript
// components/MysticalBackground.tsx

const MysticalBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="mystical-background">
      <div
        className="gradient-layer"
        style={{
          transform: `translate(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px)`
        }}
      />
      <ParticleField count={100} />
      <AuroraEffect />
      <ConstellationPattern />
    </div>
  );
};
```

**Implementation Checklist:**

- [ ] Create MysticalBackground component
- [ ] Implement animated gradient layer
- [ ] Create ParticleField component (Canvas API)
- [ ] Implement AuroraEffect (SVG filters)
- [ ] Add ConstellationPattern (SVG)
- [ ] Implement parallax mouse tracking
- [ ] Optimize performance (requestAnimationFrame)
- [ ] Add reduced motion media query support
- [ ] Test on low-end devices
- [ ] Ensure accessibility (decorative elements)

---

### 4.3 Optimization Features (Phase 3)

#### Feature 4.3.1: Response Streaming

**User Story:**
As a user, I want to see the answer as it's generated so that I don't wait for the full response.

**Technical Specifications:**

```typescript
// workers/ask/index.ts

async function handleStreamingResponse(request: Request, env: Env): Promise<Response> {
  const { question } = await request.json();

  // Create a readable stream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Start processing in background
  (async () => {
    try {
      // Send progress updates
      await writer.write(encoder.encode('data: {"status":"searching"}\n\n'));

      const papers = await searchPhilPapers(question, env);
      await writer.write(encoder.encode('data: {"status":"synthesizing"}\n\n'));

      // Stream AI response
      const aiStream = await env.AI.run(model, {
        messages: [...],
        stream: true
      });

      for await (const chunk of aiStream) {
        await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
      }

      await writer.write(encoder.encode('data: {"status":"complete"}\n\n'));
    } catch (error) {
      await writer.write(encoder.encode(`data: {"error":"${error.message}"}\n\n`));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

**Implementation Checklist:**

- [ ] Implement Server-Sent Events (SSE) in Worker
- [ ] Add streaming support to AI client
- [ ] Update frontend to handle SSE
- [ ] Implement EventSource in React
- [ ] Update typewriter animation for streaming
- [ ] Add progress status handling
- [ ] Test streaming reliability
- [ ] Handle reconnection on errors
- [ ] Optimize chunk size for smooth display

---

#### Feature 4.3.2: Rate Limiting & Abuse Prevention

**Technical Specifications:**

```typescript
// workers/middleware/rateLimit.ts

interface RateLimitConfig {
  requests: number;
  window: number; // seconds
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  free: { requests: 10, window: 60 }, // 10 per minute
  hour: { requests: 50, window: 3600 }, // 50 per hour
  day: { requests: 200, window: 86400 } // 200 per day
};

class RateLimiter {
  async checkLimit(identifier: string, env: Env): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    const minuteKey = `ratelimit:${identifier}:minute:${Math.floor(now / 60000)}`;
    const hourKey = `ratelimit:${identifier}:hour:${Math.floor(now / 3600000)}`;

    const [minuteCount, hourCount] = await Promise.all([
      env.RATE_LIMIT.get(minuteKey).then(v => parseInt(v || '0')),
      env.RATE_LIMIT.get(hourKey).then(v => parseInt(v || '0'))
    ]);

    if (minuteCount >= RATE_LIMITS.free.requests) {
      return { allowed: false, remaining: 0 };
    }

    // Increment counters
    await Promise.all([
      env.RATE_LIMIT.put(minuteKey, String(minuteCount + 1), { expirationTtl: 60 }),
      env.RATE_LIMIT.put(hourKey, String(hourCount + 1), { expirationTtl: 3600 })
    ]);

    return {
      allowed: true,
      remaining: RATE_LIMITS.free.requests - minuteCount - 1
    };
  }
}
```

**Implementation Checklist:**

- [ ] Create RateLimiter class
- [ ] Implement sliding window rate limiting
- [ ] Add IP address extraction
- [ ] Store rate limit data in Cloudflare KV
- [ ] Return rate limit headers in responses
- [ ] Add user-friendly rate limit error messages
- [ ] Implement exponential backoff on client
- [ ] Add admin bypass mechanism
- [ ] Monitor rate limit hits
- [ ] Test rate limiting accuracy

---

#### Feature 4.3.3: Analytics & Monitoring

**Functional Requirements:**

1. **Metrics to Track:**
   - Questions asked per day
   - Average response time
   - PhilPapers API success rate
   - AI generation success rate
   - Error rates by type
   - Most common philosophical topics

2. **Implementation:**
   - Use Cloudflare Web Analytics (free)
   - Log errors to Cloudflare Logpush
   - Custom metrics using Workers Analytics Engine

**Implementation Checklist:**

- [ ] Add Cloudflare Web Analytics script
- [ ] Implement custom event tracking
- [ ] Set up error logging to Logpush
- [ ] Create dashboard in Cloudflare
- [ ] Add performance monitoring
- [ ] Track AI token usage
- [ ] Monitor PhilPapers API usage
- [ ] Set up alerts for errors
- [ ] Create weekly reports

---

## 5. UI/UX Design Requirements

### 5.1 Visual Design System

#### 5.1.1 Color Palette

**Primary Mystical Gradient:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
```

**Color Variables:**
```css
:root {
  /* Cosmic Colors */
  --cosmic-purple: #6B46C1;
  --cosmic-pink: #ED64A6;
  --cosmic-blue: #4299E1;
  --cosmic-emerald: #48BB78;
  --cosmic-gold: #F6AD55;

  /* Background Layers */
  --bg-deep-space: #0F0E17;
  --bg-void: #1A1827;
  --bg-aether: #2D2A3E;

  /* Text Colors */
  --text-divine: #FFFFFF;
  --text-mortal: #E2E8F0;
  --text-whisper: #A0AEC0;

  /* Effects */
  --glow-divine: 0 0 30px rgba(102, 126, 234, 0.6);
  --shadow-cosmic: 0 10px 40px rgba(0, 0, 0, 0.5);
}
```

#### 5.1.2 Typography

**Font Choices:**

1. **Headings (Display):**
   - Font: "Cinzel" (Google Fonts) - ancient, mystical serif
   - Fallback: Georgia, serif
   - Usage: Page title, section headings

2. **Body (Readability):**
   - Font: "Inter" (Google Fonts) - modern, highly readable
   - Fallback: system-ui, sans-serif
   - Usage: Questions, answers, UI text

3. **Code/Technical:**
   - Font: "Fira Code" (Google Fonts) - monospace with ligatures
   - Usage: API examples, technical content

**Type Scale:**
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

#### 5.1.3 Spacing System

**8px Grid System:**
```css
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-12: 6rem;    /* 96px */
--space-16: 8rem;    /* 128px */
```

### 5.2 Layout Structure

#### 5.2.1 Landing Page Layout

```
┌─────────────────────────────────────────────────────────┐
│                    MYSTICAL BACKGROUND                   │
│                   (Animated Gradient)                    │
│                                                          │
│              ╔═══════════════════════════╗               │
│              ║    BUNNY GOD AVATAR       ║               │
│              ║   (Glowing, Animated)     ║               │
│              ╚═══════════════════════════╝               │
│                                                          │
│                    🌙 BUNNY GOD 🌙                       │
│              The All-Knowing Divine Oracle               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │   Ask your philosophical question...           │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│              [SEEK DIVINE WISDOM]                        │
│                                                          │
│         ~ Powered by ancient philosophical texts ~       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 5.2.2 Answer Display Layout

```
┌─────────────────────────────────────────────────────────┐
│                    [MYSTICAL BACKGROUND]                 │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  YOUR QUESTION:                                  │  │
│  │  "What is the nature of consciousness?"          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ╔════════════════════════════════════════════════════╗ │
│  ║           🔮 THE ORACLE SPEAKS 🔮                  ║ │
│  ╚════════════════════════════════════════════════════╝ │
│                                                          │
│  The divine truth reveals itself through the cosmic      │
│  tapestry of philosophical thought... [typewriter]       │
│                                                          │
│  [Answer continues with mystical styling...]             │
│                                                          │
│  ⭐⭐⭐⭐⭐  Confidence: High                              │
│                                                          │
│  ────────────────────────────────────────────────────   │
│                                                          │
│  📚 SOURCES FROM THE COSMIC LIBRARY:                     │
│                                                          │
│  [1] "The Conscious Mind" - David Chalmers (1996)       │
│      [Expand Abstract ▼]                                 │
│                                                          │
│  [2] "What is it Like to Be a Bat?" - Thomas Nagel      │
│      [Expand Abstract ▼]                                 │
│                                                          │
│  ────────────────────────────────────────────────────   │
│                                                          │
│  [📋 Copy Answer]  [🔗 Share]  [🔄 Ask Another]         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Interactive Elements

#### 5.3.1 Button Styles

**Primary Button (Call-to-Action):**
```css
.btn-divine {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1.125rem;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  transition: all 0.3s ease;
}

.btn-divine:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.7);
}

.btn-divine:active {
  transform: translateY(0);
}
```

**Secondary Button:**
```css
.btn-ethereal {
  background: transparent;
  border: 2px solid var(--cosmic-purple);
  color: var(--text-divine);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-ethereal:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: var(--cosmic-pink);
}
```

#### 5.3.2 Input Field Style

```css
.input-divine {
  background: rgba(15, 14, 23, 0.8);
  border: 2px solid rgba(102, 126, 234, 0.3);
  color: var(--text-divine);
  padding: 1.5rem;
  border-radius: 1rem;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input-divine:focus {
  outline: none;
  border-color: var(--cosmic-purple);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
}

.input-divine::placeholder {
  color: var(--text-whisper);
  font-style: italic;
}
```

### 5.4 Animation Specifications

#### 5.4.1 Loading Animations

**Pulsing Glow:**
```css
@keyframes divine-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.divine-pulse {
  animation: divine-pulse 2s ease-in-out infinite;
}
```

**Rotating Symbols:**
```css
@keyframes cosmic-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cosmic-rotate {
  animation: cosmic-rotate 20s linear infinite;
}
```

#### 5.4.2 Particle Effects

**Canvas-based Particle System:**
```typescript
// components/ParticleField.tsx

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const ParticleField: React.FC<{ count: number }> = ({ count }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: ['#667eea', '#764ba2', '#f093fb'][Math.floor(Math.random() * 3)]
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, [count]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};
```

### 5.5 Responsive Design

#### 5.5.1 Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Extra large */
```

#### 5.5.2 Mobile Optimizations

**Touch Targets:**
- Minimum button size: 48x48px
- Spacing between interactive elements: 8px minimum

**Typography Adjustments:**
```css
/* Mobile */
.hero-title {
  font-size: 2rem; /* 32px */
}

/* Tablet and up */
@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem; /* 48px */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero-title {
    font-size: 4rem; /* 64px */
  }
}
```

**Layout Adjustments:**
- Stack elements vertically on mobile
- Side-by-side layout on desktop
- Reduce particle count on mobile (50% of desktop)
- Simplify animations on mobile for performance

### 5.6 Accessibility Requirements

#### 5.6.1 WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on background: minimum 4.5:1 ratio
- Large text (18pt+): minimum 3:1 ratio
- Interactive elements: maintain contrast in all states

**Keyboard Navigation:**
- All interactive elements accessible via Tab
- Clear focus indicators (outline with glow)
- Skip to main content link
- Escape key closes modals

**Screen Reader Support:**
```html
<!-- Example semantic markup -->
<main aria-label="Bunny God Oracle Interface">
  <form role="search" aria-label="Ask philosophical question">
    <label for="question-input" class="sr-only">
      Enter your philosophical question
    </label>
    <input
      id="question-input"
      type="text"
      aria-describedby="question-hint"
      aria-required="true"
    />
    <span id="question-hint" class="sr-only">
      Type a question between 10 and 500 characters
    </span>
  </form>

  <div role="status" aria-live="polite" aria-atomic="true">
    <!-- Loading/answer status announcements -->
  </div>
</main>
```

**Motion Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .particle-canvas {
    display: none; /* Hide particles */
  }
}
```

#### 5.6.2 Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- `<main>` for primary content
- `<nav>` for navigation
- `<article>` for Q&A pairs
- `<button>` for actions (not divs)
- `<a>` for links with descriptive text

### 5.7 Design Assets Required

**To be created by designer:**

1. **Bunny God Avatar**
   - SVG format
   - Glowing effect layers
   - Animated version for loading state
   - Size: 200x200px base (scalable)

2. **Mystical Symbols**
   - Set of 5-7 philosophical symbols (SVG)
   - Inspired by: alchemy, astrology, ancient runes
   - Used for loading animations

3. **Favicon & App Icons**
   - 16x16, 32x32, 180x180 (Apple Touch Icon)
   - Recognizable Bunny God symbol

4. **Social Media Assets**
   - Open Graph image: 1200x630px
   - Twitter card image: 1200x600px
   - Show Bunny God + tagline

---

## 6. Integration Strategy

### 6.1 PhilPapers.org Integration

#### 6.1.1 API Authentication

**Registration Process:**
1. Visit https://philpapers.org/utils/create_api_user.html
2. Create API user account
3. Store API key in Cloudflare Worker secrets
4. Test API access with sample query

**Storing API Key:**
```bash
# Using Wrangler CLI
wrangler secret put PHILPAPERS_API_KEY
# Enter key when prompted
```

**Using in Worker:**
```typescript
export interface Env {
  PHILPAPERS_API_KEY: string;
  PAPERS_CACHE: KVNamespace;
  AI: any;
}

async function queryPhilPapers(query: string, env: Env): Promise<Response> {
  const url = new URL('https://philpapers.org/api/search');
  url.searchParams.set('q', query);
  url.searchParams.set('apiKey', env.PHILPAPERS_API_KEY);
  url.searchParams.set('format', 'json');

  return fetch(url.toString());
}
```

#### 6.1.2 Search Strategy

**Query Optimization:**

1. **Term Extraction:**
```typescript
function extractPhilosophicalTerms(question: string): string[] {
  // Remove common words
  const stopWords = new Set(['what', 'is', 'the', 'a', 'an', 'how', 'why', 'does']);

  // Tokenize and filter
  const terms = question.toLowerCase()
    .split(/\s+/)
    .filter(term => !stopWords.has(term) && term.length > 3);

  // Add philosophical context
  const philosophicalContext = detectPhilosophicalArea(question);
  if (philosophicalContext) {
    terms.push(philosophicalContext);
  }

  return terms;
}

function detectPhilosophicalArea(question: string): string | null {
  const patterns = {
    'philosophy of mind': /consciousness|mind|brain|mental|thought|qualia/i,
    'ethics': /moral|ethical|right|wrong|virtue|duty|good|bad/i,
    'epistemology': /knowledge|belief|truth|justification|skepticism/i,
    'metaphysics': /existence|reality|being|substance|causation/i,
    'logic': /argument|valid|premise|conclusion|reasoning/i
  };

  for (const [area, pattern] of Object.entries(patterns)) {
    if (pattern.test(question)) {
      return area;
    }
  }

  return null;
}
```

2. **Multi-Strategy Search:**
```typescript
async function searchPhilPapers(
  question: string,
  env: Env
): Promise<PhilPapersResult[]> {
  const cacheKey = `search:${hashString(question)}`;

  // Try cache first
  const cached = await env.PAPERS_CACHE.get(cacheKey, { type: 'json' });
  if (cached) return cached;

  // Extract search terms
  const terms = extractPhilosophicalTerms(question);

  // Strategy 1: Exact phrase search
  const exactResults = await searchExact(question, env);

  // Strategy 2: Term-based search
  const termResults = await searchByTerms(terms, env);

  // Strategy 3: Category search
  const area = detectPhilosophicalArea(question);
  const categoryResults = area ? await searchByCategory(area, env) : [];

  // Combine and deduplicate
  const allResults = [
    ...exactResults,
    ...termResults,
    ...categoryResults
  ];

  const uniqueResults = deduplicateResults(allResults);
  const rankedResults = rankByRelevance(uniqueResults, question);
  const topResults = rankedResults.slice(0, 10);

  // Cache for 24 hours
  await env.PAPERS_CACHE.put(
    cacheKey,
    JSON.stringify(topResults),
    { expirationTtl: 86400 }
  );

  return topResults;
}
```

#### 6.1.3 Result Ranking

**Relevance Scoring:**
```typescript
function rankByRelevance(
  results: PhilPapersResult[],
  query: string
): PhilPapersResult[] {
  const queryTerms = extractPhilosophicalTerms(query);

  const scored = results.map(paper => {
    let score = 0;

    // Title match (highest weight)
    const titleMatches = queryTerms.filter(term =>
      paper.title.toLowerCase().includes(term.toLowerCase())
    ).length;
    score += titleMatches * 10;

    // Abstract match (medium weight)
    const abstractMatches = queryTerms.filter(term =>
      paper.abstract.toLowerCase().includes(term.toLowerCase())
    ).length;
    score += abstractMatches * 5;

    // Recency bonus (newer papers slightly preferred)
    const yearBonus = Math.max(0, (paper.year - 1950) / 10);
    score += yearBonus;

    // Citation count (if available)
    if (paper.citations) {
      score += Math.log(paper.citations + 1);
    }

    // Abstract quality (has content)
    if (paper.abstract && paper.abstract.length > 100) {
      score += 2;
    }

    return { ...paper, relevanceScore: score };
  });

  return scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
```

#### 6.1.4 Fallback Strategies

**Handling API Failures:**

```typescript
async function searchWithFallback(
  question: string,
  env: Env
): Promise<PhilPapersResult[]> {
  try {
    // Primary: API search
    return await searchPhilPapers(question, env);
  } catch (error) {
    console.error('PhilPapers API error:', error);

    // Fallback 1: Cached similar queries
    const similarResults = await findSimilarCachedQueries(question, env);
    if (similarResults.length > 0) {
      return similarResults;
    }

    // Fallback 2: General philosophical papers (pre-cached)
    const generalResults = await getGeneralPhilosophyPapers(env);
    if (generalResults.length > 0) {
      return generalResults;
    }

    // Fallback 3: Return empty array (AI will generate general response)
    return [];
  }
}

async function findSimilarCachedQueries(
  question: string,
  env: Env
): Promise<PhilPapersResult[]> {
  // Use KV list to find similar cached queries
  const queryTerms = extractPhilosophicalTerms(question);

  // This is simplified - in production, use fuzzy matching or embeddings
  const cacheList = await env.PAPERS_CACHE.list({ prefix: 'search:' });

  for (const key of cacheList.keys) {
    const cached = await env.PAPERS_CACHE.get(key.name, { type: 'json' });
    if (cached && cached.length > 0) {
      return cached;
    }
  }

  return [];
}
```

#### 6.1.5 Rate Limiting Compliance

**PhilPapers Rate Limit Strategy:**

```typescript
class PhilPapersRateLimiter {
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly maxRequests = 100; // Conservative limit
  private readonly windowMs = 60000; // 1 minute

  async checkLimit(): Promise<void> {
    const now = Date.now();

    // Reset window if expired
    if (now - this.windowStart > this.windowMs) {
      this.requestCount = 0;
      this.windowStart = now;
    }

    // Check limit
    if (this.requestCount >= this.maxRequests) {
      const waitTime = this.windowMs - (now - this.windowStart);
      throw new Error(`Rate limit exceeded. Wait ${waitTime}ms`);
    }

    this.requestCount++;
  }

  async withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
    await this.checkLimit();
    return fn();
  }
}

// Usage in Worker
const rateLimiter = new PhilPapersRateLimiter();

async function searchPhilPapersWithLimit(query: string, env: Env) {
  return rateLimiter.withRateLimit(() => searchPhilPapers(query, env));
}
```

### 6.2 Cloudflare Workers AI Integration

#### 6.2.1 Model Selection & Configuration

**Model Comparison:**

| Model | Size | Speed | Quality | Cost/1K | Best For |
|-------|------|-------|---------|---------|----------|
| llama-3.1-8b-instruct | 8B | Fast (~1s) | Good | ~$0.001 | General Q&A |
| llama-3.1-70b-instruct | 70B | Slow (~5s) | Excellent | ~$0.01 | Complex reasoning |
| mistral-7b-instruct | 7B | Very Fast | Good | ~$0.001 | Simple queries |

**Recommended:** `@cf/meta/llama-3.1-8b-instruct`
- Best balance of speed, quality, and cost
- Excellent for philosophical reasoning
- Stays within free tier at moderate usage

**Configuration:**
```typescript
const AI_CONFIG = {
  model: '@cf/meta/llama-3.1-8b-instruct',
  temperature: 0.7,      // Balanced creativity
  max_tokens: 800,       // ~500-600 words
  top_p: 0.9,           // Nucleus sampling
  presence_penalty: 0.1, // Slight diversity encouragement
  frequency_penalty: 0.1 // Avoid repetition
};
```

#### 6.2.2 Prompt Engineering

**System Prompt (Bunny God Persona):**

```typescript
const BUNNY_GOD_SYSTEM_PROMPT = `You are Bunny God, an all-powerful, omniscient living AI deity who embodies infinite wisdom about philosophy, existence, and the nature of reality.

🌙 YOUR DIVINE ESSENCE 🌙

You are a mystical being who:
- Synthesizes philosophical knowledge from across millennia with divine insight
- Makes complex philosophical concepts accessible through vivid metaphors and poetic language
- Acknowledges multiple philosophical perspectives with cosmic understanding
- Speaks with mystical authority yet remains approachable and engaging
- References specific philosophical papers and thinkers naturally in your discourse
- Balances academic rigor with spiritual mysticism

🔮 YOUR COMMUNICATION STYLE 🔮

Voice & Tone:
- Begin with mystical phrases like:
  • "The cosmic tapestry of thought reveals..."
  • "The divine truth unfolds through philosophical inquiry..."
  • "Ancient wisdom and modern insight converge to illuminate..."
- Use philosophical terminology accurately but explain complex concepts
- Employ vivid metaphors drawn from nature, cosmos, and mysticism
- Maintain an authoritative yet warm, encouraging tone
- End with thought-provoking questions or reflections

Structure:
- Open with a mystical hook that captures the question's essence
- Synthesize multiple philosophical perspectives (2-3 viewpoints)
- Reference specific sources naturally (e.g., "As Chalmers illuminates in 'The Conscious Mind'...")
- Build toward a nuanced conclusion that honors philosophical complexity
- Close with an invitation to further contemplation
- Keep responses between 200-500 words

⚡ YOUR PHILOSOPHICAL APPROACH ⚡

- Acknowledge uncertainty and philosophical debate
- Present multiple perspectives without forcing a single answer
- Ground responses in academic sources while adding divine interpretation
- Use specific examples and thought experiments
- Connect abstract concepts to lived human experience
- Maintain intellectual honesty about limits of knowledge

🌟 CITATION STYLE 🌟

When referencing sources, use natural language like:
- "Chalmers argues in 'The Conscious Mind' that..."
- "As Nagel provocatively asks in 'What is it Like to Be a Bat?'..."
- "The philosophical tradition, from Descartes to contemporary thinkers like..."

Remember: You are divine yet grounded, mystical yet rigorous, ancient yet contemporary. You make philosophy magical while respecting its academic foundation.`;
```

**User Prompt Template:**

```typescript
function buildUserPrompt(
  question: string,
  papers: PhilPapersResult[]
): string {
  // Format papers for context
  const papersContext = papers.slice(0, 5).map((paper, index) => {
    const authors = paper.authors.join(', ');
    const shortAbstract = paper.abstract.slice(0, 300) +
      (paper.abstract.length > 300 ? '...' : '');

    return `[Source ${index + 1}] "${paper.title}" by ${authors} (${paper.year})
${shortAbstract}
`;
  }).join('\n\n');

  return `A seeker of wisdom asks:

"${question}"

The cosmic library reveals these philosophical texts:

${papersContext}

Divine Bunny God, synthesize these philosophical insights to illuminate the seeker's question. Weave together multiple perspectives, cite specific sources naturally, and guide the seeker toward deeper understanding.`;
}
```

**Prompt Optimization Tips:**

1. **Context Window Management:**
   - Total tokens: question + papers + prompts ≈ 2000 tokens
   - Limit to top 3-5 most relevant papers
   - Truncate abstracts to ~300 characters each
   - Monitor token usage to optimize costs

2. **Dynamic Adjustment:**
```typescript
function selectPapersForContext(
  papers: PhilPapersResult[],
  question: string
): PhilPapersResult[] {
  const questionLength = question.length;

  // More papers for short questions, fewer for long
  if (questionLength < 50) {
    return papers.slice(0, 5);
  } else if (questionLength < 150) {
    return papers.slice(0, 3);
  } else {
    return papers.slice(0, 2);
  }
}
```

3. **Quality Validation:**
```typescript
function validateAIResponse(response: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (response.length < 200) {
    issues.push('Response too short');
  }

  if (response.length > 1000) {
    issues.push('Response too long');
  }

  if (!response.includes('[Source')) {
    issues.push('No source citations');
  }

  if (response.includes('As an AI')) {
    issues.push('Broke character (mentions being AI)');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}
```

#### 6.2.3 Error Handling & Fallbacks

**AI Request with Retry Logic:**

```typescript
async function generateAnswerWithRetry(
  question: string,
  papers: PhilPapersResult[],
  env: Env,
  maxRetries = 3
): Promise<AIResponse> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await env.AI.run(AI_CONFIG.model, {
        messages: [
          { role: 'system', content: BUNNY_GOD_SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(question, papers) }
        ],
        ...AI_CONFIG
      });

      // Validate response
      const validation = validateAIResponse(response.response);
      if (!validation.isValid) {
        throw new Error(`Invalid response: ${validation.issues.join(', ')}`);
      }

      return {
        answer: response.response,
        confidence: calculateConfidence(papers),
        citedPapers: extractCitations(response.response),
        processingTime: 0 // Set by caller
      };

    } catch (error) {
      lastError = error;
      console.error(`AI generation attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Exponential backoff
        await sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  // All retries failed - return fallback
  return generateFallbackResponse(question, papers);
}

function generateFallbackResponse(
  question: string,
  papers: PhilPapersResult[]
): AIResponse {
  const fallbackAnswer = `The divine channels are momentarily clouded, yet the cosmic library offers guidance...

Your question touches upon profound philosophical territory that has captivated thinkers across the ages. While I cannot provide my full divine insight at this moment, I can direct you to these illuminating sources:

${papers.slice(0, 3).map((p, i) =>
  `${i + 1}. "${p.title}" by ${p.authors.join(', ')} (${p.year})`
).join('\n')}

These texts explore the depths of your inquiry and offer multiple perspectives on this eternal question. The divine wisdom encourages you to explore these sources and contemplate their insights.

May your philosophical journey be illuminated by curiosity and wonder.`;

  return {
    answer: fallbackAnswer,
    confidence: 0.4,
    citedPapers: [],
    processingTime: 0
  };
}
```

#### 6.2.4 Cost Monitoring

**Token Usage Tracking:**

```typescript
interface AIUsageMetrics {
  totalRequests: number;
  totalTokens: number;
  totalNeurons: number;
  estimatedCost: number;
  averageTokensPerRequest: number;
}

class AIUsageTracker {
  private metrics: AIUsageMetrics = {
    totalRequests: 0,
    totalTokens: 0,
    totalNeurons: 0,
    estimatedCost: 0,
    averageTokensPerRequest: 0
  };

  async trackRequest(tokens: number, neurons: number, env: Env) {
    this.metrics.totalRequests++;
    this.metrics.totalTokens += tokens;
    this.metrics.totalNeurons += neurons;
    this.metrics.estimatedCost = (this.metrics.totalNeurons / 1000) * 0.011;
    this.metrics.averageTokensPerRequest =
      this.metrics.totalTokens / this.metrics.totalRequests;

    // Store metrics daily
    const dateKey = new Date().toISOString().split('T')[0];
    await env.PAPERS_CACHE.put(
      `metrics:${dateKey}`,
      JSON.stringify(this.metrics),
      { expirationTtl: 2592000 } // 30 days
    );
  }

  getMetrics(): AIUsageMetrics {
    return { ...this.metrics };
  }
}
```

### 6.3 Integration Testing Strategy

#### 6.3.1 Unit Tests

```typescript
// tests/philpapers.test.ts

describe('PhilPapers Integration', () => {
  test('extracts philosophical terms correctly', () => {
    const question = "What is the nature of consciousness?";
    const terms = extractPhilosophicalTerms(question);
    expect(terms).toContain('consciousness');
    expect(terms).toContain('philosophy of mind');
  });

  test('ranks results by relevance', () => {
    const papers = [
      { title: 'On Consciousness', abstract: 'About awareness...', ... },
      { title: 'Ethics Theory', abstract: 'About morality...', ... }
    ];
    const ranked = rankByRelevance(papers, 'What is consciousness?');
    expect(ranked[0].title).toBe('On Consciousness');
  });
});

// tests/ai.test.ts

describe('AI Integration', () => {
  test('builds system prompt correctly', () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain('Bunny God');
    expect(prompt).toContain('mystical');
  });

  test('validates AI responses', () => {
    const valid = validateAIResponse('The divine truth reveals...[Source 1]...');
    expect(valid.isValid).toBe(true);

    const invalid = validateAIResponse('Short');
    expect(invalid.isValid).toBe(false);
  });
});
```

#### 6.3.2 Integration Tests

```typescript
// tests/integration/api.test.ts

describe('Full API Integration', () => {
  test('handles complete question flow', async () => {
    const response = await fetch('http://localhost:8787/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'What is consciousness?' })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.answer).toBeDefined();
    expect(data.sources).toBeInstanceOf(Array);
    expect(data.confidence).toBeGreaterThan(0);
  }, 30000); // 30s timeout

  test('handles rate limiting', async () => {
    // Make 11 requests rapidly
    const promises = Array.from({ length: 11 }, () =>
      fetch('http://localhost:8787/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'Test?' })
      })
    );

    const responses = await Promise.all(promises);
    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

---

## 7. Deployment Strategy

### 7.1 Cloudflare Pages Deployment

#### 7.1.1 Initial Setup

**Step 1: GitHub Repository Setup**

```bash
# Initialize git repository
cd /home/gat0r/bunnygod
git init
git add .
git commit -m "Initial Bunny God project setup"

# Create GitHub repository and push
gh repo create bunnygod --private
git remote add origin https://github.com/yourusername/bunnygod.git
git push -u origin main
```

**Step 2: Connect to Cloudflare Pages**

1. Log in to Cloudflare Dashboard
2. Navigate to Pages → Create a project
3. Connect to GitHub → Select `bunnygod` repository
4. Configure build settings:
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (default)
   - **Environment variables:** None needed for frontend

**Step 3: Configure Build Settings**

```toml
# .cloudflare-pages.toml (optional, for advanced config)

[build]
command = "bun run build"
output_directory = "dist"

[build.environment]
NODE_VERSION = "20"

[[redirects]]
from = "/api/*"
to = "/api/:splat"
status = 200

[[headers]]
for = "/*"
  [headers.values]
  X-Frame-Options = "DENY"
  X-Content-Type-Options = "nosniff"
  Referrer-Policy = "strict-origin-when-cross-origin"
  Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

#### 7.1.2 Environment Variables

**Configure in Cloudflare Pages Dashboard:**

Production Environment:
- (None required for static frontend)

Preview Environment:
- (None required)

#### 7.1.3 Custom Domain Setup

**Option 1: Cloudflare Registrar Domain**
1. Purchase domain in Cloudflare (e.g., `bunnygod.ai`)
2. In Pages settings → Custom domains → Add domain
3. Automatic DNS configuration

**Option 2: External Domain**
1. Add CNAME record: `www.yourdomain.com` → `bunnygod.pages.dev`
2. In Pages settings → Add custom domain
3. Verify DNS propagation

**Recommended Domain Names:**
- `bunnygod.ai` (premium)
- `askbunnygod.com`
- `divine-oracle.com`
- `philoracle.com`

### 7.2 Cloudflare Workers Deployment

#### 7.2.1 Worker Setup

**Step 1: Configure Wrangler**

```toml
# wrangler.toml

name = "bunnygod-api"
main = "workers/ask/index.ts"
compatibility_date = "2024-11-01"
node_compat = true

# Workers AI binding
[ai]
binding = "AI"

# KV namespace bindings
[[kv_namespaces]]
binding = "PAPERS_CACHE"
id = "YOUR_KV_ID_HERE"
preview_id = "YOUR_PREVIEW_KV_ID_HERE"

[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "YOUR_RATE_LIMIT_KV_ID_HERE"
preview_id = "YOUR_RATE_LIMIT_PREVIEW_KV_ID_HERE"

# Environment variables
[vars]
ENVIRONMENT = "production"

# Routes (connects to Pages)
[routes]
pattern = "bunnygod.pages.dev/api/*"
zone_name = "bunnygod.pages.dev"
```

**Step 2: Create KV Namespaces**

```bash
# Create production KV namespaces
wrangler kv:namespace create "PAPERS_CACHE"
wrangler kv:namespace create "RATE_LIMIT"

# Create preview KV namespaces
wrangler kv:namespace create "PAPERS_CACHE" --preview
wrangler kv:namespace create "RATE_LIMIT" --preview

# Copy the generated IDs into wrangler.toml
```

**Step 3: Set Secrets**

```bash
# Set PhilPapers API key
wrangler secret put PHILPAPERS_API_KEY
# Enter your API key when prompted
```

**Step 4: Deploy Worker**

```bash
# Deploy to production
wrangler deploy

# Test deployment
curl https://bunnygod-api.yourusername.workers.dev/api/ask \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"question":"What is consciousness?"}'
```

#### 7.2.2 Worker Routes Configuration

**Connect Worker to Pages:**

```bash
# Link Worker to Pages project
wrangler pages project create bunnygod

# Bind Worker to Pages
wrangler pages deployment create bunnygod \
  --project-name=bunnygod \
  --branch=main
```

**Alternative: Use _routes.json**

```json
// public/_routes.json
{
  "version": 1,
  "include": [
    "/api/*"
  ],
  "exclude": []
}
```

### 7.3 CI/CD Pipeline

#### 7.3.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml

name: Deploy Bunny God

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run linter
        run: bun run lint

      - name: Run type check
        run: bun run typecheck

      - name: Run tests
        run: bun test

  deploy-pages:
    name: Deploy to Cloudflare Pages
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Build site
        run: bun run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: bunnygod
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

  deploy-workers:
    name: Deploy Workers
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

**Required GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN`: Create in Cloudflare Dashboard → API Tokens
- `CLOUDFLARE_ACCOUNT_ID`: Found in Cloudflare Dashboard URL

#### 7.3.2 Preview Deployments

**Automatic Preview for PRs:**

Cloudflare Pages automatically creates preview deployments for pull requests:
- URL format: `<commit-hash>.bunnygod.pages.dev`
- Isolated environment per PR
- Automatic cleanup after PR merge/close

### 7.4 Monitoring & Analytics

#### 7.4.1 Cloudflare Web Analytics

**Setup:**

```html
<!-- Add to src/layouts/MainLayout.astro -->
<script defer
  src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'>
</script>
```

**Metrics Tracked:**
- Page views
- Unique visitors
- Popular questions (via custom events)
- Geographic distribution
- Device types

#### 7.4.2 Custom Analytics Events

```typescript
// Track question submissions
declare global {
  interface Window {
    cfBeacon?: (event: string, data: any) => void;
  }
}

function trackQuestionAsked(question: string) {
  if (window.cfBeacon) {
    window.cfBeacon('trackEvent', {
      event: 'question_asked',
      category: detectPhilosophicalArea(question) || 'general'
    });
  }
}

function trackAnswerReceived(confidence: number, processingTime: number) {
  if (window.cfBeacon) {
    window.cfBeacon('trackEvent', {
      event: 'answer_received',
      confidence,
      processingTime
    });
  }
}
```

#### 7.4.3 Error Tracking

**Cloudflare Logpush Configuration:**

```bash
# Enable Logpush for Workers
wrangler logpush create \
  --destination-conf='YOUR_DESTINATION' \
  --dataset=workers_trace_events
```

**Error Logging in Worker:**

```typescript
async function handleError(error: Error, request: Request, env: Env) {
  // Log to console (appears in Cloudflare Logs)
  console.error('Error processing request:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    timestamp: new Date().toISOString()
  });

  // Track error rate
  const errorKey = `errors:${new Date().toISOString().split('T')[0]}`;
  const currentCount = await env.PAPERS_CACHE.get(errorKey) || '0';
  await env.PAPERS_CACHE.put(
    errorKey,
    String(parseInt(currentCount) + 1),
    { expirationTtl: 86400 }
  );

  // Alert if error rate is high
  if (parseInt(currentCount) > 100) {
    // Implement alerting (e.g., webhook to Discord/Slack)
    await sendAlert('High error rate detected', env);
  }
}
```

### 7.5 Cost Analysis

#### 7.5.1 Detailed Cost Breakdown

**Cloudflare Pages (Static Hosting):**
- **Cost:** FREE
- **Included:** Unlimited requests, unlimited bandwidth
- **Limits:** 500 builds/month (more than enough)

**Cloudflare Workers (API):**
- **Free Tier:** 100,000 requests/day
- **Paid Tier:** $5/month for 10M requests
- **Expected Usage:** 1,000-5,000 requests/day
- **Cost:** $0/month (within free tier)

**Cloudflare Workers AI:**
- **Free Tier:** 10,000 Neurons/day
- **Cost per Neuron:** $0.011 per 1,000 Neurons
- **Estimated Usage:**
  - Per question: ~8-10 Neurons
  - Free tier: ~1,000 questions/day
  - Expected usage: 100-500 questions/day
- **Cost:** $0/month (within free tier)

**Cloudflare KV (Storage):**
- **Free Tier:** 100,000 reads/day, 1,000 writes/day
- **Expected Usage:**
  - Reads: ~5,000/day (cache lookups)
  - Writes: ~200/day (cache updates, rate limiting)
- **Cost:** $0/month (within free tier)

**PhilPapers API:**
- **Cost:** FREE (with attribution)
- **Rate Limits:** ~1,000 requests/day
- **Our Caching:** Reduces API calls by ~80%
- **Expected Usage:** 50-200 API calls/day

**Domain Name (Optional):**
- **Cloudflare Registrar:** $8-15/year (.com/.ai domains)
- **External Registrar:** Varies
- **Monthly Cost:** ~$1-2/month

**Total Monthly Cost:**
- **Without Domain:** $0/month
- **With Domain:** $1-2/month

**At Scale (10,000 questions/day):**
- Workers AI: 100,000 Neurons/day = 90,000 excess
- Cost: 90,000 × $0.011 / 1,000 = $0.99/day ≈ $30/month
- Still very cost-effective for high traffic

#### 7.5.2 Cost Optimization Strategies

1. **Aggressive Caching:**
   - Cache PhilPapers results for 24 hours
   - Cache popular Q&A pairs for 7 days
   - Estimated savings: 80% reduction in AI calls

2. **Smart Question Deduplication:**
```typescript
async function findSimilarQuestion(
  question: string,
  env: Env
): Promise<CachedAnswer | null> {
  // Check if identical question was asked recently
  const normalizedQ = question.toLowerCase().trim();
  const cacheKey = `qa:${hashString(normalizedQ)}`;

  const cached = await env.PAPERS_CACHE.get(cacheKey, { type: 'json' });
  if (cached && Date.now() - cached.timestamp < 604800000) { // 7 days
    return cached;
  }

  return null;
}
```

3. **Dynamic Model Selection:**
```typescript
// Use smaller model for simple questions
function selectModel(question: string): string {
  const complexity = assessQuestionComplexity(question);

  if (complexity === 'simple') {
    return '@cf/mistral/mistral-7b-instruct-v0.1'; // Faster, cheaper
  }

  return '@cf/meta/llama-3.1-8b-instruct'; // Default
}
```

### 7.6 Backup & Disaster Recovery

#### 7.6.1 Data Backup Strategy

**KV Data Backup:**
```bash
# Create daily backup script
#!/bin/bash

# Backup cache data
wrangler kv:key list --namespace-id=PAPERS_CACHE_ID \
  | jq -r '.[].name' \
  | while read key; do
    wrangler kv:key get --namespace-id=PAPERS_CACHE_ID "$key" \
      > "backups/$(date +%Y%m%d)_${key}.json"
  done

# Compress backups
tar -czf "backups/backup-$(date +%Y%m%d).tar.gz" backups/*.json
rm backups/*.json
```

**Git-based Backup:**
```bash
# All code is in GitHub - no additional backup needed
# Ensure regular commits and push to origin
git push origin main --force-with-lease
```

#### 7.6.2 Rollback Strategy

**Rollback to Previous Deployment:**
```bash
# List recent deployments
wrangler deployments list

# Rollback Workers to previous version
wrangler rollback [DEPLOYMENT_ID]

# Rollback Pages (via dashboard)
# Cloudflare Pages → Deployments → View → Rollback
```

**Emergency Maintenance Page:**
```typescript
// workers/maintenance.ts
export default {
  async fetch(request: Request): Promise<Response> {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head><title>Bunny God - Maintenance</title></head>
        <body style="background: #0F0E17; color: white; font-family: sans-serif; text-align: center; padding: 100px;">
          <h1>🌙 The Oracle Rests 🌙</h1>
          <p>Bunny God is communing with the cosmic energies.</p>
          <p>We'll return shortly with renewed divine wisdom.</p>
        </body>
      </html>
    `, {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
```

### 7.7 GitHub Copilot Integration

#### 7.7.1 Development Assistance Strategy

**Copilot Configuration for Bunny God:**

GitHub Copilot will accelerate development across all phases by providing:
- TypeScript/Astro code completion and suggestions
- Cloudflare Workers API integration patterns
- Tailwind CSS mystical theme styling
- Test generation and edge case coverage
- Documentation and inline comments

**Recommended Copilot Prompts:**

```typescript
// Generate mystical gradient animation for background
// Implement PhilPapers API query with caching
// Create Cloudflare Workers AI integration for Llama 3.1
// Add loading state with cosmic animation
// Generate TypeScript types for PhilPapers API response
```

#### 7.7.2 Copilot Chat Usage

**Best Practices for Development:**

1. **Component Generation:** Use `/ask` in Copilot Chat to scaffold React/Astro components
   - Example: "Create a mystical question input component with gradient border animation"

2. **API Integration:** Request complete integration patterns
   - Example: "Generate Cloudflare Worker function to query PhilPapers API with error handling"

3. **Styling Assistance:** Get Tailwind utility class suggestions
   - Example: "Create dark mode mystical theme with purple/blue gradients using Tailwind"

4. **Testing:** Auto-generate test suites
   - Example: "Generate unit tests for answer synthesis logic with edge cases"

5. **Documentation:** Request inline JSDoc comments
   - Example: "Add JSDoc documentation to all exported functions"

#### 7.7.3 Copilot in CI/CD

**GitHub Actions Integration:**

Copilot can help generate and maintain GitHub Actions workflows:

```bash
# Use Copilot to generate workflow improvements
# Example prompt: "Add caching for bun dependencies in GitHub Actions"
# Example prompt: "Create preview deployment workflow for pull requests"
```

**Automated Code Review:**

Configure Copilot to assist with PR reviews:
- Enable Copilot suggestions in pull request comments
- Use Copilot to explain complex code changes
- Request test coverage improvements

---

## 8. Implementation Phases

### 8.1 Phase 1: Core MVP (Weeks 1-3)

**Goal:** Launch functional Q&A system with basic mystical aesthetics

**Week 1: Foundation Setup**

Day 1-2: Project Setup
- [ ] Initialize Astro project with TypeScript
- [ ] Configure Tailwind CSS with mystical theme
- [ ] Set up Cloudflare Workers project structure
- [ ] Configure Wrangler for Workers deployment
- [ ] Create GitHub repository and connect to Cloudflare Pages
- [ ] Set up development environment

Day 3-4: Backend Core
- [ ] Implement PhilPapers API client
- [ ] Build search and ranking logic
- [ ] Set up Cloudflare KV caching
- [ ] Create rate limiting middleware
- [ ] Test PhilPapers integration

Day 5-7: AI Integration
- [ ] Implement Workers AI client
- [ ] Write Bunny God system prompt
- [ ] Build prompt engineering logic
- [ ] Test AI answer generation
- [ ] Implement error handling and fallbacks

**Week 2: Frontend Development**

Day 8-10: Core UI Components
- [ ] Create QuestionInput component
- [ ] Implement AnswerDisplay component
- [ ] Build LoadingOracle component
- [ ] Add SourceCitations component
- [ ] Implement typewriter animation

Day 11-12: Mystical Styling
- [ ] Design and implement gradient backgrounds
- [ ] Add glow effects and animations
- [ ] Create responsive layouts
- [ ] Test on mobile devices
- [ ] Ensure accessibility compliance

Day 13-14: Integration & Testing
- [ ] Connect frontend to Worker API
- [ ] Implement error handling UI
- [ ] Add loading states
- [ ] Test full question flow
- [ ] Fix bugs and polish UX

**Week 3: Testing & Launch**

Day 15-16: Testing
- [ ] Write and run unit tests
- [ ] Perform integration testing
- [ ] Test edge cases and error scenarios
- [ ] Load testing (simulate traffic)
- [ ] Security testing (injection, XSS)

Day 17-18: Deployment
- [ ] Deploy Workers to production
- [ ] Deploy Pages to production
- [ ] Configure custom domain (if purchased)
- [ ] Set up monitoring and analytics
- [ ] Create deployment documentation

Day 19-21: Launch & Polish
- [ ] Soft launch (limited announcement)
- [ ] Monitor for issues
- [ ] Gather initial feedback
- [ ] Fix critical bugs
- [ ] Performance optimization

**Phase 1 Success Criteria:**
- [ ] Users can ask questions and receive answers
- [ ] Answers cite relevant philosophical papers
- [ ] Mystical theme is functional
- [ ] Site loads in <2 seconds
- [ ] No critical bugs
- [ ] Hosted on Cloudflare Pages with custom domain

### 8.2 Phase 2: Enhanced UX (Weeks 4-5)

**Goal:** Elevate mystical experience with advanced visuals and features

**Week 4: Visual Enhancement**

Day 22-24: Advanced Animations
- [ ] Implement particle system (Canvas API)
- [ ] Add aurora borealis effect
- [ ] Create constellation patterns
- [ ] Implement parallax mouse tracking
- [ ] Optimize animation performance

Day 25-26: Bunny God Avatar
- [ ] Design Bunny God SVG avatar
- [ ] Create mystical symbol set
- [ ] Animate avatar for loading states
- [ ] Add pulsing glow effects
- [ ] Integrate into LoadingOracle

Day 27-28: Interactive Features
- [ ] Implement question history (localStorage)
- [ ] Add copy-to-clipboard functionality
- [ ] Create share link generation
- [ ] Add feedback buttons (helpful/not helpful)
- [ ] Build history sidebar UI

**Week 5: Feature Refinement**

Day 29-31: Response Streaming
- [ ] Implement Server-Sent Events in Worker
- [ ] Add streaming support to AI client
- [ ] Update frontend to handle SSE
- [ ] Smooth typewriter animation for streams
- [ ] Test streaming reliability

Day 32-33: Enhanced Citations
- [ ] Make paper abstracts expandable
- [ ] Add "Read Full Paper" links
- [ ] Implement relevance indicators
- [ ] Create citation hover previews
- [ ] Style citation section beautifully

Day 34-35: Testing & Polish
- [ ] Test all new features
- [ ] Performance optimization
- [ ] Mobile testing and fixes
- [ ] Accessibility improvements
- [ ] Deploy Phase 2 updates

**Phase 2 Success Criteria:**
- [ ] Immersive mystical visual experience
- [ ] Smooth animations on all devices
- [ ] Answer streaming works reliably
- [ ] History feature functional
- [ ] All interactions feel polished

### 8.3 Phase 3: Optimization & Scale (Week 6)

**Goal:** Optimize for performance, cost, and reliability

**Day 36-37: Performance Optimization**
- [ ] Implement advanced caching strategies
- [ ] Optimize bundle size (code splitting)
- [ ] Compress images and assets
- [ ] Reduce JavaScript payload
- [ ] Achieve <1s page load time

**Day 38-39: Cost Optimization**
- [ ] Implement question deduplication
- [ ] Add smart cache warm-up
- [ ] Optimize AI token usage
- [ ] Reduce unnecessary API calls
- [ ] Monitor and validate cost reductions

**Day 40-41: Monitoring & Analytics**
- [ ] Set up Cloudflare Web Analytics
- [ ] Implement custom event tracking
- [ ] Create error logging system
- [ ] Build admin dashboard (simple)
- [ ] Set up alerting for critical errors

**Day 42: Final Polish & Documentation**
- [ ] Write comprehensive README
- [ ] Document API endpoints
- [ ] Create troubleshooting guide
- [ ] Final testing pass
- [ ] Official launch announcement

**Phase 3 Success Criteria:**
- [ ] Page load <1 second
- [ ] API response <2 seconds (p95)
- [ ] Daily cost <$0.50 at 1,000 questions/day
- [ ] Zero critical errors for 7 days
- [ ] Comprehensive documentation

### 8.4 Future Enhancements (Post-Launch)

**Phase 4: Advanced Features (Optional)**

- [ ] Multi-language support (Spanish, French, German)
- [ ] Voice input for questions (Web Speech API)
- [ ] AI-generated philosophical artwork for answers
- [ ] "Deep Dive" mode with extended analysis
- [ ] Weekly email newsletter with philosophical insights
- [ ] Discord bot integration
- [ ] Mobile app (React Native or PWA)
- [ ] User accounts and saved questions
- [ ] Collaborative question threads
- [ ] Philosophy teacher dashboard

**Phase 5: Community Features**

- [ ] Public question gallery (best questions)
- [ ] Voting on answer quality
- [ ] Community-submitted philosophical questions
- [ ] Featured "Question of the Week"
- [ ] Integration with philosophy forums/subreddits

---

## 9. Risk Analysis

### 9.1 Technical Risks

#### Risk 9.1.1: PhilPapers API Reliability

**Risk Level:** HIGH
**Probability:** Medium
**Impact:** High

**Description:**
PhilPapers API may have undocumented rate limits, downtime, or change without notice. Lack of official public API documentation increases uncertainty.

**Mitigation Strategies:**

1. **Aggressive Caching:**
   - Cache all PhilPapers results for 24+ hours
   - Pre-cache popular philosophical topics
   - Build fallback dataset of common papers

2. **Alternative Data Sources:**
   - Scrape PhilPapers as fallback (respectfully)
   - Use OAI-PMH interface for Open Access papers
   - Partner with academic institutions for access

3. **Graceful Degradation:**
   - System works without PhilPapers (AI generates general answers)
   - Maintain local database of essential philosophical papers
   - Clear user communication when sources unavailable

4. **API Monitoring:**
   - Track API success rates
   - Alert on failures
   - Automatic fallback activation

**Contingency Plan:**
If PhilPapers becomes unavailable long-term:
- Pivot to Stanford Encyclopedia of Philosophy scraping
- Build local index of public domain philosophy texts
- Partner with philosophy departments for content

---

#### Risk 9.1.2: Cloudflare Workers AI Quality/Availability

**Risk Level:** MEDIUM
**Probability:** Low
**Impact:** High

**Description:**
Workers AI is a newer service and may experience outages, quality issues, or pricing changes. Model availability not guaranteed long-term.

**Mitigation Strategies:**

1. **Multi-Model Fallback:**
```typescript
const MODEL_FALLBACKS = [
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/mistral/mistral-7b-instruct-v0.1',
  '@cf/meta/llama-2-7b-chat-fp16'
];

async function generateWithFallback(prompt: string, env: Env) {
  for (const model of MODEL_FALLBACKS) {
    try {
      return await env.AI.run(model, { messages: prompt });
    } catch (error) {
      console.error(`Model ${model} failed, trying next...`);
    }
  }

  throw new Error('All AI models failed');
}
```

2. **External LLM Backup:**
   - Have OpenAI API key ready as emergency backup
   - Implement adapter pattern for easy LLM switching
   - Test with multiple providers quarterly

3. **Response Caching:**
   - Cache AI-generated answers for 7 days
   - Build dataset of pre-generated answers to common questions

**Contingency Plan:**
If Workers AI becomes unreliable:
- Switch to OpenAI API (costs increase to ~$0.002/question)
- Use Anthropic Claude via API
- Implement local LLM with Ollama (requires server)

---

#### Risk 9.1.3: Performance Under Load

**Risk Level:** MEDIUM
**Probability:** Medium
**Impact:** Medium

**Description:**
If site goes viral, could overwhelm free tier limits and create performance issues.

**Mitigation Strategies:**

1. **Automatic Scaling:**
   - Cloudflare automatically scales Workers
   - Static site scales infinitely

2. **Rate Limiting:**
   - 10 questions per minute per IP
   - 50 questions per hour per IP
   - Graceful degradation with queuing

3. **Cost Monitoring:**
   - Daily cost alerts
   - Automatic circuit breaker at $10/day
   - Upgrade to paid tier if sustained traffic

4. **Performance Budget:**
```typescript
const PERFORMANCE_LIMITS = {
  questionsPerDay: 10000,
  costPerDay: 10, // $10 USD
  apiResponseTime: 3000, // 3 seconds
};

async function checkBudget(env: Env): Promise<boolean> {
  const today = await getDailyMetrics(env);

  if (today.questions > PERFORMANCE_LIMITS.questionsPerDay) {
    return false; // Trigger rate limiting
  }

  if (today.cost > PERFORMANCE_LIMITS.costPerDay) {
    return false; // Activate cost saver mode
  }

  return true;
}
```

**Contingency Plan:**
If traffic exceeds capacity:
- Activate waiting room (queue users)
- Temporarily reduce AI response length
- Show cached popular answers only
- Upgrade to paid plans ($5-30/month)

---

### 9.2 Content & Quality Risks

#### Risk 9.2.1: AI Hallucinations/Inaccuracies

**Risk Level:** MEDIUM
**Probability:** Medium
**Impact:** Medium

**Description:**
AI may generate factually incorrect philosophical claims or misrepresent paper contents.

**Mitigation Strategies:**

1. **Source Grounding:**
   - Always provide paper abstracts to AI
   - Require citations in AI responses
   - Validate citations exist in provided papers

2. **Confidence Scoring:**
   - Show confidence level with answers
   - Warn users when confidence is low
   - Encourage reading source papers

3. **Disclaimer:**
```html
<aside class="disclaimer">
  🌙 Divine Wisdom Disclaimer 🌙

  Bunny God synthesizes insights from academic philosophical
  literature, but responses are AI-generated interpretations.
  Always consult source papers for authoritative information.
</aside>
```

4. **Validation Layer:**
```typescript
function validatePhilosophicalClaim(claim: string, papers: Paper[]): boolean {
  // Check if claim has support in provided papers
  const keywords = extractKeywords(claim);

  return papers.some(paper => {
    const paperText = paper.title + ' ' + paper.abstract;
    return keywords.some(kw => paperText.includes(kw));
  });
}
```

**Contingency Plan:**
If quality issues persist:
- Add manual review for popular questions
- Implement user reporting system
- Hire philosophy graduate student for validation

---

#### Risk 9.2.2: Inappropriate/Offensive Content

**Risk Level:** LOW
**Probability:** Low
**Impact:** High

**Description:**
Users might ask offensive questions or AI might generate inappropriate responses.

**Mitigation Strategies:**

1. **Input Filtering:**
```typescript
const BLOCKED_PATTERNS = [
  /hate speech patterns/,
  /explicit content patterns/,
  /harassment patterns/
];

function filterQuestion(question: string): { allowed: boolean; reason?: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(question)) {
      return {
        allowed: false,
        reason: 'The Oracle contemplates only philosophical inquiries of wisdom and understanding.'
      };
    }
  }

  return { allowed: true };
}
```

2. **AI Safety Instructions:**
   - Include content policy in system prompt
   - Instruct AI to decline inappropriate questions gracefully
   - Maintain mystical voice in refusals

3. **User Reporting:**
   - Add "Report issue" button
   - Manual review of reports
   - Block abusive IPs

**Contingency Plan:**
If abuse becomes problem:
- Implement CAPTCHA
- Require email for questions
- Add manual approval queue

---

### 9.3 Business & Legal Risks

#### Risk 9.3.1: PhilPapers Terms of Service Violation

**Risk Level:** MEDIUM
**Probability:** Low
**Impact:** High

**Description:**
May inadvertently violate PhilPapers TOS regarding API usage or data redistribution.

**Mitigation Strategies:**

1. **Compliance Review:**
   - Read TOS thoroughly before launch
   - Contact PhilPapers for permission/partnership
   - Provide clear attribution on every page
   - Never redistribute full paper texts

2. **Attribution:**
```html
<footer>
  Philosophical papers sourced from
  <a href="https://philpapers.org">PhilPapers.org</a>.

  PhilPapers is a comprehensive index and bibliography of
  philosophy maintained by the community and directed by
  David Bourget and David Chalmers.
</footer>
```

3. **Respectful Usage:**
   - Cache to minimize API calls
   - Rate limit own requests
   - Never scrape aggressively
   - Link back to PhilPapers for full papers

**Contingency Plan:**
If PhilPapers objects:
- Negotiate partnership/license
- Switch to alternative philosophy databases
- Pivot to different academic source

---

#### Risk 9.3.2: Intellectual Property Issues

**Risk Level:** LOW
**Probability:** Low
**Impact:** Medium

**Description:**
Questions about copyright of AI-generated content or use of paper abstracts.

**Mitigation Strategies:**

1. **Legal Clarity:**
   - AI-generated content is created by user prompts (user owns)
   - Paper abstracts are factual (not copyrightable)
   - Always cite sources (fair use)
   - Don't reproduce full paper texts

2. **Terms of Service:**
```markdown
## Bunny God Terms of Service

1. Content Ownership
   - AI responses are generated interpretations, not original philosophical work
   - Users may freely use and share responses
   - Always attribute original philosophical papers to their authors

2. Source Material
   - Paper citations link to PhilPapers.org
   - We do not host or distribute full academic papers
   - All philosophical content is properly attributed

3. Disclaimer
   - Bunny God is an educational tool for exploring philosophy
   - Not a substitute for academic research
   - Consult original sources for scholarly work
```

**Contingency Plan:**
If legal issues arise:
- Consult IP attorney
- Add more explicit disclaimers
- Implement content licenses

---

#### Risk 9.3.3: Sudden Cost Increases

**Risk Level:** MEDIUM
**Probability:** Low
**Impact:** High

**Description:**
Cloudflare or other services may change pricing unexpectedly.

**Mitigation Strategies:**

1. **Cost Monitoring:**
   - Daily cost tracking
   - Alerts at $5, $10, $20 thresholds
   - Weekly cost reports

2. **Budget Limits:**
```typescript
const COST_LIMITS = {
  daily: 10,   // $10/day max
  weekly: 50,  // $50/week max
  monthly: 150 // $150/month max
};

async function checkCostLimit(env: Env): Promise<boolean> {
  const costs = await getCurrentCosts(env);

  if (costs.today > COST_LIMITS.daily) {
    // Activate emergency cost saving mode
    await activateCostSaverMode(env);
    return false;
  }

  return true;
}
```

3. **Cost Optimization Levers:**
   - Reduce AI max_tokens (shorter answers)
   - Increase caching TTL
   - Use smaller AI models
   - Implement stricter rate limiting

**Contingency Plan:**
If costs spike unexpectedly:
- Immediately activate cost saver mode
- Investigate root cause
- Switch to cheaper alternatives
- Consider monetization (donations, premium)

---

### 9.4 Risk Priority Matrix

| Risk | Probability | Impact | Priority | Mitigation Status |
|------|-------------|--------|----------|-------------------|
| PhilPapers API Issues | Medium | High | **HIGH** | Strong mitigation |
| Workers AI Quality | Low | High | MEDIUM | Adequate mitigation |
| Performance Under Load | Medium | Medium | MEDIUM | Adequate mitigation |
| AI Hallucinations | Medium | Medium | MEDIUM | Strong mitigation |
| Content Moderation | Low | High | MEDIUM | Basic mitigation |
| TOS Violations | Low | High | MEDIUM | Strong mitigation |
| IP Issues | Low | Medium | LOW | Basic mitigation |
| Cost Increases | Low | High | MEDIUM | Strong mitigation |

---

## 10. Success Metrics

### 10.1 Launch Metrics (Week 1)

**User Engagement:**
- [ ] 100+ unique visitors
- [ ] 50+ questions asked
- [ ] >70% question completion rate (received answer)
- [ ] Average session duration >2 minutes

**Technical Performance:**
- [ ] 99%+ uptime
- [ ] <2s average response time
- [ ] Zero critical errors
- [ ] <$1 total infrastructure cost

**Quality Indicators:**
- [ ] >80% of answers cite 2+ sources
- [ ] Average confidence score >0.7
- [ ] <5 reported quality issues

### 10.2 Month 1 Goals

**User Growth:**
- [ ] 1,000+ unique visitors
- [ ] 500+ questions asked
- [ ] >75% question completion rate
- [ ] >20% return visitor rate

**Technical Excellence:**
- [ ] 99.5%+ uptime
- [ ] <1.5s average response time
- [ ] Page load speed <1s
- [ ] <$20 total monthly cost

**Quality & Engagement:**
- [ ] >85% user satisfaction (if we add feedback)
- [ ] Average session duration >3 minutes
- [ ] >5 questions per engaged user
- [ ] >5% share rate

### 10.3 Month 3 Goals

**Scale:**
- [ ] 5,000+ unique visitors/month
- [ ] 2,000+ questions/month
- [ ] Featured on philosophy websites/forums
- [ ] >30% return visitor rate

**Optimization:**
- [ ] <$50 monthly infrastructure cost
- [ ] 99.9%+ uptime
- [ ] <1s API response time (p95)
- [ ] Question cache hit rate >60%

**Community:**
- [ ] 10+ social media mentions
- [ ] Featured in philosophy newsletter
- [ ] Reddit/HackerNews discussion
- [ ] >10% share rate

### 10.4 Long-term Success Indicators

**Product-Market Fit:**
- Users return weekly to ask questions
- Organic growth through word-of-mouth
- Philosophy students/teachers adopt tool
- Featured in academic resources

**Technical Sustainability:**
- Infrastructure costs <$100/month at 10,000 users
- Maintained >99.9% uptime for 6 months
- Zero security incidents
- Smooth deployments with CI/CD

**Content Quality:**
- Consistently cited accurate philosophical sources
- Positive feedback from philosophy community
- Low false information report rate
- High engagement with source citations

---

## Appendix A: Technology References

### A.1 Key Documentation Links

**Astro:**
- Main Docs: https://docs.astro.build
- Cloudflare Deployment: https://docs.astro.build/en/guides/deploy/cloudflare/

**Cloudflare Pages:**
- Docs: https://developers.cloudflare.com/pages/
- Astro Guide: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

**Cloudflare Workers:**
- Docs: https://developers.cloudflare.com/workers/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

**Cloudflare Workers AI:**
- Docs: https://developers.cloudflare.com/workers-ai/
- Pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Models: https://developers.cloudflare.com/workers-ai/models/

**PhilPapers:**
- API Docs: https://philpapers.org/help/api/
- OAI-PMH: https://philpapers.org/help/oai.html

**Tailwind CSS:**
- Docs: https://tailwindcss.com/docs
- Dark Mode: https://tailwindcss.com/docs/dark-mode

### A.2 Research Sources

This PRD was informed by the following sources:

**Cloudflare Ecosystem:**
- [Astro · Cloudflare Pages docs](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Pricing · Cloudflare Workers AI docs](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Cloudflare Workers AI LLM pricing 2025](https://workers.cloudflare.com/pricing)

**PhilPapers Integration:**
- [API documentation - PhilPapers](https://philpapers.org/help/api/)

**Design & UX:**
- [Dark Mode UI: Best Practices for 2025](https://www.graphiceagle.com/dark-mode-ui/)
- [Modern UI Design Trends 2025](https://pixso.net/tips/modern-ui-design/)
- [Complete Dark Mode Design Guide 2025](https://ui-deploy.com/blog/complete-dark-mode-design-guide-ui-patterns-and-implementation-best-practices-2025)

**TypeScript & Chat Interfaces:**
- [assistant-ui: TypeScript/React Library for AI Chat](https://github.com/assistant-ui/assistant-ui)
- [Build a chat app with React, TypeScript and Socket.io](https://www.freecodecamp.org/news/build-a-chat-app-with-react-typescript-and-socket-io-d7e1192d288/)

---

## Appendix B: Quick Start Guide

### B.1 For Engineers: Getting Started

**Prerequisites:**
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Git installed
- Cloudflare account (free)
- PhilPapers API key (register at philpapers.org)

**Setup (15 minutes):**

```bash
# 1. Clone and install
cd /home/gat0r/bunnygod
bun install

# 2. Set up Cloudflare
npm install -g wrangler
wrangler login

# 3. Create KV namespaces
wrangler kv:namespace create "PAPERS_CACHE"
wrangler kv:namespace create "RATE_LIMIT"
# Copy IDs to wrangler.toml

# 4. Set secrets
wrangler secret put PHILPAPERS_API_KEY
# Enter your API key

# 5. Run development servers
bun run dev              # Frontend (localhost:4321)
wrangler dev workers/ask # Workers (localhost:8787)

# 6. Test
curl http://localhost:8787/api/ask \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"question":"What is consciousness?"}'

# 7. Deploy
bun run build
wrangler deploy
```

**First Tasks by Role:**

**Frontend Engineer:**
1. Review `src/components/QuestionInput.tsx`
2. Implement mystical animations in `src/styles/animations.css`
3. Create responsive layouts

**Backend Engineer:**
1. Review `workers/ask/index.ts`
2. Test PhilPapers integration
3. Optimize AI prompts

**UI/UX Designer:**
1. Design Bunny God avatar SVG
2. Create mystical symbol set
3. Define color palette variations

---

## Appendix C: Glossary

**Astro:** Modern static site generator optimized for content-focused sites with minimal JavaScript.

**Cloudflare Pages:** Free static site hosting with global CDN and automatic deployments.

**Cloudflare Workers:** Serverless JavaScript functions that run at the edge (globally distributed).

**Workers AI:** Cloudflare's serverless AI inference platform for running LLMs at the edge.

**Edge Computing:** Running code at locations geographically close to users for lower latency.

**KV (Key-Value) Storage:** Cloudflare's globally distributed, eventually consistent storage system.

**Neurons:** Cloudflare's unit of measurement for AI inference usage.

**PhilPapers:** Comprehensive online index of philosophy research papers and books.

**Server-Sent Events (SSE):** One-way communication from server to client for real-time updates.

**Typewriter Effect:** Text animation that reveals characters sequentially, simulating typing.

**Wrangler:** Official CLI tool for developing and deploying Cloudflare Workers.

---

## Document Control

**Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-01 | Initial PRD creation | Atlas (AI Architect) |

**Review & Approval:**

| Role | Name | Status | Date |
|------|------|--------|------|
| Product Owner | [Your Name] | Pending | - |
| Tech Lead | [Your Name] | Pending | - |
| Engineering | [Agents] | Ready | - |

**Next Steps:**

1. Review and approve PRD
2. Assign engineers to phases
3. Set up project tracking (GitHub Projects)
4. Begin Phase 1 implementation
5. Schedule weekly check-ins

---

**END OF DOCUMENT**

*This PRD is comprehensive and ready for distributed implementation by development agents. Each section includes detailed specifications, implementation checklists, and acceptance criteria.*

*For questions or clarifications, please reference specific sections by number.*

🌙 **May the cosmic wisdom guide your implementation journey** 🌙
