

## Phase 3: Three New Sections

### New Components

#### 1. `src/components/ExpatJourney.tsx` — Section 5
- Warm White background (`#FAF9F6`)
- Headline + subline with specified typography
- **Desktop**: Hand-drawn SVG looping path connecting 4 stage nodes (Pre-Rooted, Rooting In, Thrive, Rooting Back) in a non-linear layout with curves and loops. Path uses `stroke-dasharray`/`stroke-dashoffset` animated via Framer Motion `useScroll` + `useTransform` to draw on scroll. Each node fades in when path progress reaches it (at 25%, 50%, 75%, 100%). Description text fades in 0.2s after node.
- SVG path: Deep Blue `#1F299C`, stroke-width 3, with slight irregularity (hand-drawn bezier curves). Nodes are circles with stage name (weight 700), description (weight 400), and "Learn more →" link in Fresh Green `#3DA776`. Hover: scale + shadow.
- **Mobile**: Vertical SVG path drawing downward, stages stacked. Same draw-on-scroll behavior.
- `id="journey"` for nav anchor

#### 2. `src/components/AboutSection.tsx` — Section 6
- Warm White background, `id="about"`
- 50/50 split: left = grey placeholder rectangle (3:4 portrait), right = text block
- Text: headline weight 800, 3 body paragraphs, "Read the full story →" CTA in Fresh Green
- Animation: image slides from left (`x: -60`), text from right (`x: 60`) on scroll via `useInView`
- Mobile: image stacks above text, full width

#### 3. `src/components/GroundingPillars.tsx` — Section 7
- Deep Blue `#1F299C` full-width background, all white text
- Centered headline, 3×2 grid of cards with semi-transparent white bg/border
- 6 pillars with name (weight 700) and description (weight 300)
- Cards stagger-reveal: fade + rise (`y: 40`), 0.15s delay between each
- Mobile: 2-column or single-column grid
- `id="pillars"` for potential future nav use

### Modified Files

#### `src/pages/CorporateHome.tsx` and `src/pages/IndividualHome.tsx`
- Import and add ExpatJourney, AboutSection, GroundingPillars after IntegrationProgram
- Remove old placeholder `#about` section (replaced by real component)
- Keep `#insights` and `#contact` placeholders

#### `src/components/StickyNav.tsx`
- Corporate links: "The Journey" already points to `#journey` — confirmed correct
- Individual links: "Your Journey" already points to `#journey` — confirmed correct
- "About" already points to `#about` — confirmed correct
- No nav changes needed

### Files Changed

| File | Action |
|------|--------|
| `src/components/ExpatJourney.tsx` | Create — SVG path journey map with scroll-draw animation |
| `src/components/AboutSection.tsx` | Create — Split layout, photo placeholder + bio text |
| `src/components/GroundingPillars.tsx` | Create — Deep blue section with 6 staggered cards |
| `src/pages/CorporateHome.tsx` | Add 3 new section imports below IntegrationProgram |
| `src/pages/IndividualHome.tsx` | Add 3 new section imports below IntegrationProgram |

