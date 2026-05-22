# Fix shifting decorative elements (Arrow + Heart)

## Problem

Two decorative images are pinned with **fixed pixel offsets**:

- **Blue arrow** in Services → Step 1: `top: 553px, left: 475px`
- **Drawn heart** in Stages headline (Corporate): `top: 40px, left: 760px`

Because pixels don't scale with the container, every time the preview width changes (closing the chat sidebar, fullscreen, real visitor's browser) the elements drift away from where you placed them. Your live site will look different from the editor preview at 1432px.

## Goal

Pin both elements to a stable visual anchor so they stay in the same spot regardless of viewport width.

## Approach

### 1. Heart (Stages headline) — anchor to text

The headline uses `clamp()` font sizing, so it scales with viewport. The heart should scale **with the headline**, not with pixels.

- Wrap the last word (e.g. "STAGE") in an inline-block `<span style="position: relative">`.
- Move the heart inside that span and position it with **`em` units** relative to that word (e.g. `top: -0.2em; right: -0.8em; height: 1.1em`).
- Result: the heart scales and stays glued to the word at every viewport.

### 2. Arrow (Services Step 1) — anchor to step number

Same idea, different anchor.

- Wrap the `1.` step number in a `position: relative` span.
- Position the arrow with `em`/`%` values relative to that span (e.g. `top: 1.2em; left: 2em; width: 6em`).
- Result: arrow follows the step number, scales with font size, no pixel drift.

### 3. Remove the leftover drag/badge code on the heart

The heart still has the draggable handler and the blue coordinate badge. Once the position is anchored, strip:
- `useState` for `heartPos`
- `dragStateRef` + the `useEffect` mouse handlers
- The `onMouseDown` prop and `cursor: grab`
- The blue coordinate badge div

## Tuning workflow

After the refactor, fine-tuning is done by editing 2–3 `em` numbers per element. I'll set sensible starting values; you tell me "nudge the heart up a bit" or give exact em values and I'll hardcode them. No more drag UI needed.

## Answer to "which view matches my live site"

Closest match: **collapse the chat sidebar / use the fullscreen preview** so the preview fills your browser at ~1440–1920px wide. That's what real visitors see. Once the elements are anchored (above), it won't matter anymore.

## Files touched

- `src/components/ExpatJourney.tsx` — heart anchoring + cleanup
- `src/pages/Services.tsx` — arrow anchoring + remove `ARROW` constant
