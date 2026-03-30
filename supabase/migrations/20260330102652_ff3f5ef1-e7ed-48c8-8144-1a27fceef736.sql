CREATE TABLE public.cultural_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_a text NOT NULL,
  country_b text NOT NULL,
  comparison_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (country_a, country_b)
);
ALTER TABLE public.cultural_comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comparisons" ON public.cultural_comparisons FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert comparisons" ON public.cultural_comparisons FOR INSERT TO authenticated WITH CHECK (true);