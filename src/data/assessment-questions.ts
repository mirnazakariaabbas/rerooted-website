export interface AssessmentOption {
  label: string;
  value: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  category: string;
  type: 'single' | 'multi';
  options: AssessmentOption[];
  multiSelectCap?: number;
  /** For Q2: if "Location change only" (value 1) is selected alongside others, ignore it */
  ignoreIfAlsoSelected?: number;
  /** Only show this question if the referenced question has one of the specified answer values */
  conditional?: { questionId: string; values: number[] };
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ─── Category 1: Assignment Context (6 questions) ───
  {
    id: 'q1', text: 'What type of assignment is this?', category: 'Assignment Context', type: 'single',
    options: [
      { label: 'Extended business travel (< 6 months)', value: 2 },
      { label: 'Short-term assignment (6–24 months)', value: 4 },
      { label: 'Long-term assignment (2–4 years)', value: 5 },
      { label: 'Permanent relocation / localization', value: 8 },
      { label: 'Commuter arrangement (split between countries)', value: 6 },
    ],
  },
  {
    id: 'q2', text: 'What changes come with this role?', category: 'Assignment Context', type: 'multi',
    multiSelectCap: 10, ignoreIfAlsoSelected: 1,
    options: [
      { label: 'Location change only — same role, same function', value: 1 },
      { label: 'Different market, region, or business unit', value: 2 },
      { label: 'Promotion — step up in scope or seniority', value: 3 },
      { label: 'New function or discipline (e.g. marketing → operations)', value: 3 },
      { label: 'First time managing people', value: 4 },
      { label: 'Managing a significantly larger or more complex team', value: 3 },
    ],
  },
  {
    id: 'q3', text: 'What is the strategic impact of this assignment?', category: 'Assignment Context', type: 'single',
    options: [
      { label: 'Routine — a standard move with predictable expectations', value: 2 },
      { label: 'Meaningful — an important role within normal business operations', value: 4 },
      { label: 'High impact — market entry, turnaround, or significant P&L responsibility', value: 7 },
      { label: 'Business critical — transformation mandate, senior leadership scrutiny from day one', value: 10 },
    ],
  },
  {
    id: 'q4', text: 'What is the position context?', category: 'Assignment Context', type: 'single',
    options: [
      { label: 'Taking over a stable, well-documented role', value: 1 },
      { label: 'Replacing a predecessor with a standard handover', value: 4 },
      { label: 'Replacing a predecessor who failed, exited abruptly, or was removed', value: 7 },
      { label: 'Newly created position — no predecessor, building from scratch', value: 8 },
    ],
  },
  {
    id: 'q5', text: 'How much time pressure exists to deliver results?', category: 'Assignment Context', type: 'single',
    options: [
      { label: 'Generous ramp-up (3+ months to settle before full performance expected)', value: 1 },
      { label: 'Standard expectations (1–3 months to reach full speed)', value: 4 },
      { label: 'Accelerated — meaningful delivery expected within weeks', value: 7 },
      { label: 'Immediate — crisis response or urgent business need', value: 10 },
    ],
  },
  {
    id: 'q6', text: 'How complex is the reporting structure?', category: 'Assignment Context', type: 'single',
    options: [
      { label: 'Single reporting line, locally based', value: 1 },
      { label: 'Reports to HQ in a similar time zone', value: 3 },
      { label: 'Matrix — dual reporting (local + regional/global)', value: 6 },
      { label: 'Complex matrix — multiple stakeholders across time zones', value: 9 },
    ],
  },

  // ─── Category 2: Cultural Distance (3 questions) ───
  {
    id: 'q7', text: 'How culturally distant is the host country from home?', category: 'Cultural Distance', type: 'single',
    options: [
      { label: 'Very similar — minor differences, easy to navigate', value: 1 },
      { label: 'Noticeably different — requires conscious adjustment in social and professional settings', value: 4 },
      { label: 'Quite different — frequent misunderstandings likely, significant adaptation needed', value: 7 },
      { label: 'Fundamentally different — deeply different worldview, daily life requires major behavioral change', value: 10 },
    ],
  },
  {
    id: 'q8', text: 'In the host country, how easy is it to find food, products, and routines from home?', category: 'Cultural Distance', type: 'single',
    options: [
      { label: 'Easily available — large diaspora community, international shops and restaurants', value: 1 },
      { label: 'Available with some effort — specialty stores, online ordering, occasional trips', value: 4 },
      { label: 'Very limited — requires imports, care packages, or travel to find', value: 7 },
      { label: 'Virtually unavailable — will need to fully adapt to local alternatives', value: 10 },
    ],
  },
  {
    id: 'q9', text: 'How different is the safety, healthcare, and infrastructure environment?', category: 'Cultural Distance', type: 'single',
    options: [
      { label: 'Comparable or better than home country', value: 1 },
      { label: 'Minor adjustments needed', value: 3 },
      { label: 'Notable differences requiring active planning', value: 6 },
      { label: 'Significant concerns requiring active management', value: 9 },
    ],
  },

  // ─── Category 3: Professional Environment (3 questions) ───
  {
    id: 'q10', text: 'What is the team dynamic at the destination?', category: 'Professional Environment', type: 'single',
    options: [
      { label: 'Joining a team they already know and have worked with', value: 1 },
      { label: 'Joining an established team as a new peer or member', value: 3 },
      { label: 'Inheriting and leading an existing local team', value: 6 },
      { label: 'Building a new team from scratch', value: 8 },
    ],
  },
  {
    id: 'q11', text: 'How different is the work culture?', category: 'Professional Environment', type: 'single',
    options: [
      { label: 'Very similar work culture and business practices', value: 1 },
      { label: 'Some differences in communication, hierarchy, or meeting style', value: 4 },
      { label: 'Significantly different — feedback norms, decision-making, power distance', value: 7 },
      { label: 'Fundamentally different — requires rethinking how they operate and lead', value: 10 },
    ],
  },
  {
    id: 'q12', text: 'How aligned is the local office with HQ culture and expectations?', category: 'Professional Environment', type: 'single',
    options: [
      { label: 'Strong alignment between local and HQ', value: 1 },
      { label: 'Some tension or misalignment', value: 4 },
      { label: 'Significant disconnect — caught between two organizational cultures', value: 7 },
      { label: 'Resistant local environment — HQ directives met with friction', value: 10 },
    ],
  },

  // ─── Category 4: Language (2 questions) ───
  {
    id: 'q13', text: "How well do they speak the host country's primary language?", category: 'Language', type: 'single',
    options: [
      { label: 'Fluent or native speaker', value: 1 },
      { label: 'Conversational — can manage daily life', value: 3 },
      { label: 'Basic — survival phrases only', value: 7 },
      { label: 'No proficiency at all', value: 10 },
    ],
  },
  {
    id: 'q14', text: 'What language is used in the workplace?', category: 'Language', type: 'single',
    options: [
      { label: 'Same as their native language', value: 1 },
      { label: "A language they're fully fluent in", value: 2 },
      { label: 'Mixed — formal meetings in a known language, informal interactions in local language', value: 5 },
      { label: "Predominantly a language they don't speak well", value: 9 },
    ],
  },

  // ─── Category 5: Family & Accompanying (5 questions) ───
  {
    id: 'q15', text: 'Who is making this move?', category: 'Family & Accompanying', type: 'single',
    options: [
      { label: 'Solo — no partner or dependents', value: 4 },
      { label: 'With partner, no children', value: 3 },
      { label: 'With partner and children', value: 7 },
      { label: 'Single parent with children', value: 9 },
      { label: 'Relocating alone — partner and/or family staying in home country', value: 8 },
    ],
  },
  {
    id: 'q16', text: 'Ages of children relocating?', category: 'Family & Accompanying', type: 'multi',
    multiSelectCap: 10,
    conditional: { questionId: 'q15', values: [7, 9] },
    options: [
      { label: 'Infant or toddler (under 3)', value: 3 },
      { label: 'Pre-school (3–5)', value: 3 },
      { label: 'Primary school (6–11)', value: 4 },
      { label: 'Secondary / teenagers (12–17)', value: 5 },
    ],
  },
  {
    id: 'q17', text: "What is the impact on the partner's career?", category: 'Family & Accompanying', type: 'single',
    conditional: { questionId: 'q15', values: [3, 7, 8] },
    options: [
      { label: 'Partner works remotely — minimal career disruption', value: 2 },
      { label: 'Partner choosing a career break', value: 4 },
      { label: 'Partner giving up career with uncertain prospects in host country', value: 7 },
      { label: 'Partner unable to work (no work permit or limited opportunities)', value: 9 },
    ],
  },
  {
    id: 'q18', text: 'How does the partner feel about the move?', category: 'Family & Accompanying', type: 'single',
    conditional: { questionId: 'q15', values: [3, 7, 8] },
    options: [
      { label: 'Enthusiastic and has some connections in the host country', value: 1 },
      { label: 'Supportive but has no network or connections there', value: 4 },
      { label: 'Reluctant or anxious about the move', value: 7 },
      { label: 'Strongly opposed or has significant concerns', value: 9 },
    ],
  },
  {
    id: 'q19', text: 'Are there elderly or dependent family members being left behind?', category: 'Family & Accompanying', type: 'single',
    options: [
      { label: 'No dependents left behind', value: 0 },
      { label: 'Family nearby who manage independently', value: 2 },
      { label: 'Aging parents or dependents requiring some coordination from afar', value: 5 },
      { label: 'Primary caregiver responsibilities being handed off to others', value: 8 },
    ],
  },

  // ─── Category 6: Geographic Factors (3 questions) ───
  {
    id: 'q20', text: 'What is the time zone difference between home/HQ and host country?', category: 'Geographic Factors', type: 'single',
    options: [
      { label: 'Same or 1–2 hours difference', value: 1 },
      { label: '3–5 hours', value: 4 },
      { label: '6–8 hours', value: 7 },
      { label: '9+ hours', value: 10 },
    ],
  },
  {
    id: 'q21', text: 'How easy is it to travel home?', category: 'Geographic Factors', type: 'single',
    options: [
      { label: 'Under 3 hours (direct flight or train)', value: 1 },
      { label: '3–6 hours direct', value: 3 },
      { label: '6–12 hours or one connection', value: 6 },
      { label: '12+ hours or complex multi-leg journey', value: 9 },
    ],
  },
  {
    id: 'q22', text: 'How different is the climate and physical environment?', category: 'Geographic Factors', type: 'single',
    options: [
      { label: 'Very similar to home', value: 1 },
      { label: 'Moderate adjustment needed', value: 3 },
      { label: 'Significant difference requiring lifestyle changes', value: 6 },
      { label: 'Extreme — requires major adaptation (heat, altitude, humidity, reversed seasons)', value: 8 },
    ],
  },

  // ─── Category 7: Social Readiness (2 questions) ───
  {
    id: 'q23', text: 'Do they have an existing social network in the host country?', category: 'Social Readiness', type: 'single',
    options: [
      { label: 'Strong network — close friends or family there', value: 1 },
      { label: 'Some contacts — colleagues or acquaintances', value: 4 },
      { label: 'Online connections only', value: 6 },
      { label: 'Nobody at all', value: 9 },
    ],
  },
  {
    id: 'q24', text: 'How established is the expat community in the destination?', category: 'Social Readiness', type: 'single',
    options: [
      { label: 'Large, well-organized expat community with social groups and events', value: 1 },
      { label: 'Moderate expat presence, some organized activities', value: 4 },
      { label: 'Small or fragmented expat community', value: 7 },
      { label: 'Very isolated — few expats, limited social infrastructure', value: 9 },
    ],
  },

  // ─── Category 8: Resilience & Adaptability (4 questions) ───
  {
    id: 'q25', text: 'How much prior international relocation experience do they have?', category: 'Resilience & Adaptability', type: 'single',
    options: [
      { label: 'Three or more international relocations', value: 1 },
      { label: 'One or two prior international moves', value: 3 },
      { label: 'Has lived abroad briefly but not a full relocation', value: 5 },
      { label: 'First time living outside their home country', value: 8 },
    ],
  },
  {
    id: 'q26', text: 'How comfortable are they with ambiguity and uncertainty?', category: 'Resilience & Adaptability', type: 'single',
    options: [
      { label: 'Thrives on uncertainty and novel situations', value: 1 },
      { label: 'Adapts reasonably well with some initial discomfort', value: 4 },
      { label: 'Prefers clarity and predictability', value: 7 },
      { label: 'Finds uncertainty very stressful and destabilizing', value: 10 },
    ],
  },
  {
    id: 'q27', text: 'How do they typically respond to major life changes?', category: 'Resilience & Adaptability', type: 'single',
    options: [
      { label: 'Energized — sees change as opportunity', value: 2 },
      { label: 'Adapts after an adjustment period', value: 4 },
      { label: 'Finds change stressful but works through it', value: 6 },
      { label: 'Change is very difficult and disruptive', value: 9 },
    ],
  },
  {
    id: 'q28', text: 'How have they historically experienced homesickness or being away from home?', category: 'Resilience & Adaptability', type: 'single',
    options: [
      { label: 'Rarely experiences it', value: 2 },
      { label: 'Occasional and manageable', value: 4 },
      { label: 'Frequent — takes noticeable effort to manage', value: 7 },
      { label: 'Intense and prolonged — significantly affects wellbeing', value: 9 },
    ],
  },
];

