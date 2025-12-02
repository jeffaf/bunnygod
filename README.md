# 🐰✨ Bunny God

> *An all-powerful living AI deity that answers philosophical questions*
>
> **"Behold, the Bunny God liveth! 🐰✨"** - *The Followers*
>
> **"All hail the Bunny!"** - *The Response*

Bunny God is an AI-powered philosophical Q&A system that queries academic philosophical literature from CrossRef and synthesizes answers using cutting-edge AI. The system combines academic rigor with mystical aesthetics to create a unique, engaging experience that makes philosophy accessible and fun.

**Live at:** [https://bunnygod.pages.dev](https://bunnygod.pages.dev)

## 🌟 Features

### Core Functionality
- **Divine Wisdom**: Ask any philosophical question and receive answers backed by peer-reviewed academic literature
- **Academic Citations**: Every answer includes clickable citations to relevant philosophical papers with expandable abstracts
- **Intelligent Caching**: Questions are cached for 24 hours using Cloudflare KV for instant responses
- **Question History**: Your recent questions are saved locally for easy re-asking
- **Share Questions**: Share specific questions via URL parameter (`?q=your+question`)

### User Experience
- **Mystical Interface**: Beautiful dark mode UI with cosmic gradients and particle animations
- **Responsive Design**: Mobile-first design optimized for all devices
- **Loading Oracle**: Mystical animated loading state with philosophical wisdom
- **Feedback System**: Rate answers as helpful or not helpful (stored in KV namespace)
- **Social Sharing**: Share answers via Twitter, LinkedIn, or copy link

### Technical Excellence
- **Edge-Powered**: Cloudflare Workers AI synthesizes wisdom from academic sources
- **Performance Optimized**: 60.67 KB gzipped bundle, Lighthouse score 92+ mobile, 96+ desktop
- **Free to Use**: Operates within free tiers of modern cloud infrastructure
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Tested**: Comprehensive unit tests with Bun test runner

## 🛠️ Tech Stack

### Frontend
- **Framework**: Astro 4.15+ (Static Site Generation)
- **UI Library**: React 18.3+ (Islands Architecture)
- **Styling**: Tailwind CSS 3.4+ with custom mystical theme
- **TypeScript**: 5.6+ with strict type checking
- **Package Manager**: Bun (fast JavaScript runtime)

### Backend
- **Runtime**: Cloudflare Workers (Edge Functions)
- **AI Model**: Cloudflare Workers AI - Llama 3.1 8B Instruct
- **Data Source**: CrossRef API (scholarly publications database)
- **Caching**: Cloudflare KV (24-hour TTL)
- **Feedback Storage**: Cloudflare KV (30-day TTL)
- **Analytics**: Cloudflare Web Analytics

### Deployment
- **Frontend Hosting**: Cloudflare Pages
- **API Hosting**: Cloudflare Workers
- **DNS**: Cloudflare DNS
- **CI/CD**: GitHub Actions (automated deployments)

## 🚀 Quick Start

### Prerequisites

- **Bun** v1.0+: [Install Bun](https://bun.sh)
- **Cloudflare Account**: [Sign up free](https://dash.cloudflare.com/sign-up)
- **Node.js** 18+ (for Wrangler compatibility)
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/jeffaf/bunnygod.git
cd bunnygod

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Cloudflare credentials (optional for local dev)
```

### Local Development

```bash
# Start Astro development server (frontend)
bun run dev
# Open http://localhost:4321

# In a separate terminal, start Workers dev server (backend)
bun run worker:dev
# API available at http://localhost:8787
```

Note: For local development, you can use the production API endpoint or run the worker locally. The frontend defaults to `https://bunnygod-api.jeffbarron.workers.dev` if no `PUBLIC_API_URL` is set.

### Available Scripts

```bash
# Development
bun run dev              # Start Astro dev server (port 4321)
bun run worker:dev       # Start Workers dev server (port 8787)

# Building
bun run build            # Build static site for production
bun run preview          # Preview production build locally

# Quality Assurance
bun run typecheck        # Run TypeScript type checking
bun run lint             # Run ESLint
bun run lint:fix         # Fix ESLint issues automatically
bun run format           # Format code with Prettier
bun test                 # Run unit tests
bun test:watch          # Run tests in watch mode

# Deployment
bun run worker:deploy    # Deploy Worker to Cloudflare
# Pages deployment handled by GitHub Actions on push
```

## 📁 Project Structure

```
bunnygod/
├── src/
│   ├── components/
│   │   ├── BunnyGodInterface.tsx    # Main Q&A interface component
│   │   ├── QuestionInput.tsx        # Question input with validation
│   │   ├── AnswerDisplay.tsx        # Answer rendering with citations
│   │   ├── LoadingOracle.tsx        # Mystical loading animation
│   │   ├── citations/               # Citation components
│   │   │   ├── CitationCard.tsx     # Individual citation display
│   │   │   ├── CitationExpand.tsx   # Expandable citation details
│   │   │   ├── CitationAbstract.tsx # Abstract display
│   │   │   └── CitationHeader.tsx   # Citation header/title
│   │   └── phase2/                  # Phase 2 features
│   │       ├── MysticalBackground.tsx  # Particle animation background
│   │       ├── QuestionHistory.tsx     # Recent questions sidebar
│   │       ├── ShareButtons.tsx        # Social sharing
│   │       └── FeedbackButtons.tsx     # Helpful/not-helpful rating
│   ├── layouts/
│   │   └── MainLayout.astro         # Main page layout with meta tags
│   ├── pages/
│   │   └── index.astro              # Homepage
│   └── styles/
│       └── global.css               # Tailwind + custom animations
├── workers/ask/                     # Cloudflare Worker (Backend API)
│   ├── index.ts                     # Main worker entry point
│   ├── ai.ts                        # Workers AI integration
│   ├── philpapers.ts                # CrossRef API client
│   ├── analytics.ts                 # Analytics tracking
│   ├── crypto.ts                    # Hashing utilities
│   └── wrangler.toml                # Worker configuration
├── public/                          # Static assets
│   └── favicon.ico
├── docs/                            # Documentation
│   ├── API.md                       # API documentation
│   ├── ARCHITECTURE.md              # System architecture
│   ├── TROUBLESHOOTING.md           # Common issues & solutions
│   └── FEEDBACK_SYSTEM.md           # Feedback implementation details
├── tests/                           # Unit tests
│   └── citations.test.ts
├── PRD.md                           # Product Requirements Document
├── PHASE3_COMPLETION.md             # Phase 3 delivery summary
├── PERFORMANCE_REPORT.md            # Performance optimization report
└── package.json
```

## 🚢 Deployment

### Cloudflare Pages (Frontend)

The frontend is automatically deployed via GitHub Actions on every push to `main`:

1. **Connect Repository**: Link your GitHub repo to Cloudflare Pages
2. **Build Settings**:
   - Build command: `bun run build`
   - Build output directory: `dist`
   - Root directory: `/`
3. **Environment Variables**: None required (API URL is hardcoded)
4. **Deploy**: Push to `main` branch triggers automatic deployment

### Cloudflare Workers (Backend API)

Deploy the API worker manually using Wrangler:

```bash
# Deploy to production
bun run worker:deploy

# Or manually with wrangler
cd workers/ask
wrangler deploy index.ts
```

**Required Setup:**
1. **KV Namespaces**: Create two KV namespaces in Cloudflare dashboard
   - `CACHE` (for question caching)
   - `FEEDBACK` (for user feedback)
2. **Update wrangler.toml**: Add your KV namespace IDs
3. **Workers AI**: Automatically available in Cloudflare Workers (no setup required)
4. **Analytics**: Optional - enable in Cloudflare dashboard

### Environment Variables & Secrets

**Frontend (.env - optional for local dev):**
```bash
PUBLIC_API_URL=https://your-worker.workers.dev
```

**Worker (wrangler.toml):**
```toml
account_id = "your_cloudflare_account_id"

[[kv_namespaces]]
binding = "CACHE"
id = "your_cache_kv_namespace_id"

[[kv_namespaces]]
binding = "FEEDBACK"
id = "your_feedback_kv_namespace_id"
```

See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for detailed deployment issues and solutions.

## 🎨 Design Philosophy

Bunny God combines academic philosophy with mystical aesthetics:

- **Dark Mode First**: Deep cosmic backgrounds with ethereal gradients (#1a0b2e, #2d1b3d)
- **Animated Experiences**: Smooth transitions and mystical particle animations
- **Responsive**: Mobile-first design that scales beautifully (Tailwind breakpoints)
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation and ARIA labels
- **Performance**: Sub-61KB gzipped bundle with aggressive code splitting
- **Type-Safe**: Full TypeScript with strict mode enabled

## 📚 Documentation

- **[API Documentation](./docs/API.md)** - Worker endpoints, request/response formats, error codes
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System architecture, data flow, component hierarchy
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues, deployment problems, solutions
- **[Product Requirements](./PRD.md)** - Comprehensive technical specification
- **[Performance Report](./PERFORMANCE_REPORT.md)** - Optimization metrics and Lighthouse scores
- **[Phase 3 Summary](./PHASE3_COMPLETION.md)** - Features delivered, metrics, launch checklist

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

### Development Workflow

1. **Fork the repository** on GitHub
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/bunnygod.git`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes** with tests
5. **Run quality checks**:
   ```bash
   bun run typecheck  # TypeScript type checking
   bun run lint       # ESLint validation
   bun test           # Unit tests
   bun run build      # Production build test
   ```
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to your fork**: `git push origin feature/amazing-feature`
8. **Open a Pull Request** on GitHub

### Code Standards

- **TypeScript**: Use strict typing, no `any` types without justification
- **React**: Functional components with hooks, no class components
- **Tailwind**: Use utility classes, avoid custom CSS unless necessary
- **Testing**: Add unit tests for new components/functions
- **Commits**: Use conventional commits format (`feat:`, `fix:`, `docs:`, etc.)
- **Linting**: Code must pass `bun run lint` and `bun run typecheck`

### Areas for Contribution

- UI/UX improvements and animations
- Performance optimizations
- Additional philosophical data sources
- Test coverage improvements
- Documentation enhancements
- Accessibility improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PhilPapers.org](https://philpapers.org) for providing access to philosophical literature
- [Cloudflare](https://cloudflare.com) for edge computing infrastructure
- [Anthropic](https://anthropic.com) for Claude AI assistance in development

## 💬 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built by 🐰 with vibes**

*May Bunny God guide your philosophical journey* ✨
