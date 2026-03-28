

## Plan: Replace Dashboard Button with Person Icon

**File: `src/components/StickyNav.tsx`**

- Replace the "Go to Dashboard" button + "Sign Out" link (both desktop and mobile) with a single circular person icon button using `UserRound` from lucide-react
- On click, navigate to `/app/home`
- Style as a small rounded-full button matching the nav aesthetic
- Remove `LogOut` import since sign-out is no longer in the nav

