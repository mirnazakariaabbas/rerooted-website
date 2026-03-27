

## Plan: Push Auth Content Upward

**File**: `src/pages/Auth.tsx`

Shift the entire card upward within the vertically-centered flex container by adding negative top margin or switching from `items-center` to `items-start` with top padding. The simplest approach: add a negative margin-top (e.g. `-mt-16` or `-mt-20`) to the inner `motion.div` wrapper, which keeps `items-center` centering but nudges everything upward.

### Change

In the outer `motion.div` (around line 108), add `-mt-16` to its className to shift the content block upward while preserving horizontal width.

