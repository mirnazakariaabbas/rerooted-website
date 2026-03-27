
-- Add certification_level and user_id to coaches
ALTER TABLE public.coaches ADD COLUMN certification_level text NOT NULL DEFAULT 'non-certified';
ALTER TABLE public.coaches ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add coach to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'coach';

-- Create coach_availability table
CREATE TABLE public.coach_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  day_of_week int NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coach_availability ENABLE ROW LEVEL SECURITY;

-- RLS for coach_availability
CREATE POLICY "Admins can manage availability" ON public.coach_availability FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Coaches can manage own availability" ON public.coach_availability FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.id = coach_availability.coach_id AND coaches.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.id = coach_availability.coach_id AND coaches.user_id = auth.uid()));
CREATE POLICY "Authenticated can read availability" ON public.coach_availability FOR SELECT TO authenticated USING (true);

-- Coaches can update own coach record
CREATE POLICY "Coaches can update own record" ON public.coaches FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Coaches can read shared reflections from their coachees
CREATE POLICY "Coaches can read shared reflections" ON public.reflections FOR SELECT TO authenticated USING (
  shared_with_coach = true AND EXISTS (
    SELECT 1 FROM public.coach_assignments ca
    JOIN public.coaches c ON c.id = ca.coach_id
    WHERE ca.user_id = reflections.user_id AND c.user_id = auth.uid()
  )
);

-- Coaches can read their own bookings
CREATE POLICY "Coaches can read own bookings" ON public.meeting_bookings FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.coaches WHERE coaches.id = meeting_bookings.coach_id AND coaches.user_id = auth.uid())
);

-- Coaches can read assigned user profiles
CREATE POLICY "Coaches can read assigned profiles" ON public.profiles FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.coach_assignments ca
    JOIN public.coaches c ON c.id = ca.coach_id
    WHERE ca.user_id = profiles.id AND c.user_id = auth.uid()
  )
);

-- Coaches can read their assignments
CREATE POLICY "Coaches can read own assignments" ON public.coach_assignments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.coaches WHERE coaches.id = coach_assignments.coach_id AND coaches.user_id = auth.uid())
);

-- Update handle_new_user to auto-link coaches on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type, 'individual')
  );

  -- Auto-link coach record if email matches
  UPDATE public.coaches SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;

  IF FOUND THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'coach')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;
