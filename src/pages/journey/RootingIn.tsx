import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";

const Section = ({ children, className = "", bg = "var(--brand-surface)" }: { children: React.ReactNode; className?: string; bg?: string }) => {
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

const dimensions = [
  {
    title: "Values Harmonization",
    content: "You arrive with a set of beliefs shaped by where you grew up. Your new home has its own. The work isn't choosing one over the other, it's finding where they meet. We help expatriates clarify their personal values, understand the value system of their host culture, and bring the two into harmony."
  },
  {
    title: "Cultural Adaptation",
    content: "Why do your colleagues behave that way? Why do you react the way you do? Culture runs deeper than customs, it shapes how people give feedback, build trust, make decisions, and show respect. We help expatriates read their new environment and adapt without losing what makes them who they are."
  },
  {
    title: "Language Learning",
    content: "Learning the local language is one of the most powerful acts of integration, and one of the most resisted. The blocks are rarely intellectual. They're emotional. Fear of sounding foolish. Frustration with slow progress. We help expatriates set out on the language journey by addressing what's really in the way."
  },
  {
    title: "Filling the Emotional Cup",
    content: "Relocation doesn't pause your personal life, it pressures it. Whether you're single and searching for connection, managing a long-distance relationship, or supporting a partner through their own transition, your emotional world needs attention. We help expatriates navigate love, loneliness, and partnership in a new context."
  },
  {
    title: "Building an Enriching Social Life",
    content: "Making friends as an adult is hard. Making friends as an adult in a foreign country is harder. We help expatriates find their people, build friendships, discover activities, and create a social life that actually fills them up rather than just fills the calendar."
  },
  {
    title: "Third Culture Kids",
    content: "Raising children between cultures is one of the most complex and rewarding parts of expat life. Your kids are growing up in a world that's different from the one you knew, and that's not a problem to solve, it's a reality to navigate well. We help families approach this with intention and confidence."
  },
];

const ExpandableCard = ({ dim }: { dim: typeof dimensions[0] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(188,173,212,0.5)", backgroundColor: "#fff" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <p className="font-bold text-base" style={{ color: "var(--brand-ink)" }}>{dim.title}</p>
        <ChevronDown
          size={20}
          className="shrink-0 transition-transform duration-200"
          style={{ color: "var(--brand-deep)", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-[1.8]" style={{ color: "var(--brand-ink)" }}>
              {dim.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RootingIn = () => (
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <StickyNav />

    {/* Hero */}
    <section className="pt-32 pb-16 px-6 lg:px-12" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="container mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--brand-accent)" }}>Stage 2 of 4</p>
        <h1 className="font-black text-4xl md:text-5xl leading-tight" style={{ color: "var(--brand-ink)", fontWeight: 900 }}>
          I made the move. How do I make this home?
        </h1>
      </div>
    </section>

    {/* Intro */}
    <Section className="py-20" bg="var(--brand-surface)">
      <div className="container mx-auto max-w-3xl space-y-5 text-base leading-[1.7]" style={{ color: "var(--brand-ink)" }}>
        <p>
          The bags are unpacked. The paperwork is done. And now comes the part no relocation package prepared you for, actually living here.
        </p>
        <p>
          Rooting In is the most vulnerable stage of the expat journey. Everything is unfamiliar. The way people communicate, the things they value, the rhythms of daily life. You're not just learning a new city, you're rebuilding your sense of self in foreign soil.
        </p>
        <p>
          This is where most expats either adapt or retreat. <strong>Re-Rooted®</strong> makes sure it's the former.
        </p>
      </div>
    </Section>

    {/* Dimensions */}
    <Section className="py-20" bg="var(--brand-surface)">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-extrabold text-3xl md:text-[36px] leading-tight mb-2" style={{ color: "var(--brand-ink)", fontWeight: 800 }}>
          What Rooting In Looks Like
        </h2>
        <p className="text-base mb-8" style={{ color: "var(--brand-mute)" }}>
          Six dimensions of settling into a new life, and the coaching that supports each one.
        </p>
        <div className="space-y-4">
          {dimensions.map((dim, i) => (
            <ExpandableCard key={i} dim={dim} />
          ))}
        </div>
      </div>
    </Section>

    {/* Corporate Close */}
    <Section className="py-20" bg="var(--brand-surface)">
      <div className="container mx-auto max-w-3xl space-y-5 text-base leading-[1.7]" style={{ color: "var(--brand-ink)" }}>
        <p>
          The Rooting In phase is where most assignment failures begin, not because the employee can't do the job, but because they can't settle into the life around it.
        </p>
        <p>
          When someone is struggling with cultural disorientation, relationship strain, or social isolation, it shows up in their work. Slower ramp-up. Lower engagement. Early departure.
        </p>
        <p>
          <strong>Re-Rooted®</strong> coaching during this phase helps your people move through adaptation faster, with more confidence and less silent struggle. The result is an employee who's not just present, but grounded.
        </p>
        <div className="pt-4">
          <Link
            to="/contact"
            className="inline-flex items-center px-7 py-3.5 text-base font-semibold rounded-lg text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--brand-deep)" }}
          >
            Talk to us about supporting your people through Rooting In →
          </Link>
        </div>
      </div>
    </Section>

    {/* Journey Nav */}
    <section className="py-10 px-6 lg:px-12" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="container mx-auto max-w-3xl flex justify-between">
        <Link to="/journey/pre-rooted" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4" style={{ color: "var(--brand-deep)" }}>
          <ArrowLeft size={16} /> Pre-Rooted
        </Link>
        <Link to="/journey/thrive" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4" style={{ color: "var(--brand-deep)" }}>
          Thrive <ArrowRight size={16} />
        </Link>
      </div>
    </section>

    <Footer />
  </motion.main>
);

export default RootingIn;
