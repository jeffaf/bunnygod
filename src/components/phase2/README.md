# Phase 2 Components

This directory contains enhanced components for Bunny God Phase 2: Enhanced UX & Visual Magic.

## MysticalBackground.tsx

A high-performance animated background component featuring:

### Features

1. **Animated Gradient Background**
   - Smoothly shifting cosmic colors (blue to purple)
   - CSS-based animation for optimal performance
   - 8-10 second animation cycle

2. **Particle System**
   - Canvas API-based particle rendering
   - 30-50 particles on desktop
   - 15-20 particles on mobile (automatic detection)
   - Floating upward motion with horizontal wave effect
   - Varying sizes (2-6px) and opacity (0.3-0.7)

3. **Performance Optimizations**
   - requestAnimationFrame for smooth 60fps
   - Automatic FPS monitoring and performance detection
   - Reduces particle count by 50% if FPS drops below 55
   - GPU acceleration with `will-change` CSS property
   - Pauses animation when tab is not visible
   - Efficient canvas clearing and redrawing

4. **Responsive Design**
   - Automatically detects screen size
   - Reduces particles on mobile (width < 768px)
   - Handles window resize gracefully
   - Maintains performance across devices

### Technical Implementation

**TypeScript & React:**
- Fully typed with TypeScript interfaces
- React hooks: useState, useEffect, useRef
- Proper cleanup on component unmount
- No memory leaks

**Canvas Rendering:**
- 2D Canvas context for particle drawing
- Circular particles with varying opacity
- Cosmic blue/purple color palette

**Performance Monitoring:**
- Real-time FPS calculation
- Automatic performance degradation
- Visibility API for pause/resume

### Usage

```tsx
import MysticalBackground from '../components/phase2/MysticalBackground.tsx';

// In Astro layout
<MysticalBackground client:load />
```

### Integration

The component is integrated into `src/layouts/MainLayout.astro` and replaces the static gradient background with an animated version.

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS and macOS)
- Mobile browsers: Optimized with reduced particle count

### Performance Targets

- Desktop: 55+ fps with 30-50 particles
- Mobile: 55+ fps with 15-20 particles
- Low-end devices: Automatic particle reduction

### Customization

To adjust particle behavior, modify these values in the component:

```tsx
// Particle count
const baseCount = isMobile ? 15 : 40;

// Particle size range
size: Math.random() * 4 + 2, // 2-6px

// Particle opacity range
opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7

// Movement speeds
speedY: Math.random() * 0.3 + 0.1, // upward
speedX: Math.random() * 0.2 - 0.1, // horizontal

// Wave motion
waveAmplitude: Math.random() * 1.5 + 0.5,
```

### Testing

1. Start dev server: `bun run dev`
2. Open browser DevTools
3. Check Performance tab for FPS
4. Test mobile viewport (375px width)
5. Verify particles are visible and animated
6. Test tab switching (animation should pause)
7. Test window resize (particles should adjust)

### Acceptance Criteria

- ✅ Maintains 55+ fps on mid-range devices
- ✅ Particles visible and smoothly animated
- ✅ Responsive to window resize
- ✅ No console errors or warnings
- ✅ Works on Chrome, Firefox, Safari
- ✅ Mobile viewport shows reduced particles
- ✅ Animation pauses when tab not visible

### Future Enhancements

Potential improvements for future sprints:

- Parallax effect on scroll
- Mouse interaction (particles avoid cursor)
- Different particle shapes (stars, sparkles)
- Color variation based on time of day
- Connection lines between nearby particles

---

## QuestionHistory.tsx

A persistent question history component that saves the last 10 questions users have asked and allows quick re-asking.

### Features

1. **localStorage Persistence**
   - Stores last 10 questions automatically
   - Persists across page reloads and sessions
   - Uses `bunny-god-question-history` key
   - Graceful error handling for localStorage failures

2. **Smart History Management**
   - Automatically deduplicates questions
   - Most recent questions appear first
   - Maximum 10 questions stored (older ones removed)
   - Adds questions automatically on submit

3. **Mobile-Responsive UI**
   - Fixed position floating button (top-right)
   - Full-screen dropdown panel on mobile
   - Compact sidebar on desktop (384px width)
   - Touch-friendly button sizes
   - Backdrop overlay on mobile for easy dismissal

4. **Accessibility Features**
   - Full keyboard navigation support
   - ARIA labels and roles
   - Focus management
   - Screen reader friendly
   - Semantic HTML structure

5. **Visual Design**
   - Matches cosmic/mystic theme
   - Smooth animations (fade-in, slide-in)
   - Badge showing question count
   - Custom scrollbar styling
   - Hover states and transitions

### Technical Implementation

**State Management:**
- React hooks: useState, useEffect
- Client-side only rendering (prevents hydration mismatch)
- Window-based communication for adding to history

