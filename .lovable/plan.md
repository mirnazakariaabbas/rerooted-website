

## Fix: Sticky Nav Not Appearing

The nav only shows when `window.scrollY > window.innerHeight * 0.6` — but the placeholder sections are mostly empty, so there may not be enough content to scroll past that threshold. Also, `gateOpen` starts as `true`, so the nav returns `null` until the gate is dismissed.

The real issue: after dismissing the gate, the page content may not be tall enough or the user hasn't scrolled far enough. The 60% threshold on a 778px viewport means ~467px of scroll needed, but the hero is `min-h-screen` so there should be enough room.

**Most likely cause**: The nav works but requires scrolling. However, users expect a visible nav immediately after the gate closes. 

### Plan
In `src/components/StickyNav.tsx`:
- Show the nav **immediately** once the gate is closed (remove the scroll-based visibility logic entirely, or make it always visible when `!gateOpen`)
- Keep the sticky `fixed top-0` positioning
- Add a subtle entrance animation when the gate closes

This is a one-file change to `StickyNav.tsx`.

