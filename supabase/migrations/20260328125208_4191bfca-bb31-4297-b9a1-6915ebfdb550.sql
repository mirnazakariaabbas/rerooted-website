
CREATE TABLE public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT 'MessageSquare',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage forum categories" ON public.forum_categories
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can read categories" ON public.forum_categories
  FOR SELECT TO authenticated
  USING (true);

CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read all posts" ON public.forum_posts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create posts" ON public.forum_posts
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own posts" ON public.forum_posts
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts" ON public.forum_posts
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  body text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read all replies" ON public.forum_replies
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create replies" ON public.forum_replies
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own replies" ON public.forum_replies
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all replies" ON public.forum_replies
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
