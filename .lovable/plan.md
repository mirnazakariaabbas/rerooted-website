

## Plan: Four Fixes

### 1. Logo click reopens the Audience Gate

In `StickyNav.tsx`, change the logo `<a href="#top">` to a `<button>` that calls `setGateOpen(true)` and scrolls to top. This reopens the full-screen gate so the user can re-choose their audience.

### 2. More noticeable Hero animations

In `Hero.tsx`, increase the animation travel distance and duration:
- Headline lines: `y: 40` instead of `20`, duration `0.8s`, and increase the stagger delay between line 1 and line 2 to `0.6s`
- Body text: `y: 30`, duration `0.6s`, delay `0.4s`
- CTAs: `y: 30`, duration `0.6s`, delay `0.7s`
- Hero image: add a fade-in + scale animation (start at `scale: 0.9, opacity: 0`)

### 3. ProblemStats animations use vertical (Y-axis) motion

In `ProblemStats.tsx`, change the StatCard animations from `x: 60` (horizontal slide) to `y: 60` (vertical slide-up). Also change the 98% stat from `scale: 0.8` to `y: 80` for a slide-up entrance. All elements animate vertically.

### 4. Individual page section order

Update `IndividualHome.tsx` to match the confirmed order:
Hero → ProblemStats → IntegrationProgram → placeholder sections (about, pillars, blog, CTA)

This is already the current order, so no change is needed here. The user mentioned the order differs but the current layout already matches their stated preference. Future phases will add Expat Journey between ProblemStats and IntegrationProgram.

### Files changed

| File | Change |
|------|--------|
| `src/components/StickyNav.tsx` | Logo click opens gate |
| `src/components/Hero.tsx` | Bigger, slower animations |
| `src/components/ProblemStats.tsx` | Vertical slide animations |

