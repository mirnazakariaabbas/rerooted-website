
-- Create audit_log table for tracking all admin actions
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text,
  user_role text,
  action_type text NOT NULL,
  section text,
  record_type text,
  record_id text,
  record_name text,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log" ON public.audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert audit log" ON public.audit_log
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create newsletters table
CREATE TABLE public.newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  body_html text NOT NULL DEFAULT '',
  from_name text DEFAULT 'Re-Rooted',
  reply_to text DEFAULT 'hello@re-rooted.com',
  recipient_segment text DEFAULT 'all_subscribers',
  status text NOT NULL DEFAULT 'draft',
  sent_at timestamptz,
  scheduled_at timestamptz,
  open_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  unsubscribe_count integer DEFAULT 0,
  recipient_count integer DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage newsletters" ON public.newsletters
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create admin_access_requests table for approval workflow
CREATE TABLE public.admin_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_name text,
  user_email text,
  requested_role text NOT NULL DEFAULT 'admin',
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage access requests" ON public.admin_access_requests
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
