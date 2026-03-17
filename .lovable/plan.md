

## Fix: Clicking Backward on Journey Timeline

**Root cause**: When clicking backward (e.g., Final Assessment → Integration Assessment), the smooth scroll animation fires intermediate scroll events. The `useMotionValueEvent` callback updates `scrollActive` continuously during the animation, and the line `if (clickedStep !== null && idx === clickedStep) setClickedStep(null)` clears the click override prematurely — then `scrollActive` takes over with whatever scroll position happens to be current, fighting the intended selection.

**Fix in `src/components/IntegrationProgram.tsx`**:

1. Remove the "clear clickedStep when scroll catches up" logic from `useMotionValueEvent`
2. Instead, only clear `clickedStep` when the user **manually scrolls** (wheel/touch), not during programmatic smooth scrolls
3. Add a `isScrolling` ref flag: set `true` in `jumpTo`, set `false` after a short timeout (~800ms) to cover the smooth scroll duration
4. In `useMotionValueEvent`: only update `scrollActive` and only clear `clickedStep` when `isScrolling` is `false` (i.e., user is manually scrolling, not from a click-triggered scroll)

This ensures clicking any step — forward or backward — immediately and reliably sets the active state, and only natural user scrolling resumes scroll-driven behavior.

**Single file changed**: `src/components/IntegrationProgram.tsx` (lines 50-60 region)

