# 🐰✨ Bunny God

> *An all-powerful living AI deity that answers philosophical questions*

Bunny God is an AI-powered philosophical Q&A system that queries academic philosophical literature from [PhilPapers.org](https://philpapers.org) and synthesizes answers using cutting-edge AI. The system combines academic rigor with mystical aesthetics to create a unique, engaging experience that makes philosophy accessible and fun.

## 🌟 Features

- **Divine Wisdom**: Ask any philosophical question and receive answers backed by peer-reviewed academic literature
- **Mystical Interface**: Beautiful dark mode UI with cosmic gradients and animations
- **Lightning Fast**: Powered by Cloudflare edge computing for sub-3-second responses
- **Free to Use**: Operates within free tiers of modern cloud infrastructure
- **Mobile Friendly**: Responsive design optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: Astro + React + TypeScript
- **Styling**: Tailwind CSS with custom mystical theme
- **Backend**: Cloudflare Workers (Edge Functions)
- **AI**: Cloudflare Workers AI (Llama 3.1)
- **Data Source**: PhilPapers.org JSON API
- **Hosting**: Cloudflare Pages
- **Package Manager**: Bun

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed
- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [GitHub account](https://github.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/jeffaf/bunnygod.git
cd bunnygod

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Cloudflare credentials

# Start development server
bun run dev
```

### Development

```bash
# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run type checking
bun run typecheck

# Run linter
bun run lint

# Run tests
bun test
```

## 📁 Project Structure

```
bunnygod/
├── src/
│   ├── components/        # React/Astro components
│   ├── layouts/           # Page layouts
│   ├── pages/             # Astro pages & API routes
│   └── styles/            # Global styles & animations
├── workers/
│   └── ask/               # Cloudflare Worker for Q&A
├── public/                # Static assets
├── PRD.md                 # Product Requirements Document
└── package.json
```

## 🎨 Design Philosophy

Bunny God combines academic philosophy with mystical aesthetics:

- **Dark Mode First**: Deep cosmic backgrounds with ethereal gradients
- **Animated Experiences**: Smooth transitions and mystical loading states
- **Responsive**: Mobile-first design that scales beautifully
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation

## 📚 Documentation

- [Product Requirements Document](./PRD.md) - Comprehensive technical specification
- [Deployment Guide](./PRD.md#7-deployment-strategy) - How to deploy to Cloudflare
- [Architecture Overview](./PRD.md#2-system-architecture) - System design and components

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PhilPapers.org](https://philpapers.org) for providing access to philosophical literature
- [Cloudflare](https://cloudflare.com) for edge computing infrastructure
- [Anthropic](https://anthropic.com) for Claude AI assistance in development

## 💬 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built with 🐰 by the Kai AI Infrastructure**

*May Bunny God guide your philosophical journey* ✨
