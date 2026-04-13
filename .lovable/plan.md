

## Plan: Make Audience Gate Buttons More Noticeable

**File: `src/components/AudienceGate.tsx`**

Currently the two buttons are outline-only (transparent background with white border), which makes them blend into the Deep Blue background. Changes:

1. **Add a prompt line above the buttons**: "Choose your path" in white, weight 600, slightly larger, to direct attention downward to the buttons.

2. **Make buttons visually bolder**:
   - Change from transparent outline to **semi-filled style**: white background with Deep Blue text (swap the current hover state to be the default state)
   - Add a subtle **glow/shadow** effect: `shadow-[0_0_20px_rgba(255,255,255,0.25)]`
   - Increase padding slightly: `px-10 py-5` (from `px-8 py-4`)
   - Increase font size: `text-lg md:text-xl` (from `text-base md:text-lg`)
   - On hover: invert back to outline style (border only, white text on blue)

3. **Add a subtle pulse animation** on the buttons after they appear: a gentle scale pulse (1.0 → 1.03 → 1.0) that plays once after the entrance animation, drawing the eye.

4. **Show subtitle text by default** (always visible at reduced opacity) instead of only on hover, so users understand the options without needing to hover.

Single file change, no routing or logic changes.

