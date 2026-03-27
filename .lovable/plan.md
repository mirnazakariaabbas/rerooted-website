

## Plan: Coach Certification Tags, Full Edit, Coach Role & Dashboard

This is a large feature spanning database changes, admin UI updates, a new "coach" role, and an entirely new coach dashboard. Here is the breakdown.

---

### 1. Database Changes (Migration)

**Add `certification_level` column to `coaches` table:**
```sql
ALTER TABLE public.coaches ADD COLUMN certification_level text NOT NULL DEFAULT 'non-certified';
```
Valid values: `ACC`, `PCC`, `MCC`, `Non-certified` (enforced in UI, not via enum to keep flexibility).

**Add `user_id` column to `coaches` table** to link a coach record to a signed-up user:
```sql
ALTER TABLE public.coaches ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
```

**Add `coach` to the `app_role` enum:**
```sql
ALTER TYPE public.app_role ADD VALUE 'coach';
```

**Add `coach_availability` table** for built-in scheduling:
```sql
CREATE TABLE public.coach_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coach_availability ENABLE ROW LEVEL SECURITY;
```

**RLS policies for `coach_availability`:**
- Admins can manage all rows
- Coaches can manage their own availability (via `coaches.user_id`)
- Authenticated users can read all availability (for booking)

**RLS policies for coaches table** — add policy so coaches can read/update their own record (where `user_id = auth.uid()`).

**Add RLS policy on `reflections`** so coaches can read reflections shared with them (where `shared_with_coach = true` and the user is assigned to that coach).

---

### 2. Admin CoachesTab Updates

**File: `src/pages/admin/tabs/CoachesTab.tsx`**

- Add `certification_level` field to the add/edit dialog as a Select dropdown with options: ACC, PCC, MCC, Non-certified
- Display certification level as a colored Badge in the table
- Add `photo_url` field (URL input) to the dialog
- Ensure all coach fields are fully editable: name, email, bio, specialties, certification_level, photo_url
- Show `user_id` link status in the table (whether a coach account has signed up)

---

### 3. Coach Signup & Role Assignment Flow

When admin adds a coach with an email:
- If the email does not belong to an existing user, display a "Not yet signed up" status in the admin table
- The admin can click "Send Invite" which triggers an invitation email telling the coach to sign up at the platform
- When the coach signs up (same auth system), a database function or admin action links the `coaches.user_id` to their `auth.users.id` and adds a `coach` role to `user_roles`

**Implementation:**
- **Edge function `invite-coach`**: Sends an email to the coach's email address with a signup link. Uses Lovable AI for email content (no external API key needed). Records the invitation in the `invitations` table.
- **Admin UI**: "Send Invite" button per coach row (when `user_id` is null)
- **Linking logic**: After a coach signs up, the admin can manually link them from the Users tab, OR we add a trigger/function that auto-links when a new user signs up with an email matching `coaches.email`

**Auto-link function (migration):**
```sql
CREATE OR REPLACE FUNCTION public.link_coach_on_signup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE public.coaches SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;

  IF FOUND THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'coach')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_link_coach
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.link_coach_on_signup();
```

---

### 4. Coach Dashboard

**New route:** `/app/coach-dashboard` (visible only to users with `coach` role)

**New files:**
- `src/hooks/useCoachRole.ts` — Hook similar to `useAdmin` but checks for `coach` role
- `src/pages/coach/CoachDashboard.tsx` — Main coach dashboard page with tabs

**Dashboard tabs:**
1. **My Coachees** — List of assigned members (from `coach_assignments`), showing name, country, stage, assessment score
2. **Shared Journal** — Reflections from coachees where `shared_with_coach = true`, grouped by coachee
3. **Availability** — Weekly time slot editor (day + start/end time), CRUD on `coach_availability`
4. **Upcoming Sessions** — View of `meeting_bookings` for their assigned members
5. **My Profile** — View/edit their own coach bio, specialties, certification, photo

**Layout changes:**
- `BottomNav.tsx` — Add a "Dashboard" tab (Briefcase icon) visible only when user has `coach` role, linking to `/app/coach-dashboard`
- `MemberLayout.tsx` — Allow coach role users to access `/app/coach-dashboard`; block non-coaches from accessing it
- `App.tsx` — Add route for `/app/coach-dashboard`

---

### 5. Member Booking Flow Update

**File: `src/pages/member/CoachPage.tsx`**

- After showing coach info, add a "Book a Session" section
- Fetch available time slots from `coach_availability` for the assigned coach
- Show available slots for the next 2 weeks
- When member selects a slot, insert into `meeting_bookings`

---

### Summary of New/Modified Files

| File | Action |
|------|--------|
| Migration (SQL) | Add certification_level, user_id to coaches; create coach_availability; add coach to app_role; auto-link trigger; new RLS policies |
| `src/pages/admin/tabs/CoachesTab.tsx` | Add certification dropdown, photo URL, send invite button |
| `src/hooks/useCoachRole.ts` | New — check coach role |
| `src/pages/coach/CoachDashboard.tsx` | New — coach dashboard with 5 tabs |
| `src/components/layout/BottomNav.tsx` | Add coach dashboard tab |
| `src/components/layout/MemberLayout.tsx` | Guard coach dashboard route |
| `src/App.tsx` | Add coach-dashboard route |
| `src/pages/member/CoachPage.tsx` | Add booking UI with availability slots |
| Edge function `invite-coach` | New — send coach invitation email |

