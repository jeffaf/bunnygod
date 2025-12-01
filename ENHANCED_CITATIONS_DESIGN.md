# Enhanced Citations UI Design Specification

**Project:** Bunny God - AI Philosophical Q&A System
**Feature:** Enhanced Citations UI (Phase 2 Sprint 2, Feature #6)
**Version:** 1.0
**Date:** 2025-12-01
**Status:** Ready for Engineering Handoff

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Design Philosophy](#design-philosophy)
3. [Visual Specification](#visual-specification)
4. [Component Structure](#component-structure)
5. [Color & Typography](#color--typography)
6. [Interaction Design](#interaction-design)
7. [Responsive Behavior](#responsive-behavior)
8. [Accessibility Standards](#accessibility-standards)
9. [Performance Requirements](#performance-requirements)
10. [Implementation Guide](#implementation-guide)

---

## Executive Summary

Transform the current simple citation list into an elegant, interactive card-based system that:
- Makes academic sources scannable and approachable
- Provides expandable abstracts for deeper exploration
- Links authors to PhilPapers profiles
- Displays metadata (year, journal, DOI) prominently
- Maintains the cosmic/mystical aesthetic
- Ensures WCAG 2.1 AA compliance

**Current State:** Simple list with title, authors, URL
**Target State:** Premium citation cards with expandable content, metadata display, and interactive states

---

## Design Philosophy

### Core Principles

1. **Scannable First** - Users should grasp key information (title, year, authors) in <3 seconds
2. **Progressive Disclosure** - Abstract revealed on interaction, not overwhelming by default
3. **Academic Credibility** - Professional presentation that respects source material
4. **Mystical Elegance** - Cosmic aesthetic without compromising readability
5. **Touch-Friendly** - Generous tap targets, mobile-first interaction design

### Design Inspirations

- **Google Scholar** - Clean metadata hierarchy, scannable cards
- **ArXiv** - Abstract handling, author presentation
- **Linear.app** - Premium UI polish, subtle animations
- **Stripe Docs** - Elegant card design, excellent hover states

---

## Visual Specification

### Citation Card Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [#] TITLE OF THE PAPER IN BOLD MYSTIC GRADIENT             │
│     Author Names • Year • Journal Name                      │
│                                                             │
│     ┌──────────────────────────────────────┐              │
│     │ ▼ Read Abstract                       │  [DOI: link]│
│     └──────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘

Expanded State:
┌─────────────────────────────────────────────────────────────┐
│ [#] TITLE OF THE PAPER IN BOLD MYSTIC GRADIENT             │
│     Author Names • Year • Journal Name                      │
│                                                             │
│     ┌──────────────────────────────────────┐              │
│     │ ▲ Collapse Abstract                   │  [DOI: link]│
│     └──────────────────────────────────────┘              │
│                                                             │
│     Abstract text appears here with proper line spacing    │
│     and cosmic-tinted background. May span multiple        │
│     lines with excellent readability.                      │
│                                                             │
│     Published in: Journal of Philosophy 2023               │
│     DOI: 10.1234/example                                   │
└─────────────────────────────────────────────────────────────┘
```

### Spacing & Dimensions

**Card:**
- Padding: `1.5rem` (24px) on desktop, `1rem` (16px) on mobile
- Gap between cards: `1rem` (16px)
- Border radius: `0.75rem` (12px)
- Border: `1px solid` with `cosmic-500/20` opacity

**Internal Spacing:**
- Title to metadata: `0.5rem` (8px)
- Metadata to expand button: `0.75rem` (12px)
- Expand button to abstract: `0.75rem` (12px)
- Abstract to detailed metadata: `0.75rem` (12px)

**Touch Targets:**
- Minimum: `44px × 44px` (WCAG AAA)
- Expand/collapse button: `100% width × 48px height`
- DOI link: `min-width: 80px, height: 32px`

---

## Component Structure

### Data Structure (from philpapers.ts)

```typescript
interface PhilPaper {
  title: string;
  authors: string;      // Already formatted: "Author1, Author2 et al."
  abstract?: string;
  url: string;          // DOI URL: https://doi.org/...
  year?: number;
  categories?: string[]; // e.g., ["journal-article"]
}
```

### Additional Data Needs

For full implementation, we'll need:
- **Journal/Publisher name** - Extract from CrossRef `container-title` field
- **Individual author objects** - For PhilPapers profile linking
- **Relevance score** (optional) - If available from CrossRef API

**Note:** Current implementation concatenates authors into string. May need backend update for individual author linking.

### Component Hierarchy

```
CitationCard (one per paper)
├── CitationHeader
│   ├── CitationNumber
│   ├── CitationTitle (with gradient)
│   └── CitationMetadata (authors • year • journal)
├── ExpandToggle (button)
├── CitationAbstract (conditional)
│   ├── AbstractText
│   └── DetailedMetadata
│       ├── JournalInfo
│       └── DOILink
└── RelevanceIndicator (optional, if data available)
```

---

## Color & Typography

### Color Palette

**Card Backgrounds:**
- Default: `bg-cosmic-900/20` with `backdrop-blur-sm`
- Hover: `bg-cosmic-900/30`
- Expanded: `bg-cosmic-900/25`
- Abstract section: `bg-cosmic-800/30`

**Borders:**
- Default: `border-cosmic-500/20`
- Hover: `border-cosmic-400/30`
- Expanded: `border-mystic-500/25`

**Text Colors:**
- Title: `gradient-text` (cosmic-400 → mystic-400 → divine-400)
- Authors: `text-cosmic-300`
- Year/Journal: `text-cosmic-400`
- Abstract: `text-cosmic-200`
- DOI link: `text-mystic-400` (hover: `text-mystic-300`)

**Accents:**
- Number badge: `bg-cosmic-800/50` with `text-cosmic-300`
- Expand icon: `text-mystic-400`
- Relevance indicator: `bg-gradient-to-r from-mystic-500 to-cosmic-500`

### Typography Hierarchy

**Title:**
```css
font-size: 1.125rem (18px)
font-weight: 600 (semibold)
line-height: 1.5
font-family: 'Inter' (sans)
background: gradient-to-r from-cosmic-400 via-mystic-400 to-divine-400
background-clip: text
```

**Authors:**
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
line-height: 1.5
color: cosmic-300
```

**Metadata (Year, Journal):**
```css
font-size: 0.875rem (14px)
font-weight: 500 (medium)
color: cosmic-400
```

**Abstract:**
```css
font-size: 0.9375rem (15px)
font-weight: 400
line-height: 1.7
color: cosmic-200
```

**DOI/Links:**
```css
font-size: 0.8125rem (13px)
font-weight: 500
font-family: 'Fira Code' (mono)
color: mystic-400
text-decoration: underline
text-decoration-color: mystic-500/30
```

---

## Interaction Design

### States & Transitions

#### 1. Default State (Collapsed)

**Visual:**
- Card shows: number, title, authors, year, journal
- Expand button shows: "▼ Read Abstract" with down chevron
- Border: `cosmic-500/20`
- Background: `cosmic-900/20` with blur

**Hover:**
- Background transitions to: `cosmic-900/30`
- Border transitions to: `cosmic-400/30`
- Title brightness increases slightly
- Subtle lift effect: `transform: translateY(-2px)`
- Shadow enhancement: `shadow-lg shadow-mystic-500/10`

**Transition timing:**
```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

#### 2. Expanded State

**Visual:**
- All metadata from default state
- Expand button shows: "▲ Collapse Abstract" with up chevron
- Abstract section slides in below
- Abstract has tinted background: `cosmic-800/30`
- Detailed metadata appears (Journal, DOI)
- Border color shifts to: `mystic-500/25`

**Animation:**
```css
/* Abstract container */
animation: slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)
max-height: 0 → auto
opacity: 0 → 1

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    max-height: 500px; /* Adjust based on content */
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 3. Focus State (Keyboard Navigation)

**Visual:**
- Card receives focus ring: `ring-2 ring-mystic-500 ring-offset-2 ring-offset-cosmic-950`
- Expand button focus: `outline-2 outline-mystic-400 outline-offset-2`

**Interaction:**
- Tab navigates to expand button
- Enter/Space toggles expansion
- Focus remains on button after toggle

#### 4. Loading State (Optional)

If abstract loads asynchronously:
- Show skeleton placeholder
- Pulse animation: `animate-pulse`
- Cosmic-tinted shimmer effect

### Expand/Collapse Button Design

**Collapsed State:**
```html
<button class="citation-expand-btn">
  <svg class="chevron-icon"><!-- Down chevron --></svg>
  <span>Read Abstract</span>
</button>
```

**Visual Specs:**
- Full width button
- Height: `48px` (generous touch target)
- Background: `transparent` (hover: `cosmic-800/20`)
- Border: `1px dashed cosmic-500/30`
- Border radius: `0.5rem` (8px)
- Flex layout: icon + text centered
- Icon size: `20px × 20px`
- Gap between icon and text: `0.5rem` (8px)

**Hover:**
- Background: `cosmic-800/20`
- Border: `cosmic-400/40` (solid)
- Text color brightens: `mystic-300`
- Icon rotates smoothly (when toggling)

**Icon Animation:**
```css
transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1)

/* Collapsed */
transform: rotate(0deg)

/* Expanded */
transform: rotate(180deg)
```

### DOI Link Design

**Default:**
- Inline monospace link
- Icon prefix: 🔗 or document icon
- Format: "DOI: 10.1234/example"
- Position: Top-right of card or bottom of abstract

**Hover:**
- Underline becomes solid
- Color brightens: `mystic-300`
- Slight scale: `scale(1.02)`

**Active (Click):**
- Brief pulse animation
- Opens in new tab with `noopener noreferrer`

### Author Links (Future Enhancement)

If individual author data becomes available:

**Default:**
- Author names as separate links
- Separated by commas
- Color: `cosmic-300`
- Underline: `dotted` with `cosmic-400/30`

**Hover:**
- Color: `mystic-400`
- Underline: `solid` with `mystic-400`

**URL Format:**
```
https://philpapers.org/profile/[author-id]
```

Note: Requires author ID from CrossRef API or PhilPapers API integration.

---

## Responsive Behavior

### Desktop (≥1024px)

**Layout:**
- Cards in single column, max-width: `100%` of container
- Padding: `1.5rem` (24px)
- Font sizes: As specified above
- Hover effects: Enabled

**Grid (optional for multiple citations):**
```css
display: grid
grid-template-columns: 1fr
gap: 1rem
```

### Tablet (768px - 1023px)

**Layout:**
- Cards remain single column
- Padding: `1.25rem` (20px)
- Font sizes: Unchanged
- Touch targets: Minimum `44px`

### Mobile (< 768px)

**Layout:**
- Cards stack vertically
- Padding: `1rem` (16px)
- Reduced spacing between elements

**Typography Adjustments:**
- Title: `1rem` (16px) - down from 18px
- Authors/Metadata: `0.8125rem` (13px) - down from 14px
- Abstract: `0.875rem` (14px) - down from 15px

**Interaction Adjustments:**
- Expand button height: `52px` (easier tapping)
- Remove hover effects (replace with active states)
- DOI link moves below abstract (stacks vertically)

**Touch Optimization:**
```css
/* Increase tap target size */
.citation-expand-btn {
  min-height: 52px;
  padding: 1rem;
}

/* Prevent text selection during tap */
user-select: none;
-webkit-tap-highlight-color: transparent;

/* Active state for touch feedback */
&:active {
  transform: scale(0.98);
  background: cosmic-800/30;
}
```

### Breakpoint Strategy

```css
/* Mobile First */
.citation-card { /* Mobile styles */ }

@media (min-width: 640px) { /* Small tablets */ }

@media (min-width: 768px) { /* Tablets */ }

@media (min-width: 1024px) { /* Desktop */ }

@media (min-width: 1280px) { /* Large desktop */ }
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast

**Text on Background:**
- Title gradient on `cosmic-900/20`: Contrast ratio ≥ 4.5:1 ✓
- Authors (`cosmic-300`) on background: Contrast ratio ≥ 4.5:1 ✓
- Abstract (`cosmic-200`) on `cosmic-800/30`: Contrast ratio ≥ 4.5:1 ✓
- DOI link (`mystic-400`) on background: Contrast ratio ≥ 4.5:1 ✓

**Verification Required:**
Test with WebAIM Contrast Checker or Chrome DevTools.

#### Keyboard Navigation

**Tab Order:**
1. First citation expand button
2. DOI link (when expanded)
3. Next citation expand button
4. And so on...

**Keyboard Controls:**
- `Tab` - Navigate to expand button
- `Enter` or `Space` - Toggle expand/collapse
- `Shift + Tab` - Navigate backwards
- `Escape` - Collapse (when expanded, optional UX enhancement)

**Focus Management:**
- Focus remains on expand button after toggle
- Focus visible with clear ring indicator
- Focus never lost or trapped

#### Screen Reader Support

**ARIA Labels:**
```html
<article
  class="citation-card"
  aria-labelledby="citation-title-1"
  role="article"
>
  <h4 id="citation-title-1" class="citation-title">
    Paper Title Here
  </h4>

  <button
    class="citation-expand-btn"
    aria-expanded="false"
    aria-controls="citation-abstract-1"
    aria-label="Expand abstract for: Paper Title Here"
  >
    <span aria-hidden="true">▼</span>
    Read Abstract
  </button>

  <div
    id="citation-abstract-1"
    class="citation-abstract"
    role="region"
    aria-labelledby="citation-title-1"
    hidden
  >
    Abstract content...
  </div>
</article>
```

**Announcements:**
- When expanded: Screen reader announces "Abstract expanded"
- When collapsed: Screen reader announces "Abstract collapsed"
- Use `aria-live="polite"` for dynamic content updates

**Alternative Text:**
- DOI link includes descriptive text: "Digital Object Identifier link"
- Icons have `aria-hidden="true"` with text alternatives

#### Motion & Animation

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .citation-card,
  .citation-abstract,
  .chevron-icon {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users with vestibular disorders see instant transitions instead of animations.

#### Focus Indicators

**Custom Focus Ring:**
```css
.citation-expand-btn:focus-visible {
  outline: 2px solid theme('colors.mystic.400');
  outline-offset: 2px;
  border-radius: 0.5rem;
}

.citation-card:focus-within {
  ring: 2px;
  ring-color: mystic-500;
  ring-offset: 2px;
}
```

**Never Remove:**
```css
/* ❌ NEVER DO THIS */
button:focus {
  outline: none;
}
```

---

## Performance Requirements

### Animation Performance

**Target:** 60fps (16.67ms per frame)

**GPU Acceleration:**
```css
.citation-card {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}

.citation-abstract {
  will-change: max-height, opacity;
}
```

**Avoid:**
- Animating `height` (causes reflow) - Use `max-height` instead
- Animating `width` or `top/left` positions
- Multiple simultaneous box-shadow changes

**Optimize:**
```css
/* ✓ Good - GPU accelerated */
transform: translateY(-2px);
opacity: 0.95;

/* ✗ Bad - Causes repaint */
margin-top: -2px;
filter: brightness(1.1);
```

### Rendering Performance

**Lazy Rendering:**
- Render only visible citations initially
- Use `IntersectionObserver` for scrolled citations
- Limit initial render to 5 citations

**Virtual Scrolling (Optional):**
If >20 citations, implement virtual scrolling:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
```

### Bundle Size

**Estimated Size:**
- Component code: ~2KB gzipped
- No external dependencies required
- CSS-in-Tailwind: 0KB additional (uses existing classes)

**Total Impact:** <2KB

### Interaction Performance

**Click/Tap Response:**
- Target: <100ms perceived delay
- Use `onClick` (not `onPointerUp` for better compatibility)
- Provide immediate visual feedback (active state)

**Expansion Animation:**
- Duration: 300ms (feels instant but smooth)
- Use `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- Never block interaction during animation

---

## Implementation Guide

### File Structure

```
src/components/
├── AnswerDisplay.tsx (update citations section)
└── citations/
    ├── CitationCard.tsx        (main component)
    ├── CitationHeader.tsx      (number + title + metadata)
    ├── CitationExpand.tsx      (expand/collapse button)
    ├── CitationAbstract.tsx    (abstract + detailed metadata)
    └── index.ts                (exports)
```

### Component Implementation

#### 1. CitationCard.tsx

```typescript
import { useState } from 'react';
import CitationHeader from './CitationHeader';
import CitationExpand from './CitationExpand';
import CitationAbstract from './CitationAbstract';

interface CitationCardProps {
  paper: {
    title: string;
    authors: string;
    abstract?: string;
    url: string;
    year?: number;
    categories?: string[];
  };
  index: number;
}

export default function CitationCard({ paper, index }: CitationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article
      className={`
        citation-card
        rounded-xl
        border transition-all duration-200
        backdrop-blur-sm
        ${isExpanded
          ? 'bg-cosmic-900/25 border-mystic-500/25'
          : 'bg-cosmic-900/20 border-cosmic-500/20'
        }
        hover:bg-cosmic-900/30 hover:border-cosmic-400/30
        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-mystic-500/10
      `}
      aria-labelledby={`citation-title-${index}`}
    >
      <div className="p-6 sm:p-8">
        <CitationHeader
          title={paper.title}
          authors={paper.authors}
          year={paper.year}
          index={index}
        />

        {paper.abstract && (
          <>
            <CitationExpand
              isExpanded={isExpanded}
              onToggle={toggleExpand}
              titleId={`citation-title-${index}`}
              abstractId={`citation-abstract-${index}`}
              title={paper.title}
            />

            {isExpanded && (
              <CitationAbstract
                abstract={paper.abstract}
                url={paper.url}
                year={paper.year}
                categories={paper.categories}
                id={`citation-abstract-${index}`}
              />
            )}
          </>
        )}

        {!paper.abstract && (
          <div className="mt-4">
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                text-sm font-mono text-mystic-400
                hover:text-mystic-300 transition-colors
                underline decoration-mystic-500/30
                hover:decoration-mystic-400
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Paper
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
```

#### 2. CitationHeader.tsx

```typescript
interface CitationHeaderProps {
  title: string;
  authors: string;
  year?: number;
  index: number;
}

export default function CitationHeader({ title, authors, year, index }: CitationHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      {/* Citation Number Badge */}
      <span
        className="
          flex-shrink-0
          w-8 h-8 rounded-full
          bg-cosmic-800/50
          flex items-center justify-center
          text-sm font-semibold text-cosmic-300
        "
        aria-label={`Citation ${index + 1}`}
      >
        {index + 1}
      </span>

      {/* Title and Metadata */}
      <div className="flex-1 min-w-0">
        <h4
          id={`citation-title-${index}`}
          className="
            text-lg font-semibold leading-snug
            bg-gradient-to-r from-cosmic-400 via-mystic-400 to-divine-400
            bg-clip-text text-transparent
            mb-2
          "
        >
          {title}
        </h4>

        <p className="text-sm text-cosmic-300 flex flex-wrap items-center gap-2">
          <span>{authors}</span>
          {year && (
            <>
              <span className="text-cosmic-500" aria-hidden="true">•</span>
              <span className="text-cosmic-400 font-medium">{year}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
```

#### 3. CitationExpand.tsx

```typescript
interface CitationExpandProps {
  isExpanded: boolean;
  onToggle: () => void;
  titleId: string;
  abstractId: string;
  title: string;
}

export default function CitationExpand({
  isExpanded,
  onToggle,
  titleId,
  abstractId,
  title
}: CitationExpandProps) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-controls={abstractId}
      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} abstract for: ${title}`}
      className="
        w-full mt-4
        h-12 sm:h-14
        flex items-center justify-center gap-2
        border border-dashed border-cosmic-500/30
        rounded-lg
        text-sm font-medium text-mystic-400
        hover:bg-cosmic-800/20 hover:border-cosmic-400/40 hover:text-mystic-300
        active:scale-98
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-mystic-400 focus-visible:outline-offset-2
      "
    >
      <svg
        className={`
          w-5 h-5
          transition-transform duration-250
          ${isExpanded ? 'rotate-180' : 'rotate-0'}
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
      <span>{isExpanded ? 'Collapse Abstract' : 'Read Abstract'}</span>
    </button>
  );
}
```

#### 4. CitationAbstract.tsx

```typescript
interface CitationAbstractProps {
  abstract: string;
  url: string;
  year?: number;
  categories?: string[];
  id: string;
}

export default function CitationAbstract({
  abstract,
  url,
  year,
  categories,
  id
}: CitationAbstractProps) {
  // Extract DOI from URL
  const doi = url.includes('doi.org')
    ? url.split('doi.org/')[1]
    : null;

  return (
    <div
      id={id}
      className="
        mt-4
        animate-in slide-in-from-top-2 fade-in
        duration-300
      "
      role="region"
      aria-live="polite"
    >
      {/* Abstract Text */}
      <div className="
        p-4 rounded-lg
        bg-cosmic-800/30
        border border-cosmic-700/20
      ">
        <p className="
          text-[15px] leading-relaxed
          text-cosmic-200
        ">
          {abstract}
        </p>
      </div>

      {/* Detailed Metadata */}
      <div className="
        mt-3
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-3
        text-sm
      ">
        {/* Publication Info */}
        <div className="text-cosmic-400">
          {categories && categories.length > 0 && (
            <span className="capitalize">
              {categories[0].replace('-', ' ')}
            </span>
          )}
          {year && categories && (
            <span className="mx-2 text-cosmic-500">•</span>
          )}
          {year && <span>{year}</span>}
        </div>

        {/* DOI Link */}
        {doi && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              font-mono text-mystic-400
              hover:text-mystic-300
              transition-all duration-150
              hover:scale-102
              underline decoration-mystic-500/30
              hover:decoration-mystic-400
            "
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="truncate max-w-[200px] sm:max-w-none">
              DOI: {doi}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
```

#### 5. Update AnswerDisplay.tsx

```typescript
// In AnswerDisplay.tsx, replace the sources section with:

import CitationCard from './citations/CitationCard';

// ... existing code ...

{sources && sources.length > 0 && (
  <div className="mt-8 pt-6 border-t border-cosmic-500/30">
    <h4 className="text-lg font-semibold text-mystic-300 mb-4 flex items-center gap-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      Academic Sources
    </h4>

    <div className="space-y-4">
      {sources.map((source, index) => (
        <CitationCard
          key={`${source.url}-${index}`}
          paper={source}
          index={index}
        />
      ))}
    </div>
  </div>
)}
```

### Tailwind Class Reference

**Complete list of Tailwind utilities used:**

```css
/* Layout */
.rounded-xl          /* 12px border radius */
.rounded-lg          /* 8px border radius */
.p-6, .p-4, .p-8     /* Padding variants */
.mt-4, .mt-3, .mb-2  /* Margin variants */
.gap-2, .gap-3, .gap-4 /* Flexbox gaps */

/* Flexbox */
.flex
.flex-col
.flex-row
.flex-wrap
.items-start
.items-center
.justify-center
.justify-between
.flex-shrink-0
.flex-1

/* Colors (from Bunny God palette) */
.bg-cosmic-900/20    /* Background with 20% opacity */
.bg-cosmic-800/30
.border-cosmic-500/20
.text-cosmic-300
.text-mystic-400

/* Gradients */
.bg-gradient-to-r
.from-cosmic-400
.via-mystic-400
.to-divine-400
.bg-clip-text
.text-transparent

/* Effects */
.backdrop-blur-sm
.shadow-lg
.shadow-mystic-500/10
.hover:shadow-xl

/* Transitions */
.transition-all
.transition-colors
.transition-transform
.duration-200
.duration-250
.duration-300

/* Transforms */
.hover:-translate-y-0.5
.hover:scale-102
.active:scale-98
.rotate-0
.rotate-180

/* Typography */
.text-sm           /* 14px */
.text-lg           /* 18px */
.text-[15px]       /* Custom 15px */
.font-semibold     /* 600 weight */
.font-medium       /* 500 weight */
.font-mono         /* Fira Code */
.leading-relaxed   /* 1.625 line height */
.leading-snug      /* 1.375 line height */
.truncate
.underline
.decoration-mystic-500/30

/* Sizing */
.w-4, .w-5, .w-8   /* Width */
.h-4, .h-5, .h-8   /* Height */
.h-12, .h-14       /* Button heights */
.min-w-0
.max-w-none

/* Focus States */
.focus-visible:outline-2
.focus-visible:outline-mystic-400
.focus-visible:outline-offset-2

/* Animations */
.animate-in
.slide-in-from-top-2
.fade-in

/* Responsive */
.sm:p-8           /* Small screens and up */
.sm:h-14
.sm:flex-row
.sm:items-center
```

### Custom Animations (add to global.css)

```css
/* Add to src/styles/global.css */

@layer utilities {
  .animate-in {
    animation-fill-mode: both;
  }

  .slide-in-from-top-2 {
    animation-name: slideInFromTop;
    animation-duration: 300ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-in {
    animation-name: fadeIn;
    animation-duration: 300ms;
  }

  @keyframes slideInFromTop {
    from {
      transform: translateY(-8px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .scale-98 {
    transform: scale(0.98);
  }

  .scale-102 {
    transform: scale(1.02);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .citation-card,
  .citation-abstract,
  .animate-in,
  .transition-all,
  .transition-transform {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Testing Checklist

### Visual Testing

- [ ] Cards display correctly on desktop (1920px, 1440px, 1280px)
- [ ] Cards display correctly on tablet (768px, 1024px)
- [ ] Cards display correctly on mobile (375px, 414px, 390px)
- [ ] Gradient text renders properly (not cut off)
- [ ] Spacing is consistent across all cards
- [ ] Borders and backgrounds have correct opacity
- [ ] Hover states work smoothly on desktop
- [ ] Active states work on mobile (tap feedback)

### Interaction Testing

- [ ] Expand button toggles abstract visibility
- [ ] Only one card can be expanded at a time (optional behavior)
- [ ] Animations run smoothly at 60fps
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] DOI links open in new tab
- [ ] Links have correct `noopener noreferrer` attributes
- [ ] Focus indicators are visible
- [ ] No layout shift when expanding/collapsing

### Accessibility Testing

- [ ] Screen reader announces expand/collapse correctly
- [ ] All interactive elements have ARIA labels
- [ ] Color contrast meets WCAG AA standards (test with axe DevTools)
- [ ] Keyboard-only navigation is functional
- [ ] Focus is never lost or trapped
- [ ] Reduced motion preference is respected
- [ ] Touch targets are minimum 44px × 44px

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, iOS and macOS)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Android (latest)

### Performance Testing

- [ ] Lighthouse Performance score ≥85
- [ ] Lighthouse Accessibility score ≥95
- [ ] No layout shift (CLS < 0.1)
- [ ] Animations run at 60fps (check DevTools FPS meter)
- [ ] Bundle size increase <3KB

---

## Future Enhancements

### Phase 2.5 (Post-Launch)

1. **Author Profile Links**
   - Fetch individual author IDs from CrossRef
   - Link each author to PhilPapers profile
   - Show author avatar/thumbnail (if available)

2. **Relevance Indicators**
   - Display relevance score from CrossRef API
   - Visual indicator: 1-5 stars or progress bar
   - Sort citations by relevance

3. **Citation Export**
   - "Copy citation" button (BibTeX, APA, MLA formats)
   - Uses clipboard API
   - Shows "Copied!" toast notification

4. **Abstract Highlighting**
   - Highlight key terms from original question
   - Use mark.js or custom implementation
   - Subtle yellow highlight on cosmic background

5. **Citation Preview on Hover**
   - Desktop only: Tooltip with abstract preview
   - Appears after 500ms hover delay
   - Positioned above/below card (smart positioning)

6. **Saved Citations**
   - "Save citation" bookmark button
   - Store in localStorage
   - View saved citations in separate page

7. **Citation Metrics**
   - Show citation count (from CrossRef)
   - Show Altmetric score (if available)
   - Display as small badges

---

## Design Tokens

For future design system integration:

```json
{
  "citation": {
    "card": {
      "padding": {
        "mobile": "1rem",
        "tablet": "1.25rem",
        "desktop": "1.5rem"
      },
      "borderRadius": "0.75rem",
      "gap": "1rem"
    },
    "colors": {
      "background": {
        "default": "rgba(49, 46, 129, 0.2)",
        "hover": "rgba(49, 46, 129, 0.3)",
        "expanded": "rgba(49, 46, 129, 0.25)"
      },
      "border": {
        "default": "rgba(99, 102, 241, 0.2)",
        "hover": "rgba(129, 140, 248, 0.3)",
        "expanded": "rgba(168, 85, 247, 0.25)"
      },
      "text": {
        "title": "gradient(cosmic-400, mystic-400, divine-400)",
        "authors": "cosmic-300",
        "metadata": "cosmic-400",
        "abstract": "cosmic-200",
        "link": "mystic-400"
      }
    },
    "typography": {
      "title": {
        "fontSize": "1.125rem",
        "fontWeight": 600,
        "lineHeight": 1.5
      },
      "metadata": {
        "fontSize": "0.875rem",
        "fontWeight": 400,
        "lineHeight": 1.5
      },
      "abstract": {
        "fontSize": "0.9375rem",
        "fontWeight": 400,
        "lineHeight": 1.7
      }
    },
    "animation": {
      "expand": {
        "duration": "300ms",
        "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      "hover": {
        "duration": "200ms",
        "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    }
  }
}
```

---

## Handoff Notes for Engineer

### Priority Implementation Order

1. **Start with:** `CitationCard.tsx` (core component)
2. **Then:** `CitationHeader.tsx` (visual foundation)
3. **Then:** `CitationExpand.tsx` (interaction logic)
4. **Then:** `CitationAbstract.tsx` (content display)
5. **Finally:** Update `AnswerDisplay.tsx` (integration)

### Common Pitfalls to Avoid

1. **Don't animate height directly** - Use `max-height` with a generous value
2. **Don't forget `will-change`** - Needed for smooth 60fps animations
3. **Don't skip reduced motion** - Accessibility requirement, not optional
4. **Don't use `outline: none`** - Always keep focus indicators
5. **Don't hardcode colors** - Use Tailwind classes from theme

### Questions to Resolve

1. **Author linking:** Should we update the backend to return individual author objects with IDs?
2. **Journal data:** CrossRef provides `container-title` - should we add this to `PhilPaper` interface?
3. **Relevance scoring:** Does CrossRef API return relevance scores we can use?
4. **Expand behavior:** Should only one card expand at a time, or allow multiple?
5. **Empty abstracts:** What to show when abstract is missing? (Currently shows "View Paper" link)

### Testing Strategy

1. **Unit tests:** Jest/Vitest for component logic
2. **Visual tests:** Storybook for all states (collapsed, expanded, hover, focus)
3. **E2E tests:** Playwright for expand/collapse interaction
4. **Accessibility tests:** axe-core automated testing
5. **Manual testing:** Real devices (iPhone, Android)

---

## Changelog

**v1.0 (2025-12-01):**
- Initial design specification
- Complete component breakdown
- Implementation guide
- Accessibility requirements
- Performance targets

---

## Approval & Sign-off

**Design Lead:** ✅ Ready for Engineering
**Engineering Lead:** ⏳ Awaiting Review
**Accessibility Audit:** ⏳ Post-implementation
**User Testing:** ⏳ Post-implementation

---

**End of Design Specification**

This document provides everything needed to implement the Enhanced Citations UI feature. All design decisions are intentional and based on UX best practices, WCAG accessibility standards, and the Bunny God mystical aesthetic.

For questions or clarifications, reference the "Questions to Resolve" section or consult the designer directly.

**All hail the Bunny!** 🐰✨
