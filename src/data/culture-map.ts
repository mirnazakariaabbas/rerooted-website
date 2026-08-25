// Fixed, framework-level content for the Cultural Companion.
// This is the "standard read" that never changes between country pairs.
// The country-specific analysis comes from the `cultural-comparison` edge function.

export interface CultureMapIntroSection {
  heading: string;
  body: string[];
}

export const CULTURE_MAP_INTRO: CultureMapIntroSection[] = [
  {
    heading: 'Why culture feels invisible until you move',
    body: [
      'Culture is the set of shared, mostly unspoken assumptions a group uses to make sense of behaviour. It tells people what counts as polite, what counts as competent, and what counts as honest. Because everyone around you shares the same assumptions at home, you rarely notice they exist.',
      'When you relocate, those assumptions stop matching your surroundings. The same email that read as efficient at home now reads as blunt. The same silence that meant agreement now means doubt. Nothing about you changed, only the interpretation frame around you did.',
      'Most relocation difficulty is not a language problem or a skills problem. It is a decoding problem. Once you can name what is different, the friction becomes something you can work with instead of something you take personally.',
    ],
  },
  {
    heading: 'What the Culture Map is',
    body: [
      'The Culture Map is a framework that draws on the work of researchers such as Erin Meyer and Geert Hofstede, who spent decades comparing how national cultures handle work and relationships. It maps national work cultures across eight behavioural scales, from how people communicate to how they handle deadlines. Each scale is a spectrum, not a category.',
      'The insight that makes it useful is relative positioning. There is no correct place on a scale. What matters is the distance between where you sit and where the people around you sit. A Dutch manager is direct compared with a Japanese colleague and reserved compared with an Israeli one.',
      'We add two further scales, emotional expression and work-life integration, because expats consistently report those as the areas where daily life, not just work, feels different.',
    ],
  },
  {
    heading: 'How to use this tool',
    body: [
      'Read your overview first for the big picture of your move. Then work through the scales one at a time. Each scale opens with a fixed explanation of what it measures and why it matters, followed by the specific gap between your two countries and a realistic conversation showing how the same moment plays out in each place.',
      'Treat every score as a tendency, not a rule. Individuals vary enormously inside any culture, and your own workplace may sit far from its national average. The value is in knowing which direction to adjust, and by roughly how much.',
    ],
  },
];

export interface DimensionPrimer {
  id: string;
  name: string;
  lowLabel: string;
  highLabel: string;
  whatItMeasures: string;
  lowMeans: string;
  highMeans: string;
  whyItMatters: string;
}

