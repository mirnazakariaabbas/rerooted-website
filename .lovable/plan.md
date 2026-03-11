

## Plan: Split into CorporateHome and IndividualHome Pages

Instead of conditional logic scattered across components, create two standalone page components that each hardcode their own content and section order.

### New Files

**`src/pages/CorporateHome.tsx`**
- Imports and renders all sections in corporate order with corporate content hardcoded:
  1. Hero — "Relocation is not a moment. / It's a journey." + corporate body/CTAs
  2. ProblemStats — label "Why I Built Re-Rooted®", headline "The Problem Companies Avoid", no closing line
  3. IntegrationProgram (5-step timeline)
  4. Placeholder sections (about, insights, contact) for future phases

**`src/pages/IndividualHome.tsx`**
- Same structure but with individual content hardcoded:
  1. Hero — "You are moving countries, / Now what?" + individual body/CTAs
  2. ProblemStats — label "You're Not Alone", headline "What nobody told you before you moved", with closing line
  3. IntegrationProgram (reused as-is for now — future phases will swap order with Expat Journey)
  4. Placeholder sections

### Refactored Components

**`src/components/CorporateHero.tsx`** → **`src/components/Hero.tsx`**
- Accept props: `headline1`, `headline2`, `body`, `cta1`, `cta2`
- Remove `useAudience` and all conditional logic — pure presentational component

**`src/components/ProblemStats.tsx`**
- Accept props: `label`, `headline`, `closingLine`
- Remove `useAudience` and `contentMap` — pure presentational

**`src/components/IntegrationProgram.tsx`**
- No changes needed — already audience-agnostic

### Updated Files

**`src/pages/Index.tsx`**
- Read `audience` from `useAudience()`
- Render `<AudienceGate />` and `<StickyNav />` always
- When `audience === "individual"` → render `<IndividualHome />`
- Otherwise → render `<CorporateHome />`
- Wrap in `AnimatePresence` for crossfade on toggle

**`src/components/StickyNav.tsx`**
- No changes — already reads audience for nav links and toggle

**`src/components/AudienceGate.tsx`**
- No changes — already sets audience via context

### Why This Approach

- Each page is self-contained with zero conditional rendering
- Shared components (IntegrationProgram, future Pillars/Blog) are simply imported by both pages
- Adding future sections per-audience is just adding imports to the right page file
- The nav toggle swaps `audience` in context, which causes `Index.tsx` to swap the entire page component

