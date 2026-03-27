export type JourneyStage = 'pre-rooted' | 'rooting-in' | 'thrive' | 'rooting-back';
export type FamilySetup = 'alone' | 'with-partner' | 'with-family';

export interface UserProfile {
  name: string;
  photoUrl?: string;
  countryFrom: string;
  countryTo: string;
  arrivalDate: string;
  stage: JourneyStage;
  familySetup: FamilySetup;
  hasChildren: boolean;
  primaryLanguage: string;
  onboardingComplete: boolean;
  notifyReflections: boolean;
  notifyCheckins: boolean;
}

export interface ReflectionEntry {
  id: string;
  date: string;
  prompt: string;
  response: string;
  sharedWithCoach?: boolean;
}

export interface AssessmentResult {
  completedAt: string;
  score: number;
  answers: Record<string, number>;
}

export interface DimensionProgress {
  dimension: string;
  status: 'not-started' | 'in-progress' | 'explored';
}

export const DEFAULT_USER: UserProfile = {
  name: '',
  countryFrom: '',
  countryTo: '',
  arrivalDate: '',
  stage: 'rooting-in',
  familySetup: 'alone',
  hasChildren: false,
  primaryLanguage: 'English',
  onboardingComplete: false,
  notifyReflections: true,
  notifyCheckins: true,
};

export const STAGE_LABELS: Record<JourneyStage, { name: string; tagline: string; number: number }> = {
  'pre-rooted': { name: 'Pre-Rooted', tagline: "Should I go or should I stay!", number: 1 },
  'rooting-in': { name: 'Rooting In', tagline: "Landing in a new country and I want to make it home!", number: 2 },
  'thrive': { name: 'Thrive', tagline: "I've been here 2+ years, settled and ready to take off!", number: 3 },
  'rooting-back': { name: 'Rooting Back', tagline: "Going back home — managing reverse culture shock", number: 4 },
};

export function calculateStage(arrivalDate: string, isReturning: boolean): JourneyStage {
  if (isReturning) return 'rooting-back';
  const arrival = new Date(arrivalDate);
  const now = new Date();
  if (arrival > now) return 'pre-rooted';
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  if (arrival > twoYearsAgo) return 'rooting-in';
  return 'thrive';
}
