

## Plan: Replace `IntegrationProgram` with vertical tree-timeline

Replace the current corporate-only horizontal sticky-scroll 5-step section with the vertical alternating timeline from the upload, using the upload's exact content (6 steps including the new "Day 1 — Assignment complexity evaluation" step) and editorial typography.

### What changes

- **`src/components/IntegrationProgram.tsx`** — full rewrite of the component body. Keep the same export name and `id="program"` so `CorporateHome.tsx` and the "See how it works" CTA continue to work without changes.

### Layout & content (verbatim from upload)

Six steps, alternating left/right around a central spine:

1. Day 0 — Candidate shortlisted (star)
2. Day 1 — Assignment complexity evaluation (graph) ← **new step**
3. Week 1 — Personal needs assessment (list)
4. Weeks 2–14 — Active coaching (sprout)
5. Week 15 — Final assessment (flag)
6. Post-program — Ongoing support (check)

Footer totals: 90 days · 6 sessions · 2 assessments · 1 final report.

### Visual treatment

- Warm White `#FAF9F6` background, large editorial heading "The ReRooted *Journey*" with serif italic green emphasis (Instrument Serif via Google Fonts, loaded once at the top of the component or in `index.html`).
- Center spine: thin Deep Blue line at 12% opacity, with a green fill that grows downward as the user scrolls (scroll-linked `scaleY` transform).
- Each step: meta column (date eyebrow + serif title), 72px circular icon node alternating Blue/Green with a Warm-White ring, and body copy column. Pop-in animation on the dot when the step enters view; row fades up on intersection.
- Mobile (<980px): collapses to single column with a left-aligned spine and 32px dots (already handled in the upload's CSS).

### Adjustments to keep on-brand

- Section keeps `id="program"` (required by Corporate Hero's "See how it works" anchor).
- Add the existing `ProgramCTAs` block (Book a call / View pricing) below the footer totals so the corporate funnel is preserved. *(Confirm in implementation that current page already provides those — they're present in the existing component.)*
- Load Instrument Serif via a `<link>` injection inside the component's `useEffect` so no global config changes are needed.
- Apply the project's em-dash → en-dash/comma rule: keep "Weeks 2–14" (en dash, OK) but no em dashes anywhere in copy.
- Footer totals styled with serif numerals as in the upload.

### Not changing

- `CorporateHome.tsx` order and props — unchanged.
- `IndividualHome.tsx` — unchanged (this section is corporate-only).
- `ExpatJourney.tsx` (the 4-stage life-stage timeline) — unchanged.

### Memory update

Update `mem://features/integration-program` to reflect the new vertical 6-step timeline (replacing the 5-step horizontal sticky-scroll).

