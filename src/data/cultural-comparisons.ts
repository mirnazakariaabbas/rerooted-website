export interface CulturalDimension {
  name: string;
  homeDescription: string;
  hostDescription: string;
  homeScore: number;
  hostScore: number;
  explanation: string;
  practicalTip: string;
}

export interface CountryPairComparison {
  homeCountry: string;
  hostCountry: string;
  overview: string;
  dimensions: CulturalDimension[];
}

export const CULTURAL_COMPARISONS: CountryPairComparison[] = [
  {
    homeCountry: 'Egypt',
    hostCountry: 'Switzerland',
    overview: "Moving from Egypt to Switzerland means navigating one of the widest cultural gaps in professional relocation. Egypt's warmth, spontaneity, and relationship-first culture meets Switzerland's precision, structure, and privacy.",
    dimensions: [
      { name: 'Communication Style', homeDescription: 'High-context, indirect', hostDescription: 'Low-context, direct', homeScore: 8, hostScore: 3, explanation: 'In Egypt, much is communicated through context and relationship. In Switzerland, people say exactly what they mean.', practicalTip: 'Silence in a meeting often means people are thinking, not disagreeing. Give it space.' },
      { name: 'Relationship to Authority', homeDescription: 'Hierarchical', hostDescription: 'Flat, consensus-driven', homeScore: 8, hostScore: 3, explanation: 'Egyptian workplaces have clear hierarchies. Swiss organizations tend toward flat structures.', practicalTip: 'Don\'t wait for your manager to tell you what to do. Initiative is valued.' },
      { name: 'Time & Punctuality', homeDescription: 'Flexible', hostDescription: 'Strict', homeScore: 3, hostScore: 10, explanation: 'Time in Egypt is fluid. In Switzerland, being late by 2 minutes is noticed.', practicalTip: 'Set your watch 5 minutes ahead. Arriving on time means you\'re comfortable.' },
      { name: 'Work-Life Balance', homeDescription: 'Long hours, social overlap', hostDescription: 'Protected personal time', homeScore: 4, hostScore: 8, explanation: 'In Egypt, work and social life blend. In Switzerland, evenings are private.', practicalTip: 'Respect the 6 PM boundary. Don\'t send work emails on Sunday.' },
      { name: 'Social Norms', homeDescription: 'Warm, physical', hostDescription: 'Reserved, private', homeScore: 9, hostScore: 3, explanation: 'Egyptians greet with warmth and hospitality. Swiss greetings are polite but reserved.', practicalTip: 'Wait for locals to initiate physical greetings.' },
      { name: 'Emotional Expression', homeDescription: 'Expressive, passionate', hostDescription: 'Restrained, measured', homeScore: 9, hostScore: 3, explanation: 'Egyptians express emotions openly. Swiss culture values restraint professionally.', practicalTip: 'Channel passion into clear arguments. Energy is welcome; volatility is not.' },
      { name: 'Trust Building', homeDescription: 'Personal connection', hostDescription: 'Reliability and track record', homeScore: 9, hostScore: 3, explanation: 'In Egypt, trust is built over meals. In Switzerland, through consistent delivery.', practicalTip: 'Swiss friendships take years, but once formed, they\'re deep and lasting.' },
    ],
  },
  {
    homeCountry: 'India',
    hostCountry: 'United Kingdom',
    overview: "India to the UK is one of the most traveled migration paths, yet the cultural adjustment is deeper than shared colonial history suggests.",
    dimensions: [
      { name: 'Communication Style', homeDescription: 'Context-rich', hostDescription: 'Understated, indirect', homeScore: 7, hostScore: 4, explanation: '"Quite good" might mean "not good enough" in British English.', practicalTip: 'Learn British understatement. "Interesting idea" often means "I disagree."' },
      { name: 'Time & Punctuality', homeDescription: 'Flexible', hostDescription: 'Punctual', homeScore: 4, hostScore: 8, explanation: 'In the UK, being on time is a basic expectation.', practicalTip: 'If running late, text ahead, it\'s considered polite.' },
      { name: 'Social Norms', homeDescription: 'Warm, hospitable', hostDescription: 'Polite, reserved', homeScore: 8, hostScore: 4, explanation: 'Indian hospitality is legendary. British norms center on politeness and the sacred queue.', practicalTip: 'Never skip a queue. It\'s the one social sin the British won\'t forgive.' },
      { name: 'Emotional Expression', homeDescription: 'Open, demonstrative', hostDescription: 'Reserved, stiff upper lip', homeScore: 8, hostScore: 3, explanation: 'Indians express emotions freely. The British default to restraint.', practicalTip: 'Enthusiasm is welcome; emotional intensity less so.' },
      { name: 'Trust Building', homeDescription: 'Personal bonds', hostDescription: 'Competence and reliability', homeScore: 8, hostScore: 4, explanation: 'In India, trust is personal. In the UK, it\'s built through doing what you say.', practicalTip: 'Follow through on every commitment. Reliability is the British love language.' },
    ],
  },
  {
    homeCountry: 'United States',
    hostCountry: 'Japan',
    overview: "America and Japan sit at opposite ends of nearly every cultural spectrum. This move will reshape how you think about communication, relationships, and silence.",
    dimensions: [
      { name: 'Communication Style', homeDescription: 'Direct, explicit', hostDescription: 'Indirect, contextual', homeScore: 2, hostScore: 9, explanation: 'Japanese communication relies on reading the air (kuuki wo yomu).', practicalTip: 'Learn to read silence. What\'s unsaid is often more important.' },
      { name: 'Relationship to Authority', homeDescription: 'Informal', hostDescription: 'Deeply hierarchical', homeScore: 3, hostScore: 9, explanation: 'Japanese organizations have strict seniority systems.', practicalTip: 'Use last names and proper honorifics until invited otherwise.' },
      { name: 'Time & Punctuality', homeDescription: 'Punctual', hostDescription: 'Extremely punctual', homeScore: 7, hostScore: 10, explanation: 'Being even slightly late is a sign of disrespect.', practicalTip: 'Aim to arrive 5 minutes early. In Japan, on time is late.' },
      { name: 'Values & Worldview', homeDescription: 'Individual achievement', hostDescription: 'Group harmony (wa)', homeScore: 2, hostScore: 9, explanation: 'America celebrates the individual. Japan prioritizes group harmony.', practicalTip: 'Frame achievements as team contributions.' },
      { name: 'Emotional Expression', homeDescription: 'Open, expressive', hostDescription: 'Restrained, controlled', homeScore: 8, hostScore: 2, explanation: 'Emotional restraint in Japan is a form of respect.', practicalTip: 'Develop your poker face for professional settings.' },
    ],
  },
  {
    homeCountry: 'Brazil',
    hostCountry: 'Germany',
    overview: "Brazil to Germany is a move from warmth and spontaneity to structure and directness. The cultural adjustment affects everything from how you greet people to how you plan your weekend.",
    dimensions: [
      { name: 'Communication Style', homeDescription: 'Warm, expressive', hostDescription: 'Direct, efficient', homeScore: 8, hostScore: 2, explanation: 'German directness can feel blunt. Brazilian warmth can feel unfocused.', practicalTip: 'In Germany, get to the point quickly. Small talk comes after business.' },
      { name: 'Time & Punctuality', homeDescription: 'Flexible', hostDescription: 'Very strict', homeScore: 3, hostScore: 9, explanation: 'Germans are famously punctual. Being late is unprofessional.', practicalTip: 'Arrive 5 minutes early. Always.' },
      { name: 'Social Norms', homeDescription: 'Physical, open', hostDescription: 'Reserved, formal', homeScore: 9, hostScore: 3, explanation: 'Brazilians are physically affectionate. Germans maintain more personal space.', practicalTip: 'Handshakes are the default. Hugs come much later in friendships.' },
      { name: 'Emotional Expression', homeDescription: 'Very expressive', hostDescription: 'Measured, controlled', homeScore: 9, hostScore: 3, explanation: 'Brazilian expressiveness is endearing at home but can overwhelm Germans.', practicalTip: 'Tone down the volume. Germans respond to calm, reasoned arguments.' },
      { name: 'Trust Building', homeDescription: 'Through warmth', hostDescription: 'Through reliability', homeScore: 8, hostScore: 3, explanation: 'In Brazil, trust is built through personal connection. In Germany, through punctuality and follow-through.', practicalTip: 'Do what you say. Germans remember every commitment.' },
    ],
  },
];