/** Total number of questions (used as divisor: N × 10) */
const TOTAL_QUESTIONS = 28;

/**
 * Compute the score value for a single question answer.
 * Handles multi-select (array) answers with cap logic and ignoreIfAlsoSelected rule.
 */
function questionScore(question: AssessmentQuestion, answer: number | number[]): number {
  if (Array.isArray(answer)) {
    let values = [...answer];
    // Q2 rule: if "location change only" (value matching ignoreIfAlsoSelected) is selected alongside others, ignore it
    if (question.ignoreIfAlsoSelected !== undefined && values.length > 1) {
      values = values.filter(v => v !== question.ignoreIfAlsoSelected);
    }
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.min(sum, question.multiSelectCap ?? 10);
  }
  return answer;
}

export function calculateDifficultyScore(answers: Record<string, number | number[]>): number {
  let sum = 0;
  for (const q of ASSESSMENT_QUESTIONS) {
    const answer = answers[q.id];
    if (answer !== undefined) {
      sum += questionScore(q, answer);
    }
  }
  return Math.round((sum / (TOTAL_QUESTIONS * 10)) * 100);
}

/**
 * Given current answers, return the list of visible questions (applying conditional logic).
 */
export function getVisibleQuestions(answers: Record<string, number | number[]>): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter(q => {
    if (!q.conditional) return true;
    const depAnswer = answers[q.conditional.questionId];
    if (depAnswer === undefined) return false;
    if (Array.isArray(depAnswer)) {
      // For multi-select dependency, check if any selected value matches
      return depAnswer.some(v => q.conditional!.values.includes(v));
    }
    return q.conditional.values.includes(depAnswer);
  });
}

