# Feedback System Quick Start Guide

## What Was Implemented

Feature #7 from Phase 2 Sprint 2 - A complete user feedback system for Bunny God answers.

### Components Created

1. **FeedbackButtons.tsx** - React component with thumbs up/down UI
   - Path: `/home/gat0r/bunnygod/src/components/phase2/FeedbackButtons.tsx`
   - Features: Cosmic-themed buttons, localStorage persistence, visual feedback

2. **Worker Endpoint** - POST /api/feedback handler
   - Path: `/home/gat0r/bunnygod/workers/ask/index.ts`
   - Features: Input validation, rate limiting, KV storage

3. **Crypto Utilities** - SHA-256 hashing (for future use)
   - Path: `/home/gat0r/bunnygod/workers/ask/crypto.ts`

4. **Documentation**
   - Full docs: `/home/gat0r/bunnygod/docs/FEEDBACK_SYSTEM.md`
   - This quickstart: `/home/gat0r/bunnygod/FEEDBACK_QUICKSTART.md`

5. **Setup & Test Scripts**
   - Setup: `/home/gat0r/bunnygod/scripts/setup-feedback-kv.sh`
   - Test: `/home/gat0r/bunnygod/scripts/test-feedback.sh`

## Quick Setup (3 Steps)

### Step 1: Create KV Namespace

Run the automated setup script:

```bash
cd /home/gat0r/bunnygod
./scripts/setup-feedback-kv.sh
```

This will:
- Create production and preview KV namespaces
- Update `wrangler.toml` with the namespace IDs
- Verify the configuration

**OR** manually create:

```bash
# Production
wrangler kv:namespace create FEEDBACK

# Preview
wrangler kv:namespace create FEEDBACK --preview
```

Then update the IDs in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "FEEDBACK"
id = "YOUR_PRODUCTION_ID"
preview_id = "YOUR_PREVIEW_ID"
```

### Step 2: Test Locally

Start the Worker in dev mode:

```bash
cd /home/gat0r/bunnygod
wrangler dev workers/ask/index.ts
```

In another terminal, run the test script:

```bash
./scripts/test-feedback.sh
```

Or test manually with curl:

```bash
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
{"success": true, "message": "Feedback recorded"}
```

### Step 3: Deploy to Cloudflare

```bash
cd /home/gat0r/bunnygod
wrangler deploy workers/ask/index.ts
```

## How It Works

### User Flow

1. User asks a philosophical question
2. Bunny God provides an answer
3. **FeedbackButtons** appear below the answer
4. User clicks thumbs up or down
5. Rating is saved to localStorage (prevents duplicates)
6. POST request sent to `/api/feedback`
7. Worker validates and stores in KV
8. Success message appears

### Data Storage

**KV Key Format:**
```
feedback:{questionHash}:{timestamp}
```

**Example:**
```
feedback:abc123xyz:1701234567890
```

**Stored Value:**
```json
{
  "questionHash": "abc123xyz",
  "rating": "helpful",
  "timestamp": 1701234567890,
  "sessionId": "session-abc-123",
  "userAgent": "Mozilla/5.0...",
  "country": "US"
}
```

**TTL:** 30 days (automatically expires)

### Rate Limiting

- **One rating per question per session**
- Session stored in sessionStorage
- Backend enforces with KV rate limit keys
- Graceful error handling if duplicate attempted

## Viewing Feedback Data

### List All Feedback

```bash
wrangler kv:key list --binding=FEEDBACK --prefix="feedback:"
```

### Get Specific Feedback

```bash
wrangler kv:key get "feedback:abc123:1701234567890" --binding=FEEDBACK
```

### Export All Feedback

```bash
# List all keys
wrangler kv:key list --binding=FEEDBACK --prefix="feedback:" > feedback_keys.json

