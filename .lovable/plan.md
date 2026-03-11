

## Plan: Audience Toggle Pill in Navbar

Convert the static "For Organizations" badge into a clickable toggle that switches between "For Organizations" and "For Individuals" using the existing `useAudience` context.

### Changes in `src/components/StickyNav.tsx`

**Desktop (line 46-49):** Replace the static `<span>` with a `<button>` that:
- Displays the current audience label ("For Organizations" / "For Individuals")
- On click, toggles `audience` between `"organization"` and `"individual"` via `setAudience`
- Animates the text swap using framer-motion `AnimatePresence` + `motion.span` with a subtle slide/fade
- Keeps the pill styling (rounded-full, border, dot indicator) but adds `cursor-pointer` and hover state

**Mobile (line 85-88):** Same toggle button in the mobile menu.

**Context usage:** Destructure `audience` and `setAudience` from `useAudience()` (line 17) alongside `gateOpen`.

### Visual behavior
- Pill shows a colored dot + current audience text
- Clicking smoothly crossfades to the other label
- The dot color could subtly change between audiences (e.g., `bg-secondary` vs `bg-accent`)

