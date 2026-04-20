

## Plan: Align WhyReRooted to screenshot using brand fonts

### What changes (`src/components/WhyReRooted.tsx`)

**Typography swap to site brand fonts** (only difference from the screenshot):
- Section base font: `'DM Sans', system-ui, sans-serif` (replaces Inter Tight).
- Eyebrow ("WHY REROOTED") and intro paragraph: DM Sans inherited.
- Large editorial statement: `'Manrope', system-ui, sans-serif`, weight 500 normal / 500 italic for the highlighted words (replaces Instrument Serif). Manrope has a true italic so the slanted "not a shipment.", "replanted.", "roots," will still render as italic — matching the screenshot's emphasis pattern in the brand voice.

**Layout & content alignment with screenshot** (kept exact):
- Two-column grid `1fr 1fr`, gap 90, `alignItems: start`.
- Left column: sticky eyebrow + small mute paragraph, max-width 32ch.
- Right column: large statement, three lines with `<br />` breaks:
  1. "A relocation is *not a shipment.*"
  2. "It's a person being **replanted.**" ("replanted." in faded blue `rgba(31,41,156,0.35)`)
  3. "We tend to the *roots,* so the move takes hold."
- Italic words "not a shipment.", "roots," in green `#3DA776`.
- Statement color: Deep Blue `#1F299C`.
- Background: Warm White `#FAF9F6`.
- Padding `180px 0 160px`, max-width 1320, horizontal padding 48px.
- Letter-spacing tightened (`-0.02em`) and line-height 1.04 for the same dense editorial feel.
- Responsive: collapse to single column under 980px (unchanged).

**Copy rule fix** (per `mem://style/content-formatting`):
- Replace the em dash in the intro paragraph: "treated as logistics — visas, shipping, tax." becomes "treated as logistics: visas, shipping, tax."

### Not changing
- `index.html` font links (Manrope is already loaded).
- `CorporateHome.tsx` and `IndividualHome.tsx` placement (still right after `<Hero />`).
- Any other section.

### Memory update
- Add a short memory note `mem://features/why-rerooted` describing the section (two-column editorial statement, DM Sans + Manrope, placed after Hero on both audience homepages).

