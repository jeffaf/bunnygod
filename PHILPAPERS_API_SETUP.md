# PhilPapers API Integration Guide

## Overview

Bunny God now supports **PhilPapers.org**, the world's largest philosophy research database with over 2.96 million academic papers. This provides more relevant and specialized philosophical content compared to general academic databases.

## Features

- **Primary Source**: PhilPapers.org API for specialized philosophy papers
- **Automatic Fallback**: Falls back to CrossRef if PhilPapers is unavailable or credentials not provided
- **Source Tracking**: Logs which API was used for each request
- **Graceful Degradation**: System continues to work even without PhilPapers credentials

## API Registration

### Step 1: Register for PhilPapers API Access

1. Visit the PhilPapers API documentation page: https://philpapers.org/help/api.html
2. Contact PhilPapers to request API credentials
3. You will receive:
   - `apiId` - Your unique API identifier
   - `apiKey` - Your API authentication key

### Step 2: Configure Environment Variables

#### For Cloudflare Workers (Production)

Add the credentials to your `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
PHILPAPERS_API_ID = "your_api_id_here"
PHILPAPERS_API_KEY = "your_api_key_here"
```

Or use Cloudflare Dashboard:
1. Go to your Worker settings in Cloudflare Dashboard
2. Navigate to Settings > Variables
3. Add environment variables:
   - `PHILPAPERS_API_ID`
   - `PHILPAPERS_API_KEY`

#### For Local Development

Create a `.dev.vars` file in the `workers/ask/` directory:

```bash
PHILPAPERS_API_ID=your_api_id_here
PHILPAPERS_API_KEY=your_api_key_here
```

**Note**: Never commit this file to version control!

### Step 3: Deploy

Deploy your Worker with the new credentials:

```bash
cd workers/ask
wrangler deploy
```

## How It Works

### API Selection Logic

```typescript
1. If PHILPAPERS_API_ID and PHILPAPERS_API_KEY are provided:
   → Try PhilPapers API first
   → If successful, return PhilPapers results
   → If fails, fall back to CrossRef

2. If credentials NOT provided:
   → Use CrossRef API directly
   → Log warning about missing credentials
```

### Response Format

The API returns a `PhilPapersSearchResult` with:

```typescript
{
  papers: PhilPaper[];      // Array of paper objects
  total: number;            // Total results available
  source?: 'philpapers' | 'crossref';  // Which API was used
}
```

Each `PhilPaper` object contains:

```typescript
{
  title: string;           // Paper title
  authors: string;         // Formatted author names
  abstract?: string;       // Paper abstract (if available)
  url: string;            // Link to full paper
  year?: number;          // Publication year
  categories?: string[];  // Subject categories
}
```

## API Endpoints

### PhilPapers API

**Endpoint**: `https://philpapers.org/philpapers/api/search`

**Parameters**:
- `apiId` - Your API ID (required)
- `apiKey` - Your API key (required)
- `searchStr` - Search query string
- `limit` - Number of results to return
- `format` - Response format (json)

**Example**:
```
https://philpapers.org/philpapers/api/search?apiId=YOUR_ID&apiKey=YOUR_KEY&searchStr=free%20will&limit=5&format=json
```

### CrossRef API (Fallback)

**Endpoint**: `https://api.crossref.org/works`

**Parameters**:
- `query` - Search query (enhanced with philosophy keywords)
- `rows` - Number of results
- `select` - Fields to return
- `sort` - Sort order (relevance)

**No authentication required** for CrossRef.

## Monitoring & Debugging

### Check Which API Was Used

The system logs indicate which API source was used:

```
✅ Successfully retrieved papers from PhilPapers API
```

or

```
⚠️ PhilPapers credentials not provided, using CrossRef
✅ Successfully retrieved papers from CrossRef
```

### Common Issues

**Problem**: "PhilPapers API error: 403"
- **Solution**: Check that your API credentials are correct and active

**Problem**: "PhilPapers credentials not provided"
- **Solution**: Add `PHILPAPERS_API_ID` and `PHILPAPERS_API_KEY` to environment variables

**Problem**: API returns no results
- **Solution**: The system will automatically fall back to CrossRef

## Development Notes

### Response Format Flexibility

The PhilPapers API implementation includes flexible response parsing to handle variations in the API response format:

```typescript
// Handles multiple possible field names
title: item.title || 'Untitled'
authors: item.authors || item.author || []
abstract: item.abstract || item.description || ''
url: item.url || item.link || `https://philpapers.org/rec/${item.id}`
year: item.year || item.pubYear || undefined
categories: item.categories || item.topics || []
```

### Author Formatting

The system includes specialized author formatting for both APIs:

- **PhilPapers**: Handles both string arrays and object formats
- **CrossRef**: Handles `{ given, family }` format
- Both limit to 3 authors + "et al." for readability

## Security Best Practices

1. **Never commit API credentials** to version control
2. Use `.dev.vars` for local development
3. Store production credentials in Cloudflare Dashboard
4. Rotate API keys periodically
5. Monitor API usage for anomalies

## Future Enhancements

Potential improvements for the PhilPapers integration:

- [ ] Add category-specific search
- [ ] Implement pagination for large result sets
- [ ] Cache PhilPapers results for longer (philosophy papers change slowly)
- [ ] Add author-specific search capabilities
- [ ] Implement date range filtering
- [ ] Add citation count sorting (if available in API)

## Support

- **PhilPapers API Documentation**: https://philpapers.org/help/api.html
- **PhilPapers Support**: Contact through their website
- **CrossRef API Documentation**: https://api.crossref.org/swagger-ui/index.html

## Testing

Test the integration:

```bash
# Local testing
cd workers/ask
wrangler dev

# Make a test request
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the nature of free will?"}'
```

Check the logs to see which API source was used and verify the response quality.
