-- Coaching notes table
CREATE TABLE public.coaching_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  coachee_id uuid NOT NULL,
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coaching_notes ENABLE ROW LEVEL SECURITY;

-- Coaches can manage their own notes
CREATE POLICY "Coaches can manage own notes"
  ON public.coaching_notes FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coaching_notes.coach_id
    AND coaches.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coaching_notes.coach_id
    AND coaches.user_id = auth.uid()
  ));

-- Members can read notes about themselves
CREATE POLICY "Members can read own notes"
  ON public.coaching_notes FOR SELECT TO authenticated
  USING (coachee_id = auth.uid());

-- Admins can manage all notes
CREATE POLICY "Admins can manage all notes"
  ON public.coaching_notes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));