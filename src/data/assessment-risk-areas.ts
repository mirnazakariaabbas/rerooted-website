/**
 * Employer-facing risk copy for the Relocation Risk Assessment output.
 *
 * The member coaching content in `coaching-content.ts` is written to the
 * relocating employee. This map is the same set of dimensions expressed for
 * the company running the assessment: what the business risk is, the early
 * signal a manager would notice, and what to put in place.
 */
export interface RiskArea {
  id: string;
  title: string;
  risk: string;
  watchFor: string;
  action: string;
  icon: string;
}

export const ASSESSMENT_RISK_AREAS: Record<string, RiskArea> = {
  'values-harmonization': {
    id: 'values-harmonization',
    title: 'Values and Working Norms',
    icon: '🌿',
    risk: 'What counts as direct, respectful or professional differs between the two countries, so intent is misread on both sides during the first months.',
    watchFor: 'The employee is described as blunt, evasive or hard to read by local colleagues, or reports that local peers are.',
    action: 'Brief the receiving team on the employee\'s home working norms and give the employee a named cultural sounding board in the local business.',
  },
  'cultural-adaptation': {
    id: 'cultural-adaptation',
    title: 'Cultural Adaptation',
    icon: '🌍',
    risk: 'Daily life friction outside work consumes energy that would otherwise go into ramp-up, extending time to full productivity.',
    watchFor: 'Slower than expected delivery in the first 90 days without any capability concern, and low engagement outside working hours.',
    action: 'Fund practical settling support (housing, admin, banking, schooling) and set an explicit ramp-up curve rather than day-one full performance expectations.',
  },
  'language-learning': {
    id: 'language-learning',
    title: 'Language Capability',
    icon: '💬',
    risk: 'Limited local language reduces informal information flow, weakens stakeholder relationships and can isolate the employee from decisions made outside formal meetings.',
    watchFor: 'The employee is present in meetings but absent from the corridor conversations where decisions actually form.',
    action: 'Budget structured language training from month one and confirm which meetings and documents will be run in a shared working language.',
  },
  'emotional-cup': {
    id: 'emotional-cup',
    title: 'Wellbeing and Sustained Capacity',
    icon: '☕',
    risk: 'Relocation strain is the most common driver of early assignment failure and unplanned return, usually surfacing between months three and nine.',
    watchFor: 'Withdrawal, uncharacteristic irritability, rising sickness absence, or a sudden drop in discretionary effort.',
    action: 'Schedule check-ins at 30, 90 and 180 days with someone outside the reporting line, and make confidential coaching or EAP access explicit.',
  },
  'leadership-transition': {
    id: 'leadership-transition',
    title: 'Leadership Transition',
    icon: '🧭',
    risk: 'The employee is changing scope and country at the same time, so leadership missteps land in an unfamiliar cultural context and are harder to recover from.',
    watchFor: 'Early friction with the inherited team, decisions escalated upward, or key local team members starting to disengage.',
    action: 'Pair the move with transition coaching and a stakeholder map, and agree a 100-day plan with the receiving business before arrival.',
  },
  'social-life': {
    id: 'social-life',
    title: 'Social Integration',
    icon: '🤝',
    risk: 'Without a network outside work, retention depends entirely on the role going well. If the role wobbles, there is nothing holding the employee in country.',
    watchFor: 'Frequent trips home, no local ties after six months, and questions about the exit or repatriation terms.',
    action: 'Connect the employee to internal networks and local communities early, and support partner or family integration alongside the employee.',
  },
  'family-support': {
    id: 'family-support',
    title: 'Family and Partner Impact',
    icon: '👨‍👩‍👧',
    risk: 'Accompanying family dissatisfaction, especially partner career disruption, is a leading cause of early return regardless of how well the role is going.',
    watchFor: 'Partner unable to work or find purpose locally, family remaining in the home country longer than planned, or repeated schedule changes to travel home.',
    action: 'Include partner career support, spousal work permit advice and family integration in the package, and check in with the family, not only the employee.',
  },
  'third-culture-kids': {
    id: 'third-culture-kids',
    title: 'Children and Schooling',
    icon: '🎒',
    risk: 'Schooling placement, language of instruction and children settling are common triggers for renegotiating or ending an assignment mid-term.',
    watchFor: 'Unresolved school places near the start date, children in a language of instruction they cannot yet follow, or requests to change location.',
    action: 'Confirm school placement and cost coverage before the start date and allow flexibility in the first term for family transition.',
  },
};
