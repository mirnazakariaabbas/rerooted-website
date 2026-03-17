

## Fix: Click-to-Select Journey Stages

The ExpatJourney component currently has no click interaction — nodes are just visual with descriptions floating next to each node. The plan adds an `activeStage` state so clicking a node selects it, highlights it green, and shows its description in a card below the SVG.

### Changes to `src/components/ExpatJourney.tsx`

**Desktop:**
- Add `activeStage` state (number | null, default null) to `DesktopJourney`
- Pass `activeStage` and `setActiveStage` to each `DesktopNode`
- On node click: set `activeStage` to that index
- Active node turns green (`bg-secondary`) instead of blue, scales up with ring glow
- Remove per-node description text overlays (quote, desc, link) from the absolute-positioned nodes — keep only the circle with name
- Add a description card below the SVG (similar to IntegrationProgram's card): shows the selected stage's name, quote (if individual), description, and "This is me →" / "Learn more →" link
- Card uses `AnimatePresence` for smooth transitions between stages
- When no stage is selected, show a hint: "Click a stage to learn more"

**Mobile:**
- Add `activeStage` state to `MobileJourney`
- Clicking a mobile node sets it active, turns it green, and expands its description (or all descriptions stay visible but active one is highlighted)
- Active node: green background, others stay blue

**Both audiences:** Same interaction pattern, different content (quotes for individual, plain for corporate)

### Files Changed

| File | Change |
|------|--------|
| `src/components/ExpatJourney.tsx` | Add activeStage state, click handlers, green highlight, description card below SVG, remove per-node text overlays on desktop |

