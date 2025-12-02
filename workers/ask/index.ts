/**
 * Bunny God API Worker
 *
 * Main Cloudflare Worker that handles philosophical question answering
 * by querying PhilPapers.org and synthesizing answers with Workers AI
 */

export interface Env {
  AI: any; // Cloudflare Workers AI binding
  CACHE: KVNamespace; // KV namespace for caching
  FEEDBACK: KVNamespace; // KV namespace for user feedback
  ANALYTICS?: any; // Analytics Engine binding (optional - requires dashboard setup)
  ENVIRONMENT: string;
  PHILPAPERS_API_ID?: string; // PhilPapers API ID (optional - falls back to CrossRef)
  PHILPAPERS_API_KEY?: string; // PhilPapers API Key (optional - falls back to CrossRef)
}

interface QuestionRequest {
  question: string;
}

interface AnswerResponse {
  answer: string;
  sources: Array<{
    title: string;
    authors: string;
    url: string;
  }>;
  cached: boolean;
}

interface FeedbackRequest {
  questionHash: string;
  rating: 'helpful' | 'not-helpful';
  timestamp: number;
  sessionId?: string;
}

interface FeedbackData {
  questionHash: string;
  rating: 'helpful' | 'not-helpful';
  timestamp: number;
  sessionId?: string;
  userAgent?: string;
  country?: string;
}

/**
 * Handle feedback submission
 */
async function handleFeedback(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    // Parse request body
    const body = await request.json() as FeedbackRequest;

    // Validate request
    if (!body.questionHash || typeof body.questionHash !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid questionHash' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.rating || !['helpful', 'not-helpful'].includes(body.rating)) {
      return new Response(
        JSON.stringify({ error: 'Invalid rating. Must be "helpful" or "not-helpful"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.timestamp || typeof body.timestamp !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid timestamp' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for FEEDBACK KV namespace
    if (!env.FEEDBACK) {
      return new Response(
        JSON.stringify({ error: 'Feedback storage not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: Check if this session already rated this question
    const rateLimitKey = `ratelimit:${body.sessionId}:${body.questionHash}`;
    const existingRating = await env.FEEDBACK.get(rateLimitKey);

    if (existingRating) {
      return new Response(
        JSON.stringify({ error: 'Already rated this question', rating: existingRating }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare feedback data with metadata
    const feedbackData: FeedbackData = {
      questionHash: body.questionHash,
      rating: body.rating,
      timestamp: body.timestamp,
      sessionId: body.sessionId,
      userAgent: request.headers.get('user-agent') || undefined,
      country: (request as any).cf?.country || undefined,
    };

    // Store feedback in KV
    const feedbackKey = `feedback:${body.questionHash}:${body.timestamp}`;
    await env.FEEDBACK.put(feedbackKey, JSON.stringify(feedbackData), {
      expirationTtl: 2592000, // 30 days
    });

    // Store rate limit (shorter TTL - 7 days)
    if (body.sessionId) {
      await env.FEEDBACK.put(rateLimitKey, body.rating, {
        expirationTtl: 604800, // 7 days
      });
    }

    // Track analytics if available
    if (env.ANALYTICS) {
      const { trackEvent } = await import('./analytics');
      trackEvent(env.ANALYTICS, 'feedback_submitted', {
        question_length: 0,
        response_time_ms: 0,
        sources_count: body.rating === 'helpful' ? 1 : 0,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Feedback recorded' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing feedback:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: env.ENVIRONMENT === 'development' ? (error as Error).message : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Route handling
    const url = new URL(request.url);

    // Feedback endpoint
    if (url.pathname === '/api/feedback') {
      return handleFeedback(request, env, corsHeaders);
    }

    // Question answering endpoint (default)
    const startTime = Date.now();

    try {
      // Parse request body
      const body = await request.json() as QuestionRequest;

      if (!body.question || typeof body.question !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid question format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const question = body.question.trim();

      if (question.length < 10) {
        return new Response(
          JSON.stringify({ error: 'Question too short (minimum 10 characters)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (question.length > 500) {
        return new Response(
          JSON.stringify({ error: 'Question too long (maximum 500 characters)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Normalize question for cache key: lowercase and collapse multiple spaces
      // This ensures "What is love?" and "what is love?" hit the same cache entry
      const normalizedForCache = question.toLowerCase().replace(/\s+/g, ' ');

      // Check cache first
      const cacheKey = `answer:${hashString(normalizedForCache)}`;
      const cached = await env.CACHE?.get(cacheKey, 'json');

      if (cached) {
        return new Response(
          JSON.stringify({ ...cached, cached: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Import modules dynamically
      const { searchPhilPapers, extractSearchTerms } = await import('./philpapers');
      const { synthesizeAnswer, sanitizeQuestion } = await import('./ai');

      // Sanitize the question
      const sanitizedQuestion = sanitizeQuestion(question);

      // Extract search terms for PhilPapers
      const searchTerms = extractSearchTerms(sanitizedQuestion);

      // Query PhilPapers for relevant papers (with optional credentials)
      const philPapersResult = await searchPhilPapers(searchTerms, 5, {
        apiId: env.PHILPAPERS_API_ID,
        apiKey: env.PHILPAPERS_API_KEY,
      });

      // Generate answer using Workers AI
      const aiResponse = await synthesizeAnswer(env.AI, sanitizedQuestion, philPapersResult.papers);

      // Build response
      const response: AnswerResponse = {
        answer: aiResponse.answer,
        sources: philPapersResult.papers.map(paper => ({
          title: paper.title,
          authors: paper.authors,
          url: paper.url,
        })),
        cached: false,
      };

      // Cache the response for 24 hours
      await env.CACHE?.put(cacheKey, JSON.stringify(response), { expirationTtl: 86400 });

      // Track analytics
      const { trackQuestion } = await import('./analytics');
      const responseTime = Date.now() - startTime;
      trackQuestion(
        env.ANALYTICS,
        sanitizedQuestion.length,
        responseTime,
        response.sources.length,
        false
      );

      return new Response(
        JSON.stringify(response),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('Error processing question:', error);

      // Track error
      const { trackError } = await import('./analytics');
      trackError(env.ANALYTICS, (error as Error).message);

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: env.ENVIRONMENT === 'development' ? (error as Error).message : undefined
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};

/**
 * Simple string hash function for cache keys
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
