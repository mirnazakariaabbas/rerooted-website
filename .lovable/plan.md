

## Plan: Redesign ProblemStats with infographic grid

Rebuild `src/components/ProblemStats.tsx` to mirror the reference layout (asymmetric 3-column grid with one tall hero card and 4 smaller cards) while making the numbers themselves the visual hero of each box. No red — use Deep Blue hero, white-outlined cards, with one accent card in a darker brand-aligned tone.

### Layout

```text
+-----------+-------------------+-----------+
|   43%     |                   |  1 in 3   |
|  perf     |       98%         |  miss     |
+-----------+   burnout (hero)  +-----------+
|   42%     |                   |   80%     |
|  leaving  |                   |  recovery |
+-----------+-------------------+-----------+
```

- Section background: `#FAF9F6` (Warm White), replacing current Deep Blue
- Grid: `1fr 1.6fr 1fr` × 2 rows; center cell spans both rows
- Cards: 12px rounded corners, no shadows (per brand rules)
- Subtle background grid pattern + faded number watermark (from reference) for texture

### Card styling (number-fills-the-box)

- **Hero (98%)**: Deep Blue `#1F299C` bg, white number at ~clamp(80px, 12vw, 140px), green `%` superscript, label below in white
- **4 outline cards**: White bg, 1.5px `#CDCCCD` border, Deep Blue number at ~clamp(48px, 7vw, 72px), dark label
- **No icons** in any card — number dominates, label is compact below
- Numbers use font-weight 900, line-height 0.9 to maximize visual size

### Stats (all 5 from reference)

1. 98% — expats report burnout symptoms (hero)
2. 43% — report negative impact on work performance
3. 1 in 3 — don't meet expectations
4. 42% — considered leaving their employer
5. 80% — recover productivity after 1+ year, or never

### Animations (preserved from reference)

- Cubic ease-out count-up triggered when section enters view
- Staggered start: hero at 100ms, then 400/600/800/1000ms
- "1 in 3" animates from "1 in 10" down to "1 in 3"
- Cards fade-and-rise (Framer Motion) as they appear
- Source line + disclaimer fade in last

### Responsive

- Mobile (<768px): single column stack, hero card first, then 4 stacked outline cards (no row spanning)
- Tablet (≥768px): full 3×2 asymmetric grid as shown

### Props (unchanged signature)

`label`, `headline`, `closingLine` props remain — Corporate and Individual homepages keep their existing copy with no changes needed in `CorporateHome.tsx` or `IndividualHome.tsx`.

### File touched

- `src/components/ProblemStats.tsx` — full rewrite of internals; export signature preserved