export const DIMENSION_PRIMERS: DimensionPrimer[] = [
  {
    id: 'communicating',
    name: 'Communicating',
    lowLabel: 'Low context',
    highLabel: 'High context',
    whatItMeasures: 'How much meaning is carried by the words themselves versus by the surrounding context, relationship and shared history.',
    lowMeans: 'In low-context cultures, good communication is precise, simple and explicit. Messages are said and written plainly, repetition is welcome, and if something was not stated, it was not communicated. Clarity is a form of respect.',
    highMeans: 'In high-context cultures, good communication is layered and nuanced. Much is implied rather than stated, and listeners are expected to read between the lines, pick up tone, and understand what the silence means. Spelling everything out can feel condescending.',
    whyItMatters: 'This is the scale that produces the most misunderstandings, because both sides believe they were perfectly clear. Low-context speakers hear vagueness, high-context speakers hear bluntness, and neither realises the other was following a different rulebook.',
  },
  {
    id: 'evaluating',
    name: 'Evaluating',
    lowLabel: 'Direct negative feedback',
    highLabel: 'Indirect negative feedback',
    whatItMeasures: 'How openly criticism is delivered, and how much it is softened, wrapped or delegated to context.',
    lowMeans: 'Direct cultures give criticism frankly and sometimes in front of the group. Upgraders such as "absolutely" or "totally wrong" are used. Directness is read as honesty and as taking the other person seriously.',
    highMeans: 'Indirect cultures deliver criticism softly, in private, and often surrounded by praise. Downgraders such as "a little", "maybe", "slightly" appear constantly. Protecting the relationship and the person\'s standing matters as much as the message.',
    whyItMatters: 'Getting this wrong damages trust fastest. Direct feedback in an indirect culture can end a working relationship, while indirect feedback in a direct culture is often missed entirely, so the problem is never fixed and the person is judged unresponsive.',
  },
  {
    id: 'persuading',
    name: 'Persuading',
    lowLabel: 'Principles first',
    highLabel: 'Applications first',
    whatItMeasures: 'Whether people are convinced by reasoning from theory down to the case, or by concrete examples and results that build up to a conclusion.',
    lowMeans: 'Principles-first audiences want the underlying reasoning, method and framework before the recommendation. Jumping straight to the conclusion feels superficial and unearned.',
    highMeans: 'Applications-first audiences want the recommendation, the practical steps and the evidence that it works. Long theoretical build-ups feel like a waste of everyone\'s time.',
    whyItMatters: 'This decides whether your proposal lands. The same slide deck that reads as rigorous in one country reads as unfocused in another, and the content was never the issue.',
  },
  {
    id: 'leading',
    name: 'Leading',
    lowLabel: 'Egalitarian',
    highLabel: 'Hierarchical',
    whatItMeasures: 'The ideal distance between a boss and a subordinate, and how visible status is in everyday interaction.',
    lowMeans: 'Egalitarian cultures minimise hierarchy. Bosses are facilitators among equals, first names are normal, and skipping a level to reach the right person is acceptable and even efficient.',
    highMeans: 'Hierarchical cultures treat the boss as a clear leader whose position is respected in language, seating, speaking order and communication routes. Going around your manager is a serious breach.',
    whyItMatters: 'It determines who you may email, who speaks first in a meeting, and whether initiative reads as ownership or as overstepping. Many expats are labelled arrogant or passive purely because of this gap.',
  },
  {
    id: 'deciding',
    name: 'Deciding',
    lowLabel: 'Consensual',
    highLabel: 'Top-down',
    whatItMeasures: 'Whether decisions are made by group agreement or by an individual, and how firm a decision is once taken.',
    lowMeans: 'Consensual cultures invest heavily up front. Everyone is consulted, the process is slow, and once the decision is made it is treated as final and implementation is fast.',
    highMeans: 'Top-down cultures let the responsible individual decide quickly. Decisions can be revisited as new information arrives, so an early decision is a working position rather than a commitment.',
    whyItMatters: 'The mismatch shows up as frustration about speed. One side thinks nothing is ever decided, the other thinks decisions keep getting reopened, and both are simply applying the norm they grew up with.',
  },
  {
    id: 'trusting',
    name: 'Trusting',
    lowLabel: 'Task based',
    highLabel: 'Relationship based',
    whatItMeasures: 'Whether professional trust is built by reliable delivery or by personal connection.',
    lowMeans: 'Task-based cultures build trust through competence and consistency. You did what you promised, so you are trustworthy. Business and personal life stay largely separate.',
    highMeans: 'Relationship-based cultures build trust through shared time, meals, personal knowledge and mutual obligation. People do business with people they know as human beings, and the relationship outlives any single project.',
    whyItMatters: 'This shapes how long it takes to be effective and how you build a social life. In relationship-based cultures the dinner is the work, and in task-based cultures it is optional and no substitute for delivery.',
  },
  {
    id: 'disagreeing',
    name: 'Disagreeing',
    lowLabel: 'Confrontational',
    highLabel: 'Avoids confrontation',
    whatItMeasures: 'Whether open disagreement is seen as a healthy contribution or as a threat to group harmony.',
    lowMeans: 'Confrontational cultures separate the idea from the person. Arguing hard in a meeting is a sign of engagement and respect, and the same people go for a drink afterwards.',
    highMeans: 'Confrontation-avoidant cultures see open disagreement as damaging to the group and to the other person\'s standing. Objections travel privately, before or after the meeting, or through carefully coded language.',
    whyItMatters: 'It changes where real decisions happen. If you only participate in the formal meeting in a confrontation-avoidant culture, you will consistently discover that the conversation that mattered already took place.',
  },
  {
    id: 'scheduling',
    name: 'Scheduling',
    lowLabel: 'Linear time',
    highLabel: 'Flexible time',
    whatItMeasures: 'How people organise time: as a sequence of fixed slots, or as a fluid set of parallel possibilities.',
    lowMeans: 'Linear-time cultures do one thing at a time, in order, on schedule. Punctuality is a moral quality and interruptions are rude. The agenda is a commitment.',
    highMeans: 'Flexible-time cultures handle several things at once and adapt as circumstances change. Interruptions are normal and the plan bends to reality and to the people in front of you.',
    whyItMatters: 'This is the most visible daily difference and the one that generates fastest judgment. Two minutes late is invisible in one place and a character flaw in another.',
  },
  {
    id: 'emotional_expression',
    name: 'Emotional expression',
    lowLabel: 'Reserved',
    highLabel: 'Expressive',
    whatItMeasures: 'How much emotion is shown in voice, face, gesture and physical contact in ordinary professional and social settings.',
    lowMeans: 'Reserved cultures keep emotion contained in public. Composure signals reliability and maturity, and strong displays can be read as instability or as pressure on the listener.',
    highMeans: 'Expressive cultures show warmth, enthusiasm and frustration openly. Emotion signals sincerity and involvement, and a flat delivery can be read as disinterest or coldness.',
    whyItMatters: 'It affects how you are perceived before anyone evaluates your work. The same energy that makes you charismatic at home can make you seem unpredictable abroad, or the reverse.',
  },
  {
    id: 'work_life',
    name: 'Work-life integration',
    lowLabel: 'Strictly separated',
    highLabel: 'Fully blended',
    whatItMeasures: 'How far professional life extends into evenings, weekends and personal identity.',
    lowMeans: 'Separated cultures protect private time firmly. Contacting a colleague outside hours needs a real reason, colleagues are not automatically friends, and leaving on time is normal, not a lack of commitment.',
    highMeans: 'Blended cultures let work and personal life overlap. Colleagues become your social circle, messages arrive in the evening, and availability is part of being a good teammate.',
    whyItMatters: 'For expats this is often the loneliness scale. In separated cultures, the colleagues you see every day will not fill your social calendar, so friendship has to be built deliberately elsewhere.',
  },
];

export const PRIMER_BY_ID: Record<string, DimensionPrimer> = Object.fromEntries(
  DIMENSION_PRIMERS.map(p => [p.id, p])
);
