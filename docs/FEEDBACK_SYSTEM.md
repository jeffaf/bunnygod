# Feedback System Documentation

## Overview

The Bunny God Feedback System allows users to rate answers as "helpful" or "not helpful". Feedback is stored anonymously in Cloudflare KV for future analysis and improvements.

## Architecture

### Frontend Components

**FeedbackButtons.tsx**
- Location: `/home/gat0r/bunnygod/src/components/phase2/FeedbackButtons.tsx`
- Features:
  - Thumbs up/down buttons with cosmic theming
  - Visual feedback on selection (gradient glow, scale animation)
  - localStorage persistence (prevents duplicate ratings per session)
  - Success/error messages
  - Privacy-conscious design (no PII collected)

### Backend API

**Worker Endpoint: POST /api/feedback**
- Location: `/home/gat0r/bunnygod/workers/ask/index.ts`
- Accepts:
  ```typescript
  {
    questionHash: string;      // Client-side simple hash
    rating: 'helpful' | 'not-helpful';
    timestamp: number;
    sessionId?: string;         // Browser session ID
  }
  ```
- Stores:
  ```typescript
  {
    questionHash: string;
    rating: 'helpful' | 'not-helpful';
    timestamp: number;
    sessionId?: string;
    userAgent?: string;         // From request headers
    country?: string;           // From Cloudflare cf object
  }
  ```

### Storage Architecture

**Cloudflare KV Namespace: FEEDBACK**
- Binding: `env.FEEDBACK`
- Two key types:

1. **Feedback Data Keys**
   - Format: `feedback:{questionHash}:{timestamp}`
   - Value: JSON-stringified FeedbackData
   - TTL: 30 days (2,592,000 seconds)
   - Example: `feedback:abc123xyz:1701234567890`

2. **Rate Limit Keys**
   - Format: `ratelimit:{sessionId}:{questionHash}`
   - Value: rating string ('helpful' or 'not-helpful')
   - TTL: 7 days (604,800 seconds)
   - Purpose: Prevent duplicate ratings per session

## Setup Instructions

### 1. Create KV Namespace

Run the following commands to create the KV namespace:

```bash
# Production namespace
wrangler kv:namespace create FEEDBACK

# Preview/dev namespace
wrangler kv:namespace create FEEDBACK --preview
```

This will output namespace IDs like:
```
{ binding = "FEEDBACK", id = "abc123..." }
{ binding = "FEEDBACK", preview_id = "xyz789..." }
```

### 2. Update wrangler.toml

Replace the placeholder IDs in `wrangler.toml`:

```toml
# KV namespace for user feedback storage
[[kv_namespaces]]
binding = "FEEDBACK"
id = "YOUR_PRODUCTION_ID_HERE"
preview_id = "YOUR_PREVIEW_ID_HERE"
```

### 3. Deploy Worker

```bash
cd /home/gat0r/bunnygod
wrangler deploy workers/ask/index.ts
```

### 4. Test Locally

```bash
# Start local dev server
wrangler dev workers/ask/index.ts

# In another terminal, test the endpoint
curl -X POST http://localhost:8787/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "questionHash": "test123",
    "rating": "helpful",
    "timestamp": 1701234567890,
    "sessionId": "session-test-123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

## Data Schema

### FeedbackData Interface

```typescript
interface FeedbackData {
  questionHash: string;      // Simple hash of question (client-side)
  rating: 'helpful' | 'not-helpful';
  timestamp: number;         // Unix timestamp (ms)
  sessionId?: string;        // Browser session identifier
  userAgent?: string;        // User's browser/device
  country?: string;          // User's country (from Cloudflare)
}
```

### Privacy Features

1. **Question Hashing**: Questions are hashed client-side using a simple hash function (not cryptographic, but provides basic privacy)
2. **No PII**: No personally identifiable information collected
3. **Anonymous Sessions**: Session IDs are randomly generated browser-local identifiers
4. **Geographic Data**: Only country-level data from Cloudflare (no IP addresses stored)
5. **Automatic Expiry**: All data expires after 30 days

## Rate Limiting

- **Per Session, Per Question**: Users can only rate each question once per session
- **Session Persistence**: 7 days
- **Implementation**: Separate KV keys for rate limiting
- **User Experience**: Graceful handling with informative error messages

## Analytics & Querying

### Query Feedback Data

Use Wrangler CLI to query stored feedback:

```bash
# List all feedback keys (first 1000)
wrangler kv:key list --binding=FEEDBACK --prefix="feedback:"

