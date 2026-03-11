

## Phase 2: The Problem + Integration Program

Two new components to create and wire into `Index.tsx`.

### Component 1: `ProblemStats.tsx`

Full-width section with Deep Blue (`#1F299C`) background containing:

- **Top label**: "WHY I BUILT RE-ROOTED®" in green, uppercase, letter-spaced
- **Headline**: "The Problem Companies Avoid" in white, ~44px, weight 800
- **Two-column layout**:
  - Left: massive "98%" counter (green, 120px) + subtitle
  - Right: two stacked lavender cards with counting stats ("10–20%", "1 in 3")
- **Source line**: white, 50% opacity, small text
- **Animations**: Use framer-motion `useInView` for fade-ins, a custom `useCountUp` hook for number animations, and staggered slide-in for right cards
- **Mobile**: Stack columns vertically

### Component 2: `IntegrationProgram.tsx`

The sticky-scroll timeline section with Warm White (`#FAF9F6`) background:

- **Structure**: A tall outer `div` (e.g., `h-[500vh]`) with a `position: sticky` inner container that fills the viewport
- **Horizontal timeline**: 5 nodes (phone, clipboard, sprout, flag, check icons from lucide-react) connected by a line that progressively fills green
- **Scroll mapping**: Use `useScroll` + `useTransform` from framer-motion on the outer container to map scroll progress (0-1) to active step (1-5)
- **Content area**: Crossfade between step descriptions using `AnimatePresence`
- **Click**: Clicking a node programmatically scrolls to the corresponding position in the outer container
- **Summary + CTAs**: Appear when progress reaches step 5
- **Mobile**: Vertical timeline layout, no sticky pin — just intersection-based reveals for each step card. Detect via `useIsMobile` hook.

### Changes to `Index.tsx`

Replace the `#program` and `#journey` placeholder sections with the two new components. Set `id="program"` on the `IntegrationProgram` section (or a wrapper encompassing both).

### Changes to `StickyNav.tsx`

The nav link "The Program" already points to `#program` — just ensure the section ID matches.

### File summary

| File | Action |
|------|--------|
| `src/components/ProblemStats.tsx` | Create |
| `src/components/IntegrationProgram.tsx` | Create |
| `src/pages/Index.tsx` | Update — replace placeholder sections |

