

## Plan: Add "Go to App" Button for Signed-In Users on Public Site

### What Changes

**File: `src/components/StickyNav.tsx`**

Replace the "Sign Out" button (shown when user is authenticated) with a **"Go to Dashboard"** button that navigates to `/app/home`. Optionally keep a smaller sign-out option alongside it.

- Desktop: Replace the current "Sign Out" button with a styled "Go to Dashboard" button using the `LayoutDashboard` icon from Lucide. Add a small ghost "Sign Out" link next to it.
- Mobile: Same treatment in the mobile menu — "Go to Dashboard" as primary action, "Sign Out" as secondary text link below.

### Technical Detail

- Use `navigate('/app/home')` on click — the existing auth-guarded routing will handle role-based redirects if needed.
- Import `LayoutDashboard` from `lucide-react`.
- No new files, no database changes. Single file edit.