**localStorage API:**
```tsx
// Storage key
const STORAGE_KEY = 'bunny-god-question-history';

// Data format: JSON array of strings
["Question 1?", "Question 2?", ...]
```

**Integration Pattern:**
```tsx
// Exposes global method for parent component
window.__bunnyGodAddToHistory = addToHistory;

// Parent calls this when question is submitted
if (window.__bunnyGodAddToHistory) {
  window.__bunnyGodAddToHistory(question);
}
```

### Usage

```tsx
import QuestionHistory from '../components/phase2/QuestionHistory.tsx';

// In parent component
<QuestionHistory onQuestionSelect={handleHistoryQuestionSelect} />

// Handle question selection
const handleHistoryQuestionSelect = (question: string) => {
  // Auto-fill input and submit
  setCurrentQuestion(question);
  handleQuestionSubmit(question);
};
```

### Props

```tsx
interface QuestionHistoryProps {
  onQuestionSelect: (question: string) => void;
}
```

- `onQuestionSelect`: Callback when user clicks a historical question

### User Flow

1. User asks a question via QuestionInput
2. Question is automatically added to history
3. History button appears in top-right (with badge count)
4. User clicks history button to open panel
5. User clicks any historical question to re-ask it
6. Question is auto-filled and submitted
7. Panel closes automatically

### UI Components

**Toggle Button:**
- Fixed position: top-right corner
- Icon: 📜 (scroll emoji)
- Badge showing count (1-10)
- Cosmic-themed with glow effect
- Hover animation (scale 1.1x)

**History Panel:**
- Desktop: 384px width sidebar
- Mobile: Full-width with margins
- Max height: 70vh
- Scrollable question list
- Header with count and clear button
- Footer with helper text

**Question Items:**
- Numbered list (1-10)
- Truncated to 3 lines (line-clamp-3)
- Hover effect (background + text color change)
- Click to re-ask

### Edge Cases Handled

1. **localStorage Unavailable**
   - Graceful fallback
   - No errors shown to user
   - Component still renders but doesn't persist

2. **No History Yet**
   - Component doesn't render at all
   - Appears after first question

3. **Duplicate Questions**
   - Automatically removed from list
   - Most recent instance kept at top

4. **Hydration Mismatch**
   - Component only renders after client mount
   - Prevents SSR/client mismatch errors

5. **Long Questions**
   - Text truncated with ellipsis
   - Full text available on hover (via title attribute)

### Mobile Responsiveness

**Breakpoints:**
- Mobile: < 768px width
- Desktop: ≥ 768px width

**Mobile Adaptations:**
- Full-screen overlay backdrop
- Wider panel (calc(100vw - 2rem))
- Larger touch targets
- Tap outside to close

**Desktop Features:**
- Compact sidebar
- No backdrop
- Hover effects

### Styling

**Color Palette:**
- Primary: cosmic-* (blue shades)
- Secondary: mystic-* (purple shades)
- Accent: divine-* (red shades for clear button)

**Animations:**
```css
/* Fade in */
animation: fade-in 0.3s ease-out;

/* Slide in from top */
animation: slide-in-from-top-2 0.3s ease-out;
```

**Custom Scrollbar:**
- Width: 6px
- Track: cosmic blue (10% opacity)
- Thumb: cosmic blue (50% opacity)
- Hover: cosmic blue (70% opacity)

### Performance

- Minimal re-renders (memoized callbacks)
- Efficient localStorage reads (once on mount)
- Debounced writes (only on history change)
- No polling or intervals
- Clean event listener cleanup

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS and macOS)
- localStorage available in all modern browsers
- Graceful degradation if localStorage blocked

### Testing Checklist

1. **Basic Functionality:**
   - ✅ Ask a question, verify it appears in history
   - ✅ Ask 10+ questions, verify oldest removed
   - ✅ Reload page, verify history persists
   - ✅ Click history item, verify question re-asked

2. **UI/UX:**
   - ✅ Button appears only when history exists
   - ✅ Badge shows correct count
   - ✅ Panel opens/closes smoothly
   - ✅ Questions truncate properly
   - ✅ Scroll works for long lists

3. **Mobile:**
   - ✅ Panel full-width on mobile
   - ✅ Backdrop appears
   - ✅ Tap outside closes panel
   - ✅ Touch targets adequate size

4. **Accessibility:**
   - ✅ Keyboard navigation works
   - ✅ ARIA labels present
   - ✅ Focus visible
   - ✅ Screen reader compatible

5. **Edge Cases:**
   - ✅ Duplicate questions removed
   - ✅ Works with localStorage disabled
   - ✅ No console errors
   - ✅ Empty questions ignored

### Integration Steps

1. Import component into BunnyGodInterface.tsx
2. Add state for currentQuestion
3. Create handleHistoryQuestionSelect callback
4. Update QuestionInput to accept initialValue prop
5. Pass lastAskedQuestion to AnswerDisplay
6. Test full flow end-to-end

