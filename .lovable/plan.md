

## Plan: Fix Footer Layout, Add Scroll-to-Top, Fix Nav Bar

Three issues to address:

### 1. Add ScrollToTop component
**New file: `src/components/ScrollToTop.tsx`**
- Uses `useLocation` to detect route changes, calls `window.scrollTo({ top: 0, left: 0 })` on every pathname change
- Ensures clicking footer links takes users to the top of the new page

**Modified: `src/App.tsx`**
- Import and render `<ScrollToTop />` inside `<BrowserRouter>`, before `<Routes>`

### 2. Redesign Footer to be more compact
**Modified: `src/components/Footer.tsx`**
- Reduce vertical padding from `py-12 md:py-16` to `py-8 md:py-10`
- Reduce internal gaps from `gap-10` to `gap-6`
- Move logo higher (reduce `mt` on text below it)
- Split the nav links into a **2-column grid** (`grid grid-cols-2 gap-x-8 gap-y-2`) instead of a single column
- Reduce bottom toggle section margin from `mt-10` to `mt-6`
- Keep the CTA + LinkedIn in the third column as-is

### 3. Fix nav bar not showing on Contact page
The Contact page already imports `<StickyNav />`. The nav hides itself when `gateOpen` is true. The issue is likely that navigating from a page where the gate was dismissed doesn't persist. Will verify the `StickyNav` renders on inner pages — the `gateOpen` state check (`if (gateOpen) return null`) may be triggering incorrectly. Will ensure the gate state defaults to closed on inner pages (non-homepage routes).

**Modified: `src/components/StickyNav.tsx`**
- Add a check: if user is NOT on the homepage (`/`), always show the nav regardless of `gateOpen` state. The gate is only relevant on the homepage.

### No database changes needed.

