## Goal
Add a new editorial, black-background "Field Note 02 — The Problem" section directly after the Hero on both `IndividualHome` and `CorporateHome`, matching the supplied spec 1:1.

## Open question (please confirm before I build)
Both homepages currently render `<ProblemStats>` right after `<WhyReRooted>`. The new section covers the same topic ("The Problem"). Pick one:
- **A. Replace** the existing `ProblemStats` with the new section on both pages.
- **B. Keep both** — render the new section between Hero and WhyReRooted, leave ProblemStats where it is.
- **C. Replace on Corporate only** (where the headline is literally "The Problem Companies Avoid"), keep ProblemStats on Individual.

Default if you don't say: **A (replace on both)** — the new section is a stronger, more on-spec take.

## What gets built

### 1. New component: `src/components/ProblemCompaniesAvoid.tsx`
Self-contained section that follows the spec exactly:
- Near-black `#0A0A0A` background, white text, full-width, `min-h-screen`.
- Fixed left/right 56px edge rails with vertical labels (hidden <980px).
- Centered 1200px inner frame, 80px horizontal padding (28px mobile), 80/100px vertical padding.
- Top meta strip: `§ 02 — The Problem` ↔ sources, on a hairline border.
- Masthead: "Ninety-eight" in Instrument Serif italic, with a small green `percent` label inline.
- Subhead in Instrument Serif italic, max 44ch.
- "The findings · iii. data points" divider.
- 3-column stats grid (`1 in 3`, `42%`, `80%`) with green tag labels, big serif numbers, italic captions. Collapses to 1 column <980px.
- Closing line with one italic+green phrase ("default outcome") and right-aligned "Re-Rooted® exists to change that".

### 2. Page wiring
Edit `src/pages/IndividualHome.tsx` and `src/pages/CorporateHome.tsx`:
- Import `ProblemCompaniesAvoid`.
- Render it right after `<Hero …/>`.
- Apply chosen option (A/B/C) for the existing `<ProblemStats>`.

### 3. No `index.html` changes needed
Instrument Serif and Inter Tight are already loaded in the existing Google Fonts link.

## Technical details

- Component is a single `.tsx` file with all styles inlined via Tailwind arbitrary values + a tiny `<style>` block scoped to the section for the things Tailwind handles awkwardly (writing-mode for vertical rails, the `clamp()` font-sizes, the inline-flex masthead/percent alignment). Keeps it dependency-free.
- Font families set locally on the section root: `font-family: 'Inter Tight', sans-serif;` with serif elements using `font-family: 'Instrument Serif', serif;`. No global Tailwind config changes.
- Colors hardcoded per spec (`#0A0A0A`, `#3DA776`, `#BCADD4`, white at various opacities). This intentionally diverges from the Deep Blue / Manrope project tokens — scoped to this section only, no global token edits.
- No shadows, no gradients, no rounded corners, no icons (matches both spec and project core rules).
- Edge rails use `position: fixed` with `pointer-events: none` and `z-index: 5`, hidden via media query <980px so they don't fight mobile layout.
- Responsive breakpoint: a single 980px boundary (per spec) for rails, headline scaling, and grid collapse.

## Out of scope
- No memory updates (this is a one-off editorial section; existing ProblemStats memory still applies if we keep it).
- No changes to navigation, routing, or the StickyNav adaptive behavior.
- No new tests (pure presentational component).