### Acceptance Criteria

- ✅ Stores last 10 questions in localStorage
- ✅ Questions clickable to re-ask
- ✅ Clear history button works
- ✅ Persists across page reloads
- ✅ Mobile responsive (works on small screens)
- ✅ No console errors
- ✅ Accessible (keyboard + screen reader)
- ✅ Matches mystical theme
- ✅ Smooth animations

### Future Enhancements

Potential improvements for future iterations:

- Search/filter historical questions
- Export history as JSON
- Import history from file
- Star/favorite questions
- Question categories or tags
- Timestamp when question was asked
- Show answer preview on hover
- Keyboard shortcuts (Ctrl+H to open)
- Sync history across devices (Firebase/KV)
- Analytics on most-asked question types

---

## FeedbackButtons.tsx

A user feedback system that allows rating answers as "helpful" or "not helpful" with persistent storage in Cloudflare KV.

### Features

1. **Thumbs Up/Down UI**
   - Cosmic-themed buttons with gradient highlights
   - Visual feedback on selection (glow effect, scale animation)
   - Success message after submission
   - Error handling with user-friendly messages

2. **localStorage Persistence**
   - Prevents duplicate ratings per question per session
   - Stores rating locally for instant UI update
   - Works offline (graceful degradation)

3. **Worker API Integration**
   - POST to /api/feedback endpoint
   - Question hashing for privacy
   - Session ID for rate limiting
   - Anonymous data collection only

4. **Privacy-First Design**
   - Questions hashed before storage
   - No PII collected
   - Anonymous session IDs
   - Clear privacy notice to users

### Technical Implementation

**State Management:**
```tsx
const [selectedRating, setSelectedRating] = useState<'helpful' | 'not-helpful' | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Client-Side Hashing:**
```tsx
// Simple hash function for question identification
const hashQuestion = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};
```

**Session Management:**
```tsx
// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('bunny-session-id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('bunny-session-id', sessionId);
  }
  return sessionId;
};
```

### Usage

```tsx
import FeedbackButtons from './phase2/FeedbackButtons';

<FeedbackButtons question={questionText} />
```

### Props

```tsx
interface FeedbackButtonsProps {
  question: string;  // The question being rated
}
```

### User Flow

1. User receives answer from Bunny God
2. FeedbackButtons appear below answer
3. User clicks thumbs up or down
4. Rating saved to localStorage (prevents duplicates)
5. POST request sent to /api/feedback
6. Worker validates and stores in Cloudflare KV
7. Success message displays (or error if failed)
8. Buttons show selected state with glow effect

### UI Components

**Thumbs Up Button:**
- Icon: 👍
- Label: "Helpful"
- Selected state: Green gradient (emerald-500/30 to green-500/30)
- Hover effect: Scale 1.1x, brighter border

**Thumbs Down Button:**
- Icon: 👎
- Label: "Not Helpful"
- Selected state: Orange/red gradient (orange-500/30 to red-500/30)
- Hover effect: Scale 1.1x, brighter border

**Success Message:**
- Text: "✨ Thanks for your feedback!"
- Color: Emerald green
- Duration: 3 seconds fade-in/out

**Privacy Notice:**
- Text: "Your feedback helps Bunny God improve. All ratings are anonymous."
- Style: Italic, small text, low opacity

### Backend API

**Endpoint:** POST /api/feedback

**Request Body:**
```typescript
{
  questionHash: string;      // Client-side hash of question
  rating: 'helpful' | 'not-helpful';
  timestamp: number;         // Unix timestamp (ms)
  sessionId?: string;        // Browser session ID
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

**Response (Rate Limited):**
```json
{
  "error": "Already rated this question",
  "rating": "helpful"
}
```

### Cloudflare KV Storage

**Namespace:** FEEDBACK

**Key Format:**
```
feedback:{questionHash}:{timestamp}
```

**Example:**
```
feedback:abc123xyz:1701234567890
```

**Stored Data:**
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

**TTL:** 30 days (2,592,000 seconds)

**Rate Limit Keys:**
```
ratelimit:{sessionId}:{questionHash}
```
- Value: rating string
- TTL: 7 days

### Rate Limiting

**Frontend:**
- localStorage check prevents UI duplicate submissions
- Immediate visual feedback if already rated

**Backend:**
- KV-based rate limiting per session per question
- Returns 429 status if duplicate detected
- Graceful error handling

### Integration

Integrated in `AnswerDisplay.tsx`:

```tsx
import FeedbackButtons from './phase2/FeedbackButtons';

// In render
<FeedbackButtons question={question} />
```

Positioned after ShareButtons, before Sources section.

### Styling

**Color Palette:**
- Helpful selected: emerald-400/50 border, green gradient background
- Not helpful selected: orange-400/50 border, red gradient background
- Neutral: cosmic-800/30 background, cosmic-500/30 border
- Text: cosmic-200 (light gray)

**Animations:**
```css
/* Button scale on hover */
transition: all 0.3s ease-out;
hover:scale-110

/* Selected state glow */
background: animate-pulse

/* Success message fade in */
animation: fade-in 0.3s duration-300
```

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS and macOS)
- Fetch API: All modern browsers
- localStorage: All modern browsers
- sessionStorage: All modern browsers

