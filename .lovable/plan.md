# Cinematic "Zoom Into Button" Gate Transition

Replace the curtain-split exit with a portal-style zoom: when the user clicks "I'm an organization", "I'm an individual", or "Not sure", the clicked button becomes the camera target. The viewport appears to fly into that button, which expands to fill the screen and dissolves into the homepage hero underneath.

## The effect, step by step

1. User clicks a choice button.
2. Capture that button's bounding rect on screen.
3. All other gate content (logo, tagline, other button, login, "not sure") quickly fades and drifts back (scale 0.92, blur 4px, opacity 0) — like the camera is pulling focus away from them.
4. The clicked button:
   - Lifts slightly (subtle 1.05 pop, 120ms)
   - Then scales up massively (~25x) from its own center, while its border-radius eases to 0, its background fades from transparent/white to the deep-blue gate color, then to transparent
   - Simultaneously the whole gate layer blurs (0 to 12px) and fades opacity to 0 in the final 35% of the animation
5. Underneath, the homepage hero is already mounted. It starts at scale 1.08 with a slight blur, and during the last ~500ms eases to scale 1, blur 0, opacity 1 — so it feels like you flew through the button into the page.
6. Total duration ~1.1s, easing `[0.7, 0, 0.2, 1]` (cinematic ease-in-out with strong acceleration).

## Technical notes

- Use Framer Motion. Track the clicked button via a `ref` and read `getBoundingClientRect()` on click; store `{ x, y, width, height }` in state.
- Render an overlay `motion.div` positioned absolutely at the captured rect, animating `scale`, `borderRadius`, `backgroundColor`, and `opacity`. Set `transformOrigin` to the rect's center so the zoom feels anchored to the button.
- The existing `AnimatePresence` on the gate stays; the gate's `exit` props drive the fade/blur of surrounding chrome. The zoom overlay is a separate element that animates on exit alongside it.
- The "Not sure? Start here" link reuses the same handler — wrap its text in a hidden zoom-target or fall back to a center-screen origin for that path.
- Lock body scroll until the animation completes (already handled by existing effect — just delay `setGateOpen(false)` cleanup until after exit finishes; AnimatePresence handles this automatically).
- No new dependencies. Single file change: `src/components/AudienceGate.tsx`.

## Out of scope

- No changes to the homepage hero component or its content.
- No changes to routing, audience context, or the StickyNav anchor behavior.
