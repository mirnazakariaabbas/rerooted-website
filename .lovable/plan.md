

## Plan: Add 5 Inner Pages + Placeholder Pages + Navigation Updates

This is a large build covering 5 content-rich inner pages, 3 placeholder pages, navigation rewiring, and CTA link updates across the site.

### New Files to Create

**1. `src/pages/About.tsx`** — Route: `/about`
- Deep Blue hero with white headline and green italic tagline
- Story section: photo placeholder (40%) + biographical text (60%)
- Professional section on Light Lavender with career details + ICF badge placeholder
- Mission section on Warm White
- "How We Work" section with global network description
- CTA: "Start a conversation" linking to `/contact`
- Uses `StickyNav`, `Footer`, fade-in scroll animations via Framer Motion

**2. `src/pages/Services.tsx`** — Route: `/services`
- Deep Blue hero with program headline
- Program overview paragraph on Warm White
- 5 service sections alternating Warm White / Light Lavender backgrounds:
  - Discovery Call (Day 0), Integration Assessment (Week 1), Active Coaching (Weeks 2–10), Final Assessment (Week 11–12), Ongoing Support (Post-program)
  - Each with icon, timing badge, full content from spec
  - Active Coaching displays coaching areas as a visual card grid (not a plain list)
- Program summary line centered below
- Cultural Companion App section on Deep Blue
- CTA: "Start a conversation" linking to `/contact`

**3. `src/pages/journey/PreRooted.tsx`** — Route: `/journey/pre-rooted`
- Light Lavender hero with "Stage 1 of 4" label
- Intro section on Warm White
- "The Re-Rooted Compass" — 5 expandable accordion cards (The Soil, The Wind, The Sunlight, The Thorns, The Pruning) with full content
- "The Four Directions" — 2x2 card grid (Go, Not Yet, Not There, Stay and Own It)
- Corporate close on Light Lavender
- Journey navigation: Next → `/journey/rooting-in`
- CTA linking to `/contact`

**4. `src/pages/journey/RootingIn.tsx`** — Route: `/journey/rooting-in`
- Light Lavender hero with "Stage 2 of 4" label
- Intro section with full content
- "What Rooting In Looks Like" — 6 expandable cards (Values Harmonization, Cultural Adaptation, Language Learning, Filling the Emotional Cup, Building an Enriching Social Life, Third Culture Kids)
- Corporate close on Light Lavender
- Journey nav: Previous ← `/journey/pre-rooted`, Next → `/journey/thrive`
- CTA linking to `/contact`

**5. `src/pages/Contact.tsx`** — Route: `/contact`
- Warm White hero with centered "Start a conversation" headline
- Intro paragraph
- Centered form (max-w-[560px]) with: Name, Company, Email, Phone (optional), "How can we help?" dropdown (5 options), Message textarea, Send button
- Lavender borders, green focus — same style as existing `ContactCTA`
- Post-submit: "Thank you. We'll be in touch soon." replaces form
- Below form: email, phone placeholder, Switzerland location with map pin icon
- Bottom CTA: "Not ready for a form? Email us directly"

**6. `src/pages/journey/Thrive.tsx`** — Placeholder, route `/journey/thrive`
- Light Lavender hero, "Stage 3 of 4", headline: "I'm settled. Now I want to take off."
- "Coming soon" message + link to `/contact`
- Journey nav: Previous ← `/journey/rooting-in`, Next → `/journey/rooting-back`

**7. `src/pages/journey/RootingBack.tsx`** — Placeholder, route `/journey/rooting-back`
- Light Lavender hero, "Stage 4 of 4", headline: "I'm going back. But I'm not the same person who left."
- "Coming soon" message + link to `/contact`
- Journey nav: Previous ← `/journey/thrive`

### Files to Modify

**8. `src/App.tsx`** — Add routes:
- `/about`, `/services`, `/contact`
- `/journey/pre-rooted`, `/journey/rooting-in`, `/journey/thrive`, `/journey/rooting-back`

**9. `src/components/StickyNav.tsx`** — Update nav links:
- Corporate: "The Program" → `/services`, "The Journey" → `#journey` (homepage scroll), "About" → `/about`, "Insights" → `/blog`, "Contact" → `/contact`
- Individual: "Your Journey" → `#journey`, "Support" → `#support`, "About" → `/about`, "Insights" → `/blog`, "Contact" → `/contact`
- Use `<Link>` or `navigate()` for route links, keep `<a href="#...">` for same-page anchors
- Handle mixed behavior: hash links only work on homepage, route links navigate to pages

**10. `src/components/Footer.tsx`** — Update links to match nav (route-based where needed)

**11. `src/components/AboutSection.tsx`** — Update "Read the full story →" / "Hear my story →" to link to `/about`

**12. `src/components/IntegrationProgram.tsx`** — Update "Get a program overview" button to link to `/services`

**13. `src/components/ContactCTA.tsx`** — Keep as homepage section (anchor `#contact`). The new `/contact` page is separate.

**14. `src/components/ExpatJourney.tsx`** — Add "Learn more →" / "This is me →" links on each stage card:
- Pre-Rooted → `/journey/pre-rooted`
- Rooting In → `/journey/rooting-in`
- Thrive → `/journey/thrive`
- Rooting Back → `/journey/rooting-back`

**15. `src/pages/CorporateHome.tsx`** — Update Hero CTA: "See how it works" → `#program` (keep), "Start a conversation" → `/contact`

**16. `src/pages/IndividualHome.tsx`** — Update Hero CTA: keep journey scroll, "Reach out" → `/contact`

**17. `src/components/BlogPreview.tsx`** — Update "See all insights →" to link to `/blog`

### Shared Patterns for All Inner Pages
- Each page wraps content in `<StickyNav />` at top and `<Footer />` at bottom
- Page entrance: `<motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>` fade-in
- Scroll-triggered sections use `useInView` from Framer Motion (same pattern as homepage)
- All em dashes replaced with commas, colons, or periods
- Typography: DM Sans (already the site font via Manrope — will use existing font stack), weight 900 for headlines, 400 for body
- Brand colors: Deep Blue (#1F299C), Fresh Green (#3DA776), Lavender (#BCADD4), Light Lavender (#F3F0F7), Warm White (#FAF9F6)

### No Database Changes
All pages are static content. No migrations needed.

### Technical Notes
- Navigation links that point to homepage sections (like `#journey`, `#program`, `#support`) need special handling: when clicked from an inner page, navigate to `/#journey` etc. Will use `useNavigate` + hash detection.
- The existing `Blog.tsx` page already exists at `/blog` route — will verify it works as the placeholder insights page.
- Total: ~13 new/modified files, no backend changes.

