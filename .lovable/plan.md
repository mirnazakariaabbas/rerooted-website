# Hardcode heart position + clean up drag UI

Lock the drawn heart in the Stages headline (Corporate) at the values from your screenshot:

**top: 41px · left: 433px · size: 2.7em**

## Changes in `src/components/ExpatJourney.tsx`

1. Replace the `heartPos` state with a `HEART` constant: `{ top: 41, left: 433, size: 2.7 }`.
2. Remove the drag system: `useState` for `heartPos`, `dragStateRef`, the `useEffect` mouse handlers, and the `onMouseDown` prop.
3. Remove the blue coordinate badge div above the headline.
4. Remove `cursor: "grab"` from the heart image style.

## Note on the shifting issue

These are still fixed pixels, so the heart will drift when the viewport changes width (same as before). You asked to hardcode the current position, so I'm doing that. When you're ready to make it stop shifting across viewports, say the word and I'll anchor it to the headline text with `em` units instead.

Same goes for the arrow on Services, just let me know.
