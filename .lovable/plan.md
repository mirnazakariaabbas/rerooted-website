

## Goal

Restore brand typography consistency by replacing **Instrument Serif** (a non-brand font that crept into recently added sections) with **Manrope** (the brand display font), while keeping all current font sizes intact.

## Brand reference (per visual identity memory)

- **Display / Headings**: Manrope (`font-display`), weights 400-800
- **Body**: DM Sans (`font-sans`), weights 300-700
- No serif fonts anywhere in the brand system

## Scope: two files only

Both were added recently and use inline `fontFamily: "'Instrument Serif', Georgia, serif"` plus the `font-serif` Tailwind class.

### 1. `src/components/ExpatJourney.tsx`

Replace serif typography in three spots, sizes unchanged:

- **Section heading** ("Where are you right now." / "Four ways to work with us.") — remove `font-serif` class and inline `fontFamily`; switch to `font-display` with brand weight 700. Keep `clamp(36px, 4.5vw, 64px)`, line-height, color, letter-spacing.
- **Card numerals** ("01"–"04") — drop `font-serif italic` + serif `fontFamily`; use `font-display` with weight 600, keep green color and 18px size. Italic styling removed (not in brand system).
- **Card titles** (stage names) — drop `font-serif italic` + serif `fontFamily`; use `font-display` weight 700. Keep `clamp(24px, 2.2vw, 32px)` size, line-height, color.

### 2. `src/components/IntegrationProgram.tsx`

Three serif spots to convert, sizes unchanged:

- **Main heading** ("The Re-Rooted Journey") — remove `font-serif` + serif `fontFamily`; use `font-display` weight 700. Keep `clamp(52px, 6vw, 96px)`. The `<em>` around "Journey" loses `fontStyle: italic` and stays green via color.
- **Step titles** (`<h4>` at line 315) — remove serif `fontFamily`; use Manrope weight 700, keep size 42 and other styles.
- **Inline accent `<b>`** at line 419 — remove serif `fontFamily`; use Manrope weight 700, keep size 32 and green color.

## Implementation notes

- Use the existing `font-display` Tailwind utility (already mapped to Manrope in `tailwind.config.ts`) instead of inline `fontFamily`. This keeps the codebase aligned with how the rest of the site declares headings.
- Replace italic emphasis with the brand's color emphasis (Fresh Green `#3DA776` / `text-secondary`) where italics were carrying meaning, since the brand system doesn't use italic serif accents.
- Leave `WhyReRooted.tsx`, `AudienceGate.tsx`, `Welcome.tsx`, `TestimonialsCarousel.tsx`, and `DimensionDetail.tsx` untouched: they already use `font-display` or use italic on `font-sans`/Manrope (brand-compliant), not Instrument Serif.
- No font-size, color, spacing, or layout changes.

## Out of scope

- No changes to `index.html` font preconnect (Instrument Serif link can stay; it just won't be referenced anywhere). Optional cleanup can follow later.
- No copy changes.