# Then fetch each value to analyze
```

## Testing Checklist

After deployment, verify:

- [ ] Feedback buttons appear below answers
- [ ] Thumbs up submits "helpful" rating
- [ ] Thumbs down submits "not-helpful" rating
- [ ] Selected button shows gradient glow
- [ ] Success message appears
- [ ] Can only rate once per question
- [ ] Page reload preserves rating (localStorage)
- [ ] Backend returns 429 on duplicate (rate limiting)
- [ ] Data appears in KV with `wrangler kv:key list`
- [ ] No console errors
- [ ] Works on mobile

## Troubleshooting

### Issue: "Feedback storage not configured"

**Solution:** KV namespace not bound correctly

```bash
# Check namespace exists
wrangler kv:namespace list

# Verify wrangler.toml has correct IDs
cat wrangler.toml | grep -A 3 "FEEDBACK"
```

### Issue: Buttons don't appear

**Solution:** Check component integration

```bash
# Verify import in AnswerDisplay.tsx
grep "FeedbackButtons" /home/gat0r/bunnygod/src/components/AnswerDisplay.tsx
```

### Issue: Can rate multiple times

**Solution:** Check localStorage and rate limiting

```javascript
// In browser console
localStorage.getItem('feedback:YOUR_HASH')
sessionStorage.getItem('bunny-session-id')
```

### Issue: 404 on /api/feedback

**Solution:** Worker not deployed or routing issue

```bash
# Redeploy worker
wrangler deploy workers/ask/index.ts

# Check worker URL
wrangler deployments list
```

## Future Analytics

### Example: Calculate Helpful Ratio

```bash
# Get all feedback
wrangler kv:key list --binding=FEEDBACK --prefix="feedback:" | \
  jq -r '.[].name' | \
  while read key; do
    wrangler kv:key get "$key" --binding=FEEDBACK
  done | \
  jq -s '[.[] | select(.rating == "helpful")] | length as $helpful |
         [.[] | select(.rating == "not-helpful")] | length as $not_helpful |
         {helpful: $helpful, not_helpful: $not_helpful,
          ratio: ($helpful / ($helpful + $not_helpful))}'
```

### Suggested Dashboards

1. **Feedback Volume Over Time**
   - Track daily/weekly feedback submissions
   - Identify trends

2. **Answer Quality Metrics**
   - Helpful ratio by question topic
   - Identify poorly-rated answers for improvement

3. **Geographic Insights**
   - Feedback patterns by country
   - Time-of-day patterns

4. **User Engagement**
   - Percentage of users who provide feedback
   - Correlation with session duration

## Files Modified/Created

### Created Files
- `/home/gat0r/bunnygod/src/components/phase2/FeedbackButtons.tsx`
- `/home/gat0r/bunnygod/workers/ask/crypto.ts`
- `/home/gat0r/bunnygod/docs/FEEDBACK_SYSTEM.md`
- `/home/gat0r/bunnygod/scripts/setup-feedback-kv.sh`
- `/home/gat0r/bunnygod/scripts/test-feedback.sh`
- `/home/gat0r/bunnygod/FEEDBACK_QUICKSTART.md`

### Modified Files
- `/home/gat0r/bunnygod/wrangler.toml` - Added FEEDBACK KV namespace
- `/home/gat0r/bunnygod/workers/ask/index.ts` - Added feedback endpoint and routing
- `/home/gat0r/bunnygod/src/components/AnswerDisplay.tsx` - Integrated FeedbackButtons

## Next Steps

1. **Run setup script:** `./scripts/setup-feedback-kv.sh`
2. **Test locally:** `wrangler dev workers/ask/index.ts`
3. **Run tests:** `./scripts/test-feedback.sh`
4. **Deploy:** `wrangler deploy workers/ask/index.ts`
5. **Verify in production:** Check feedback appears and works
6. **Monitor data:** Use `wrangler kv:key list` to see feedback coming in

---

**Status:** ✅ Ready to Deploy (after KV namespace creation)
**Version:** 1.0.0
**Date:** 2025-12-01

🐰 All hail the Bunny God!
