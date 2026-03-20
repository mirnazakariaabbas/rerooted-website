

## Plan: Two Fixes

### 1. Scroll to top after gate selection
**File**: `src/components/AudienceGate.tsx`

In `handleSelect`, add `window.scrollTo({ top: 0, behavior: "instant" })` before closing the gate. This ensures that when the user clicks the logo (which opens the gate) and then re-selects an audience, the page resets to the top instead of staying at the previous scroll position.

### 2. Fix S-curve path for stages 3 and 4
**File**: `src/components/ExpatJourney.tsx`

The current path logic always curves the same direction as the card side (`left → -100`, `right → +100`). But for a proper S-curve "road" that winds back and forth, the curve between two stops needs to swing in the **opposite** direction first before arriving at the next stop. The current bezier control points all use the same offset, making the last two segments look flat or kinked instead of curving smoothly.

**Fix**: Change the path generation so each segment's control points swing toward the **opposite** side of where the path is heading, creating a true S-curve between every pair of stops. Specifically:
- The control points for each segment should swing toward the **previous** side (or opposite of the target), then curve into the target stop
- Use alternating control point offsets: `cp1` swings one way, `cp2` swings the other, so the path snakes naturally through all 4 stops

This will produce consistent, road-like curves for all 4 stages instead of only the first 2.

### Files Changed

| File | Change |
|------|--------|
| `src/components/AudienceGate.tsx` | Add `window.scrollTo({ top: 0 })` in `handleSelect` |
| `src/components/ExpatJourney.tsx` | Fix bezier control points for consistent S-curve across all 4 stages |

