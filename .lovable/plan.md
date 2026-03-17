
Goal: make every click on the Re-Rooted Journey timeline immediately select that stage, fill the green progress line up to that stage, and swap the description to that stage.

What’s happening now
- In `src/components/IntegrationProgram.tsx`, each node click only calls `jumpTo(i)`.
- The active step is still controlled only by `scrollYProgress`.
- So clicking “Integration Assessment” does not reliably/instantly change the selected stage; it waits for scroll position to catch up, and the mapping can feel off.

Plan

1. Fix the desktop timeline selection logic in `src/components/IntegrationProgram.tsx`
- Add a dedicated selected step state for click interaction.
- On click:
  - immediately set the selected step to the clicked index
  - immediately update the description card to that step
  - immediately update the green progress line to stop at that step
  - keep the clicked step and all previous steps green
- Keep smooth scrolling, but make the UI state update first so the user sees the correct stage right away.

2. Separate “scroll progress” from “clicked selection”
- Keep `scrollYProgress` for passive scrolling behavior.
- Add logic so the component uses:
  - clicked selection when the user clicks a stage
  - scroll-driven selection when the user continues scrolling
- This prevents click feedback from being overwritten too late or feeling broken.

3. Correct the progress line behavior
- Replace the current fill width behavior so it can reflect the active selected index precisely.
- Green line should end at:
  - Discovery Call when step 1 is selected
  - Integration Assessment when step 2 is selected
  - Active Coaching when step 3 is selected
  - Final Assessment when step 4 is selected
  - Ongoing Support when step 5 is selected

4. Make the description always match the active selected point
- The description card should always render from the same active index used by the node highlight and green line.
- This ensures all 3 parts stay synchronized:
  - highlighted node
  - green path fill
  - description content

5. Keep behavior consistent across all five points
- Verify the same logic works for:
  - Discovery Call
  - Integration Assessment
  - Active Coaching
  - Final Assessment
  - Ongoing Support

Implementation details
- File to update: `src/components/IntegrationProgram.tsx`
- Main code changes:
  - introduce a click-selected index state
  - compute a single `displayedActiveStep`
  - use `displayedActiveStep` for:
    - node green styling
    - description card content
    - CTA/summary visibility
    - progress fill width
  - keep `jumpTo(i)` but call `setSelectedStep(i)` first

Expected result
- Clicking “Integration Assessment” will instantly:
  - make steps 1–2 green
  - move the description to Integration Assessment
  - keep the timeline visually aligned with that selected stage
- Same behavior will work for every stage in the journey.

Scope
- This fix is only for the corporate `IntegrationProgram` journey timeline.
- `ExpatJourney` already uses click-to-select state separately and does not need the same fix unless you want its progress/path behavior adjusted too.
