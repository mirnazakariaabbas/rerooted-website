

## Plan: Enhance Journey Sections (Both Audiences)

### Changes to `src/components/IntegrationProgram.tsx` (Corporate)

**1. Close the gap + bigger title + "Keep Scrolling" hint**
- Reduce `mb-16` on the heading to `mb-6`
- Increase title size from `text-3xl md:text-[40px]` to `text-4xl md:text-5xl`
- Add a "Keep Scrolling" text below the title in Deep Blue (`text-primary`), small font, with a subtle bounce animation (chevron down icon)

**2. Move timeline inside the description card**
- Instead of having the timeline nodes above and the description card below as separate blocks, combine them into one unified card container
- The card holds: the timeline row (nodes + progress line) at the top, and the active step description below it inside the same card
- This visually groups the infographic with its description

**3. Click-to-activate with green fill**
- Already partly works (clicking jumps scroll). Enhance: when a node is clicked, immediately set `active` to that index (don't wait for scroll to catch up)
- The filled progress line turns green up to the clicked stage
- The clicked node and all preceding nodes turn green, description updates instantly

### Changes to `src/components/ExpatJourney.tsx` (Individual + Corporate)

**1. Close the gap + bigger title + "Keep Scrolling" hint**
- Reduce `mb-4` on the header wrapper to `mb-2`
- Reduce `mt-12` on the desktop journey container to `mt-4`
- Increase title size to `text-4xl md:text-5xl`
- Add "Keep Scrolling" in primary color below the subline with a down chevron

**2. Move SVG path inside a description card**
- Wrap the SVG path and nodes inside a card container (`bg-card rounded-xl border shadow-sm p-6`)
- Below the SVG, show the active/selected stage description inside the same card
- Remove the per-node text overlays from the SVG area — the nodes remain as circles with names, but the description appears in the card below the path

**3. Click-to-select with green highlight**
- Add `activeStage` state (default: first visible or null)
- Clicking a stage node sets it as active, turns it green (from blue), and shows its description in the card below
- Non-active reached nodes stay blue, active node becomes green with scale-up
- On mobile: tapping a node highlights it green and scrolls the description into view

### Files Changed

| File | Change |
|------|--------|
| `src/components/IntegrationProgram.tsx` | Tighter gap, bigger title, "Keep Scrolling", unified card, click-to-green |
| `src/components/ExpatJourney.tsx` | Tighter gap, bigger title, "Keep Scrolling", SVG inside card with description below, click-to-green |

