

## Plan: Phase 1 — Re-Rooted Admin Platform (New Shell + Core Sections)

### What We're Building

Replace the entire `/app` layout with a new sidebar-based shell matching the spec's premium SaaS aesthetic. Build the Phase 1 features: dashboard home, contacts, members, and automated email templates.

### Architecture Change

The current `/app` uses a `MemberLayout` with a bottom nav. We'll replace this with a new `AppShell` component that uses the shadcn Sidebar, switching the bottom nav to a collapsible left sidebar. All user types (member, coach, admin) use this shell — the sidebar content adapts based on role.

```text
Current:                        New:
┌────────────────────┐          ┌──────┬─────────────────┐
│      Content       │          │      │  Top Bar         │
│                    │          │ Side │  (breadcrumbs,   │
│                    │          │ bar  │   search, bell)  │
│                    │          │      ├─────────────────┤
│                    │          │      │                  │
├────────────────────┤          │      │    Content       │
│    Bottom Nav      │          │      │                  │
└────────────────────┘          └──────┴─────────────────┘
```

### Brand & Styling Updates

1. **`src/index.css`** — Update CSS variables:
   - Card: `#F3F0F7` (Very Light Lavender)
   - Body text: `#1A1A1A`, Muted: `#6B6B6B`
   - Sidebar background: Deep Blue `#1F299C`, sidebar text: white
   - Destructive: `#D94F4F`, Warning: add `--warning` variable

2. **`tailwind.config.ts`** — Add Manrope to font family. Add `warning` color token.

3. **`index.html`** — Add Manrope Google Font link.

### Layout Components (New/Rewritten)

4. **`src/components/layout/AppShell.tsx`** — New. Uses `SidebarProvider` + `Sidebar` from shadcn. Contains:
   - Sidebar with Re-Rooted logo on Deep Blue background
   - Bucket sections (System, System Admin, Content, Intelligence) with expand/collapse
   - Active state: green left border + light lavender bg
   - Bottom: user avatar, name, role badge
   - Role-based visibility (members see Home/Cultural/Coach/Assessment/Profile; admins see all buckets; coaches see Dashboard + member tabs)
   - Top bar: breadcrumbs, notification bell, user avatar dropdown

5. **`src/components/layout/TopBar.tsx`** — New. Breadcrumb nav, global search trigger (Cmd+K), notification bell, user dropdown.

6. **`src/components/layout/MemberLayout.tsx`** — Rewrite to use `AppShell` instead of `BottomNav`.

7. **`src/components/layout/BottomNav.tsx`** — Remove (replaced by sidebar).

### Routing Updates

8. **`src/App.tsx`** — Restructure routes under `/app`:
   - Member routes: `/app/home`, `/app/cultural`, `/app/coach`, `/app/assessment`, `/app/profile`
   - Admin routes: `/app/admin/dashboard`, `/app/admin/users/contacts`, `/app/admin/users/members`, `/app/admin/users/organizations`, `/app/admin/users/coaches`, `/app/admin/users/admins`, `/app/admin/users/employees`, `/app/admin/users/subscribers`, `/app/admin/users/linkedin`, `/app/admin/users/history`, `/app/admin/system/*`, `/app/admin/content/*`, `/app/admin/intelligence/*`
   - Coach: `/app/coach-dashboard`

### Dashboard Home Screen

9. **`src/pages/admin/AdminHome.tsx`** — New. Command center with:
   - 4 metric cards (Total Contacts, Members, Coaches, Emails Sent) — fetched from DB counts
   - 3 secondary cards (Pending Approvals, New Submissions, placeholder RSS)
   - Recent Activity Feed (last 15 actions — placeholder for now)
   - Quick Action buttons (+Add Contact, View Pending Approvals)

### Contacts Section (Full CRUD)

10. **Database migration** — Create `contacts` table:
    - `id`, `first_name`, `last_name`, `email`, `phone`, `organization_id`, `source` (enum: contact_form, csv_import, linkedin_import, manual_entry, referral, event), `journey_stage`, `gdpr_consent`, `gdpr_consent_date`, `tags` (jsonb), `created_at`, `created_by`
    - RLS: admins full access, read-only admins can SELECT

11. **`src/pages/admin/users/ContactsPage.tsx`** — New. Full data table with:
    - Search, sort, filter by source/stage/tags
    - Row click opens right-side Sheet (drawer) with tabs: Details, Notes & Activity, Tags
    - CSV import with column mapping wizard
    - Manual add modal
    - Convert to Member button
    - Delete with confirmation

### Members Section

12. **`src/pages/admin/users/MembersPage.tsx`** — New. Replaces current UsersTab with richer table:
    - Columns: Name, Email, Member Since, Status, Journey Stage, Assigned Coach, Last Login
    - Profile drawer with tabs: Profile, Coaching (match history + reassign), Activity Log, Documents
    - Status badges: Active, Inactive, Churned

### Organizations Section

13. **Database migration** — Create `organizations` table:
    - `id`, `name`, `industry`, `country`, `website`, `primary_contact_id`, `status`, `notes`, `created_at`
    - RLS: admins full access

14. **`src/pages/admin/users/OrganizationsPage.tsx`** — New. Table + drawer with org details, linked members, activity log.

### Admin CoachesTab Enhancement

15. **`src/pages/admin/users/CoachesPage.tsx`** — Evolve existing CoachesTab into full page with certifications inline table, clients sub-tab, activity log.

### Automated Emails (Placeholder/Template Library)

16. **`src/pages/admin/content/AutomatedEmailsPage.tsx`** — New. Card grid showing pre-defined email trigger templates (Welcome, Contact Form, Coach Match, etc.) with Active/Inactive toggle. Template editor view with subject, body preview, variable insertion. All using mock data for now — actual email sending infrastructure to be wired in Phase 2.

### Files Summary

| Action | File |
|--------|------|
| Update | `index.html`, `src/index.css`, `tailwind.config.ts` |
| Create | `AppShell.tsx`, `TopBar.tsx`, `AdminHome.tsx` |
| Create | `ContactsPage.tsx`, `MembersPage.tsx`, `OrganizationsPage.tsx`, `CoachesPage.tsx`, `AutomatedEmailsPage.tsx` |
| Rewrite | `MemberLayout.tsx`, `App.tsx` |
| Remove | `BottomNav.tsx` (replaced), `AdminDashboard.tsx` (replaced by new routing) |
| Migration | `contacts` table, `organizations` table |

### What's Deferred to Phase 2+

- Admin Users / Employees / Subscribers / LinkedIn sections
- System Administration (security metrics, sessions, IP allowlist, audit log)
- Newsletter composer
- RSS Mention Monitor
- Intelligence bucket (Competitive Analysis, SEO)
- Notifications system, Global search (Cmd+K), Dark mode
- Role Version History
- Onboarding tooltips

### Technical Notes

- Uses shadcn `Sidebar` component with `collapsible="icon"` for mini-collapse
- All tables use shadcn Table (Tanstack Table integration deferred to Phase 2 for sorting/filtering power)
- Drawer/detail panels use shadcn `Sheet` (right-side slide-in)
- Framer Motion entrance animations maintained
- Existing member pages (MemberHome, CulturalCompanion, CoachPage, AssessmentPage, ProfilePage) and CoachDashboard remain functionally identical but now render inside the new sidebar shell instead of bottom nav

