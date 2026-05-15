ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS children_count integer,
  ADD COLUMN IF NOT EXISTS children_ages integer[];