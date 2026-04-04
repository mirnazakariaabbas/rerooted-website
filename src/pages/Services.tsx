import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, ClipboardList, Sprout, Flag, CheckCircle, Heart, Globe, Languages, Brain, Users, Baby } from "lucide-react";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";

const Section = ({ children, className = "", bg = "#FAF9F6" }: { children: React.ReactNode; className?: string; bg?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      className={`px-6 lg:px-12 ${className}`}
      style={{ backgroundColor: bg }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
};

const services = [
  {
    icon: Phone,
    timing: "Day 0",
    name: "Discovery Call",
    bg: "#FAF9F6",
    content: [
      "HR or employee reaches out. We understand the assignment, the person, the family situation, and the specific integration challenges.",
      "This initial conversation shapes everything that follows. We listen before we recommend, because no two relocations are the same."
    ],
  },
  {
    icon: ClipboardList,
    timing: "Week 1",
    name: "Integration Assessment",
    bg: "#F3F0F7",
    content: [
      "Our Integration Assessment is a scored diagnostic that measures the difficulty of a specific country-to-country move, factoring in cultural distance, language, lifestyle differences, and more.",
      "The assessment covers six dimensions: values harmonization, cultural adaptation, language confidence, emotional wellbeing, social integration, and family support. It identifies gaps, strengths, and priorities.",
      "The result is a difficulty score that shapes the level of coaching support needed. Higher difficulty, more intensive coaching. Lower difficulty, lighter touch. No guesswork.",
      "The assessment is shared with HR and the hiring manager as a baseline."
    ],
  },
  {
    icon: Sprout,
    timing: "Weeks 2–10",
    name: "Active Coaching",
    bg: "#FAF9F6",
    content: [
      "Bi-weekly one-on-one sessions with a matched coach. Practical, action-oriented work on the dimensions that matter most.",
      "Coaching is delivered through a global network of certified coaches, each bringing local knowledge and lived expat experience. Programs are tiered based on the Integration Assessment difficulty score, so the intensity of support matches the complexity of the move."
    ],
  },
  {
    icon: Flag,
    timing: "Week 11–12",
    name: "Final Assessment",
    bg: "#F3F0F7",
    content: [
      "Post-program assessment measuring progress across all six roots. The same diagnostic used at the start is repeated, creating a clear before-and-after picture.",
      "Integration report delivered to HR and hiring manager with outcomes. A clear picture of what worked, what was hard, and what your organization can improve next time, turning every assignment into institutional knowledge."
    ],
  },
  {
    icon: CheckCircle,
    timing: "Post-program",
    name: "Ongoing Support",
    bg: "#FAF9F6",
    content: [
      "Optional follow-up sessions. The employee has tools and habits for continued integration. HR has data for the next assignment.",
      "Re-Rooted® doesn't disappear after the program ends. We remain available for the moments that matter."
    ],
  },
];

const coachingAreas = [
  { icon: Heart, title: "Values Harmonization", desc: "Aligning personal beliefs with the culture of the host country." },
  { icon: Globe, title: "Cultural Adaptation", desc: "Understanding behavior, communication, and trust-building across cultures." },
  { icon: Languages, title: "Language Confidence", desc: "Addressing the emotional blocks that slow language learning." },
  { icon: Brain, title: "Emotional Wellbeing", desc: "Navigating relationships, loneliness, and personal identity during transition." },
  { icon: Users, title: "Social Integration", desc: "Building friendships, activities, and a life outside of work." },
  { icon: Baby, title: "Family Support", desc: "Helping partners and children adapt, with dedicated guidance for third culture kids." },
];

const Services = () => (
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <StickyNav />

    {/* Hero */}
    <section className="pt-32 pb-16 px-6 lg:px-12" style={{ backgroundColor: "#1F299C" }}>
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-white font-black text-4xl md:text-5xl leading-tight" style={{ fontWeight: 900 }}>
          The Re-Rooted® Integration Program
        </h1>
        <p className="mt-4 text-lg text-white/80" style={{ fontWeight: 400 }}>
          Tools to measure. Coaching to support. Data to prove it worked.
        </p>
      </div>
    </section>

    {/* Overview */}
    <Section className="py-20" bg="#FAF9F6">
      <div className="container mx-auto max-w-3xl space-y-5 text-base leading-[1.7]" style={{ color: "#1A1A1A" }}>
        <p>
          Relocation support shouldn't end at logistics. <strong>Re-Rooted®</strong> combines diagnostic tools, personalized coaching, and measurable outcomes to help expatriates integrate, and help organizations see the difference.
        </p>
        <p>
          Every engagement is tailored to the move, the person, and the stage they're in.
        </p>
      </div>
    </Section>

    {/* Service Sections */}
    {services.map((service, i) => {
      const Icon = service.icon;
      return (
        <Section key={i} className="py-16" bg={service.bg}>
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(31,41,156,0.1)" }}>
                <Icon size={22} style={{ color: "#1F299C" }} />
              </div>
              <div>
                <h3 className="font-bold text-xl" style={{ color: "#1A1A1A" }}>{service.name}</h3>
                <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(61,167,118,0.12)", color: "#3DA776" }}>
                  {service.timing}
                </span>
              </div>
            </div>
            <div className="space-y-4 text-base leading-[1.7]" style={{ color: "#1A1A1A" }}>
              {service.content.map((p, j) => <p key={j}>{p}</p>)}
            </div>

            {/* Coaching areas grid for Active Coaching */}
            {i === 2 && (
              <div className="mt-10">
                <p className="font-semibold mb-4" style={{ color: "#1A1A1A" }}>What coaching covers:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coachingAreas.map((area, k) => {
                    const AreaIcon = area.icon;
                    return (
                      <div key={k} className="rounded-xl p-5 border" style={{ backgroundColor: "#F3F0F7", borderColor: "rgba(188,173,212,0.5)" }}>
                        <AreaIcon size={20} style={{ color: "#1F299C" }} className="mb-2" />
                        <p className="font-semibold text-sm mb-1" style={{ color: "#1A1A1A" }}>{area.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>{area.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Section>
      );
    })}

    {/* Summary */}
    <Section className="py-10" bg="#FAF9F6">
      <p className="text-center text-sm font-semibold" style={{ color: "#6B6B6B" }}>
        Total engagement: 90 days · 6–8 coaching sessions · 2 assessments · 1 HR report
      </p>
    </Section>

    {/* Cultural Companion App */}
    <section className="py-20 px-6 lg:px-12" style={{ backgroundColor: "#1F299C" }}>
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-white font-extrabold text-3xl md:text-[36px] leading-tight mb-6">
          Your Cultural Companion, The Re-Rooted® App
        </h2>
        <div className="space-y-4 text-base leading-[1.7] text-white/80">
          <p>
            The <strong className="text-white">Re-Rooted®</strong> Cultural Companion is a digital tool that helps expatriates explore and understand their destination country, side by side with the country they're coming from. Cultural norms, communication styles, daily life, values, cost of living, all compared in a way that's practical and personal.
          </p>
          <p>
            A living reference that helps people prepare before they arrive and make sense of what they experience once they're there.
          </p>
        </div>
        <Link
          to="/app/cultural"
          className="inline-flex items-center mt-8 px-7 py-3.5 text-base font-semibold rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: "#3DA776", color: "#fff" }}
        >
          Explore the app →
        </Link>
      </div>
    </section>

    {/* CTA */}
    <Section className="py-16" bg="#FAF9F6">
      <div className="container mx-auto max-w-3xl text-center">
        <Link
          to="/contact"
          className="inline-flex items-center px-7 py-3.5 text-base font-semibold rounded-lg text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#1F299C" }}
        >
          Start a conversation →
        </Link>
      </div>
    </Section>

    <Footer />
  </motion.main>
);

export default Services;
