

## Plan: Enlarge Logo + Adjust Spacing on Auth Page

**File**: `src/pages/Auth.tsx`

### Changes

1. **Logo 1.5x bigger** — Increase container height from `h-40 md:h-52` to `h-60 md:h-80` and image from `h-60 md:h-80` to `h-[22rem] md:h-[30rem]`

2. **Group logo + slogan together, push upward** — Remove `space-y-8` from the outer wrapper. Instead, split the layout into two groups:
   - **Top group** (logo + slogan): tightly paired with minimal gap, pushed toward the top using negative margin or reduced spacing
   - **Bottom group** (welcome text + form): separated from the top group with `mt-8` or similar

3. **Add clear separation** — Insert `mt-10` before the "Welcome back" heading to create visible breathing room between logo/slogan block and the form content

### Result
Logo and tagline sit as a prominent header near the top; form fields sit below with clear visual separation.

