

## Plan: Rebuild ExpatJourney as Vertical Winding Timeline

Replace the current ExpatJourney component with a completely new vertical S-curve timeline design. Both corporate and individual versions get this new visual treatment, with audience-specific headings and copy preserved.

### Design Summary

```text
Desktop layout:
                    ┌─────────┐
   ┌──────────┐     │  photo  │
   │ PRE-ROOT │─────│    ○    │
   │  (left)  │     │         │
   └──────────┘     │    :    │
                    │    :    │
                    │    ○    │──┌──────────┐
                    │         │  │ RE-ROOT  │
                    │    :    │  │  (right) │
                    │    :    │  └──────────┘
   ┌──────────┐     │    ○    │
   │ THRIVING │─────│         │
   │  (left)  │     │    :    │
   └──────────┘     │    :    │
                    │    ○    │──┌──────────┐
                    │         │  │ROOT BACK │
                    └─────────┘  │  (right) │
                                 └──────────┘

Path: Dotted lavender S-curves connecting stops
```

### Component: `src/components/ExpatJourney.tsx` — Full Rewrite

**Path**: SVG `<path>` with cubic bezier S-curves down the center. Color `#BCADD4`, stroke-width 7px, `stroke-dasharray="12 10"`, round linecaps. No scroll-draw animation (static dotted path).

**Photo circles**: 56px diameter at each stop on the path. 3px `#BCADD4` border, white inner ring via box-shadow. Placeholder `<img>` tags with comments for each stop.

**Cards**: Alternating left/right, max-width 270px, border-radius 12px, padding 20px.
- Left cards (1, 3): bg `#F3F0F7`, 1px border `#BCADD4`
- Right cards (2, 4): bg white, 1px border `#BCADD4`
- Content: ALL-CAPS title (`#1F299C`, weight 500, 13px, letter-spacing 0.07em), green accent bar (28×3px `#3DA776`), body text (`#4a4a5a`, 12px)
- Thriving card: faint leaf pattern bg at 5% opacity in `#3DA776`
- Right cards: faint root SVG lines in bottom-right, `#3DA776` at 40% opacity

**Stage copy** (individual version uses the user's new copy):
1. Pre-Rooted — "The stage before your move — preparing, dreaming, and gathering roots to carry with you."
2. Re-Rooted — "You've arrived. Learning to feel at home in your new place, street by street."
3. Thriving — "Blooming where you've been planted — building community, routines, and belonging."
4. Rooting Back — "Finding ways to give back, stay connected to your origins, and grow new roots for others."

**Corporate version**: Same visual layout, different headline ("We meet your people wherever they are") and stage descriptions (current corporate copy preserved).

**Mobile** (below 640px): Single centered column. Path becomes straight vertical dotted line behind cards. All cards full-width (max-width 90vw), centered. Photo circles centered above each card.

**Animation**: Cards fade + rise on scroll (IntersectionObserver), staggered per stop.

### Files Changed

| File | Action |
|------|--------|
| `src/components/ExpatJourney.tsx` | Full rewrite — new vertical S-curve timeline |

### What stays the same
- Section `id="journey"` preserved for nav anchoring
- Audience context still read for headline/copy switching
- Both `CorporateHome.tsx` and `IndividualHome.tsx` keep `<ExpatJourney />` import unchanged

### What's removed
- Old horizontal SVG looping path (desktop)
- Old click-to-select node/card interaction
- "Keep Scrolling" indicator
- AnimatePresence description area

