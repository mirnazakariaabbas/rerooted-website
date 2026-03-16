

## Plan: Curvy Arrow Timeline + Background Arrow Animations

Two changes: redesign the journey timeline with hand-drawn curvy arrows between steps, and add decorative background arrow/scribble animations across the entire site.

### 1. Journey Timeline — Curvy Arrow Connectors

Replace the straight vertical line with **SVG curvy arrow connectors** between each step (inspired by the "Our Plan" reference image).

**Layout:**
- Steps alternate left/right on desktop (all left-aligned on mobile)
- Between each pair of steps, an SVG arrow curves from one step's icon to the next — like the hand-drawn arrows in the reference
- Each arrow is a quadratic bezier curve with an arrowhead at the end
- Arrows + step content are revealed progressively via `IntersectionObserver` as the user scrolls
- Icons start gray, turn green when scrolled to
- Step descriptions fade in when the step becomes visible

**Arrow style:**
- Thick stroke (~3-4px), rounded caps, secondary color (green)
- Small triangular arrowhead at the tip
- Slightly wobbly/organic feel using SVG filter (subtle `feTurbulence`)
- Each arrow draws itself (stroke-dashoffset animation) when it enters the viewport

**Mobile:** Arrows curve from one step down to the next, all on the same side.

### 2. Background Decorative Arrows

Add a new `BackgroundScribbles` component rendered behind page content (fixed/absolute positioned, `pointer-events-none`, low opacity ~0.08-0.12).

**Elements:**
- 6-8 large, thin, hand-drawn arrow/swirl SVG paths scattered across the viewport (similar to the Happybase screenshot)
- Styled with `stroke: currentColor` using `text-foreground` at low opacity
- Gentle parallax: each scribble moves slightly on scroll using `useScroll` + `useTransform` for subtle vertical offset
- Placed in `Index.tsx` wrapping all content

### Files Changed

| File | Change |
|------|--------|
| `src/components/IntegrationProgram.tsx` | Replace straight line with curvy SVG arrow connectors between steps, scroll-reveal each step + arrow |
| `src/components/BackgroundScribbles.tsx` | New component: decorative hand-drawn arrow SVGs with parallax |
| `src/pages/Index.tsx` | Add `BackgroundScribbles` behind content |

