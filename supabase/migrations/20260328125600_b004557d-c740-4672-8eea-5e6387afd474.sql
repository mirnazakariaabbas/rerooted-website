
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT 'all',
  is_active boolean NOT NULL DEFAULT true,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can read active announcements" ON public.announcements
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE TABLE public.peer_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  group_type text NOT NULL DEFAULT 'general',
  auto_match_criteria jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.peer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage peer groups" ON public.peer_groups
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can read peer groups" ON public.peer_groups
  FOR SELECT TO authenticated
  USING (true);

CREATE TABLE public.peer_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.peer_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.peer_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memberships" ON public.peer_group_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can join groups" ON public.peer_group_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups" ON public.peer_group_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all memberships" ON public.peer_group_members
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can see group peers" ON public.peer_group_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.peer_group_members pgm
      WHERE pgm.group_id = peer_group_members.group_id
      AND pgm.user_id = auth.uid()
    )
  );
