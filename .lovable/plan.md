

## Audience-Aware Experience Overhaul

This plan transforms the site from "same layout, different text" into two genuinely different experiences with different section orders, unique components, audience-specific content, and distinct visual styling.

### Summary of Changes

```text
CORPORATE ORDER:              INDIVIDUAL ORDER:
Hero                          Hero
ProblemStats                  ProblemStats
IntegrationProgram (5-step)   ExpatJourney (emotional anchor)
ExpatJourney (breadth)        IndividualSupport (NEW - 2 cards)
AboutSection (3rd person)     AboutSection (1st person)
GroundingPillars              GroundingPillars
[Blog placeholder]            [Blog placeholder]
[CTA placeholder]             [CTA placeholder]
```

### Files to Create

#### `src/components/IndividualSupport.tsx` — NEW
Two side-by-side cards replacing the 5-step timeline for individuals:
- Card 1: "A coach who gets it" — icon, short description, "Find your coach →" CTA in Fresh Green
- Card 2: "Your new country, side by side with home" — icon, short description, "Explore the app →" CTA in Fresh Green
- Section `id="support"` so nav links work
- Cards fade+rise on scroll, staggered
- Warm white background, rounded-xl cards with border/shadow
- Mobile: stack vertically

### Files to Modify

#### `src/pages/IndividualHome.tsx`
- Change section order: Hero → Stats → Journey → Support → About → Pillars → placeholders
- Import `IndividualSupport` instead of `IntegrationProgram`
- Remove IntegrationProgram import

#### `src/pages/CorporateHome.tsx`
- Keep current order (already correct: Hero → Stats → Program → Journey → About → Pillars)
- No changes needed

#### `src/components/ExpatJourney.tsx`
- Accept `audience` prop (or read from context)
- **Corporate**: Current content — "We meet your people wherever they are", "Learn more →" links
- **Individual**: Headline becomes "Where are you right now?", subline is personal/validating, each stage opens with a personal quote, CTA text becomes "This is me →" in Fresh Green

#### `src/components/AboutSection.tsx`
- Read audience from context
- **Corporate** (current): Third-person, credential-focused text, unchanged
- **Individual**: First-person voice from Yasser — "I've been where you are. I know the loneliness, the identity questions, the invisible weight of starting over." Different headline: "I've been where you are." Body paragraphs rewritten in first person. CTA: "Hear my story →"

#### `src/components/Hero.tsx`
- Accept optional `variant` prop: `"corporate" | "individual"`
- **Corporate buttons**: Deep Blue bg (`bg-primary`), white text, `rounded-lg` (8px)
- **Individual buttons**: Fresh Green bg (`bg-secondary`), white text, `rounded-xl` (12px)
- Individual body text: slightly larger (`text-lg md:text-xl`), more whitespace (`space-y-5`)
- Individual transitions: slightly slower easing (0.5s delay bumps)

#### `src/components/StickyNav.tsx`
- Update individual "Support" link to point to `#support` instead of `#program`

### Visual Differences Applied

| Element | Corporate | Individual |
|---------|-----------|------------|
| CTA buttons | `bg-primary rounded-lg` | `bg-secondary rounded-xl` |
| Body text size | `text-lg` | `text-lg md:text-xl` |
| Section spacing | `py-20` | `py-24` (more breathing room) |
| Transition speed | Current (0.6-0.8s) | +0.1-0.2s slower |
| Color emphasis | More Deep Blue | More Fresh Green/Lavender |
| ExpatJourney CTA | "Learn more →" | "This is me →" |
| About tone | Third-person credentials | First-person empathy |

### Not in Scope (Future Phases)
- Blog section content (placeholder remains)
- CTA/Contact form with Company vs Dropdown field (placeholder remains)
- Actual hero images (different per audience)
- Footer CTA differences

