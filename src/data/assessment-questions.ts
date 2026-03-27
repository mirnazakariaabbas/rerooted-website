export interface AssessmentQuestion {
  id: string;
  text: string;
  category: string;
  options: { label: string; value: number }[];
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  { id: 'q1', text: 'How different is the primary language of your host country from your native language?', category: 'Cultural Distance', options: [{ label: 'Same language', value: 1 }, { label: 'Similar language family', value: 3 }, { label: 'Somewhat different', value: 6 }, { label: 'Completely different', value: 10 }] },
  { id: 'q2', text: 'How well do you speak the local language of your host country?', category: 'Language', options: [{ label: 'Fluently', value: 1 }, { label: 'Conversational', value: 3 }, { label: 'Basic phrases only', value: 7 }, { label: 'Not at all', value: 10 }] },
  { id: 'q3', text: 'How similar are the social norms and customs between your home and host countries?', category: 'Cultural Distance', options: [{ label: 'Very similar', value: 1 }, { label: 'Somewhat similar', value: 4 }, { label: 'Quite different', value: 7 }, { label: 'Completely different', value: 10 }] },
  { id: 'q4', text: 'Are you relocating alone, with a partner, or with family?', category: 'Family', options: [{ label: 'Alone', value: 5 }, { label: 'With a partner', value: 3 }, { label: 'With family and children', value: 7 }] },
  { id: 'q5', text: 'If you have children, how old are they?', category: 'Family', options: [{ label: 'No children', value: 0 }, { label: 'Under 5', value: 5 }, { label: '5–12', value: 7 }, { label: 'Teenagers', value: 9 }] },
  { id: 'q6', text: 'Is this your first international relocation?', category: 'Experience', options: [{ label: 'No, I\'ve relocated 3+ times', value: 1 }, { label: 'No, I\'ve done it once before', value: 3 }, { label: 'Yes, first time', value: 8 }] },
  { id: 'q7', text: 'How supported do you feel by your employer in this move?', category: 'Professional', options: [{ label: 'Fully supported', value: 1 }, { label: 'Moderate support', value: 4 }, { label: 'Minimal support', value: 7 }, { label: 'No employer support', value: 10 }] },
  { id: 'q8', text: 'Are you joining an existing team or building a new one?', category: 'Professional', options: [{ label: 'Existing team that knows me', value: 1 }, { label: 'Existing team, new to them', value: 4 }, { label: 'Entirely new team or role', value: 7 }] },
  { id: 'q9', text: 'How would you describe your general approach to change?', category: 'Resilience', options: [{ label: 'I thrive on it', value: 2 }, { label: 'I adapt well eventually', value: 4 }, { label: 'I find it stressful but manageable', value: 6 }, { label: 'Change is very difficult for me', value: 9 }] },
  { id: 'q10', text: 'Do you have an existing social network in your host country?', category: 'Social', options: [{ label: 'Yes, strong connections', value: 1 }, { label: 'A few contacts', value: 4 }, { label: 'Online connections only', value: 6 }, { label: 'Nobody at all', value: 9 }] },
  { id: 'q11', text: 'How different is the climate in your host country?', category: 'Cultural Distance', options: [{ label: 'Very similar', value: 1 }, { label: 'Moderately different', value: 4 }, { label: 'Dramatically different', value: 8 }] },
  { id: 'q12', text: 'How important is maintaining your home-country identity to you?', category: 'Resilience', options: [{ label: 'I\'m open to fully adapting', value: 2 }, { label: 'I want to blend both', value: 4 }, { label: 'Maintaining my identity is essential', value: 7 }] },
  { id: 'q13', text: 'Have you experienced homesickness in the past that affected your wellbeing?', category: 'Resilience', options: [{ label: 'Rarely or never', value: 2 }, { label: 'Sometimes', value: 5 }, { label: 'Often and intensely', value: 9 }] },
  { id: 'q14', text: 'How comfortable are you with ambiguity and uncertainty?', category: 'Resilience', options: [{ label: 'Very comfortable', value: 1 }, { label: 'Somewhat comfortable', value: 4 }, { label: 'I prefer clarity and plans', value: 7 }, { label: 'Uncertainty is very stressful', value: 10 }] },
  { id: 'q15', text: 'Does your partner/spouse have their own professional or social support in the host country?', category: 'Family', options: [{ label: 'Not applicable', value: 0 }, { label: 'Yes, they have their own support', value: 1 }, { label: 'Partially — working on it', value: 5 }, { label: 'No, they\'re fully dependent on me', value: 9 }] },
  { id: 'q16', text: 'How would you rate your access to familiar food, cultural products, or community from home?', category: 'Cultural Distance', options: [{ label: 'Easily available', value: 1 }, { label: 'Available with effort', value: 4 }, { label: 'Very limited', value: 8 }] },
  { id: 'q17', text: 'How different are the work culture expectations (meetings, feedback, autonomy)?', category: 'Professional', options: [{ label: 'Very similar', value: 1 }, { label: 'Some differences', value: 4 }, { label: 'Fundamentally different', value: 8 }] },
  { id: 'q18', text: 'How do you typically process difficult emotions?', category: 'Resilience', options: [{ label: 'I talk to people I trust', value: 2 }, { label: 'I journal or reflect privately', value: 3 }, { label: 'I stay busy and push through', value: 6 }, { label: 'I tend to bottle things up', value: 9 }] },
];

export function calculateDifficultyScore(answers: Record<string, number>): number {
  const values = Object.values(answers);
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  const maxPossible = values.length * 10;
  return Math.round((sum / maxPossible) * 100);
}

export function getScoreInterpretation(score: number, countryFrom: string, countryTo: string): string {
  if (score <= 30) return `Your move from ${countryFrom} to ${countryTo} has relatively low complexity. The cultural distance is manageable, and you have strong foundations to build on. Focus on deepening your connections and finding your personal rhythm.`;
  if (score <= 50) return `Your move from ${countryFrom} to ${countryTo} carries moderate complexity. There are meaningful cultural differences to navigate, but you have the resources and resilience to manage them well. Stay intentional about building support systems.`;
  if (score <= 70) return `Your move from ${countryFrom} to ${countryTo} carries significant cultural distance, combined with personal factors that add complexity. This is a high-support move — be proactive about seeking connection, coaching, and self-care.`;
  return `Your move from ${countryFrom} to ${countryTo} is one of the most complex relocation profiles. Multiple factors — cultural distance, language, family, and personal adjustment — are compounding. This is not a reflection of your ability. It means you need and deserve more support. Be gentle with yourself.`;
}

export function getPriorityDimensions(score: number, hasChildren: boolean): string[] {
  const base = ['values-harmonization', 'cultural-adaptation', 'emotional-cup'];
  if (score > 50) base.push('language-learning', 'social-life');
  if (hasChildren) base.push('third-culture-kids');
  return base;
}
