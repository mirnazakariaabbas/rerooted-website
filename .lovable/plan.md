

## Plan: Create Test Accounts for All Access Levels

We'll create 4 test users via a backend function, each with a different role/type so you can test the full UX.

### Test Accounts

| Role | Email | Password | User Type | Approval |
|------|-------|----------|-----------|----------|
| Admin | admin1@test.com | Admin123! | individual | approved |
| Org Member | orgmember1@test.com | Member123! | organization | approved |
| Individual Member | member1@test.com | Member123! | individual | approved |
| Employee (pending) | employee1@test.com | Employee123! | organization | pending |

### Steps

1. **Temporarily enable auto-confirm** on email signups so test users can sign in immediately without email verification

2. **Create an edge function** (`create-test-users`) that uses the Supabase service role to:
   - Create all 4 auth users via `supabase.auth.admin.createUser()`
   - The existing `handle_new_user` trigger will auto-create profiles
   - Update profiles to set `approval_status = 'approved'` for the first 3
   - Insert an `admin` role into `user_roles` for the admin account

3. **Invoke the edge function** once to seed the data

4. **Disable auto-confirm** after accounts are created (restore normal signup flow)

5. **Delete the edge function** after use (it's a one-time seed script)

### Technical Detail

The edge function uses `SUPABASE_SERVICE_ROLE_KEY` (already configured) to bypass RLS and create users with confirmed emails directly. The `handle_new_user` trigger populates the `profiles` table automatically with the `user_type` from signup metadata.

