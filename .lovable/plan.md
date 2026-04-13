

## Plan: Privacy Policy, Terms & Conditions, FAQ Pages + Footer Updates + Cookie Banner + Stats Disclaimer

### New Files

**1. `src/pages/Privacy.tsx`** — Route: `/privacy`
- Warm White (#FAF9F6) background, max-w-[720px] centered
- All 13 sections from the spec rendered as styled headings (weight 700) and body text (weight 400, #1A1A1A)
- "Last updated: April 2026"
- StickyNav + Footer, Framer Motion fade-in

**2. `src/pages/Terms.tsx`** — Route: `/terms`
- Same layout as Privacy. All 11 sections from the spec.
- StickyNav + Footer, fade-in

**3. `src/pages/FAQ.tsx`** — Route: `/faq`
- Warm White background, centered content
- 4 grouped headings (About Re-Rooted, For Organizations, For Individuals, About Coaching)
- Each question as an accordion item using the existing `Accordion` component from `src/components/ui/accordion.tsx`
- StickyNav + Footer, fade-in

**4. `src/components/CookieBanner.tsx`**
- Slim bar fixed to bottom of screen, #1A1A1A background, white text
- "Accept" button (green), "Manage preferences" text link opening a modal with toggles (Essential always on, Analytics toggle, Marketing toggle)
- "Learn more" links to `/privacy`
- On accept/save, stores choice in `localStorage` (cookie consent key) and hides banner
- Only shows on first visit (checks localStorage)

### Modified Files

**5. `src/App.tsx`**
- Add routes: `/privacy`, `/terms`, `/faq`
- Import and render `<CookieBanner />` at the app level (outside Routes, always visible)

**6. `src/components/Footer.tsx`**
- Add 3 new links to both corporate and individual link arrays: Privacy Policy (`/privacy`), Terms & Conditions (`/terms`), FAQ (`/faq`)
- Add below copyright: `"Re-Rooted® is a registered trademark."` (same style as copyright, xs text, opacity 0.5)
- Add coaching disclaimer: `"Coaching is not therapy, counseling, or medical treatment."` (xs text, opacity 0.4)

**7. `src/components/ProblemStats.tsx`**
- Add a second footnote line below the existing source citation: `"Statistics are drawn from published research and may reflect varied methodologies."`
- Style: white text, opacity 0.4, font-size 11px (text-[11px]), font-light

### No database changes required. All pages are static content.

