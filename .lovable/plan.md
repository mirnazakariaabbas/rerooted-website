

## Plan: Card Redesign — Image on Top of Card

Redesign each stage card in `src/components/ExpatJourney.tsx` to include a large image area on top, similar to the reference screenshot. The card becomes a vertical stack: image → title → description.

### Card Layout (reference style)

```text
┌─────────────────────┐
│                     │
│   [  IMAGE AREA  ]  │  ← Rectangular image placeholder, fills card width
│                     │
├─────────────────────┤
│  STAGE NAME         │  ← ALL-CAPS title
│                     │
│  Description text   │  ← Body copy
│  goes here...       │
└─────────────────────┘
```

### Changes to `src/components/ExpatJourney.tsx`

1. **Remove separate `PhotoCircle`** from the center path position in `DesktopStageRow` — the photo now lives inside the card itself
2. **Redesign `StageCard`**:
   - Add a rectangular image placeholder at the top of the card (aspect ratio ~16:10, rounded top corners, grey bg with "Photo" text)
   - Below: stage name (ALL-CAPS, deep blue), green accent bar, description text
   - Card max-width increases slightly (~300px) to accommodate the image
   - Card has `overflow-hidden` with `rounded-xl` so image clips to top corners
   - Keep existing background colors (lavender for left, white for right)
   - Keep hover:scale-105
3. **Remove `PhotoCircle` component** (no longer needed)
4. **Update `DesktopStageRow`**: Remove center photo circle column; card connects directly to path position
5. **Update `MobileJourney`**: Remove photo circle above card; image is now inside card
6. **SVG path stays the same** — the dotted lavender S-curve path remains behind the cards
7. **Keep the Thriving leaf pattern** on card index 2

### Files Changed

| File | Change |
|------|--------|
| `src/components/ExpatJourney.tsx` | Merge photo into card as top image area, remove PhotoCircle |

