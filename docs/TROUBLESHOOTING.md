# Bunny God Troubleshooting Guide

This guide covers common issues, their causes, and solutions for developing and deploying the Bunny God application.

---

## Table of Contents

- [Deployment Issues](#deployment-issues)
  - [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
  - [Cloudflare Workers Deployment](#cloudflare-workers-deployment)
  - [KV Namespace Setup](#kv-namespace-setup)
- [Development Issues](#development-issues)
  - [Local Development Server](#local-development-server)
  - [Build Failures](#build-failures)
  - [Type Checking Errors](#type-checking-errors)
- [Runtime Issues](#runtime-issues)
  - [API Connection Problems](#api-connection-problems)
  - [Cache Not Working](#cache-not-working)
  - [Feedback System Errors](#feedback-system-errors)
- [Performance Issues](#performance-issues)
  - [Slow Page Load](#slow-page-load)
  - [Bundle Size Too Large](#bundle-size-too-large)
  - [Lighthouse Score Low](#lighthouse-score-low)
- [Analytics Issues](#analytics-issues)

---

## Deployment Issues

### Cloudflare Pages Deployment

#### Issue: Build fails with "command not found: bun"

**Cause:** Cloudflare Pages doesn't have Bun installed by default.

**Solution:**
1. Update build command in Cloudflare Pages dashboard
2. Use npm/yarn/pnpm instead, or install Bun during build:

```bash
# Option 1: Use npm (slower but works)
Build command: npm install && npm run build
Build output: dist

# Option 2: Install Bun during build (faster)
Build command: curl -fsSL https://bun.sh/install | bash && ~/.bun/bin/bun install && ~/.bun/bin/bun run build
Build output: dist
```

**Recommended:** Use npm for Cloudflare Pages deployments due to better support.

---

#### Issue: "PUBLIC_API_URL is undefined" in production

**Cause:** Environment variable not set in Cloudflare Pages.

**Solution:**
1. Go to Cloudflare Pages → Settings → Environment Variables
2. Add variable:
   - **Name:** `PUBLIC_API_URL`
   - **Value:** `https://bunnygod-api.jeffbarron.workers.dev`
3. Redeploy

**Note:** The frontend has a fallback default URL, so this is optional.

---

#### Issue: Pages deployment succeeds but shows blank page

**Cause:** Build output directory incorrect or JavaScript errors.

**Solution:**
1. **Check build output:**
   ```bash
   bun run build
   ls -la dist/  # Should contain index.html and _astro/ folder
   ```

2. **Verify build output setting:**
   - Cloudflare Pages → Settings → Builds & deployments
   - Build output directory: `dist` (not `dist/` or `/dist`)

3. **Check browser console:**
   - Open DevTools → Console
   - Look for JavaScript errors
   - Common cause: Module import path issues

4. **Test locally:**
   ```bash
   bun run build
   bun run preview  # Test production build locally
   ```

---

### Cloudflare Workers Deployment

#### Issue: "wrangler deploy" fails with authentication error

**Cause:** Not logged into Cloudflare via Wrangler CLI.

**Solution:**
```bash
# Login to Cloudflare
wrangler login

# Verify account
wrangler whoami

# Deploy
cd workers/ask
wrangler deploy index.ts
```

---

#### Issue: Worker deployed but returns 500 errors

**Cause:** Missing KV namespace bindings or incorrect configuration.

**Solution:**
1. **Check KV namespaces exist:**
   ```bash
   wrangler kv:namespace list
   ```

2. **Verify wrangler.toml configuration:**
   ```toml
   [[kv_namespaces]]
   binding = "CACHE"
   id = "your_actual_kv_namespace_id_here"

   [[kv_namespaces]]
   binding = "FEEDBACK"
   id = "your_actual_feedback_kv_id_here"
   ```

3. **Check worker logs:**
   ```bash
   wrangler tail
   ```
   Make a request and watch for errors in the logs.

4. **Test locally with KV:**
   ```bash
   cd workers/ask
   wrangler dev index.ts --local
   # Test with: curl -X POST http://localhost:8787 -d '{"question":"test?"}'
   ```

---

#### Issue: Worker exceeds CPU time limit

**Cause:** CrossRef API slow or AI processing taking too long.

**Solution:**
1. **Enable caching** - Most queries should hit cache after first request
2. **Add timeout to CrossRef fetch:**
   ```typescript
   const response = await fetch(searchUrl.toString(), {
     headers: { 'User-Agent': '...' },
     signal: AbortSignal.timeout(5000) // 5 second timeout
   });
   ```
3. **Monitor Workers dashboard** for CPU time usage
4. **Consider upgrading** to Workers Paid plan if consistently hitting limits

---

### KV Namespace Setup

#### Issue: "KV namespace not found" error

**Cause:** KV namespace not created or wrong ID in wrangler.toml.

**Solution:**
1. **Create KV namespaces:**
   ```bash
   # Create CACHE namespace
   wrangler kv:namespace create "CACHE"
   # Output: { binding = "CACHE", id = "abc123..." }

   # Create FEEDBACK namespace
   wrangler kv:namespace create "FEEDBACK"
   # Output: { binding = "FEEDBACK", id = "def456..." }
   ```

2. **Update wrangler.toml with IDs:**
   ```toml
   [[kv_namespaces]]
   binding = "CACHE"
   id = "abc123..."  # Use actual ID from step 1

   [[kv_namespaces]]
   binding = "FEEDBACK"
   id = "def456..."  # Use actual ID from step 1
   ```

3. **Deploy worker:**
   ```bash
   wrangler deploy index.ts
   ```

---

#### Issue: Preview/dev environment can't access KV

**Cause:** No preview KV namespaces configured.

**Solution:**
1. **Create preview KV namespaces:**
   ```bash
   wrangler kv:namespace create "CACHE" --preview
   wrangler kv:namespace create "FEEDBACK" --preview
   ```

2. **Add preview IDs to wrangler.toml:**
   ```toml
   [[kv_namespaces]]
   binding = "CACHE"
   id = "production_id_here"
   preview_id = "preview_id_here"

   [[kv_namespaces]]
   binding = "FEEDBACK"
   id = "production_id_here"
   preview_id = "preview_id_here"
   ```

---

## Development Issues

### Local Development Server

#### Issue: "Port 4321 already in use"

**Cause:** Previous dev server still running or port conflict.

**Solution:**
```bash
# Option 1: Kill existing process
lsof -ti:4321 | xargs kill -9

# Option 2: Use different port
bun run dev -- --port 3000
```

---

#### Issue: Hot reload not working

**Cause:** File watcher issues or Bun/Astro bug.

**Solution:**
1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   bun run dev
   ```

2. **Clear Astro cache:**
   ```bash
   rm -rf .astro
   bun run dev
   ```

3. **Check file system limits (Linux):**
   ```bash
   # Increase file watcher limit
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

---

#### Issue: API calls fail in local development

**Cause:** CORS or worker not running.

**Solution:**
1. **Start worker dev server:**
   ```bash
   # In separate terminal
   cd workers/ask
   wrangler dev index.ts --local --port 8787
   ```

2. **Update frontend API URL:**
   ```bash
   # Create .env file
   echo "PUBLIC_API_URL=http://localhost:8787" > .env
   ```

3. **Restart Astro dev server** to pick up env changes

4. **Test worker directly:**
   ```bash
   curl -X POST http://localhost:8787 \
     -H "Content-Type: application/json" \
     -d '{"question":"What is philosophy?"}'
   ```

---

### Build Failures

#### Issue: "Module not found" during build

**Cause:** Missing dependency or incorrect import path.

**Solution:**
1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules bun.lock
   bun install
   ```

2. **Check import paths** (case-sensitive on Linux):
   ```typescript
   // Wrong
   import Component from './Component.tsx'  // .tsx extension

   // Correct
   import Component from './Component'  // No extension
   ```

3. **Verify file exists:**
   ```bash
   ls -la src/components/YourComponent.tsx
   ```

---

#### Issue: TypeScript errors during build

**Cause:** Type errors in code.

**Solution:**
1. **Run type checking separately:**
   ```bash
   bun run typecheck
   ```

2. **Fix type errors** shown in output

3. **Common fixes:**
   ```typescript
   // Issue: 'any' type
   const data: any = await response.json()  // ❌

   // Fix: Proper typing
   interface ApiResponse {
     answer: string;
     sources: Source[];
   }
   const data = await response.json() as ApiResponse  // ✅
   ```

---

### Type Checking Errors

#### Issue: "Cannot find module 'astro:content'" or similar

**Cause:** Missing Astro type declarations.

**Solution:**
1. **Ensure env.d.ts exists:**
   ```typescript
   // src/env.d.ts
   /// <reference types="astro/client" />
   ```

2. **Restart TypeScript server:**
   - VSCode: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

3. **Reinstall @astrojs/check:**
   ```bash
   bun install --force @astrojs/check
   ```

---

## Runtime Issues

### API Connection Problems

#### Issue: "Failed to fetch" error in browser

**Cause:** CORS, network issue, or incorrect API URL.

**Solution:**
1. **Check browser console** for detailed error

2. **Verify API URL:**
   ```typescript
   // In BunnyGodInterface.tsx
   const apiUrl = import.meta.env.PUBLIC_API_URL ||
                  'https://bunnygod-api.jeffbarron.workers.dev';
   console.log('API URL:', apiUrl);
   ```

3. **Test API directly:**
   ```bash
   curl -X POST https://bunnygod-api.jeffbarron.workers.dev \
     -H "Content-Type: application/json" \
     -d '{"question":"What is consciousness?"}'
   ```

4. **Check worker status:**
   - Visit: https://dash.cloudflare.com → Workers
   - Check if worker is healthy and processing requests

---

#### Issue: API returns 500 errors intermittently

**Cause:** CrossRef API timeout or Workers AI failure.

**Solution:**
1. **Check worker logs:**
   ```bash
   wrangler tail
   ```

2. **Common causes:**
   - CrossRef API down (check https://status.crossref.org)
   - Workers AI rate limit hit
   - Network timeout

3. **Implement retry logic** (if not present):
   ```typescript
   async function fetchWithRetry(url: string, options: any, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await fetch(url, options);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(r => setTimeout(r, 1000 * (i + 1)));
       }
     }
   }
   ```

---

### Cache Not Working

#### Issue: Same question returns different answers

**Cause:** Cache disabled or question hash collision.

**Solution:**
1. **Verify KV namespace exists and is bound:**
   ```bash
   wrangler kv:namespace list
   ```

2. **Check worker logs** for cache hits/misses:
   ```bash
   wrangler tail
   ```

3. **Test cache manually:**
   ```bash
   # First request (should be slow, cached: false)
   curl -X POST https://bunnygod-api.jeffbarron.workers.dev \
     -d '{"question":"What is time?"}' | jq .cached

   # Second request (should be fast, cached: true)
   curl -X POST https://bunnygod-api.jeffbarron.workers.dev \
     -d '{"question":"What is time?"}' | jq .cached
   ```

4. **Clear KV cache if needed:**
   ```bash
   wrangler kv:key delete --namespace-id=YOUR_CACHE_ID "answer:HASH_HERE"
   ```

---

### Feedback System Errors

#### Issue: "Feedback storage not configured" error

**Cause:** FEEDBACK KV namespace not bound to worker.

**Solution:**
1. **Check wrangler.toml:**
   ```toml
   [[kv_namespaces]]
   binding = "FEEDBACK"
   id = "your_feedback_kv_id"
   ```

2. **Redeploy worker:**
   ```bash
   wrangler deploy index.ts
   ```

3. **Verify in dashboard:**
   - Cloudflare → Workers → Your Worker → Settings → Variables
   - Should see FEEDBACK KV namespace binding

---

#### Issue: "Already rated this question" even for new session

**Cause:** sessionId collision or rate limit key not expiring.

**Solution:**
1. **Generate unique session IDs:**
   ```typescript
   // Use crypto.randomUUID() for session IDs
   const sessionId = crypto.randomUUID();
   ```

2. **Clear rate limit key manually:**
   ```bash
   wrangler kv:key delete \
     --namespace-id=YOUR_FEEDBACK_ID \
     "ratelimit:SESSION_ID:QUESTION_HASH"
   ```

3. **Check rate limit TTL** (should be 7 days):
   ```typescript
   await env.FEEDBACK.put(rateLimitKey, body.rating, {
     expirationTtl: 604800, // 7 days
   });
   ```

---

## Performance Issues

### Slow Page Load

#### Issue: Page takes >3 seconds to load

**Cause:** Large bundle, slow network, or unoptimized assets.

**Solution:**
1. **Check bundle size:**
   ```bash
   bun run build
   # Check output for file sizes
   ```

2. **Verify code splitting is working:**
   ```javascript
   // astro.config.mjs should have:
   vite: {
     build: {
       cssCodeSplit: true,
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom'],
           },
         },
       },
     },
   }
   ```

3. **Check Lighthouse score:**
   - Chrome DevTools → Lighthouse → Run audit
   - Target: 90+ mobile, 95+ desktop

4. **Enable Cloudflare optimizations:**
   - Dashboard → Speed → Optimization
   - Enable Auto Minify (JS, CSS, HTML)
   - Enable Brotli compression

---

### Bundle Size Too Large

#### Issue: Bundle exceeds 200KB gzipped

**Cause:** Unused dependencies or large imports.

**Solution:**
1. **Analyze bundle:**
   ```bash
   bun run build
   # Check _astro/*.js file sizes
   ```

2. **Remove unused dependencies:**
   ```bash
   # Check for unused packages
   npm install -g depcheck
   depcheck
   ```

3. **Use dynamic imports** for heavy components:
   ```typescript
   // Instead of:
   import HeavyComponent from './HeavyComponent';

   // Use:
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

4. **Optimize Tailwind:**
   ```javascript
   // tailwind.config.mjs
   module.exports = {
     content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
     // Purge unused styles
   }
   ```

---

### Lighthouse Score Low

#### Issue: Lighthouse performance score <90

**Cause:** Unoptimized loading strategy or large resources.

**Solution:**
1. **Use client:idle for non-critical components:**
   ```astro
   <!-- Instead of client:load -->
   <BunnyGodInterface client:idle />
   <MysticalBackground client:idle />
   ```

2. **Optimize font loading:**
   ```html
   <!-- Preload critical fonts -->
   <link rel="preload" href="..." as="font" crossorigin>

   <!-- Use display=swap -->
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
   ```

3. **Add resource hints:**
   ```html
   <link rel="preconnect" href="https://bunnygod-api.jeffbarron.workers.dev">
   ```

4. **Run performance report:**
   ```bash
   bun run build
   bun run preview
   # Open Chrome DevTools → Lighthouse → Analyze
   ```

See [PERFORMANCE_REPORT.md](../PERFORMANCE_REPORT.md) for detailed optimization guide.

---

## Analytics Issues

### Issue: Cloudflare Analytics not showing data

**Cause:** Analytics not enabled or needs time to populate.

**Solution:**
1. **Enable Web Analytics:**
   - Cloudflare → Analytics → Web Analytics
   - Add site: bunnygod.pages.dev

2. **Wait 24 hours** for data to populate

3. **Check beacon is loaded:**
   - View page source
   - Search for "cloudflare/beacon" script
   - Should be present in `<head>`

---

### Issue: Workers Analytics not tracking custom events

**Cause:** Analytics Engine not configured.

**Solution:**
1. **Enable Analytics Engine:**
   - Cloudflare Dashboard → Workers → Analytics Engine
   - Create dataset

2. **Uncomment in wrangler.toml:**
   ```toml
   [[analytics_engine_datasets]]
   binding = "ANALYTICS"
   ```

3. **Redeploy worker:**
   ```bash
   wrangler deploy index.ts
   ```

4. **Verify binding:**
   ```bash
   wrangler tail
   # Look for analytics.writeDataPoint() calls
   ```

---

## Getting More Help

If your issue isn't covered here:

1. **Check worker logs:**
   ```bash
   wrangler tail
   ```

2. **Check browser console:**
   - Chrome DevTools → Console
   - Look for errors and warnings

3. **Enable development mode:**
   ```toml
   # workers/ask/wrangler.toml
   [vars]
   ENVIRONMENT = "development"  # Shows detailed errors
   ```

4. **Test in isolation:**
   - Frontend: `bun run dev` (test UI without API)
   - Worker: `wrangler dev --local` (test API without frontend)

5. **Open GitHub issue:**
   - https://github.com/jeffaf/bunnygod/issues
   - Include error messages, logs, and steps to reproduce

6. **Check Cloudflare status:**
   - https://www.cloudflarestatus.com/
   - Verify services are operational

---

## Useful Commands Cheat Sheet

```bash
# Development
bun run dev              # Start frontend dev server
bun run worker:dev       # Start worker dev server

# Building
bun run build            # Build frontend
bun run preview          # Preview production build

# Testing
bun test                 # Run unit tests
bun run typecheck        # Type checking
bun run lint             # Lint code

# Deployment
wrangler deploy index.ts # Deploy worker
wrangler tail            # View worker logs
wrangler kv:namespace list  # List KV namespaces

# Debugging
wrangler dev --local     # Test worker locally
wrangler kv:key list --namespace-id=ID  # List KV keys
wrangler kv:key get --namespace-id=ID "key"  # Get KV value

# Cleanup
rm -rf .astro node_modules bun.lock  # Clean cache
bun install              # Reinstall dependencies
```

---

**Last Updated:** 2025-12-01
**Maintained by:** Daniel Miessler
