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
