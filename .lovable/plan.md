

## Plan: Crop Logo, Tighten Slogan, Space Out Bottom Link

**File**: `src/pages/Auth.tsx`

### Changes

1. **Crop logo vertically** — Reduce the logo button container height from `h-60 md:h-80` to `h-40 md:h-52`. Keep image at `h-60 md:h-80` with `object-cover` so it crops the whitespace above/below the logo mark.

2. **Logo + slogan closer** — Change the slogan's margin from `-mt-2` to `-mt-4` to pull it tighter against the cropped logo.

3. **"Don't have an account?" more distance from Sign In button** — Add `mt-6` to the `<p>` element on line 240 (currently no explicit top margin, inheriting from `space-y-5` in the form). Wrap the form and the bottom text so the bottom link gets extra spacing — or simply add a `mt-8` class to the `<p>` tag.

### Result
More compact logo area, slogan tucked closer, and clear breathing room before "Don't have an account?" link.

