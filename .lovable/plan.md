

## Plan: Admin CRM Dashboard

### Overview
Admin-only dashboard at `/app/admin` with 5 tabs plus coach assignment capability. Admins are auto-redirected here instead of member home.

### New Files

1. **`src/pages/admin/AdminDashboard.tsx`** — Main page with shadcn Tabs: Users, Coaches, Invitations, Bookings, Contacts.

2. **`src/pages/admin/tabs/UsersTab.tsx`** — Table of all profiles (name, email, user_type, approval_status, stage, created_at). Actions: approve/reject users, **assign a coach** via a Select dropdown that lists all coaches and inserts/updates `coach_assignments`.

3. **`src/pages/admin/tabs/CoachesTab.tsx`** — CRUD table for coaches (name, bio, email, specialties, photo_url). Add/edit via Dialog form, delete with confirmation.

4. **`src/pages/admin/tabs/InvitationsTab.tsx`** — Table of invitations with status. Action: send new invitation (insert email + invited_by).

5. **`src/pages/admin/tabs/BookingsTab.tsx`** — Table of meeting_bookings joined with profile and coach names. Status management.

6. **`src/pages/admin/tabs/ContactsTab.tsx`** — Table of contact_submissions. Mark as read/replied. Expandable message view.

### Modified Files

7. **`src/App.tsx`** — Add route `/app/admin` element `<AdminDashboard />` inside MemberLayout group.

8. **`src/components/layout/MemberLayout.tsx`** — Use `useAdmin()` hook. If admin and on `/app/home`, redirect to `/app/admin`. Skip pending-approval gate for admins.

9. **`src/components/layout/BottomNav.tsx`** — Show Shield icon linking to `/app/admin` when user is admin.

### Coach Assignment Detail (UsersTab)
- Each user row has an "Assign Coach" action that opens a Dialog/Popover with a Select of all coaches (fetched from `coaches` table).
- On selection, upsert into `coach_assignments` (user_id, coach_id).
- Display currently assigned coach name in the users table.
- Uses existing RLS: "Admins can manage assignments" policy on `coach_assignments`.

### Technical Notes
- All queries use `supabase.from('table').select(...)` — existing RLS policies grant admins full access.
- No new migrations needed — all tables, policies, and functions already exist.
- Uses shadcn Table, Tabs, Badge, Button, Dialog, Select components.