export function getScoreInterpretation(score: number, countryFrom: string, countryTo: string): string {
  if (score <= 25) {
    return `The relocation from ${countryFrom} to ${countryTo} shows low structural complexity with strong personal readiness. A standard relocation package is likely sufficient, with light-touch check-ins to ensure a smooth landing.`;
  }
  if (score <= 45) {
    return `The move from ${countryFrom} to ${countryTo} carries meaningful differences in culture or role, but they're manageable. Targeted coaching on 2–3 key focus areas will make a significant difference in how quickly they settle and perform.`;
  }
  if (score <= 65) {
    return `The relocation from ${countryFrom} to ${countryTo} shows significant complexity across multiple dimensions. A structured Re-Rooted coaching program is recommended to support the transition across professional, cultural, and personal domains.`;
  }
  return `The move from ${countryFrom} to ${countryTo} is one of the most complex relocation profiles — compounding factors across assignment, culture, family, and readiness. A full Re-Rooted program with ongoing support across all pillars is strongly recommended.`;
}

export function getScoreBand(score: number): { label: string; recommendation: string } {
  if (score <= 25) return { label: 'Standard Support', recommendation: 'Standard relocation package likely sufficient. Light-touch check-ins.' };
  if (score <= 45) return { label: 'Enhanced Support', recommendation: 'Targeted coaching on 2–3 key focus areas.' };
  if (score <= 65) return { label: 'Intensive Support', recommendation: 'Structured Re-Rooted coaching program recommended.' };
  return { label: 'High-Touch Program', recommendation: 'Full Re-Rooted program with ongoing support across all pillars.' };
}

export function getPriorityDimensions(score: number, answers: Record<string, number | number[]>): string[] {
  // Always shown
  const base = ['values-harmonization', 'cultural-adaptation', 'emotional-cup'];

  // Leadership in Transition: if Q2 total value ≥ 6
  const q2Answer = answers['q2'];
  if (q2Answer !== undefined) {
    const q2Question = ASSESSMENT_QUESTIONS.find(q => q.id === 'q2')!;
    const q2Score = questionScore(q2Question, q2Answer);
    if (q2Score >= 6) base.push('leadership-transition');
  }

  // Language & Social if score > 45
  if (score > 45) {
    base.push('language-learning', 'social-life');
  }

  // Family Support: if Q15 includes partner or children (values 3, 7, 8, 9)
  const q15Answer = answers['q15'];
  if (typeof q15Answer === 'number' && [3, 7, 8, 9].includes(q15Answer)) {
    base.push('family-support');
  }

  // Third Culture Kids: if Q16 has any selection
  const q16Answer = answers['q16'];
  if (Array.isArray(q16Answer) && q16Answer.length > 0) {
    base.push('third-culture-kids');
  }

  return base;
}
