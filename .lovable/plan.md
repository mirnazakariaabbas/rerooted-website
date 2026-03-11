

## Plan: Fix the Integration Program Timeline

Five changes to address all issues:

### 1. Revert title — remove logo, use plain text
Change the heading back to plain text: **"The Re-Rooted® Journey"**. Remove the logo image import.

### 2. Fix vine crossing over text — increase spacing between vine and content
The current layout places text at `calc(50% + 40px)` from the vine center, but the S-curve amplitude (120px) means the path swings into the text zone. Fix by:
- Increasing the gap: position text at `calc(50% + 80px)` from center
- Reducing vine amplitude to `80px` so it stays within its lane
- OR: simply ensure the SVG vine is rendered behind nodes with proper z-indexing and offset

### 3. Icons sit ON the vine path, turn green when scrolled to
- Remove icons from the text cards
- Place icon circles as absolutely-positioned elements centered on the vine path at each node's Y position and X position (matching the SVG curve)
- Icons start with `bg-muted text-muted-foreground` (gray)
- When the node becomes visible (IntersectionObserver), animate to `bg-secondary text-white` (green)
- Icons sit on top of the vine (z-10) so the path appears to pass through them

### 4. Description reveals on scroll — only show timing + name initially
- Each node shows timing + step name by default
- Description (`desc`) is hidden initially, revealed with a slide-down + fade animation when the node's IntersectionObserver triggers
- This makes text "interactive" — content appears as you scroll to it

### 5. Thicker, hand-drawn "treasure map" style vine
- Increase `strokeWidth` from `3` to `6`
- Add `strokeLinecap="round"` and `strokeLinejoin="round"` 
- Apply a slight SVG filter (`feTurbulence` + `feDisplacementMap`) to give the line a hand-drawn, wobbly look — like a treasure map path
- Background path uses a dashed style (`strokeDasharray="12 6"`) for a dotted map trail feel

### Files Changed

| File | Change |
|------|--------|
| `src/components/IntegrationProgram.tsx` | Full rework: plain text title, icons on vine path with color transition, description reveal on scroll, thicker hand-drawn path style, proper spacing |

