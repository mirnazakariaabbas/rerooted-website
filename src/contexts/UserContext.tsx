import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, DEFAULT_USER, ReflectionEntry, AssessmentResult, DimensionProgress } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  reflections: ReflectionEntry[];
  addReflection: (entry: Omit<ReflectionEntry, 'id' | 'date'>) => void;
  assessment: AssessmentResult | null;
  setAssessment: (result: AssessmentResult) => void;
  dimensionProgress: DimensionProgress[];
  updateDimensionProgress: (dimension: string, status: DimensionProgress['status']) => void;
  profileLoading: boolean;
  approvalStatus: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [assessment, setAssessmentState] = useState<AssessmentResult | null>(null);
  const [dimensionProgress, setDimensionProgress] = useState<DimensionProgress[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState('pending');

  useEffect(() => {
    if (!authUser) {
      setUser(DEFAULT_USER);
      setReflections([]);
      setAssessmentState(null);
      setProfileLoading(false);
      return;
    }

    const loadProfile = async () => {
      setProfileLoading(true);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setApprovalStatus(profile.approval_status || 'pending');
        setUser({
          name: profile.full_name || '',
          countryFrom: profile.country_from || '',
          countryTo: profile.country_to || '',
          arrivalDate: profile.arrival_date || '',
          stage: (profile.stage as UserProfile['stage']) || 'rooting-in',
          familySetup: (profile.family_setup as UserProfile['familySetup']) || 'alone',
          hasChildren: profile.has_children || false,
          primaryLanguage: profile.primary_language || 'English',
          onboardingComplete: profile.onboarding_complete || false,
          notifyReflections: profile.notify_reflections ?? true,
          notifyCheckins: profile.notify_checkins ?? true,
        });
      }

      // Load reflections
      const { data: refs } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (refs) {
        setReflections(refs.map(r => ({
          id: r.id,
          date: r.created_at,
          prompt: r.prompt,
          response: r.response || '',
          sharedWithCoach: r.shared_with_coach || false,
        })));
      }

      // Load latest assessment
      const { data: assess } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (assess) {
        setAssessmentState({
          completedAt: assess.completed_at || assess.created_at,
          score: assess.score || 0,
          answers: (assess.answers as Record<string, number | number[]>) || {},
        });
      }

      setProfileLoading(false);
    };
    loadProfile();
  }, [authUser]);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      if (authUser) {
        const dbUpdates: { [K in keyof import('@/integrations/supabase/types').Database['public']['Tables']['profiles']['Update']]?: import('@/integrations/supabase/types').Database['public']['Tables']['profiles']['Update'][K] } = {};
        if ('name' in updates) dbUpdates.full_name = updates.name;
        if ('countryFrom' in updates) dbUpdates.country_from = updates.countryFrom;
        if ('countryTo' in updates) dbUpdates.country_to = updates.countryTo;
        if ('arrivalDate' in updates) dbUpdates.arrival_date = updates.arrivalDate;
        if ('stage' in updates) dbUpdates.stage = updates.stage;
        if ('familySetup' in updates) dbUpdates.family_setup = updates.familySetup;
        if ('hasChildren' in updates) dbUpdates.has_children = updates.hasChildren;
        if ('primaryLanguage' in updates) dbUpdates.primary_language = updates.primaryLanguage;
        if ('onboardingComplete' in updates) dbUpdates.onboarding_complete = updates.onboardingComplete;
        if ('notifyReflections' in updates) dbUpdates.notify_reflections = updates.notifyReflections;
        if ('notifyCheckins' in updates) dbUpdates.notify_checkins = updates.notifyCheckins;
        supabase.from('profiles').update(dbUpdates).eq('id', authUser.id).then();
      }
      return next;
    });
  }, [authUser]);

  const addReflection = useCallback((entry: Omit<ReflectionEntry, 'id' | 'date'>) => {
    if (!authUser) return;
    const id = crypto.randomUUID();
    const date = new Date().toISOString();
    setReflections(prev => [{ ...entry, id, date }, ...prev]);
    supabase.from('reflections').insert({
      id,
      user_id: authUser.id,
      prompt: entry.prompt,
      response: entry.response,
      shared_with_coach: entry.sharedWithCoach || false,
    }).then();
  }, [authUser]);

  const setAssessment = useCallback((result: AssessmentResult) => {
    setAssessmentState(result);
    if (authUser) {
      supabase.from('assessments').insert({
        user_id: authUser.id,
        score: result.score,
        answers: result.answers,
        completed_at: result.completedAt,
      }).then();
    }
  }, [authUser]);

  const updateDimensionProgress = useCallback((dimension: string, status: DimensionProgress['status']) => {
    setDimensionProgress(prev => {
      const existing = prev.findIndex(d => d.dimension === dimension);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { dimension, status };
        return updated;
      }
      return [...prev, { dimension, status }];
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, reflections, addReflection, assessment, setAssessment, dimensionProgress, updateDimensionProgress, profileLoading, approvalStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
