/**
 * Analytics tracking for Bunny God API
 *
 * Tracks usage, performance, and errors
 */

export interface AnalyticsEvent {
  timestamp: number;
  event: string;
  question_length?: number;
  response_time_ms?: number;
  sources_count?: number;
  cached?: boolean;
  error?: string;
  user_agent?: string;
}

/**
 * Track API usage event
 */
export function trackEvent(
  analytics: any,
  event: string,
  data: Partial<AnalyticsEvent> = {}
): void {
  try {
    if (!analytics || typeof analytics.writeDataPoint !== 'function') {
      return; // Analytics not available
    }

    const dataPoint = {
      blobs: [event],
      doubles: [
        data.response_time_ms || 0,
        data.question_length || 0,
        data.sources_count || 0,
      ],
      indexes: [
        data.cached ? 'cached' : 'uncached',
        data.error || 'success',
      ],
    };

    analytics.writeDataPoint(dataPoint);
  } catch (error) {
    console.error('Analytics error:', error);
    // Don't throw - analytics failures shouldn't break the API
  }
}

/**
 * Track successful question
 */
export function trackQuestion(
  analytics: any,
  questionLength: number,
  responseTimeMs: number,
  sourcesCount: number,
  cached: boolean
): void {
  trackEvent(analytics, 'question_answered', {
    question_length: questionLength,
    response_time_ms: responseTimeMs,
    sources_count: sourcesCount,
    cached,
  });
}

/**
 * Track error
 */
export function trackError(
  analytics: any,
  error: string,
  questionLength?: number
): void {
  trackEvent(analytics, 'error', {
    error,
    question_length: questionLength,
  });
}
