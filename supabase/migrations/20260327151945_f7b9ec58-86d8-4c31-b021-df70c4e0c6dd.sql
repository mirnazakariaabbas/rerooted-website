
-- Active Sessions table
CREATE TABLE public.active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_name text,
  user_email text,
  user_role text,
  ip_address text,
  user_agent text,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sessions" ON public.active_sessions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- IP Allowlist table
CREATE TABLE public.ip_allowlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  label text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.ip_allowlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ip allowlist" ON public.ip_allowlist
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RSS Mentions table
CREATE TABLE public.rss_mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name text NOT NULL,
  source_url text NOT NULL,
  article_title text NOT NULL,
  article_url text NOT NULL,
  snippet text,
  published_at timestamptz,
  discovered_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false
);

ALTER TABLE public.rss_mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage rss mentions" ON public.rss_mentions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Subscribers table
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  source text DEFAULT 'website',
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  tags jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage subscribers" ON public.subscribers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- LinkedIn Contacts table
CREATE TABLE public.linkedin_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  email text,
  company text,
  position text,
  linkedin_url text,
  connected_on date,
  imported_at timestamptz NOT NULL DEFAULT now(),
  imported_by uuid,
  tags jsonb DEFAULT '[]'::jsonb,
  converted_to_contact_id uuid REFERENCES public.contacts(id)
);

ALTER TABLE public.linkedin_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage linkedin contacts" ON public.linkedin_contacts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Role Version History table
CREATE TABLE public.role_version_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_name text,
  user_email text,
  old_role text,
  new_role text NOT NULL,
  changed_by uuid,
  changed_by_name text,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.role_version_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage role history" ON public.role_version_history
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
