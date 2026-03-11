

## Plan: Redesign the Integration Program Section

Three changes to the "Re-Rooted® Journey" section:

### 1. Title: Replace "Re-Rooted®" text with the blue logo

The heading currently reads `The Re-Rooted® Journey` as plain text. Change it to:
- "The" (text) + `<img>` of `logo-shorthand-blue.png` (inline, ~40px height) + "Journey" (text)
- Use `inline-flex items-center` to vertically align the logo with the text

### 2. Add "Keep scrolling" subtitle

Below the title, add a line in Deep Blue (`text-primary`):
- Text: "Keep scrolling ↓" (or with a Lucide `ChevronDown` icon)
- Styled: `text-primary text-sm font-semibold tracking-wide`
- Subtle bounce or pulse animation on the arrow to invite scrolling

### 3. Replace horizontal sticky-scroll timeline with vertical vine/root layout

**Remove** the current `DesktopTimeline` (horizontal sticky scroll with `h-[500vh]`).

**New design** — a vertical scrollable section (no sticky, natural scroll) with an SVG vine/root path running down the center:

- An SVG `<path>` draws a sinuous S-curve (vine shape) down the center of the container
- The path uses `stroke-dasharray` + `stroke-dashoffset` animated by `useScroll` so it draws as you scroll
- Path color transitions from brown at the base to green (`hsl(153,45%,45%)`) as it grows upward (rendered top-down: green at top, browning toward bottom — or all green for simplicity)
- 5 step nodes are positioned alternating left/right along the vine (like the reference image)
  - Odd steps (1, 3, 5): icon circle on the LEFT of the vine, text to the LEFT
  - Even steps (2, 4): icon circle on the RIGHT, text to the RIGHT
- Each node has the green circle with white icon, timing label, step name, and description
- Nodes fade/slide in via `IntersectionObserver` as user scrolls past them
- The vine SVG path connects through each node position

**Mobile**: Same vertical vine layout but nodes all on the right side of the vine (like current mobile layout but with the curvy SVG path instead of a straight line).

**Summary + CTAs** appear at the bottom after the last step, always visible (no conditional on scroll position).

### Files Changed

| File | Change |
|------|--------|
| `src/components/IntegrationProgram.tsx` | Complete rewrite: vertical vine timeline with SVG path, alternating left/right nodes, scroll-driven path animation, logo in title, "keep scrolling" subtitle |

