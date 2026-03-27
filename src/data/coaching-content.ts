export interface CoachingDimension {
  id: string;
  name: string;
  shortDescription: string;
  icon: string;
  fullContent: string;
  reflectionPrompts: string[];
  practicalTips: string[];
  requiresChildren?: boolean;
}

export const ROOTING_IN_DIMENSIONS: CoachingDimension[] = [
  {
    id: 'values-harmonization',
    name: 'Values Harmonization',
    shortDescription: 'Aligning your core values with a new cultural context',
    icon: '🌿',
    fullContent: `When you move to a new country, you bring your values with you — but they don't always translate directly. What felt like common sense at home may be misunderstood here. What you considered polite might be seen as distant, or what you thought was honest might feel blunt.\n\nValues harmonization isn't about abandoning who you are. It's about understanding the invisible operating system of your new culture and finding a way to honor both worlds. This is one of the deepest, most personal parts of relocation — and one of the least discussed.`,
    reflectionPrompts: [
      'What value do you hold most deeply that feels challenged in your new environment?',
      'Have you noticed a moment where your instinct clashed with the local norm? What happened?',
      'What is one value from your host culture that you genuinely admire?',
    ],
    practicalTips: [
      'Observe before judging. Spend 2 weeks noticing cultural behaviors without labeling them as right or wrong.',
      'Find a cultural interpreter — someone from the host culture you trust enough to ask honest questions.',
      'Write down your top 5 personal values. Revisit them in 3 months and see which have shifted.',
    ],
  },
  {
    id: 'cultural-adaptation',
    name: 'Cultural Adaptation',
    shortDescription: 'Navigating daily life in an unfamiliar cultural landscape',
    icon: '🌍',
    fullContent: `Cultural adaptation is the daily work of learning to read a room you've never been in before. It's the small things — how people greet each other, when they eat, what silence means in a conversation, whether you should bring a gift when invited to dinner.\n\nIt's exhausting at first because your brain is processing thousands of micro-decisions that used to be automatic. But over time, the unfamiliar becomes familiar. The goal isn't to become someone else — it's to become fluent enough to be yourself in a new setting.`,
    reflectionPrompts: [
      'What daily routine has changed the most since your move?',
      'What cultural norm still catches you off guard?',
      'When did you first feel like you "got it" — even briefly?',
    ],
    practicalTips: [
      'Shop where locals shop. The supermarket teaches you more about a culture than any guidebook.',
      'Learn the unwritten rules of queuing, tipping, and greeting. They matter more than you think.',
      'Accept that fatigue is part of the process. Cultural adaptation is cognitive work.',
    ],
  },
  {
    id: 'language-learning',
    name: 'Language Learning',
    shortDescription: 'Building connection through the local language',
    icon: '💬',
    fullContent: `Language is more than vocabulary and grammar — it's the key to belonging. Even basic phrases signal respect, effort, and openness. You don't need to be fluent to be welcomed, but you do need to try.\n\nThe hardest part isn't the learning itself — it's the vulnerability. Speaking a language badly makes you feel small, especially if you're accomplished in your native tongue. But that vulnerability is also what builds the deepest connections.`,
    reflectionPrompts: [
      'How does it feel to not fully understand conversations around you?',
      'What word or phrase in the local language do you use most often?',
      'Has language ever made you feel excluded? What happened?',
    ],
    practicalTips: [
      'Learn 5 phrases that make people smile: please, thank you, excuse me, good morning, and "I\'m still learning."',
      'Listen to local radio or podcasts, even if you understand little. Your ear will adapt.',
      'Don\'t wait until you\'re "good enough" to speak. Start now, badly. It\'s the only way.',
    ],
  },
  {
    id: 'emotional-cup',
    name: 'Filling the Emotional Cup',
    shortDescription: 'Protecting and restoring your emotional energy',
    icon: '☕',
    fullContent: `Relocation drains your emotional cup faster than you expect. You're saying goodbye to the familiar, navigating uncertainty, and performing at work — all while processing the emotional weight of starting over.\n\nFilling your emotional cup means deliberately doing things that restore you. Not productive things. Not networking. Things that make you feel like yourself — a walk in nature, cooking a meal from home, calling someone who knows the real you.`,
    reflectionPrompts: [
      'When did you last feel truly rested — not just physically, but emotionally?',
      'What activity from home made you feel most like yourself?',
      'Who in your life right now fills your cup?',
    ],
    practicalTips: [
      'Schedule one non-negotiable restorative activity per week. Protect it.',
      'Create a comfort ritual — a morning coffee, a weekly call home, a familiar recipe.',
      'It\'s okay to grieve what you left behind. Loss and excitement can coexist.',
    ],
  },
  {
    id: 'social-life',
    name: 'Building a Social Life',
    shortDescription: 'Creating meaningful connections in a new place',
    icon: '🤝',
    fullContent: `Making friends as an adult is hard. Making friends as an adult in a foreign country is harder. The social structures that used to support you — school friends, neighbors, colleagues you've known for years — don't exist here yet.\n\nBuilding a social life abroad requires intention. You have to say yes to things that feel awkward. You have to show up consistently. And you have to accept that depth takes time — you can't fast-track trust.`,
    reflectionPrompts: [
      'Who is the first person you\'d call here in an emergency?',
      'What social setting makes you most comfortable? Most uncomfortable?',
      'Have you found someone who feels like a potential real friend?',
    ],
    practicalTips: [
      'Join one recurring group activity — a class, a club, a volunteer group. Repetition builds bonds.',
      'Invite someone for coffee before you feel ready. The awkwardness fades.',
      'Mix your social circle: expats understand your experience, locals teach you theirs.',
    ],
  },
  {
    id: 'third-culture-kids',
    name: 'Third Culture Kids',
    shortDescription: 'Supporting your children through the transition',
    icon: '🌱',
    requiresChildren: true,
    fullContent: `Your children are building their identity across cultures in a way you never did at their age. They're not fully "from" your home country, and they're not fully "of" your host country. They're something new — and that can be both a gift and a challenge.\n\nThird culture kids often develop remarkable adaptability, empathy, and worldview. But they can also struggle with belonging, identity, and the grief of repeated goodbyes. Your job isn't to fix it — it's to hold space for all of it.`,
    reflectionPrompts: [
      'How is your child expressing their feelings about the move?',
      'What parts of your home culture do you want your children to carry with them?',
      'Have they found a friend or teacher who makes them feel safe?',
    ],
    practicalTips: [
      'Maintain home-culture rituals: food, holidays, bedtime stories in your language.',
      'Let them feel sad about what they left. Don\'t rush them into "isn\'t this exciting?"',
      'Connect with other expat families. Kids bond quickly when they share the experience.',
    ],
  },
];

