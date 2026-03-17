import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Phone, ClipboardList, Sprout, Flag, CheckCircle, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Phone,
    timing: "Day 0",
    name: "Discovery Call",
    desc: "HR or employee reaches out. We understand the assignment, the person, the family situation, and the specific integration challenges.",
  },
  {
    icon: ClipboardList,
    timing: "Week 1",
    name: "Integration Assessment",
    desc: "Structured assessment across all six dimensions. Identifies gaps, strengths, and priorities. Shared with HR and hiring manager as a baseline.",
  },
  {
    icon: Sprout,
    timing: "Weeks 2–10",
    name: "Active Coaching",
    desc: "Bi-weekly one-on-one sessions with a matched coach. Practical, action-oriented work on the dimensions that matter most.",
  },
  {
    icon: Flag,
    timing: "Week 11–12",
    name: "Final Assessment",
    desc: "Post-program assessment measuring progress across all six roots. Integration report delivered to HR and hiring manager with outcomes.",
  },
  {
    icon: CheckCircle,
    timing: "Post-program",
    name: "Ongoing Support",
    desc: "Optional follow-up sessions. Employee has tools and habits for continued integration. HR has data for the next assignment.",
  },
];

/* ───────────── DESKTOP – sticky scroll ───────────── */
const DesktopTimeline = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(Math.floor(v * 5), 4);
    setActive(idx);
  });

  const jumpTo = (idx: number) => {
    setActive(idx);
    if (!outerRef.current) return;
    const top = outerRef.current.offsetTop;
    const h = outerRef.current.scrollHeight - window.innerHeight;
    const target = top + (idx / 5) * h + 1;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const fillWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={outerRef} className="relative h-[500vh]" id="program">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center bg-[hsl(40,33%,97%)] px-6 lg:px-12">
        {/* heading */}
        <h2 className="text-foreground font-extrabold text-4xl md:text-5xl mb-2 text-center">
          The Re-Rooted® Journey
        </h2>
        {/* Keep Scrolling hint */}
        <motion.div
          className="flex items-center gap-1.5 mb-6"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <span className="text-primary text-sm font-semibold">Keep Scrolling</span>
          <ChevronDown className="w-4 h-4 text-primary" />
        </motion.div>

        {/* unified card: timeline + description */}
        <div className="w-full max-w-4xl mx-auto bg-card rounded-xl border border-border shadow-sm px-8 py-8">
          {/* timeline row */}
          <div className="relative mb-8">
            {/* bg line */}
            <div className="absolute top-[30px] left-[30px] right-[30px] h-[3px] bg-border rounded-full" />
            {/* filled line */}
            <motion.div
              className="absolute top-[30px] left-[30px] h-[3px] rounded-full bg-[hsl(153,45%,45%)]"
              style={{ width: fillWidth }}
            />

            <div className="relative flex justify-between">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const reached = i <= active;
                const isActive = i === active;
                return (
                  <button
                    key={i}
                    onClick={() => jumpTo(i)}
                    className="flex flex-col items-center gap-2 cursor-pointer group z-10"
                  >
                    <motion.div
                      animate={{ scale: isActive ? 1.3 : 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                        reached
                          ? "bg-[hsl(153,45%,45%)] border-[hsl(153,45%,45%)] text-[hsl(0,0%,100%)]"
                          : "bg-card border-border text-muted-foreground"
                      } ${isActive ? "shadow-lg ring-2 ring-[hsl(153,45%,45%)]/30" : ""}`}
                    >
                      <Icon size={isActive ? 28 : 24} />
                    </motion.div>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {step.timing}
                    </span>
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        reached ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* description area inside the card */}
          <div className="min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <h3 className="text-foreground font-bold text-lg mb-1">{steps[active].name}</h3>
                <span className="inline-block text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full mb-2">
                  {steps[active].timing}
                </span>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {steps[active].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* summary + CTAs – visible when at step 5 */}
        <AnimatePresence>
          {active === 4 && (
            <motion.div
              className="mt-10 flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-muted-foreground text-sm text-center">
                Total engagement: 90 days · 6–8 coaching sessions · 2 assessments · 1 HR report
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg">Get a program overview</Button>
                <a
                  href="#contact"
                  className="text-sm font-medium text-primary hover:underline underline-offset-4"
                >
                  Or start with a conversation
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ───────────── MOBILE – vertical timeline ───────────── */
const MobileTimeline = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="program" className="bg-[hsl(40,33%,97%)] py-16 px-6">
      <h2 className="text-foreground font-extrabold text-4xl mb-2 text-center">
        The Re-Rooted® Journey
      </h2>
      <motion.div
        className="flex items-center justify-center gap-1.5 mb-8"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <span className="text-primary text-sm font-semibold">Keep Scrolling</span>
        <ChevronDown className="w-4 h-4 text-primary" />
      </motion.div>

      <div className="relative max-w-md mx-auto bg-card rounded-xl border border-border shadow-sm p-6">
        {/* vertical line */}
        <div className="absolute left-[53px] top-6 bottom-6 w-[3px] bg-border" />

        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = active === i;
          return (
            <button
              key={i}
              onClick={() => setActive(isActive ? null : i)}
              className="relative flex gap-4 mb-6 last:mb-0 pl-0 w-full text-left"
            >
              <div
                className={`w-[60px] h-[60px] shrink-0 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  isActive
                    ? "bg-[hsl(153,45%,45%)] text-[hsl(0,0%,100%)] scale-110 shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon size={22} />
              </div>
              <div className="pt-2 flex-1">
                <p className="text-xs font-semibold text-muted-foreground">{step.timing}</p>
                <p className={`font-bold text-sm mb-1 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.name}
                </p>
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      className="text-muted-foreground text-sm leading-relaxed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>

      {/* summary */}
      <p className="text-muted-foreground text-sm text-center mt-10 max-w-md mx-auto">
        Total engagement: 90 days · 6–8 coaching sessions · 2 assessments · 1 HR report
      </p>
      <div className="flex flex-col items-center gap-3 mt-6">
        <Button size="lg">Get a program overview</Button>
        <a
          href="#contact"
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Or start with a conversation
        </a>
      </div>
    </section>
  );
};

/* ───────────── export ───────────── */
const IntegrationProgram = () => {
  const mobile = useIsMobile();
  return mobile ? <MobileTimeline /> : <DesktopTimeline />;
};

export default IntegrationProgram;
