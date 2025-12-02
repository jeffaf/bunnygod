# Mobile Optimization Fixes - Quick Reference

## CRITICAL ISSUES (Must Fix Immediately)

### 1. Touch Target Failures ❌

**Problem:** Multiple buttons below Apple/Google 44×44px minimum

**Files to Fix:**
- `src/components/phase2/ShareButtons.tsx` - Lines 110-177
- `src/components/phase2/FeedbackButtons.tsx` - Lines 95-162
- `src/components/phase2/QuestionHistory.tsx` - Line 155

**Quick Fix:**
```tsx
// Change all instances of:
className="px-4 py-2..."  // ❌ ~32px height

// To:
className="px-6 py-3..."  // ✅ ~48px height

// For Clear All button specifically:
className="px-3 py-1..."  // ❌ ~24px height
// To:
className="px-5 py-2.5..." // ✅ ~44px height
```

---

### 2. Submit Button Layout ❌

**Problem:** Button positioned outside thumb zone, overlaps textarea

**File to Fix:**
- `src/components/QuestionInput.tsx` - Lines 36-62

**Solution:** 
- Desktop: Keep absolute positioning inside textarea
- Mobile: Full-width button below textarea

**Implementation:**
```tsx
<div className="relative">
  <textarea rows={3} className="w-full..." />

  {/* Desktop only - absolute positioned */}
  <button className="hidden md:block absolute bottom-4 right-4 px-8 py-3...">
    Ask Bunny God
  </button>

  {/* Mobile only - full-width below */}
  <button className="md:hidden w-full mt-3 px-6 py-4 rounded-xl...">
    Ask Bunny God
  </button>
</div>
```

---

## MEDIUM PRIORITY (Should Fix)

### 3. Particle Performance

**Problem:** 15 particles on mobile drains battery

**File to Fix:**
- `src/components/phase2/MysticalBackground.tsx` - Line 36

**Quick Fix:**
```tsx
const baseCount = isMobile ? 10 : 40; // Was: 15
```

---

### 4. Textarea Mobile Height

**Problem:** 4 rows too tall on small screens

**File to Fix:**
- `src/components/QuestionInput.tsx` - Line 32

**Quick Fix:**
```tsx
rows={3} // Was: 4
```

---

## TESTING CHECKLIST

After fixes, test on:
- [ ] Chrome DevTools → iPhone SE (375×667)
- [ ] Touch target overlay enabled
- [ ] Soft keyboard open (portrait + landscape)
- [ ] Verify all buttons tappable with 44×44 grid overlay
- [ ] Run Lighthouse mobile audit (target 90+)

---

## EFFORT ESTIMATE

- Touch target fixes: **2 hours**
- Button layout fix: **1.5 hours**
- Particle optimization: **1 hour**
- Testing: **2 hours**

**Total: ~6.5 hours**

---

See `MOBILE_OPTIMIZATION_REPORT.md` for full details.
