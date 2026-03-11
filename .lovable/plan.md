

## Fixes for Phase 1 Feedback

### 1. Audience Gate — Logo Size + Individual Description
- **Logo**: Increase from `h-20 md:h-28` to `h-32 md:h-44` (roughly 2x larger)
- **Individual hover text**: Shorten from "Take control and confidently navigate your relocation journey" to **"Take control of your relocation journey"**

### 2. Sticky Nav — Visibility Fix + Shorthand Logo
The nav triggers at `scrollY > innerHeight * 0.9`, but since the gate overlay blocks initial scroll and the hero is `min-h-screen`, users may not scroll far enough past the threshold. Fix:
- Lower the threshold to trigger after scrolling ~60% of viewport height (past the hero fold)
- Copy the uploaded graphical element (`re-rooted-graphical_elements-01.png` — the shorthand "Q"-like mark) to `src/assets/` and use it as the nav logo instead of the full wordmark

### 3. Hero Image — Decorative Border Effect + No Scroll Blocking
The uploaded screenshot shows a photo framed inside an organic, curving stroke shape (the Re-Rooted "Q" graphical element) with a lavender tint overlay. Implementation:
- Remove the parallax `motion.div` wrapper that can interfere with scroll flow
- Keep the image within normal document flow (no `position: absolute` or overflow tricks that could block scrolling)
- Apply the decorative effect using CSS:
  - Add a Deep Blue `#1F299C` SVG border/clip-path mimicking the organic swirl shape from the brand graphical element
  - Apply a subtle lavender overlay (`mix-blend-mode` or a pseudo-element) tinting the photo
  - Use `border-radius` and a rotated SVG stroke element positioned around the image
- The graphical element SVG will be created as a component wrapping the image, using the uploaded `re-rooted-graphical_elements-02.png` as reference for the swirl path

### Files to Change
- `src/components/AudienceGate.tsx` — logo size, individual description text
- `src/components/StickyNav.tsx` — lower scroll threshold, swap logo to shorthand mark
- `src/components/CorporateHero.tsx` — restyle image with decorative border, remove scroll-blocking parallax, add lavender tint
- Copy `re-rooted-graphical_elements-01.png` → `src/assets/logo-mark.png`

