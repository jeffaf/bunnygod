# Question History Feature - Test Plan

**Feature:** Question History (Feature #4, Phase 2 Sprint 2)
**Date:** 2025-12-01
**Status:** Ready for Testing

## Overview

The Question History feature saves the last 10 questions users have asked in localStorage and provides a UI component for quickly re-asking previous questions.

## Files Created/Modified

### Created:
- `/home/gat0r/bunnygod/src/components/phase2/QuestionHistory.tsx` - Main component
- `/home/gat0r/bunnygod/QUESTION_HISTORY_TEST_PLAN.md` - This file

### Modified:
- `/home/gat0r/bunnygod/src/components/BunnyGodInterface.tsx` - Integration
- `/home/gat0r/bunnygod/src/components/QuestionInput.tsx` - Added initialValue prop
- `/home/gat0r/bunnygod/src/components/phase2/README.md` - Documentation

## Test Environment

1. **Start dev server:**
   ```bash
   cd /home/gat0r/bunnygod
   bun run dev
   ```

2. **Open in browser:**
   - Local: http://localhost:4321
   - Network: http://0.0.0.0:4321

3. **Browser DevTools:**
   - Console: Check for errors
   - Application > Local Storage: Verify `bunny-god-question-history`
   - Network: Monitor API calls

## Test Cases

### 1. Basic Functionality Tests

#### Test 1.1: First Question
**Steps:**
1. Open fresh browser (clear localStorage)
2. Ask a philosophical question
3. Check if history button appears

**Expected:**
- History button (📜) appears in top-right corner
- Badge shows "1"
- No console errors

**Status:** [ ] Pass / [ ] Fail

---

#### Test 1.2: Multiple Questions
**Steps:**
1. Ask 5 different questions
2. Check history button badge
3. Open history panel

**Expected:**
- Badge shows "5"
- Panel displays all 5 questions in reverse order (newest first)
- Questions are numbered 1-5

**Status:** [ ] Pass / [ ] Fail

---

#### Test 1.3: Max 10 Questions
**Steps:**
1. Ask 12 different questions
2. Open history panel
3. Check question count

**Expected:**
- Badge shows "10"
- Only last 10 questions visible
- First 2 questions removed from history

**Status:** [ ] Pass / [ ] Fail

---

#### Test 1.4: Duplicate Questions
**Steps:**
1. Ask question: "What is consciousness?"
2. Ask different question
3. Ask "What is consciousness?" again
4. Check history

**Expected:**
- "What is consciousness?" appears only once
- It's at position #1 (most recent)
- Total count doesn't increase

**Status:** [ ] Pass / [ ] Fail

---

### 2. Persistence Tests

#### Test 2.1: Page Reload
**Steps:**
1. Ask 3 questions
2. Hard reload page (Ctrl+Shift+R)
3. Check if history button appears
4. Open history panel

**Expected:**
- History button shows "3"
- All 3 questions still present
- Same order maintained

**Status:** [ ] Pass / [ ] Fail

---

#### Test 2.2: Tab Close/Reopen
**Steps:**
1. Ask questions
2. Close browser tab completely
3. Open new tab to same URL
4. Check history

**Expected:**
- History persists across sessions
- Questions remain in localStorage

**Status:** [ ] Pass / [ ] Fail

---

#### Test 2.3: localStorage Disabled
**Steps:**
1. Disable localStorage in DevTools (simulate private browsing)
2. Ask questions
3. Check for errors

**Expected:**
- No console errors
- Component degrades gracefully
- Questions not saved (expected behavior)

**Status:** [ ] Pass / [ ] Fail

---

### 3. Re-Ask Functionality Tests

#### Test 3.1: Click Historical Question
**Steps:**
1. Ask question: "What is free will?"
2. Wait for answer
3. Ask different question
4. Open history and click "What is free will?"

**Expected:**
- History panel closes
- Question is re-submitted
- Loading oracle appears
- New answer received

**Status:** [ ] Pass / [ ] Fail

---

#### Test 3.2: Question Auto-Fill
**Steps:**
1. Open history
2. Click a question
3. Observe the QuestionInput component

**Expected:**
- Question is submitted automatically
- No manual "Ask Bunny God" button click needed
- Smooth transition

**Status:** [ ] Pass / [ ] Fail

---

### 4. UI/UX Tests

#### Test 4.1: History Button Appearance
**Steps:**
1. Inspect history button visually

**Expected:**
- Fixed position: top-right corner
- Cosmic-themed background
- 📜 scroll emoji visible
- Badge with count visible
- Hover effect works (scale 1.1x)

**Status:** [ ] Pass / [ ] Fail

---

#### Test 4.2: Panel Open/Close
**Steps:**
1. Click history button to open
2. Click button again to close
3. Open panel, click outside to close (desktop)

**Expected:**
- Smooth fade-in animation
- Panel slides in from top
- Closes smoothly
- No visual glitches

**Status:** [ ] Pass / [ ] Fail

---

#### Test 4.3: Question Truncation
**Steps:**
1. Ask very long question (200+ characters)
2. Open history
3. Check how it displays

**Expected:**
- Question truncated to 3 lines
- Ellipsis (...) shown
- No overflow issues
- Readable and clean

**Status:** [ ] Pass / [ ] Fail

---

#### Test 4.4: Clear All Button
**Steps:**
1. Ask 5 questions
2. Open history panel
3. Click "Clear All" button
4. Check localStorage

**Expected:**
- Confirmation or immediate clear
- History panel closes
- localStorage cleared
- History button disappears
- Badge shows "0" or button hidden

**Status:** [ ] Pass / [ ] Fail

---

### 5. Mobile Responsiveness Tests

#### Test 5.1: Mobile Viewport (375px)
**Steps:**
1. Open DevTools
2. Set viewport to iPhone SE (375px)
3. Ask questions
4. Open history

**Expected:**
- Button still visible and clickable
- Panel full-width with margins
- Backdrop overlay appears
- Touch targets adequate size (44px+)

**Status:** [ ] Pass / [ ] Fail

---

#### Test 5.2: Tablet Viewport (768px)
**Steps:**
1. Set viewport to iPad (768px)
2. Test history functionality

**Expected:**
- Transitions between mobile/desktop layouts
- All features work smoothly

**Status:** [ ] Pass / [ ] Fail

---

#### Test 5.3: Mobile Backdrop
**Steps:**
1. Use mobile viewport
2. Open history panel
3. Tap backdrop (outside panel)

**Expected:**
- Panel closes
- Smooth animation
- No errors

**Status:** [ ] Pass / [ ] Fail

---

### 6. Accessibility Tests

#### Test 6.1: Keyboard Navigation
**Steps:**
1. Tab to history button
2. Press Enter to open
3. Tab through questions
4. Press Enter on a question

**Expected:**
- All elements keyboard accessible
- Visible focus indicators
- Enter/Space keys work
- Logical tab order

**Status:** [ ] Pass / [ ] Fail

---

#### Test 6.2: ARIA Labels
**Steps:**
1. Inspect with accessibility DevTools
2. Check ARIA attributes

**Expected:**
- Button has aria-label="Question History"
- Panel has aria-expanded state
- Questions have aria-label with question text
- Semantic HTML used

**Status:** [ ] Pass / [ ] Fail

---

#### Test 6.3: Screen Reader
**Steps:**
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate through component

**Expected:**
- History button announced properly
- Question count announced
- Questions read correctly
- Clear feedback on actions

**Status:** [ ] Pass / [ ] Fail

---

### 7. Performance Tests

#### Test 7.1: localStorage Performance
**Steps:**
1. Open DevTools Performance tab
2. Ask 10 questions rapidly
3. Check localStorage write operations

**Expected:**
- No blocking operations
- Writes are debounced
- No UI lag
- < 5ms for localStorage operations

**Status:** [ ] Pass / [ ] Fail

---

#### Test 7.2: Component Re-renders
**Steps:**
1. Install React DevTools
2. Monitor component re-renders
3. Ask questions and interact with history

**Expected:**
- Minimal unnecessary re-renders
- Efficient state updates
- No render loops

**Status:** [ ] Pass / [ ] Fail

---

### 8. Edge Case Tests

#### Test 8.1: Empty Questions
**Steps:**
1. Try to submit empty question
2. Try to submit whitespace-only question
3. Check history

**Expected:**
- Empty questions not added to history
- No blank entries in list

**Status:** [ ] Pass / [ ] Fail

---

#### Test 8.2: Special Characters
**Steps:**
1. Ask question with emojis: "What is 🤔 consciousness?"
2. Ask question with quotes: "What is 'free will'?"
3. Ask question with HTML: "What is <strong>truth</strong>?"

**Expected:**
- All special characters stored correctly
- No XSS vulnerabilities
- Displays properly in history

**Status:** [ ] Pass / [ ] Fail

---

#### Test 8.3: Very Long History Session
**Steps:**
1. Ask 50+ questions over time
2. Check localStorage size
3. Verify only last 10 stored

**Expected:**
- localStorage doesn't grow unbounded
- Only 10 questions stored at any time
- No memory leaks

**Status:** [ ] Pass / [ ] Fail

---

### 9. Integration Tests

#### Test 9.1: With Loading State
**Steps:**
1. Click historical question
2. Observe loading oracle

**Expected:**
- Loading oracle appears immediately
- History panel closes
- Loading state shows until answer arrives

**Status:** [ ] Pass / [ ] Fail

---

#### Test 9.2: With Error State
**Steps:**
1. Disconnect network
2. Click historical question
3. Check error handling

**Expected:**
- Error message displayed
- Question still in history
- Can retry from history

**Status:** [ ] Pass / [ ] Fail

---

#### Test 9.3: Answer Display Integration
**Steps:**
1. Re-ask question from history
2. Check if answer displays correctly

**Expected:**
- Answer displays with question context
- Sources shown if available
- ShareButtons work (if implemented)

**Status:** [ ] Pass / [ ] Fail

---

### 10. Browser Compatibility Tests

#### Test 10.1: Chrome/Edge
**Steps:**
1. Test all functionality in Chrome
2. Test in Edge

**Expected:**
- Full functionality works
- No console errors
- Visual appearance correct

**Status:** [ ] Pass / [ ] Fail

---

#### Test 10.2: Firefox
**Steps:**
1. Test all functionality in Firefox

**Expected:**
- localStorage works
- Animations smooth
- No Firefox-specific issues

**Status:** [ ] Pass / [ ] Fail

---

#### Test 10.3: Safari (Desktop & iOS)
**Steps:**
1. Test in Safari desktop
2. Test on real iPhone/iPad if available

**Expected:**
- Works in Safari
- iOS Safari localStorage works
- Touch interactions smooth

**Status:** [ ] Pass / [ ] Fail

---

## Visual Inspection Checklist

- [ ] History button matches mystical theme
- [ ] Badge is clearly visible
- [ ] Panel has proper cosmic/mystic colors
- [ ] Custom scrollbar styled correctly
- [ ] Hover effects work smoothly
- [ ] Animations are smooth (no jank)
- [ ] Text is readable
- [ ] Spacing and alignment correct
- [ ] Mobile layout looks good
- [ ] Desktop layout looks good

## Developer Verification

### localStorage Data Structure
```javascript
// Open DevTools Console
localStorage.getItem('bunny-god-question-history')

// Expected format:
// ["Question 1?", "Question 2?", "Question 3?"]
```

### Component State (React DevTools)
```javascript
// QuestionHistory component state:
{
  history: string[],      // Array of questions
  isOpen: boolean,        // Panel open/closed
  isMounted: boolean      // Client-side hydration flag
}
```

### Network Tab
- [ ] No unexpected API calls when opening history
- [ ] Re-asking question triggers correct API call

### Console
- [ ] Zero errors
- [ ] Zero warnings (except known deprecation warnings)

## Acceptance Criteria Verification

- [ ] ✅ Stores last 10 questions in localStorage
- [ ] ✅ Questions are clickable to re-ask
- [ ] ✅ Clear history button works
- [ ] ✅ Persists across page reloads
- [ ] ✅ Mobile responsive
- [ ] ✅ No console errors
- [ ] ✅ Keyboard accessible
- [ ] ✅ Matches mystical theme
- [ ] ✅ Smooth animations

## Issues Found

| Issue # | Description | Severity | Status |
|---------|-------------|----------|--------|
| 1       |             |          |        |
| 2       |             |          |        |
| 3       |             |          |        |

## Next Steps

After all tests pass:

1. **Deploy to staging** (if available)
2. **User acceptance testing**
3. **Monitor localStorage quota usage**
4. **Gather user feedback**
5. **Consider future enhancements:**
   - Search/filter functionality
   - Question categories
   - Export/import history
   - Analytics on popular questions

## Testing Sign-Off

**Tested by:** ___________________
**Date:** ___________________
**Status:** [ ] Approved / [ ] Needs fixes
**Notes:**

---

**Next Feature:** Share & Copy Functionality (Feature #5)
