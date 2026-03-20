

## Plan: Enhance ExpatJourney Timeline

Three fixes to `src/components/ExpatJourney.tsx`:

### 1. More curved S-path (road-like)
The current SVG path barely curves because the bezier control points only offset by 20px in a narrow 56px-wide viewBox. Fix: widen the SVG viewBox to ~300px and make the path swing wide left and right (±100px from center) with proper S-curve control points — two control points per segment spaced apart vertically so the curve is smooth and road-like, not just a slight wobble.

### 2. Hover scale on stage card + photo
Wrap each `DesktopStageRow` card and photo circle in a group that scales up on hover. Use `transition-transform duration-200 hover:scale-110` on the photo circle and `hover:scale-105` on the card. This gives tactile feedback when hovering over any stage.

### 3. Remove green root lines from Re-Rooted and Rooting Back cards
The `RootLines` SVG component renders green decorative lines inside right-side (white) cards. Remove the `{!isLeft && <RootLines />}` line from `StageCard` to eliminate those lines entirely.

### Files Changed

| File | Change |
|------|--------|
| `src/components/ExpatJourney.tsx` | Wider S-curve path, hover scale on cards/photos, remove RootLines from cards |

