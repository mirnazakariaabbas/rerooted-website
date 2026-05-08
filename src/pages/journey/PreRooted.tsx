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

const compassPoints = [
  {
    title: "The Soil",
    question: "Do your values fit the new ground?",
    content: `Every country has a value system. The real one you feel at the school gate, in the grocery store on a Tuesday evening, in how people treat a stranger who doesn't speak the language.

Write down your five non-negotiable values. The things that make your life feel like your life. Religious community, family proximity, social warmth, professional ambition, personal freedom, whatever they are. Now honestly research how your destination handles each one. The Tuesday evening, school pickup, grocery store version. Not the tourism brochure.

Where there's alignment, you'll have energy. Where there's tension, you'll be spending energy. You need to know which is which before you go.`,
  },
  {
    title: "The Wind",
    question: "What's pushing you and what's pulling you?",
    content: `Your reasons for moving are like wind. Multiple forces, multiple directions, some at your back, some in your face.

If you're running toward something, you can measure progress. You know what arrival looks like. If you're running from something, you might land in a new city and realize the thing you were escaping came with you. The restlessness. The dissatisfaction. The feeling that this isn't quite it. These things travel well.

Two lists. 'I'm moving toward ___' and 'I'm moving away from ___.' Write them fast, without editing. If the 'away from' list is longer, spend more time understanding what you're really looking for before you decide where to find it.`,
  },
  {
    title: "The Sunlight",
    question: "What will you actually gain from the move?",
    content: `Sunlight is the growth factor. The career acceleration, the financial step-up, the independence, the expanded worldview. It's the reason you say yes. But sunlight can be a mirage.

Write three sentences that start with: 'In 3 years, because I made this move, I will have ___.' Career gains. Financial position. Personal growth. Skills. Relationships. Now call someone who's actually lived it. Someone who'll give you the Tuesday evening version, not the social media reel.

If you can't write those sentences with conviction, you're not ready.`,
  },
  {
    title: "The Thorns",
    question: "Can you survive the realistic downside?",
    content: `Not the catastrophic worst case. The genuinely plausible downside. The one that has a 30% chance of actually happening.

Your kids will grow up in a foreign culture. Your partner may lose their career, their social life, and their sense of identity, all at once. You might be an eight-hour flight away when someone you love gets sick. These aren't worst-case scenarios. They're Tuesdays.

Write the worst realistic scenario. Sit with it for a full week. If you can live with it, proceed. If the thought of it makes your chest tight at 2am, listen to that signal.`,
  },
  {
    title: "The Pruning",
    question: "What are you willing to cut in order to grow?",
    content: `Every international move is a pruning event. You will lose proximity to people you love. You will lose cultural ease, the comfort of being understood without explanation. You may lose professional networks that took a decade to build. You will lose the version of yourself that only exists in the context of your home.

Name it specifically. Not 'I'll miss my friends.' More like: 'I will miss Thursday dinners at my brother's house.' Or 'I will lose daily access to my mother, who is 68 and not in perfect health.' Or 'I will step away from a leadership role I worked seven years to earn.'

Can you make this cut and still be whole? If yes, you're pruning for growth. If the cut takes something essential, you may be amputating. There's a difference.`,
  },
];

const directions = [
  { title: "Go.", desc: "The soil fits. The wind is at your back. The sunlight is real and verified. The thorns are survivable. And you've named what you're pruning and made peace with it. This doesn't mean it'll be easy. It means you're going in with your eyes open." },
  { title: "Not Yet.", desc: "The move might be right, but the timing is wrong. Maybe the thorns are too sharp right now. An aging parent, a child in a critical school year, a partner who isn't ready. 'Not yet' is precision, not failure." },
  { title: "Not There.", desc: "Moving makes sense, but this particular destination isn't the right fit for you. The soil is wrong, or the sunlight is a mirage, or the pruning required for this specific place cuts too deep. That doesn't mean you should stay put. It means you should keep looking for the right soil." },
  { title: "Stay and Own It.", desc: "You've looked at it honestly and done your homework. The trade doesn't make sense right now. Stop wondering. Start nurturing. No resentment. No 'what if.' Full investment in the life you have." },
];

