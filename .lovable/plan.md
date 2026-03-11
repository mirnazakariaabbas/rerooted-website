

## Sticky-to-Floating Navbar

When the user is at the top of the page, the navbar sits flush against the top edge (full-width, with bottom border). Once the user scrolls down, the navbar transitions to a floating style (narrower width, rounded corners, slight margin from top, shadow).

### Changes in `src/components/StickyNav.tsx`

1. **Add scroll listener** — Track `scrollY` with a `useEffect` + `useState`. Set `scrolled = true` when `scrollY > 50`.

2. **Conditional styles on `<motion.header>`**:
   - **At top (`!scrolled`)**: Full-width, `inset-x-0 top-0`, border-bottom, no rounded corners
   - **Scrolled (`scrolled`)**: Add `mx-4 md:mx-8 top-3 rounded-2xl shadow-lg`, remove border-bottom — creating the floating pill look

3. **Animate transition** — Use Tailwind `transition-all duration-300` so the shape/margin changes are smooth.

### Visual result
- At top: standard sticky bar spanning full width
- On scroll: bar lifts off edges, gains rounded corners and shadow, becoming a floating element

