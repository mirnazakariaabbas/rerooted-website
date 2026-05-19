# Fix hero tree video without moving hero content

Small, scoped fix to the first homepage section only. Keep the existing hero composition exactly where it is, then correct only the video’s visible area, scale, and blend.

## Steps

1. **Keep the current hero layout untouched**
   - Do not change the logo, tagline, paragraph, CTA row, section spacing, or overall orientation.
   - Keep the video as an overlay inside the existing hero container, not as a grid or layout column.

2. **Match the screenshot placement more closely**
   - Reposition the video wrapper so it sits in the empty lower-right area shown in the reference image.
   - Increase the video’s displayed footprint so the tree occupies much more of that available space.
   - Adjust only the video wrapper dimensions and offsets, leaving all other hero elements in their current positions.

3. **Remove the visible white box around the video**
   - Use a dedicated clipping wrapper with `overflow: hidden` so only the intended portion of the MP4 is visible.
   - Tune the video’s crop using `object-fit`, `object-position`, and/or transform offsets so the extra matte area is hidden.
   - The uploaded MP4 has a real white background inside the file, so scale the video up within the wrapper and crop inward until only the tree drawing area remains visible.
   - Keep the page background and the video wrapper background aligned to the same Warm White tone so there is no visible edge.

4. **Preserve the requested video behavior**
   - `autoPlay`, `muted`, `playsInline`
   - No controls, no poster, no spinner, no play overlay, no loop
   - The video plays once and stops on the final frame

5. **Verify only the video changed**
   - Check the hero in preview against the screenshot reference.
   - Confirm that the text block, CTA row, nav, logo, and all lower sections remain unchanged.

## Technical notes

- File to update: `src/components/WhyReRooted.tsx`, hero section only.
- Asset path remains `public/hero-tree-animation.mp4`.
- Likely implementation: keep absolute positioning, add a tighter wrapper, and crop the MP4 inside that wrapper rather than changing the hero layout.
