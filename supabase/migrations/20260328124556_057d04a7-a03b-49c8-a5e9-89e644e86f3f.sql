
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company text,
  role text,
  quote text NOT NULL,
  photo_url text,
  rating integer DEFAULT 5,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can read featured testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated
  USING (is_featured = true);

CREATE TABLE public.page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  section_key text NOT NULL,
  title text,
  body text,
  image_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  UNIQUE(page_key, section_key)
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage page content" ON public.page_content
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can read page content" ON public.page_content
  FOR SELECT TO anon, authenticated
  USING (true);
