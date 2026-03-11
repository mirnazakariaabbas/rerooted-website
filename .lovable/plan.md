

## Plan: Logo Updates and Bold Branding

### 1. Save the shorthand logo
Copy `user-uploads://re-rooted-graphical_elements-02-2.png` to `src/assets/logo-shorthand-blue.png`.

### 2. Navbar — swap logo and enlarge
In `StickyNav.tsx`:
- Import the new shorthand logo instead of `logo-blue.png`
- Increase logo from `h-8` to `h-20` (2.5x)
- Increase nav height from `h-16` to `h-24` to accommodate

### 3. Audience Gate — enlarge logo
In `AudienceGate.tsx`:
- Change `h-32 md:h-44` to `h-80 md:h-[27.5rem]` (2.5x)

### 4. Bold "Re-Rooted®" everywhere
Search all files for "Re-Rooted" and wrap in `<strong>` or `font-bold` spans in `CorporateHero.tsx` and any other content files.

