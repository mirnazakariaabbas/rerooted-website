
-- 1. Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.user_type AS ENUM ('individual', 'organization');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  country_from TEXT,
  country_to TEXT,
  arrival_date DATE,
  stage TEXT DEFAULT 'pre-rooted',
  family_setup TEXT,
  has_children BOOLEAN DEFAULT false,
  primary_language TEXT DEFAULT 'en',
  onboarding_complete BOOLEAN DEFAULT false,
  notify_reflections BOOLEAN DEFAULT true,
  notify_checkins BOOLEAN DEFAULT true,
  user_type public.user_type NOT NULL DEFAULT 'individual',
  approval_status public.approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Coaches table
CREATE TABLE public.coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  specialties JSONB DEFAULT '[]'::jsonb,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- 6. Coach assignments
CREATE TABLE public.coach_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, coach_id)
);
ALTER TABLE public.coach_assignments ENABLE ROW LEVEL SECURITY;

-- 7. Reflections
CREATE TABLE public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT,
  shared_with_coach BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- 8. Assessments
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER,
  answers JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- 9. Invitations
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 10. Meeting bookings
CREATE TABLE public.meeting_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.meeting_bookings ENABLE ROW LEVEL SECURITY;

-- 11. Contact submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  audience_type TEXT,
  status TEXT NOT NULL DEFAULT 'unread',
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 12. Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type, 'individual')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. RLS Policies

-- Profiles: users read/update own, admins read all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User roles: admins manage, users read own
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Coaches: everyone can read, admins manage
CREATE POLICY "Anyone can read coaches" ON public.coaches
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage coaches" ON public.coaches
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Coach assignments: users read own, admins manage
CREATE POLICY "Users can read own assignments" ON public.coach_assignments
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage assignments" ON public.coach_assignments
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Reflections: users CRUD own, admins read all
CREATE POLICY "Users can manage own reflections" ON public.reflections
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can read all reflections" ON public.reflections
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Assessments: users CRUD own, admins read all
CREATE POLICY "Users can manage own assessments" ON public.assessments
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can read all assessments" ON public.assessments
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Invitations: admins manage
CREATE POLICY "Admins can manage invitations" ON public.invitations
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Meeting bookings: users read own, admins manage
CREATE POLICY "Users can read own bookings" ON public.meeting_bookings
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own bookings" ON public.meeting_bookings
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage bookings" ON public.meeting_bookings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Contact submissions: anyone can insert, admins can read/manage
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage contacts" ON public.contact_submissions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
