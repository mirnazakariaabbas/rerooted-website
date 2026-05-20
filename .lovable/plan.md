# Cinematic Portal Transition

A signature first-impression moment: when a visitor picks Organization or Individual on the gate, the "R" in Re-Rooted becomes a portal they travel through into the homepage. Framer Motion only.

## Experience

1. Click triggers a 150ms anticipation pause. Hover states fade, buttons disabled, scroll locked.
2. Surrounding UI (buttons, tagline, login, prompt) fades and blurs out. Logo stays put.
3. Logo lifts to scale 1.15. A soft radial glow pulses behind it. 8–12 ambient particles drift inward.
4. Camera zooms into the hollow of the R. Slow start, accelerates, softens on arrival. Subtle blur and a 2 degree rotation add depth. Background warms slightly.
5. Around 85% through the zoom, the homepage begins fading in underneath.
6. Homepage hero staggers: headline, subheadline, buttons, cards settle in over ~700ms.

Total runtime: ~1.9 seconds.

## What changes on the existing gate

The current blue gate stays exactly as-is visually. Tagline, "Not sure?" link, login button all remain. The transition is a new layer that activates only after click. No redesign of the gate's resting state.

## Return visitors

First visit: full cinematic transition.
Subsequent visits: gate still appears briefly so the audience choice can be changed, but clicking a button skips the portal sequence and dismisses instantly. Choice persisted in `localStorage`.

## R portal asset

A new inline SVG of the Re-Rooted "R" letterform with a true hollow center, drawn to match the wordmark proportions. Only used during the transition sequence, overlaid on top of the existing PNG logo at the same position. The hollow is what the camera flies through.

## New components

- `PortalTransition` — orchestrates the full sequence, owns the timeline and the AnimatePresence handoff.
- `PortalLogo` — the inline SVG R with hollow center and the white aperture mask used for the zoom.
- `AmbientParticles` — 8–12 motion divs, soft circles, low opacity, drift inward.
- `HomepageEntrance` — wraps `CorporateHome` / `IndividualHome` and runs the staggered hero entrance on first reveal.

## Files touched

- `src/components/AudienceGate.tsx` — on click, set a `transitioning` flag instead of immediately closing the gate. Render `PortalTransition` while it runs. Close the gate only when the sequence completes (or instantly for return visitors).
- `src/contexts/AudienceContext.tsx` — hydrate `audience` from `localStorage` on mount. Expose `hasSeenIntro` flag. Persist on `setAudience`.
- `src/pages/Index.tsx` — wrap the audience-specific home in `HomepageEntrance` so the staggered reveal fires on the handoff.
- `src/components/PortalTransition.tsx`, `PortalLogo.tsx`, `AmbientParticles.tsx`, `HomepageEntrance.tsx` — new.

## Technical notes

- Animate `transform` and `opacity` only. `will-change: transform, opacity` on the zoom layer.
- Scale curve uses `cubic-bezier(0.76, 0, 0.24, 1)` over 1.2s for the portal zoom.
- Particles are simple motion divs, no canvas, no SVG filters.
- Navigation handoff is a context state flip at ~85% progress, not a router change — the homepage is already mounted under the overlay.
- Respects `prefers-reduced-motion`: skips Phases 2–4, just fades the gate out in 300ms.
- 60fps target on mobile. Particle count drops to 6 below 640px.

## Out of scope

- No redesign of the gate's visual chrome.
- No video, Lottie, Rive, or canvas.
- No changes to the homepage content itself, only to how it enters.
