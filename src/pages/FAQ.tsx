import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  heading: string;
  items: FaqItem[];
}

const faqData: FaqGroup[] = [
  {
    heading: "About Re-Rooted®",
    items: [
      { q: "What is Re-Rooted®?", a: "Re-Rooted® is an expat mobility coaching company that helps expatriates and their families settle, adapt, and thrive during international relocations. We work with both organizations (HR, Global Mobility teams) and individuals going through a move." },
      { q: "Who founded Re-Rooted®?", a: "Re-Rooted® was founded by Yasser Abbas, an Egyptian expat with 17+ years leading businesses for global multinationals. He has lived in Saudi Arabia, Dubai, and Switzerland, and is an ICF-certified coach (ACC)." },
      { q: "Where is Re-Rooted® based?", a: "We are based in Zug, Switzerland, but we work with organizations and individuals globally through our network of certified coaches." },
    ],
  },
  {
    heading: "For Organizations",
    items: [
      { q: "What is the Re-Rooted® Integration Program?", a: "It's a 90-day coaching program designed to support employees through international relocation. It includes a discovery call, an integration assessment, 6–8 bi-weekly coaching sessions with a matched coach, a final assessment, and a report delivered to HR." },
      { q: "How long does the program last?", a: "The standard program runs for approximately 90 days, from the initial discovery call through the final assessment. Ongoing support is available after the program ends." },
      { q: "How do you match coaches to employees?", a: "We match coaches based on the employee's destination country, language, cultural background, and specific integration challenges. Every coach in our network has lived expat experience and holds relevant coaching certifications." },
      { q: "What languages do your coaches speak?", a: "Our global network includes coaches who speak English, Arabic, French, German, Spanish, Portuguese, and other languages. We match based on the employee's needs and preferences." },
      { q: "Can you support multiple assignees at the same time?", a: "Yes. We can support multiple employees across different countries simultaneously through our global coaching network." },
      { q: "How much does the program cost?", a: "Program pricing depends on the scope of the engagement, the number of assignees, and the complexity of the moves. Contact us for a conversation about your needs and we will provide a tailored proposal." },
      { q: "What does HR receive at the end of the program?", a: "HR receives an integration report based on the final assessment, showing progress across six dimensions, key insights, and recommendations for future assignments." },
      { q: "Do you replace our existing mobility program?", a: "No. We complement your existing mobility program by adding the human side that logistics providers don't cover: cultural adaptation, emotional wellbeing, social integration, and family support." },
    ],
  },
  {
    heading: "For Individuals",
    items: [
      { q: "I'm relocating on my own (not through a company). Can I still work with Re-Rooted®?", a: "Yes. We offer individual coaching and access to the Re-Rooted® Cultural Companion App for expats who are navigating a move independently." },
      { q: "How do coaching sessions work?", a: "Sessions are bi-weekly, one-on-one, conducted virtually or in person. Each session is practical and action-oriented, focused on whatever matters most to you at that stage of your journey, whether that's cultural adaptation, relationships, language confidence, social life, family, or finding your footing." },
      { q: "How do I know which stage of the journey I'm in?", a: "You probably already know. Pre-Rooted is before the move (you're deciding). Rooting-In is the first months (you're adapting). Thrive is when you're settled but want more. Rooting Back is when you're returning home. If you're not sure, reach out and we'll help you figure it out." },
      { q: "What is the Cultural Companion App?", a: "The Re-Rooted® Cultural Companion is a digital tool that helps you explore and understand your destination country side by side with where you're coming from. It compares cultural norms, communication styles, daily life, values, and cost of living." },
    ],
  },
  {
    heading: "About Coaching",
    items: [
      { q: "Is coaching the same as therapy?", a: "No. Coaching is not therapy, counseling, or medical treatment. Coaching is forward-looking and action-oriented. It focuses on helping you navigate a specific transition and build practical strategies for adaptation and growth. If you are experiencing a mental health crisis, we encourage you to seek support from a qualified healthcare professional." },
      { q: "What coaching methodology does Re-Rooted® use?", a: "Our coaching follows the International Coaching Federation (ICF) standards and code of ethics. Yasser holds an ACC (Associate Certified Coach) credential from the ICF. Our approach is grounded in lived experience, cultural intelligence, and evidence-based coaching practices." },
      { q: "What is ICF?", a: "The International Coaching Federation is the world's largest organization for professionally trained coaches. ICF sets the gold standard for coaching ethics, competencies, and credentialing. An ACC (Associate Certified Coach) credential requires a minimum of 60 hours of coach-specific training and 100 hours of coaching experience." },
      { q: "Is everything I share with my coach confidential?", a: "Yes. All coaching conversations are confidential between you and your coach. In organizational engagements, we share integration progress summaries with HR, but never the content of individual coaching sessions, unless you explicitly consent." },
      { q: "Do you collect data about my children?", a: "Only if you choose to include your family in coaching. When you enter your children's names in the Re-Rooted® app to book family coaching sessions, we store that information with your explicit consent. Children never have direct access to the app. You can request deletion of your children's data at any time. See our Privacy Policy for full details." },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <StickyNav />
      <motion.main
        className="mx-auto max-w-[720px] px-6 py-20 md:py-28"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-foreground font-extrabold text-3xl md:text-4xl mb-12">Frequently Asked Questions</h1>

        <div className="space-y-10">
          {faqData.map((group) => (
            <div key={group.heading}>
              <h2 className="text-foreground font-bold text-xl mb-4">{group.heading}</h2>
              <Accordion type="single" collapsible className="w-full">
                {group.items.map((item, i) => (
                  <AccordionItem key={i} value={`${group.heading}-${i}`}>
                    <AccordionTrigger className="text-left text-foreground/90 font-medium">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default FAQ;
