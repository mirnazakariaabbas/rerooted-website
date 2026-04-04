import { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Phone, ClipboardList, Sprout, Flag, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
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
  const [scrollActive, setScrollActive] = useState(0);
  const [clickedStep, setClickedStep] = useState<number | null>(null);
  const isProgrammaticScroll = useRef(false);
  const programmaticTimeout = useRef<ReturnType<typeof setTimeout>>();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (isProgrammaticScroll.current) return;
    const idx = Math.min(Math.floor(v * steps.length), steps.length - 1);
    setScrollActive(idx);
    setClickedStep(null);
  });

  const active = clickedStep !== null ? clickedStep : scrollActive;

  const jumpTo = (idx: number) => {
    setClickedStep(idx);
    isProgrammaticScroll.current = true;
    if (programmaticTimeout.current) clearTimeout(programmaticTimeout.current);
    if (!outerRef.current) return;
    const top = outerRef.current.offsetTop;
    const h = outerRef.current.scrollHeight - window.innerHeight;
    const progress = idx / (steps.length - 1);
    const target = top + progress * h;
    window.scrollTo({ top: target, behavior: "smooth" });
    programmaticTimeout.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
      setScrollActive(idx);
    }, 1000);
  };

  const fillPercent = `${(active / (steps.length - 1)) * 100}%`;

  return (
    <div ref={outerRef} className="relative h-[500vh]" id="program">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center bg-[hsl(40,33%,97%)] px-6 lg:px-12">
        {/* heading */}
        <h2 className="text-foreground font-extrabold text-3xl md:text-[40px] mb-16 text-center">
          The Re-Rooted® Journey
        </h2>

        {/* timeline */}
        <div className="relative w-full max-w-4xl mx-auto mb-12">
          {/* bg line */}
          <div className="absolute top-[30px] left-[30px] right-[30px] h-[3px] bg-border rounded-full" />
          {/* filled line */}
          <div
            className="absolute top-[30px] left-[30px] h-[3px] rounded-full bg-[hsl(153,45%,45%)] transition-all duration-500"
            style={{ width: fillPercent }}
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
                    animate={{
                      scale: isActive ? 1.3 : 1,
                    }}
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

        {/* content area */}
        <div className="w-full max-w-2xl mx-auto min-h-[160px] text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="bg-card rounded-xl border border-border shadow-sm px-8 py-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
  return (
    <section id="program" className="bg-[hsl(40,33%,97%)] py-16 px-6">
      <h2 className="text-foreground font-extrabold text-3xl mb-10 text-center">
        The Re-Rooted® Journey
      </h2>

      <div className="relative max-w-md mx-auto">
        {/* vertical line */}
        <div className="absolute left-[29px] top-0 bottom-0 w-[3px] bg-border" />

        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <MobileStep key={i} step={step} index={i} Icon={Icon} />
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

const MobileStep = ({
  step,
  index,
  Icon,
}: {
  step: (typeof steps)[number];
  index: number;
  Icon: (typeof steps)[number]["icon"];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-4 mb-8 pl-0"
      initial={{ opacity: 0, x: 30 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="w-[60px] h-[60px] shrink-0 rounded-full flex items-center justify-center bg-[hsl(153,45%,45%)] text-[hsl(0,0%,100%)] z-10">
        <Icon size={22} />
      </div>
      <div className="pt-2">
        <p className="text-xs font-semibold text-muted-foreground">{step.timing}</p>
        <p className="font-bold text-foreground text-sm mb-1">{step.name}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
};

/* ───────────── export ───────────── */
const IntegrationProgram = () => {
  const mobile = useIsMobile();
  return mobile ? <MobileTimeline /> : <DesktopTimeline />;
};

export default IntegrationProgram;