### Edge Cases Handled

1. **Already Rated**
   - Check localStorage on mount
   - Display selected state immediately
   - Prevent duplicate submissions

2. **Network Failure**
   - Show error message
   - Keep local rating
   - User can retry later

3. **KV Unavailable**
   - Backend returns 503
   - Frontend shows error
   - Feedback not lost (stays in localStorage)

4. **Rate Limiting**
   - Backend returns 429
   - Frontend shows informative message
   - Doesn't override local rating

5. **Long Questions**
   - Hash function handles any length
   - No truncation needed

### Performance

- Minimal re-renders (controlled state updates)
- Efficient localStorage reads (once on mount)
- Asynchronous API calls (non-blocking)
- No polling or intervals
- Lightweight DOM (simple button structure)

### Privacy & Security

**What We Collect:**
- Question hash (not full text)
- Rating (helpful/not-helpful)
- Timestamp
- Session ID (random, browser-local)
- User agent (from headers)
- Country (from Cloudflare)

**What We Don't Collect:**
- IP addresses
- Names or emails
- Personal information
- Question full text (server-side)
- User identifiers across sessions

**Security Measures:**
- Input validation on backend
- Rate limiting per session
- CORS protection
- No sensitive data stored
- Automatic data expiry (30 days)

### Testing Checklist

- [ ] Buttons appear after answer display
- [ ] Thumbs up submits "helpful" rating
- [ ] Thumbs down submits "not-helpful" rating
- [ ] Selected button shows green/orange glow
- [ ] Success message appears for 3 seconds
- [ ] Can only rate once per question
- [ ] Page reload preserves rating (localStorage)
- [ ] Backend returns 429 on duplicate
- [ ] Network error shows error message
- [ ] Works on mobile devices
- [ ] No console errors

### Setup Instructions

See `/home/gat0r/bunnygod/FEEDBACK_QUICKSTART.md` for complete setup guide.

**Quick Setup:**

1. Create KV namespace:
   ```bash
   ./scripts/setup-feedback-kv.sh
   ```

2. Test locally:
   ```bash
   wrangler dev workers/ask/index.ts
   ./scripts/test-feedback.sh
   ```

3. Deploy:
   ```bash
   wrangler deploy workers/ask/index.ts
   ```

### Analytics & Insights

**Query Feedback Data:**
```bash
# List all feedback
wrangler kv:key list --binding=FEEDBACK --prefix="feedback:"

# Get specific entry
wrangler kv:key get "feedback:abc123:1701234567890" --binding=FEEDBACK
```

**Future Analytics:**
- Helpful/not-helpful ratio by question topic
- Feedback volume over time
- Geographic patterns
- Answer quality scoring
- A/B testing different answer formats

### Acceptance Criteria

- ✅ Feedback buttons appear below answers
- ✅ Visual feedback on selection (gradient glow)
- ✅ One rating per question per session enforced
- ✅ Data stored in Cloudflare KV with 30-day TTL
- ✅ Privacy notice displayed to users
- ✅ No PII collected
- ✅ Works on mobile devices
- ✅ No console errors
- ✅ Graceful error handling
- ✅ Matches cosmic theme

### Future Enhancements

Potential improvements for future iterations:

- **Admin Dashboard**: View feedback statistics in real-time
- **Answer Quality Scoring**: Use feedback to rank answers
- **Machine Learning**: Train on highly-rated answers
- **Social Features**: "Most helpful" badges
- **Advanced Analytics**: Sentiment analysis, trends
- **A/B Testing**: Test different answer formats
- **Personalization**: Adjust answers based on feedback patterns
- **Export Tools**: CSV/JSON export for analysis

### Related Documentation

- **Full Documentation**: `/home/gat0r/bunnygod/docs/FEEDBACK_SYSTEM.md`
- **Quick Start Guide**: `/home/gat0r/bunnygod/FEEDBACK_QUICKSTART.md`
- **Setup Script**: `/home/gat0r/bunnygod/scripts/setup-feedback-kv.sh`
- **Test Script**: `/home/gat0r/bunnygod/scripts/test-feedback.sh`
- **Worker Code**: `/home/gat0r/bunnygod/workers/ask/index.ts`

---

**Last Updated:** 2025-12-01
**Component Status:** ✅ Production Ready (pending KV namespace setup)
