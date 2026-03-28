
-- Content Calendar table
CREATE TABLE public.content_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'blog_post',
  description TEXT,
  scheduled_date DATE,
  status TEXT NOT NULL DEFAULT 'idea',
  assigned_to UUID,
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content calendar"
  ON public.content_calendar FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