# Get specific feedback entry
wrangler kv:key get "feedback:abc123:1701234567890" --binding=FEEDBACK

# Get all feedback for a specific question hash
wrangler kv:key list --binding=FEEDBACK --prefix="feedback:abc123:"
```

### Analytics Queries

To analyze feedback data, you can:

1. **Export All Feedback**:
   ```bash
   # List all keys and export to file
   wrangler kv:key list --binding=FEEDBACK --prefix="feedback:" > feedback_keys.json
   ```

2. **Aggregate Statistics**:
   - Build a script to fetch all feedback entries
   - Parse JSON and calculate:
     - Helpful vs. Not Helpful ratio
     - Feedback volume over time
     - Country-based analytics
     - User agent analytics (mobile vs. desktop)

3. **Future Improvements**:
   - Integration with Cloudflare Analytics Engine
   - Real-time dashboard for feedback metrics
   - Question quality scoring based on feedback
   - A/B testing different answer formats

### Example Analytics Script

```typescript
// feedback-analytics.ts
// Run with: bun run feedback-analytics.ts

interface FeedbackData {
  questionHash: string;
  rating: 'helpful' | 'not-helpful';
  timestamp: number;
  sessionId?: string;
  userAgent?: string;
  country?: string;
}

async function analyzeFeedback() {
  // Fetch all feedback keys using wrangler kv:key list
  // Parse and aggregate statistics

  const stats = {
    totalFeedback: 0,
    helpful: 0,
    notHelpful: 0,
    byCountry: new Map<string, { helpful: number; notHelpful: number }>(),
    byDate: new Map<string, { helpful: number; notHelpful: number }>(),
  };

  // Implementation here...

  return stats;
}
```

## Testing Checklist

- [ ] FeedbackButtons render correctly after answer display
- [ ] Thumbs up button submits "helpful" rating
- [ ] Thumbs down button submits "not-helpful" rating
- [ ] Visual feedback shows selected state
- [ ] Success message appears after submission
- [ ] Can only rate once per question per session
- [ ] localStorage prevents duplicate ratings on page reload
- [ ] Rate limiting works on backend (429 status)
- [ ] KV stores feedback data correctly
- [ ] Data expires after 30 days (TTL works)
- [ ] Works on mobile devices
- [ ] No console errors

## API Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid questionHash"
}
```

### 429 Too Many Requests
```json
{
  "error": "Already rated this question",
  "rating": "helpful"
}
```

### 503 Service Unavailable
```json
{
  "error": "Feedback storage not configured"
}
```

## Future Enhancements

1. **Admin Dashboard**
   - View real-time feedback statistics
   - Identify questions with poor ratings for improvement
   - Export feedback data for analysis

2. **Machine Learning Integration**
   - Train models on highly-rated answers
   - Predict answer quality before showing to users
   - Personalized answer generation

3. **Advanced Analytics**
   - Sentiment analysis on feedback patterns
   - A/B testing different answer formats
   - User retention correlation with feedback

4. **Social Features**
   - "Most helpful" badge for top-rated answers
   - Share highly-rated answers
   - Community voting system

## Troubleshooting

### Issue: "Feedback storage not configured"

**Solution**: Ensure KV namespace is created and bound correctly in wrangler.toml

```bash
# Check KV namespace exists
wrangler kv:namespace list

# Verify binding in wrangler.toml
cat wrangler.toml | grep -A 3 "FEEDBACK"
```

### Issue: Feedback not persisting

**Solution**: Check localStorage and KV storage

```javascript
// In browser console
localStorage.getItem('feedback:YOUR_QUESTION_HASH')

// In wrangler CLI
wrangler kv:key list --binding=FEEDBACK --prefix="feedback:"
```

### Issue: Rate limiting not working

**Solution**: Verify session ID generation and rate limit keys

```javascript
// In browser console
sessionStorage.getItem('bunny-session-id')

// Check rate limit keys in KV
wrangler kv:key list --binding=FEEDBACK --prefix="ratelimit:"
```

## Security Considerations

1. **Input Validation**: All inputs validated on backend
2. **Rate Limiting**: Prevents spam and abuse
3. **No PII Collection**: Privacy-first design
4. **TTL Enforcement**: Automatic data expiry
5. **CORS Protection**: Proper CORS headers configured
6. **Question Hashing**: Questions hashed for privacy (not cryptographic strength, but adds obscurity)

---

**Last Updated**: 2025-12-01
**Version**: 1.0.0
**Status**: Production Ready (pending KV namespace creation)
