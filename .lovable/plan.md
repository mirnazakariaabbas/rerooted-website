

## Plan: Fix Journey Path Curve + Blue Color Scheme

### What changes

**File**: `src/components/ExpatJourney.tsx`

### 1. Smooth, wide S-curve path (no edgy segments)

The current path logic ends each cubic bezier at the center (`cx`), then starts the next one also from center — this creates sharp direction changes at each stop. Fix:

- Make each curve segment end at the **card's side** (left or right of center), not back at center
- The path flows: center → left card → right card → left card → right card, with smooth cubic bezier transitions between each position
- Use wider control point offsets (~140px from center in a 400px viewBox) for dramatic sweeps
- Remove the final straight `L` line to bottom — end the path with a gentle fade-out curve

This eliminates the "edgy" kinks and creates a true winding road.

### 2. Blue color scheme (path + card accents)

| Element | Current | New |
|---------|---------|-----|
| Desktop SVG path stroke | `#BCADD4` (lavender) | `#1F299C` (Deep Blue) |
| Mobile vertical dotted line | `#BCADD4` | `#1F299C` |
| Card border | `1px solid #BCADD4` | `1px solid #1F299C` with lower opacity (~0.3) |
| Green accent bar in cards | `#3DA776` | `#1F299C` |
| LeafPattern fills | `#3DA776` | `#1F299C` |

Card backgrounds, text colors, and image placeholders stay the same.

### 3. Path rendering approach

```text
Desktop path flow (wider sweeps):

     ←── Card 1 (left)
    /
   /
  S
   \
    \
     ──→ Card 2 (right)
         /
        /
       S
      /
     /
←── Card 3 (left)
    \
     \
      ──→ Card 4 (right)
```

- ViewBox width increases to 400px for more horizontal room
- Each segment uses cubic bezier where cp1 swings opposite and cp2 swings toward target
- Path endpoints land at the card side positions (not center), so the curve flows naturally between alternating sides

### Files changed

| File | Change |
|------|--------|
| `src/components/ExpatJourney.tsx` | Rewrite path math for smooth wide S-curves; change all lavender/green accents to Deep Blue |

