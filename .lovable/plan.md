
Goal: make clicking any journey step work reliably in any order, including backward jumps and jumps to the last step.

What I found
- The bug is in `src/components/IntegrationProgram.tsx` desktop timeline logic.
- The current scroll target math uses `idx / 5`, but there are 5 steps indexed `0..4`. That means clicks are not scrolling to the true position for the selected step, especially for jumps like `1 -> 5`, `3 -> 5`, `5 -> 3`, and `4 -> 2`.
- The current `setTimeout(800)` programmatic-scroll release is also brittle, because the UI depends on a guessed scroll duration instead of the actual selected position being reached.

Plan

1. Fix the step-to-scroll-position mapping
- Update the target calculation to use the full step range:
  - progress = `idx / (steps.length - 1)`
- This will align each clicked node with the same progress scale used by the active-step logic.

2. Make one source of truth for the selected step
- Keep the immediate click selection behavior so the green fill, active node, and description update instantly.
- Continue deriving all visual states from one `active` step value.

3. Improve programmatic scroll handling
- Keep the “ignore scroll updates while auto-scrolling” idea.
- Replace the fragile fixed-duration assumption with logic that releases programmatic mode only after the scroll has effectively reached the clicked target, or at minimum uses the corrected target position consistently.
- This prevents intermediate scroll events from taking over too early.

4. Keep manual scrolling behavior intact
- After a click-driven scroll completes, manual scrolling should again control the timeline.
- This preserves the sticky-scroll experience without breaking click-to-select.

5. Verify the exact failing combinations
- Specifically confirm these now work:
  - `4 -> 2`
  - `1 -> 5`
  - `5 -> 3`
  - `3 -> 5`
- Also verify random forward/backward jumps across all five steps.

Technical details
- File to update: `src/components/IntegrationProgram.tsx`
- Likely code areas:
  - `jumpTo(idx)` target math
  - programmatic scroll guard/reset logic
  - active step synchronization between click state and scroll state

Expected result
- Users can click any step at any time, forward or backward.
- The green path fills to the clicked step.
- The correct node highlights.
- The description immediately changes to the clicked step.
- No combinations should fail anymore.
