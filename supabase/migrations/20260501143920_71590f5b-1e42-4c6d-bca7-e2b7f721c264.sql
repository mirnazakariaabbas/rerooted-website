
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS external_url text;

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_source_url_key
  ON public.blog_posts (source_url)
  WHERE source_url IS NOT NULL;