const AccordionCard = ({ point }: { point: typeof compassPoints[0] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(188,173,212,0.5)", backgroundColor: "#fff" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <div>
          <p className="font-bold text-base" style={{ color: "var(--brand-ink)" }}>{point.title}</p>
          <p className="text-sm mt-0.5 italic" style={{ color: "var(--brand-mute)" }}>{point.question}</p>
        </div>
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
            <div className="px-5 pb-5 text-sm leading-[1.8] whitespace-pre-line" style={{ color: "var(--brand-ink)" }}>
              {point.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PreRooted = () => (
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <StickyNav />

    {/* Hero */}
    <section className="pt-32 pb-16 px-6 lg:px-12" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="container mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--brand-accent)" }}>Stage 1 of 4</p>
        <h1 className="font-black text-4xl md:text-5xl leading-tight" style={{ color: "var(--brand-ink)", fontWeight: 900 }}>
          Should I stay or should I go?
        </h1>
      </div>
    </section>

    {/* Intro */}
    <Section className="py-20" bg="var(--brand-surface)">
      <div className="container mx-auto max-w-3xl space-y-5 text-base leading-[1.7]" style={{ color: "var(--brand-ink)" }}>
        <p>
          You're standing at a crossroads. There's an opportunity, maybe a job offer, maybe a restless feeling that more is waiting somewhere else. Everyone has an opinion. Your family. Your friends. Your gut. But nobody is asking you the right questions.
        </p>
        <p>
          This is the stage where most people skip the hard reflection and jump straight to logistics. <strong>Re-Rooted®</strong> slows that down.
        </p>
      </div>
    </Section>

    {/* The Compass */}
    <Section className="py-20" bg="var(--brand-surface)">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-extrabold text-3xl md:text-[36px] leading-tight mb-2" style={{ color: "var(--brand-ink)", fontWeight: 800 }}>
          The Re-Rooted® Compass
        </h2>
        <p className="text-base mb-8" style={{ color: "var(--brand-mute)" }}>5 questions to ask before you move abroad</p>
        <div className="space-y-4">
          {compassPoints.map((point, i) => (
            <AccordionCard key={i} point={point} />
          ))}
        </div>
      </div>
    </Section>

    {/* Four Directions */}
    <Section className="py-20" bg="var(--brand-surface)">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-extrabold text-2xl md:text-3xl leading-tight mb-2" style={{ color: "var(--brand-ink)", fontWeight: 800 }}>
          The Four Directions
        </h2>
        <p className="text-base mb-8" style={{ color: "var(--brand-mute)" }}>
          After you've worked through all five points, you'll land in one of four places:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {directions.map((d, i) => (
            <div key={i} className="rounded-xl p-6 border" style={{ backgroundColor: "#fff", borderColor: "rgba(188,173,212,0.5)" }}>
              <p className="font-bold text-lg mb-2" style={{ color: "var(--brand-deep)" }}>{d.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--brand-ink)" }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>

    {/* Corporate Close */}
    <Section className="py-20" bg="var(--brand-surface)">
      <div className="container mx-auto max-w-3xl space-y-5 text-base leading-[1.7]" style={{ color: "var(--brand-ink)" }}>
        <p>
          The Pre-Rooted stage is where assignment success or failure begins. When employees make conscious, supported decisions about their move, they arrive with clarity instead of anxiety. <strong>Re-Rooted®</strong> coaching during this phase helps your people enter their assignment grounded.
        </p>
        <div className="pt-4">
          <Link
            to="/contact"
            className="inline-flex items-center px-7 py-3.5 text-base font-semibold rounded-lg text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--brand-deep)" }}
          >
            Talk to us about supporting your people before they move →
          </Link>
        </div>
      </div>
    </Section>

    {/* Journey Nav */}
    <section className="py-10 px-6 lg:px-12" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="container mx-auto max-w-3xl flex justify-end">
        <Link to="/journey/rooting-in" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4" style={{ color: "var(--brand-deep)" }}>
          Rooting In <ArrowRight size={16} />
        </Link>
      </div>
    </section>

    <Footer />
  </motion.main>
);

export default PreRooted;
