

## Fix: Image Appearing Below Text

The issue is that the side-by-side layout uses `lg:flex-row` (1024px breakpoint), but your viewport is 968px wide — so it falls back to stacked `flex-col`. 

### Change
In `src/components/CorporateHero.tsx`, change the flex breakpoint from `lg:` to `md:` (768px) so the image sits beside the text at your current viewport width:
- `lg:flex-row` → `md:flex-row`
- `lg:gap-16` → `md:gap-16`
- `lg:px-12` → `md:px-12`

Also remove the Q frame overlay since you said you'll handle that externally — just show the hero image with a simple rounded style.

