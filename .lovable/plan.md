

## Plan: Admin CRM + Member Portal Integration

This is a large feature set. I recommend building it in **3 phases** across multiple prompts to keep quality high and avoid errors.

---

### Phase 1: Database Schema + Auth + Role System (this prompt)

**Database migrations** — Create all required tables:

1. **`profiles`** — user profile data (name, country_from, country_to, arrival_date, stage, family_setup, has_children, primary_language, onboarding_complete, notify_reflections, notify_checkins, user_type `individual`/`organization`, approval_status `pending`/`approved`/`rejected`, created_at)
2. **`user_roles`** — role system using `app_role` enum (`admin`, `moderator`, `user`) with `has_role()` security definer function
3. **`coaches`** — name, bio, photo_url, specialties (jsonb), email
4. **`coach_assignments`** — user_id, coach_id
5. **`reflections`** — user_id, prompt, response, shared_with_coach
6. **`assessments`** — user_id, score, answers (jsonb), completed_at
7. **`invitations`** — email, status, invited_by
8. **`meeting_bookings`** — user_id, coach_id, scheduled_at, duration_minutes, status
9. **`contact_submissions`** — name, email, subject, message, audience_type, status, replied_at
10. **Trigger** — auto-create profile row on auth signup

RLS policies on all tables. Profiles: users read/update own; admins read all. Coaches/invitations/bookings: admins manage, users read assigned.

**Auth context** — `src/contexts/AuthContext.tsx` (ported from Rooted Companion)

**Admin hook** — `src/hooks/useAdmin.ts` using `has_role()` RPC

**Auth page** — `src/pages/Auth.tsx` with sign up / sign in. On sign up, user selects "Individual" or "Organization" type. After sign up, show "pending approval" message.

**Route updates** — Add `/auth` route. Add "Login" button to `StickyNav`.

### Phase 2: Member Portal (next prompt)

Port from Rooted Companion into this project:
- **Onboarding flow** (Welcome → YourMove → AboutYou → Ready) — adapted for individual vs organization paths
- **Member home page** (`/app/home`) with stage info, focus areas, weekly reflection
- **Cultural Companion** (`/app/cultural`)
- **Coach page** (`/app/coach`)
- **Assessment page** (`/app/assessment`) — placeholder for org assessment
- **Profile page** (`/app/profile`)
- **Layout** — TopBar + BottomNav for member area
- **Data files** — countries, coaching-content, cultural-comparisons, assessment-questions
- **User context** — `UserContext.tsx` with DB persistence
- **Approval gate** — if user is `pending`, show waiting screen instead of member content

### Phase 3: Admin CRM Dashboard (following prompt)

Full admin dashboard at `/admin`:
- **Users tab** — CRM table with filters (search, stage, coach, user_type). Tags: individual/organization/admin/employee. Approve/reject pending users. User detail panel with notes and activity timeline.
- **Content tab** — manage blog posts, site copy
- **Coaches tab** — add/remove coaches, assign to users
- **Invitations tab** — send invites, track status
- **Bookings tab** — view/manage meeting bookings
- **Contact tab** — view submissions, mark read/replied
- **Settings tab** — site-level configuration

---

### Phase 1 delivers

| File | Action |
|------|--------|
| Database migration | 10 tables + enum + trigger + RLS + has_role function |
| `src/contexts/AuthContext.tsx` | Create — auth state management |
| `src/hooks/useAdmin.ts` | Create — admin role check hook |
| `src/pages/Auth.tsx` | Create — login/signup with user type selection |
| `src/components/StickyNav.tsx` | Edit — add Login button |
| `src/App.tsx` | Edit — add AuthProvider, /auth route |

Shall I proceed with Phase 1?

