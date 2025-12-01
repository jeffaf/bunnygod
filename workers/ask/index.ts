/**
 * Bunny God API Worker
 *
 * Main Cloudflare Worker that handles philosophical question answering
 * by querying PhilPapers.org and synthesizing answers with Workers AI
 */

export interface Env {
  AI: any; // Cloudflare Workers AI binding
  CACHE: KVNamespace; // KV namespace for caching
  ANALYTICS?: any; // Analytics Engine binding (optional - requires dashboard setup)
  ENVIRONMENT: string;
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

      // Check cache first
      const cacheKey = `answer:${hashString(question)}`;
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

      // Query PhilPapers for relevant papers
      const philPapersResult = await searchPhilPapers(searchTerms, 5);

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
