
-- Create contact_source enum
CREATE TYPE public.contact_source AS ENUM ('contact_form', 'csv_import', 'linkedin_import', 'manual_entry', 'referral', 'event');

-- Create contacts table
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL DEFAULT '',
  email text,
  phone text,
  organization_id uuid,
  source contact_source NOT NULL DEFAULT 'manual_entry',
  journey_stage text DEFAULT 'pre-rooted',
  gdpr_consent boolean DEFAULT false,
  gdpr_consent_date timestamptz,
  tags jsonb DEFAULT '[]'::jsonb,
  notes jsonb DEFAULT '[]'::jsonb,
  job_title text,
  country text,
  language text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contacts" ON public.contacts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read contacts" ON public.contacts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create organizations table
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  country text,
  website text,
  primary_contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage organizations" ON public.organizations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add organization FK to contacts
ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_organization_id_fkey
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;
