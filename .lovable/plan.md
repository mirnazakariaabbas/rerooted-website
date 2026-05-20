# Animated sketch tree in the homepage opening section

Replace the static `hero-tree-cropped.png` image in the homepage opening section (`WhyReRootedStatement`) with a hand-sketched SVG tree that draws itself in real time when the section scrolls into view.

## What you'll see

- Section loads with the existing wordmark, tagline, paragraph, and CTAs on the left.
- On the right (or below text on mobile), a deep-blue tree appears line by line:
  1. Trunk draws bottom to top
  2. Roots fan outward below
  3. Main branches grow up and out
  4. Smaller branches extend further
  5. Subtle leaf clusters fade in last
- Total draw time about 10 seconds, plays once, then stays.
- No background box, no shadow, just blue lines on the warm white section.

## Layout changes

In `src/components/WhyReRooted.tsx`, restructure `WhyReRootedStatement` only:

- Wrap the existing text content (wordmark, tagline, paragraph, CTAs) in a left column at ~55% width on desktop.
- Add a right column at ~45% width holding the new `AnimatedTree`.
- Remove the absolutely-positioned `heroTreeCropped` image and the import for it.
- Stack vertically on mobile (text first, tree below at ~260px wide).

`WhyReRootedPillars` and every other section/file stay untouched.

## The tree component

New file `src/components/AnimatedTree.tsx`:

- Inline SVG, viewBox `0 0 400 500`, ~380x480 on desktop, ~260px on mobile.
- Paths: 1 trunk, 5-7 roots, 4-6 main branches, 6-8 small branches, 12-18 leaf clusters.
- All strokes `#1F299C`, `fill="none"`, rounded caps/joins; leaf clusters subtle `fill="#1F299C"` at `opacity 0.15`.
- Pure CSS keyframes using `stroke-dasharray` / `stroke-dashoffset` for the draw effect; `opacity` fade for leaves.
- Use framer-motion's `useInView` to trigger the animation once when scrolled into view; apply a class that starts the keyframes. No loop, `animation-fill-mode: forwards`.
- Staggered delays per the brief: trunk 0-1.5s, roots 0.3-3.5s, main branches 1.5-5s, small branches 3.5-7s, leaves 6-10s.

## Out of scope

- No other components, pages, routes, or copy change.
- No new libraries (no GSAP, Lottie, anime.js).
- No video, GIF, hand, or cursor visuals.
- The existing section background and warm-white veil stay as-is.
