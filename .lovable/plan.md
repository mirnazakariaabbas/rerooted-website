

## Plan: Fix Admin Route Protection and Home Tab

### Issues Found

1. **Home tab broken for admins**: In `MemberLayout.tsx` line 40-42, when an admin navigates to `/app/home`, they are immediately redirected back to `/app/admin`. This makes the Home tab in BottomNav non-functional for admins.

2. **Admin dashboard access**: The `AdminDashboard` component already checks `useAdmin()` and redirects non-admins to `/app/home`. However, adding a second guard in `MemberLayout` provides defense-in-depth.

### Changes

**`src/components/layout/MemberLayout.tsx`**
- Remove the automatic redirect from `/app/home` to `/app/admin` for admins (lines 39-42). Admins should be able to access all member pages including Home.
- Add a guard that blocks non-admin users from accessing `/app/admin` — if path starts with `/app/admin` and user is not admin, redirect to `/app/home`.

**`src/components/layout/BottomNav.tsx`**
- No changes needed. The admin tab (Shield icon) already only shows for admins.

### Result
- Non-admin users cannot access `/app/admin` (double protection: MemberLayout + AdminDashboard).
- Admin users can freely navigate between admin dashboard and all member pages including Home.

