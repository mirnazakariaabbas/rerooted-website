# Plan: Fix Security Findings Before Going Live with People Data

## Goal
Resolve all 5 scanner findings (1 error, 4 warnings) so the app is safe to store people's personal data and can serve as the technical foundation for GDPR/regulatory compliance.

## Findings to fix

### 1. (ERROR) Calendar-invites storage bucket is public
- Bucket `calendar-invites` is public with no ownership check — anyone with a URL can read other users' calendar invite files (personal meeting details)
- **Fix:** Make the bucket private. Add an RLS storage SELECT policy that verifies the requesting user owns the associated calendar event/booking before allowing reads.

### 2. (WARN) Public can execute SECURITY DEFINER function
- An unauthenticated user can call a SECURITY DEFINER function
- **Fix:** Revoke `EXECUTE` from `anon`, or switch to `SECURITY INVOKER`, or move out of exposed API schema if not meant to be public. (Inspect which function first.)

### 3. (WARN) Signed-in users can execute SECURITY DEFINER function
- Any signed-in user can call a SECURITY DEFINER function
- **Fix:** Revoke `EXECUTE` from `authenticated` for functions that should only run server-side, or restrict to service_role. (Inspect which function first.)

### 4. (WARN) Leaked password protection disabled
- Users with passwords found in known breaches can reuse them here
- **Fix:** Enable leaked password protection (HIBP check) via Supabase Auth config.

### 5. (WARN) Coach email addresses exposed to all authenticated users
- The "Anyone can read coaches" policy exposes the `email` column to every signed-in user
- **Fix:** Exclude `email` from the public coach directory read — either via a view that omits the column, or by splitting the policy so only admins/assigned users see email.

## Execution order
1. Fix #1 (error) first — active personal-data exposure
2. Fix #4 (settings toggle) — quick win
3. Fix #5 (policy/view change) — personal contact data
4. Fix #2 and #3 (function permissions) — inspect the specific functions, then revoke/restrict
5. Re-run the security scan to confirm all findings are resolved

## Notes
- These fixes make the app **technically** safe for people data, but GDPR/regulatory compliance also requires legal work the user must do: DPA with Lovable, privacy notice, data residency confirmation, consent flows
- No compliance claims (SOC 2, ISO, etc.) will be made — only the technical fixes above
