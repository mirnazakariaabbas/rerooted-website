# Add hero tree animation video

Small, scoped change to the homepage hero section in `src/components/WhyReRooted.tsx`. No other sections, content, or styles are touched.

## Steps

1. **Save the video asset**
   - Copy the uploaded MP4 to `public/hero-tree-animation.mp4` so it is served as a static file at `/hero-tree-animation.mp4`.

2. **Convert the hero into a two-column layout**
   - In `WhyReRootedStatement` (the first section: logo, "THE HUMAN SIDE OF RELOCATION" tagline, paragraph, and CTAs), wrap the existing content in a left column and add a right column containing the video.
   - Desktop (md and up): two columns side by side, left ~50-55%, right ~45-50%, vertically centered.
   - Mobile (below md): single column, video stacks below text, centered at ~80% width.
   - All existing text, buttons, fonts, colors, and the logo remain exactly as they are.

3. **Video element behavior**
   - `autoPlay`, `muted`, `playsInline`
   - No `loop`, no `controls`
   - Inline style: `backgroundColor: '#FAF9F6'`, no border, no shadow, no border-radius
   - `width: 100%`, `height: auto`
   - No poster, no fallback image, no overlay

## Technical notes

- File touched: `src/components/WhyReRooted.tsx` (hero subcomponent only). `WhyReRootedPillars` below it is untouched.
- Asset added: `public/hero-tree-animation.mp4`.
- Tailwind responsive classes (`flex-col md:flex-row`) handle the stacking; no new dependencies, no design tokens changed.
