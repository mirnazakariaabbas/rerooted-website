
The user wants to replace the hero image (currently `src/assets/hero-portrait.jpg` used in `src/components/Hero.tsx`) with the uploaded SVG file `Untitled_design.svg`.

Since the user is on route `/` (homepage), the Hero component is what renders the portrait image in a circular crop.

## Plan: Replace Hero Image with Uploaded SVG

### Change

1. **Copy the uploaded SVG** from `user-uploads://Untitled_design.svg` into `src/assets/hero-portrait.svg`.

2. **Update `src/components/Hero.tsx`**:
   - Change the import from `heroImage from "@/assets/hero-portrait.jpg"` to `heroImage from "@/assets/hero-portrait.svg"`.
   - Keep the existing circular crop container (`rounded-full`, fixed dimensions) and `object-cover` styling so the new SVG fits the same hero layout on both Corporate and Individual homepages.

### Notes
- The SVG will replace the image across both `CorporateHome` and `IndividualHome` since they share the `Hero` component.
- No layout, animation, or sizing changes, only the image source swap.
