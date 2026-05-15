# Coach Session Booking: Email + Calendar + Meeting Link

## Goal
When a member books a coaching session, they receive a confirmation email containing the coach's personal meeting link, an `.ics` attachment, and one-click "Add to Google / Outlook Calendar" buttons. Reminder emails go out 24h and 1h before the session.

## Meeting link approach
Each coach has a single personal recurring meeting link (their own Zoom room, Google Meet, Teams, etc.) saved on their coach profile. Every session booked with that coach reuses the same link. No third-party API integration needed.

- If a coach has not yet added a link, the email tells the member "Your coach will share the meeting link shortly" and notifies the coach to add one.

## What gets built

### 1. Database
- Add `meeting_link` (text, nullable) to `coaches`.
- Add `coach_id` foreign-key context and `reminder_24h_sent_at` / `reminder_1h_sent_at` (timestamptz, nullable) to `meeting_bookings` so reminders fire only once.

### 2. Coach profile UI
- New field "Personal meeting link" in the coach's profile editor, with helper text: "Used for all your coaching sessions. Paste your Zoom / Google Meet / Teams personal room link."

### 3. Booking confirmation email
- New transactional email template `coach-session-confirmation`.
- Triggered from `bookSlot` in `CoachPage.tsx` after successful insert.
- Email contains: session date/time, coach name, meeting link (or fallback message), `.ics` attachment workaround (hosted via Supabase Storage public URL or generated inline + linked), "Add to Google Calendar" and "Add to Outlook" buttons.

### 4. Calendar integration
- Generate an `.ics` string server-side in the Edge Function from booking data.
- Since Lovable email cannot attach files, upload the `.ics` to a public `calendar-invites` Storage bucket and link to it as "Download calendar invite (.ics)" in the email. Apple Mail, Outlook, and most clients open .ics from a link the same as an attachment.
- "Add to Google Calendar" = pre-filled `https://calendar.google.com/calendar/render?action=TEMPLATE&...` link.
- "Add to Outlook" = pre-filled `https://outlook.live.com/calendar/0/deeplink/compose?...` link.

### 5. Reminder emails (24h + 1h)
- New Edge Function `send-session-reminders` that finds bookings where `scheduled_at` is within the next 24h ± 5min or 1h ± 5min, status `scheduled`, and the corresponding `reminder_*_sent_at` is null.
- For each, invoke `send-transactional-email` with a `coach-session-reminder` template, then mark the timestamp.
- Scheduled via `pg_cron` every 5 minutes.

### 6. Coach notification
- Optional small addition: when a session is booked, also send the coach a transactional email so they know to expect it.

## User experience flow
1. Member picks a slot in `/app/coach` and clicks Book.
2. Booking row is inserted. Confirmation toast appears.
3. Within seconds, member receives confirmation email with meeting link, .ics download, and add-to-calendar buttons.
4. 24h before: reminder email. 1h before: final reminder email.
5. Member clicks meeting link at session time.

## Technical details

- Email infrastructure: requires `setup_email_infra` + `scaffold_transactional_email` if not already set up. (Memory says transactional email automation exists, so likely already set up.)
- New templates registered in `_shared/transactional-email-templates/registry.ts`:
  - `coach-session-confirmation`
  - `coach-session-reminder`
  - `coach-session-booked-coach-notice` (coach notification)
- Storage bucket `calendar-invites` (public read) for .ics files. File path: `{booking_id}.ics`.
- `pg_cron` job `coach-session-reminders` calling `send-session-reminders` every 5 minutes.
- `bookSlot` change: after insert, call `supabase.functions.invoke('send-transactional-email', ...)` with `idempotencyKey: \`booking-confirm-${bookingId}\``.

## Out of scope (can add later)
- Auto-generated unique Zoom/Meet links per session (would need Zoom or Google Calendar OAuth integration).
- Rescheduling or cancellation emails.
- SMS reminders.
- Member-side calendar sync (two-way).
