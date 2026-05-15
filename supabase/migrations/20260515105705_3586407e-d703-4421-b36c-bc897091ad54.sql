
ALTER TABLE public.coaches ADD COLUMN IF NOT EXISTS meeting_link text;

ALTER TABLE public.meeting_bookings ADD COLUMN IF NOT EXISTS reminder_24h_sent_at timestamptz;
ALTER TABLE public.meeting_bookings ADD COLUMN IF NOT EXISTS reminder_1h_sent_at timestamptz;

INSERT INTO storage.buckets (id, name, public)
VALUES ('calendar-invites', 'calendar-invites', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read calendar invites"
ON storage.objects FOR SELECT
USING (bucket_id = 'calendar-invites');

CREATE POLICY "Service role can write calendar invites"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'calendar-invites');