export const STAGE_DESCRIPTIONS: Record<string, string> = {
  'pre-rooted': "You're standing at the edge of something big. The decision has been made — or maybe it's still forming — but either way, the future is shifting. This stage is about preparation, anticipation, and the bittersweet process of beginning to let go. Not just logistically, but emotionally. You're not just packing boxes. You're starting to say goodbye.",
  'rooting-in': "The bags are unpacked. The paperwork is done. And now comes the part no relocation package prepared you for — actually living here. Everything is unfamiliar. The way people communicate, the things they value, the rhythms of daily life. You're not just learning a new city. You're rebuilding your sense of self in foreign soil.",
  'thrive': "You've found your footing. The panic has faded, the routines have formed, and you're starting to feel like this place might actually be yours. Now the question shifts from survival to growth — how do you contribute? How do you deepen? How do you make this chapter meaningful, not just manageable?",
  'rooting-back': "Going home isn't going back. The person returning is different from the one who left. Reverse culture shock is real, disorienting, and rarely talked about. You've changed, but home hasn't — or maybe it has, and that's even harder. This stage is about re-entry, re-integration, and rediscovering where you belong.",
};

export const WEEKLY_PROMPTS = [
  "What's one thing about your new home that surprised you this week?",
  "Describe a moment this week where you felt like you belonged.",
  "What do you miss most right now? Let yourself feel it.",
  "What's one small thing that went right this week?",
  "Who made you feel welcome recently? What did they do?",
  "What local habit have you started adopting — even unconsciously?",
  "If you could tell your pre-move self one thing, what would it be?",
  "What's one boundary you need to set to protect your energy?",
];
